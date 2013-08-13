var captcha = require('captcha');

exports.name = 'mwc_plugin_welcome';
exports.middleware = [function (core) {
  try {
    core.app.render('welcome/verifyEmail', function (err, html) {
      if (err) {
        throw err;
      }
    });
    core.app.render('welcome/completeProfile', function (err, html) {
      if (err) {
        throw err;
      }
    });
    core.app.render('welcome/welcome', function (err, html) {
      if (err) {
        throw err;
      }
    });

  }
  catch (e) {
    if (e.message === 'No default engine was specified and no extension was provided.') {
      throw new Error('Error: Template engine is not installed or templates are missing! Details - https://github.com/mywebclass/mwc_plugin_wellcome!');
    } else {
      throw e;
    }
  }

  return function (request, response, next) {
    if (request.user && request.user.emailVerified && request.user.profileComplete) {
      next();
    } else {
      if (request.method === 'GET') {
        if (/^\/auth/.test(request.url)) {
          next();
        } else {
          if (request.user && !request.user.emailVerified) {
            response.status(403);
            response.render('welcome/verifyEmail');
            return;
          }
          if (request.user && !request.user.profileComplete) {
            response.status(403);
            response.render('welcome/completeProfile');
            return;
          }
          var parameters = {
            'title': 'Please, authorize!',
            'useGoogle': true,
            'useGithub': (core.config.passport && core.config.passport.GITHUB_CLIENT_ID && core.config.passport.GITHUB_CLIENT_SECRET),
            'useTwitter': (core.config.passport && core.config.passport.TWITTER_CONSUMER_KEY && core.config.passport.TWITTER_CONSUMER_SECRET),
            'useFacebook': (core.config.passport && core.config.passport.FACEBOOK_APP_ID && core.config.passport.FACEBOOK_APP_SECRET)
          };
          response.status(403);
          response.render('welcome/welcome', parameters);
        }
      } else {
        next();
      }
    }
  };
},
  function (core) {
    return captcha({ url: '/auth/captcha.jpg', color: '#0064cd', background: 'rgb(20,30,200)', codeLength: 4 }); // captcha params
  }
];

exports.routes = function (core) {
  core.app.get('/auth/restoreAccount', function (request, response) {
    if (request.user) {
      response.redirect('/');
    } else {
      response.render('welcome/restoreAccount', {title: 'Restore account'});
    }
  });
  core.app.get('/auth/resetPassword', function (request, response) {
    if (request.user) {
      response.redirect('/');
    } else {
      if (request.query.key) {
        request.model.Users.findOneByApiKey(request.query.key, function (err, userFound) {
          if(err) throw err;
          if (userFound) {
            response.render('welcome/resetPassword', {
              title: 'Reset password',
              apiKey : userFound.apiKey
            });
          } else {
            response.send(404);
          }
        });
      } else {
        response.send(404);
      }
    }
  });

};
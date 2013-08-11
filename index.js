//check if template exists



exports.middleware = function (core) {
  try {
    core.app.render('welcome/verifyEmail',function(err,html){
      if(err) throw err;
    });
  }
  catch (e) {
    if (e.message === 'No default engine was specified and no extension was provided.') {
      throw new Error('Error: Template engine is not installed! Details - https://github.com/mywebclass/mwc_plugin_wellcome!');
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
};
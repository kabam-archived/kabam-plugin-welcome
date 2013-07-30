exports.extendMiddlewares = function (core) {
  return function (request, response, next) {
    if (request.user) {
      next();
    } else {
      if (request.method === 'GET') {
        if(/^\/auth/.test(request.url)){
          next();
        } else {
          var parameters={
            'title':'Please, authorize!',
            'useGoogle': true,
            'useGithub': (core.config.passport && core.config.passport.GITHUB_CLIENT_ID && core.config.passport.GITHUB_CLIENT_SECRET),
            'useTwitter':(core.config.passport && core.config.passport.TWITTER_CONSUMER_KEY && core.config.passport.TWITTER_CONSUMER_SECRET),
            'useFacebook': (core.config.passport && core.config.passport.FACEBOOK_APP_ID && core.config.passport.FACEBOOK_APP_SECRET)
          };

          try{
            response.status(403);
            response.render('welcome',parameters);
          }
          catch (e){
            if(e.message === 'No default engine was specified and no extension was provided.'){
              response.send('Error: Template engine is not installed! Details - https://github.com/mywebclass/mwc_plugin_wellcome!');
            } else {
              throw e;
            }
          }
        }
      } else {
        next();
      }
    }
  };
};
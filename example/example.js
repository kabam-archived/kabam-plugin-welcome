var mwcCore = require('mwc_kernel'),
  captcha = require('captcha'),
  express = require('express'),
  path = require('path'),
  async = require('async');

//setting up the config
var MWC = new mwcCore({
  'hostUrl':'http://mwcwelcome.herokuapp.com/',
  'secret': ((process.env.secret)?(process.env.secret):'lalalala1'),
  'mongoUrl': process.env.MONGOHQ_URL,
  'redis': ((process.env.REDISTOGO_URL)?(process.env.REDISTOGO_URL):'redis://greatCornhorio@localhost:6379'),
  "passport":{
    "GITHUB_CLIENT_ID":"--insert-github-client-id-here--",
    "GITHUB_CLIENT_SECRET": "--insert-github-client-secret-here--",
    "TWITTER_CONSUMER_KEY":"--insert-twitter-consumer-key-here--",
    "TWITTER_CONSUMER_SECRET": "--insert-twitter-consumer-secret-here--",
    "FACEBOOK_APP_ID":"--insert-facebook-app-id-here--",
    "FACEBOOK_APP_SECRET":"--insert-facebook-app-secret-here--"
  }
});

MWC.usePlugin(require('mwc_plugin_hogan_express'));

MWC.extendMiddlewares(function(core){
  return captcha({ url: '/captcha.jpg', color:'#0064cd', background: 'rgb(20,30,200)' }); // captcha params
});

MWC.extendMiddlewares(function(core){
  return express.static(path.join(__dirname, 'public'));
});

MWC.usePlugin(require('./../index.js'));
MWC.extendRoutes(function (core) {
  core.app.get('/', function (request, response) {
    response.redirect('/my');
  });

  core.app.get('/my', function (request, response) {
    if (request.is('json')) {
      response.json(request.user)
    } else {
      response.render('my', {user: request.user});
    }
  });

  core.app.get('/team', function (request, response) {
    request.MODEL.Users.find({}, function (err, users) {
      if (err) {
        throw err;
      }
      if (request.is('json')) {
        response.json(users);
      } else {
        response.render('team', {users: users});
      }
    });
  });
});
MWC.listen();
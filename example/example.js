var mwcCore = require('mwc_kernel'),
  captcha = require('captcha'),
  express = require('express'),
  path = require('path'),
  async = require('async');

//setting up the config
var MWC = new mwcCore({
  'hostUrl':'http://vvv.msk0.ru/',//'http://mwcwelcome.herokuapp.com/',
  'secret': ((process.env.secret)?(process.env.secret):'lAAAAalalala1'),
  'mongoUrl':((process.env.MONGOHQ_URL)?(process.env.MONGOHQ_URL):'mongodb://heroku:83545694fec0db031dc9955f874af3a5@dharma.mongohq.com:10053/app16189891'),
//  'mongoUrl': process.env.MONGOHQ_URL,
  'redis': ((process.env.REDISTOGO_URL)?(process.env.REDISTOGO_URL):'redis://greatCornhorio@localhost:6379'),
  'emailConfig':((process.env.emailConfig)?(process.env.emailConfig):'mywebclass@webizly.com:web$1234'),
  "passport":{
    "GITHUB_CLIENT_ID":"2673b55b727c2ebb0c93",
    "GITHUB_CLIENT_SECRET": "74aedc65c9f3aff8250abe9087c30d368566810e",
    "TWITTER_CONSUMER_KEY":"--insert-twitter-consumer-key-here--",
    "TWITTER_CONSUMER_SECRET": "--insert-twitter-consumer-secret-here--",
    "FACEBOOK_APP_ID":"--insert-facebook-app-id-here--",
    "FACEBOOK_APP_SECRET":"--insert-facebook-app-secret-here--"
  }
});

MWC.usePlugin(require('mwc_plugin_notify_by_email'));
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
    response.render('index',{userAgent:request.headers['user-agent']})
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

MWC.on('notify',function(message){
  console.log(message);
});
var mwcCore = require('mwc_kernel'),
  captcha = require('captcha'),
  express = require('express'),
  path = require('path'),
  async = require('async');

//setting up the config
var MWC = new mwcCore(require('./config.json')[(process.env.NODE_ENV) ? (process.env.NODE_ENV) : 'development']);

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

/*/
//commit after database is populated
async.parallel({
  'vodolaz095': function (cb) {
    MWC.MODEL.Users.create({
      'username': 'vodolaz095',
      'email': 'ostroumov095@gmail.com',
      'apiKey': 'vodolaz095',
      'active': true
    }, cb);

  },
  'valmy': function (cb) {
    MWC.MODEL.Users.create({
      'username': 'valmy',
      'email': 'tbudiman@gmail.com',
      'apiKey': 'valmy',
      'active': true
    }, cb);
  },
  'muhammadghazali': function (cb) {
    MWC.MODEL.Users.create({
      'username': 'muhammadghazali',
      'email': 'muhammadghazali2480@gmail.com',
      'apiKey': 'muhammadghazali',
      'active': true
    }, cb);
  },
  'kaw393939': function (cb) {
    MWC.MODEL.Users.create({
      'username': 'kaw393939',
      'email': 'keith@webizly.com',
      'apiKey': 'kaw393939',
      'active': true
    }, cb);
  }}, function (err, usersCreated) {
  if(err) throw err;
  async.parallel({
    'pwd4vodolaz095':function(cb){
      usersCreated.vodolaz095.setPassword('vodolaz095',cb);
    },
    'pwd4valmy':function(cb){
      usersCreated.valmy.setPassword('valmy',cb);
    },
    'pwd4muhammadghazali':function(cb){
      usersCreated.muhammadghazali.setPassword('muhammadghazali',cb);
    },
    'pwd4kaw393939':function(cb){
      usersCreated.kaw393939.setPassword('kaw393939',cb);
    }
  },function(err2,passwordSent){
    if(err2) throw err2;
    console.log('password were set')
  })
});
//*/
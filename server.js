 var express = require('express')
  //    , passport = require('passport')
   , flash = require('connect-flash')
  , util = require('util')
//   , LocalStrategy = require('passport-local').Strategy
// , BearerStrategy = require('passport-http-bearer').Strategy;

    record = require('./routes/record');
//users = require('./routes/users');
var mongo = require('mongodb');
var monk = require('monk');
 
//var Server = mongo.Server,
//    Db = mongo.Db,
//    BSON = mongo.BSONPure;
 
var app = express();
 
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.engine('ejs', require('ejs-locals'));
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
   app.use(express.session({ secret: 'keyboard cat' }));
   app.use(flash());
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});
 
app.get('/ebolocatemp/api/record',
        record.findAll);
app.get('/ebolocatemp/api/record/:id', record.findById);
app.post('/ebolocatemp/api/record', record.addRecord);
//app.put('/record/:id', record.updateArticle);
//app.delete('/record/:id', record.deleteArticle);

app.get('/ebolocatemp/', function(req, res){
  //res.render('index', { user: req.user });
  res.render('index');
});

app.get('/record', function(req, res){
  res.render('record', { 
    cdcId: req.query.cdcId
  });
});

app.get('/confirmation', function(req, res){
  res.render('confirmation');
});

app.post('/record', function(req, res){
  console.log('record posted...')
    console.log(req.body);
    res.redirect('/confirmation');
});


app.listen(8092);
console.log('Listening on port 8092...');

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/ebolocatemp/login');
// };
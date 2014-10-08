var express = require('express'), 
  flash = require('connect-flash'), 
  util = require('util'),
  record = require('./routes/record');

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
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});
 
app.get('/ebolocatemp/api/record', record.findAll);
app.get('/ebolocatemp/api/record/:id', record.findById);
app.post('/ebolocatemp/api/record', record.addRecord);

app.get('/ebolocatemp/', function(req, res){
  res.render('index');
});

app.get('/ebolocatemp/record', function(req, res){
  res.render('record', { 
    title: 'Temperature Collection Form',
    cdcId: req.query.cdcId
  });
});

app.get('/ebolocatemp/confirmation', function(req, res){
  res.render('confirmation', {
    title: 'Temperature Collection Confirmation'
  });
});

app.get('/ebolocatemp/error', function(req, res){
  res.render('error', {
    title: 'Temperature Collection Error'
  });
});

app.post('/ebolocatemp/record', function(req, res){
    var bod = req.body;
  
  // validate posted data
  if(!bod.cdcId && !req.query.cdcId)
    res.redirect('/ebolocatemp/error');

  if(!bod.temp)
    res.redirect('/ebolocatemp/record?cdcId=' + bod.cdcId);

  var toSave = {
    cdcId: bod.cdcId,
    temp: bod.temp,
    loc: bod.loc,
    timestamp: new Date().getTime()
  };

  // save to db
  record.addRecord(toSave, function(result){
    if(result.success){
      res.redirect('/ebolocatemp/confirmation');
    } else  {
      res.redirect('/ebolocatemp/error');      
    }
  });
});


app.listen(8092);
console.log('Listening on port 8092...');

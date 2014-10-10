var express = require('express'), 
  flash = require('connect-flash'), 
  util = require('util'),
  record = require('./routes/record'),
  _ = require('underscore');

var app = express();

var path = require('path');
var rootPath = path.normalize(__dirname + '/');

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(flash());
  app.use(app.router);
  app.use('/ebolocatemp',express.static(rootPath + '/public'));
});
 
app.get('/ebolocatemp/api/record', record.findAll);

app.get('/ebolocatemp/api/record/:id', function(req, res){
  if(req.params.id){
    var existing = record.findById(req.params.id, function(result){
        if(result.success){
          res.json(result.data);
          return;
        }else{
          res.send(404, 'resource not found');
          return;
        }
    });
  }
  else{
    res.send(404, 'resource not found');
    return;
  }
});

app.get('/ebolocatemp/api/record/cdcid/:id', function(req, res){
  if(req.params.id){
    var existing = record.findAllByCdcId(req.params.id, function(result){
        if(result.success){
          res.json(result.data);
          return;
        }else{
          res.send(404, 'resource not found');
          return;
        }
    });
  }
  else{
    res.send(404, 'resource not found');
    return;
  }
});

app.post('/ebolocatemp/api/record', function(req, res){
  var bod = req.body;

  var toSave = {
    cdcId: bod.cdcId,
    temp: bod.temp,
    loc: bod.loc,
    timestamp: bod.timestamp
  };

  // save to db
  record.addRecord(toSave, function(result){
    if(result.success){
      res.send(200, result.data);
      return;
    } else  {
      res.send(500, result.data);
      return;
    }
  });
});

app.get('/ebolocatemp/', function(req, res){
  res.render('index', {
    title: 'Temp Monitor'
  });
});

app.get('/ebolocatemp/data', function(req, res){
  res.render('data', {
    title: 'Temp Monitor Data'
  });
});

app.get('/ebolocatemp/record', function(req, res){
  res.render('record', { 
    title: 'New Temp Record',
    cdcId: req.query.cdcId
  });
});

app.get('/ebolocatemp/record/cdcid/:id', function(req, res){
  if(req.params.id){
    var existing = record.findAllByCdcId(req.params.id, function(result){
      console.log(result);
      if(result.success){

        res.render('cdcid', { 
          title: 'Temp Monitor by CDCID',
          cdcId: req.params.id,
          records: result.data
        });

        return;
        
      }else{
        res.send(404, 'resource not found');
        return;
      }
    });
  }
  else{
    res.send(404, 'resource not found');
    return;
  }
});

app.get('/ebolocatemp/error', function(req, res){
  res.render('error', {
    title: 'Temperature Collection Error'
  });
});

app.post('/ebolocatemp/record', function(req, res){
  var bod = req.body;
  
  var toSave = {
    cdcId: bod.cdcId,
    temp: bod.temp,
    loc: bod.loc
  };

  // save to db
  record.addRecord(toSave, function(result){
    if(result.success){
      res.redirect('/ebolocatemp/record/cdcid/' + result.data.cdcId);
    } else  {
      res.redirect('/ebolocatemp/error');      
    }
  });
});

app.listen(8092);
console.log('Listening on port 8092...');

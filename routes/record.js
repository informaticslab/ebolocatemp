var mongo = require('mongodb');
var monk = require('monk');
 
 var gendb = monk('localhost:27017/photon-admin-server');
var db = gendb.get('temprecorddb');
 
var Server = mongo.Server,
   Db = mongo.Db,
   BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('temprecorddb', server);
 
db.open(function(err, db) {
   if(!err) {
       console.log("Connected to 'temprecorddb' database");
       db.collection('temprecords', {strict:true}, function(err, collection) {
           if (err) {
               console.log("The 'temprecords' collection doesn't exist. Creating it with sample data...");
               populateDB();
           }
       });
   }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving temprecord with id: ' + id);
    db.collection('temprecords', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('temprecords', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addRecord= function(record, callback) {
      // validate posted data
    if(!record.cdcId)
    {
        // handle invalid cdcId
    }

    if(!record.temp)
    {
        // handle invalid temp
    }

    var toSave = {
    cdcId: record.cdcId,
    temp: record.temp,
    loc: record.loc,
    timestamp: new Date().getTime()
    };

    console.log('Saving record: ' + JSON.stringify(record));

    db.collection('temprecords', function(err, collection) {
        collection.insert(record, {safe:true}, function(err, result) {
            if (err) {
                console.log('error detected');
                console.log(err);
                return err;
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });

    console.log('end of task');

    callback();
};
 
// exports.updateArticle = function(req, res) {
//     var id = req.params.id;
//     var wine = req.body;
//     console.log('Updating article: ' + id);
//     console.log(JSON.stringify(article));
//     db.collection('articles', function(err, collection) {
//         collection.update({'_id':new BSON.ObjectID(id)}, article, {safe:true}, function(err, result) {
//             if (err) {
//                 console.log('Error updating article: ' + err);
//                 res.send({'error':'An error has occurred'});
//             } else {
//                 console.log('' + result + ' document(s) updated');
//                 res.send(article);
//             }
//         });
//     });
// }
 
// exports.deleteArticle = function(req, res) {
//     var id = req.params.id;
//     console.log('Deleting article: ' + id);
//     db.collection('articles', function(err, collection) {
//         collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
//             if (err) {
//                 res.send({'error':'An error has occurred - ' + err});
//             } else {
//                 console.log('' + result + ' document(s) deleted');
//                 res.send(req.body);
//             }
//         });
//     });
// }
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
    var temprecords = [
    {CDCID: "12345",
     temp: "102.7F",
     loc: "ATL",
     timestamp: "2014-10-08T0910"},
    {CDCID: "12345",
     temp: "98.6F",
     loc: "ATL",
     timestamp: "2014-10-07T1452"},
    {CDCID: "12345",
     temp: "98.6F",
     loc: "ATL",
     timestamp: "2014-10-06T0830"},
    {CDCID: "12345",
     temp: "98.6F",
     loc: "ABQ",
     timestamp: "2014-10-05T0225"}
    ]
    db.collection('temprecords', function(err, collection) {
        collection.insert(temprecords, function(err, result) {});
    });
}

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
 
exports.findById = function(id, callback) {
    console.log('Retrieving temprecord with id: ' + id);
    db.collection('temprecords', function(err, collection) {
        if(err){
            callback({
                success: 0,
                data: err
            });
            return;
        }
        else{
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                if(err){
                    callback({
                        success: 0,
                        data: err
                    });
                    return;
                }
                else{
                    callback({
                        success: 1,
                        data: item
                    });
                    return;
                }
            });
        }
    });
};

exports.findAllByCdcId = function(id, callback) {
    console.log('Retrieving temprecord with CdcId: ' + id);
    db.collection('temprecords', function(err, collection) {
        if(err){
            callback({
                success: 0,
                data: err
            });
            return;
        }
        else{
            collection.find({'cdcId':id}).toArray(function(err, items) {
                if(err){
                    callback({
                        success: 0,
                        data: err
                    });
                    return;
                }
                else{
                    callback({
                        success: 1,
                        data: items
                    });
                    return;
                }
            });
        }
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
    if(!record.cdcId){
        callback({
            success: 0,
            data: 'CDC ID is required'
        });
        return;
    }

    // location is required
      if(!record.loc){
        callback({
            success: 0,
            data: 'location is required'
        });
        return;
      }

    var tempNum = +record.temp;

    if(!tempNum)
    {
        callback({
            success: 0,
            data: 'temp is required'
        });
        return;
    }

    // temp must be between 95 and 110
    if(tempNum < 95 || tempNum > 110){
        callback({
            success: 0,
            data: 'temperature must be between 95 and 110'
        });
        return;
    }

    var timeToSave = record.timestamp;

    if(!timeToSave)
        timeToSave = new Date().getTime();

    var toSave = {
        cdcId: record.cdcId,
        temp: tempNum,
        loc: record.loc,
        timestamp: timeToSave
    };

    console.log('Saving record: ' + JSON.stringify(toSave));

    db.collection('temprecords', function(err, collection) {
        collection.insert(toSave, {safe:true}, function(err, result) {
            if (err) {
                console.log('error detected');
                console.log(err);
                callback({
                    success: 0,
                    data: err
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                callback({
                    success: 1,
                    data: result[0]
                });
            }
        });
    });
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
    {
        cdcId: "Ben",
        temp: 98.6,
        loc: "ATL",
        timestamp: 1412793365000
     },
    {
        cdcId: "Ben",
        temp: 98.8,
        loc: "ATL",
        timestamp: 1412879765000
     },
    {
        cdcId: "Ben",
        temp: 98.6,
        loc: "ATL",
        timestamp: 1412966165000
     },
    {
        cdcId: "Ben",
        temp: 98.5,
        loc: "ATL",
        timestamp: 1413052565000
     },
     {
        cdcId: "Ben",
        temp: 99.4,
        loc: "ATL",
        timestamp: 1413138965000
     },
     {
        cdcId: "Ben",
        temp: 99.7,
        loc: "ATL",
        timestamp: 1413225365000
     },
     {
        cdcId: "Ben",
        temp: 100.4,
        loc: "ATL",
        timestamp: 1413398165000
     },
     {
        cdcId: "Ben",
        temp: 101.2,
        loc: "ATL",
        timestamp: 1413484565000
     },
     {
        cdcId: "Ben",
        temp: 103.0,
        loc: "ATL",
        timestamp: 1413570965000
     },
     {
        cdcId: "Ben",
        temp: 100.2,
        loc: "ATL",
        timestamp: 1413657365000
     },
     {
        cdcId: "Ben",
        temp: 99.2,
        loc: "ATL",
        timestamp: 1413743765000
     }
    ]
    db.collection('temprecords', function(err, collection) {
        collection.insert(temprecords, function(err, result) {});
    });
}

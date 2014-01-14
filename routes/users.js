  var mongo = require('mongodb')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;
  

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('userdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'userdb' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data..." + err);
                var users = [
            { id: 1, username: 'bob', password: generatePassHash('secret'), email: 'bob@example.com', token: '123456789' }
            , { id: 2, username: 'joe', password: generatePassHash('birthday'), email: 'joe@example.com', token: '987654321' }
            ];
            db.collection('users', function(err, collection) {
                collection.insert(users, {safe:true}, function(err, result) {});
            });
            }
        });
    }
});

var populateDB = function() {

    var users = [
    { id: 1, username: 'bob', password: generatePassHash('secret'), email: 'bob@example.com', token: '123456789' }
  , { id: 2, username: 'joe', password: generatePassHash('birthday'), email: 'joe@example.com', token: '987654321' }
    ];
    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
 
};

    function generatePassHash(password) {
    
        var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
                  
        //console.log("The salt given was " + salt);
        
        var hash = bcrypt.hashSync(password, salt);
		
            //console.log("The Hash being returned is " + hash);
            
			return hash;
	};
        
//exports.findById = function(req, res) {
//    var id = req.params.id;
//    console.log('got a request to : ' + id);
//    //db.collection('articles', function(err, collection) {
//       // collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
//       //     res.send(item);
//       // });
//    //});
//};
//
//exports.findByUsername = function(req, res) {
//    var username = req.params.username;
//    console.log('Retrieving user: ' + username);
//  for (var i = 0, len = users.length; i < len; i++) {
//    var user = users[i];
//    if (user.username === username) {
//      return fn(null, user);
//    }
//  }
//  return fn(null, null);
//}









var express = require('express');
 
var app = express();
 
app.get('/articles', function(req, res) {
    res.send([{name:'article1'}, {name:'article2'}]);
});
app.get('/articles/:id', function(req, res) {
    res.send({id:req.params.id, title: "The Title", description: "description"});
});
 
app.listen(8081);
console.log('Listening on port 8081...');
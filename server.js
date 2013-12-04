var express = require('express'),
    article = require('./routes/articles');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/articles', article.findAll);
app.get('/articles/:id', article.findById);
app.post('/articles', article.addArticle);
app.put('/articles/:id', article.updateArticle);
app.delete('/articles/:id', article.deleteArticle);
 
app.listen(8081);
console.log('Listening on port 8081...');
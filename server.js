/*
Web server code
*/

// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    var sensors = [
        { name: 'Bloody Mary', id: '00112233-1', type: 'Door sensor', status: 'Connected' },
        { name: 'Martini',  id: '00112233-1', type: 'Door sensor', status: 'Connected' },
        { name: 'Scotch',  id: '00112233-1', type: 'Door sensor', status: 'Connected' }
    ];

    res.render('pages/index', {
        sensors: sensors
    });
});

app.listen(8080);
console.log('listenig on port 8080');

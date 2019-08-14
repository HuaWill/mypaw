let express = require('express');
let path = require('path');
var cors = require('cors');
let routes = require('./routes');

let app = new express();
app.use(cors());

routes.initialAppRouters(app);

app.use('/dist', express.static(path.resolve(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.type('text/html').sendFile(path.resolve(__dirname, '../index.html'));
});

const SERVER_PORT = '8081';
app.set('port', SERVER_PORT);
app.listen(app.get('port'));

// exports.SERVER_PORT = SERVER_PORT;
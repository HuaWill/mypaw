let express = require('express');
var cors = require('cors');
let routes = require('./routes');

let app = new express();
app.use(cors());

routes.initialAppRouters(app);

const SERVER_PORT = '8081';
app.set('port', SERVER_PORT);
app.listen(app.get('port'));

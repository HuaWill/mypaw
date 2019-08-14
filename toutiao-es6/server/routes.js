const mockData = require('./data/mock');

exports.initialAppRouters = (app) => {
    app.get('/list', (req, res) => {
        res.send(JSON.stringify(mockData));
    });
}

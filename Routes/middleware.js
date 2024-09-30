const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const middleware = express.Router();

middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: true }));
middleware.use(express.static(path.join(__dirname, '../public')));

const staticPaths = {
    '/Images': '../Images',
    '/Pages': '../Pages',
};

for (const [url, dir] of Object.entries(staticPaths)) {
    middleware.use(url, express.static(path.join(__dirname, dir)));
}

middleware.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../Images/favicon.ico'));
});

module.exports = middleware;
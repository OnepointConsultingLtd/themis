/**
 * Dedicated API server
 */
const express = require('express');
const http = require('http');
const app = express();
const port = 4000;
const api = require('./index');

app.use('/', api);

const server = http.createServer(app);

server.listen(port, () => console.log('Node Express server for rulesMS API, listening on port: ' + port));

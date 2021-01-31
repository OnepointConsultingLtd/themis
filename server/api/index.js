const express = require('express');
const app = express();
const apiRules = require('./rules');
const apiConfig = require('./config');
// const apiDeployInLocalFS = require('./deployInLocalFS');
// const apiValidate = require('./functions/validate');
const apiDeployAS = require('./deployAS'); // TODO: RENAME AND USE DEPLOY PATH
const bodyParser = require('body-parser');

// https://stackoverflow.com/questions/52016659/nodejs-router-payload-too-large
const limit = '50Mb';
const extended = true;
const options = { limit, extended };
app.use(bodyParser.json(options));
app.use(bodyParser.urlencoded(options));
app.use(bodyParser.text(options));
app.use(apiRules);
app.use(apiConfig);
// app.use(apiDeployInLocalFS);
// app.use(apiValidate);
app.use(apiDeployAS); // TODO: RENAME AND USE DEPLOY PATH

module.exports = app;

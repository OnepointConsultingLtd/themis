/* eslint consistent-return:0 */
const express = require('express');
const apiRules = require('./api/rules');
const apiConfig = require('./api/config');
// const apiDeployInLocalFS = require('./api/deployInLocalFS');
// const apiValidate = require('./api/functions/validate');
const apiDeployAS = require('./api/deployAS'); // TODO: RENAME AND USE DEPLOY PATH
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('./logger');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
  ? require('ngrok')
  : false;
const { resolve } = require('path');
const app = express();
const bodyParser = require('body-parser');

// https://stackoverflow.com/questions/52016659/nodejs-router-payload-too-large
const limit = '50Mb';
const extended = true;
const options = { limit, extended };
app.use(bodyParser.json(options));
app.use(bodyParser.urlencoded(options));
app.use(bodyParser.text(options));

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.use(apiRules);
app.use(apiConfig);
// app.use(apiDeployInLocalFS);
// app.use(apiValidate);
app.use(apiDeployAS); // TODO: RENAME AND USE DEPLOY PATH

app.use('/', express.static('public', { etag: false }));
app.use(favicon(path.join('public', 'favicons', 'favicon.ico')));

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});

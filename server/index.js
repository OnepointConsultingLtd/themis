/**
 * PRODUCTION WEBSERVER
 * (OPTIONAL DEVSERVER INCL.) 
 */

/* eslint consistent-return:0 */
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('./logger');
const argv = require('./argv');
const port = require('./port');
const isDev = process.env.NODE_ENV !== 'production';
const app = express();
const compression = require('compression');

// CRA: If you need an integrated service-API backend, pls do mount your custom backend-specific middleware here [OPTIONAL]

// Proxying all /api/* calls to Themis API service
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
app.all('/api/*', (req, res) => {
  console.log('Proxying Request', req.method, req.url);
  proxy.web(req, res, { target: isDev ? 'http://localhost:5000' : 'https://rules-ms-server.herokuapp.com', changeOrigin: true });
});

app.use(compression());

/** 
 * Production Static webserver
*/
app.use('/', express.static('public', { etag: false }));
app.use(favicon(path.join('public', 'favicons', 'favicon.ico')));
app.get('*', (req, res) =>
    res.sendFile(path.resolve('public', 'index.html')),
);

// #### DEDICATED EXPRESS DEV-SERVER [OPTIONAL]
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const config = require('../webpack.config.js');
// const compiler = webpack(config);
// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
// app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath,
//   })
// );

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host

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
  console.log('node webserver is running at PORT: ', port)
});

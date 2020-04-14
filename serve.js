const path = require('path');
const fs = require('fs');
const process = require('process');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  })
);

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  const filePath = path.join(
    __dirname,
    req.path === '/' ? '/index.html' : req.path
  );
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (!err) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(__dirname, '/index.html'));
    }
  });
});

const port = process.env.MANAGER_PORT || 3000;

app.listen(port, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port);
});

const path = require('path');
const webpack = require('webpack');

const defines = {
  DEFAULT_WS_URI: process.env.WEBSOCKET_URI || 'ws://127.0.0.1:8412/',
};

module.exports = (env, argv) => ({
  devtool: 'source-map',
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      { test: /\.(j|t)sx?$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin(defines)],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'react-dom': argv.mode === 'production' ? 'react-dom' : '@hot-loader/react-dom',
    },
  },
  devServer: {
    contentBase: __dirname,
    host: '0.0.0.0',
    port: 3030,
    hot: true,
  },
});

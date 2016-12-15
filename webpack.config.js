const webpack = require('webpack');

module.exports = {
  entry: "./lib/sz-json-rpc",
  output: {
    path: `${__dirname}/dist`,
    libraryTarget: "umd",
    library: "SzJsonRpc",
    filename: "sz-json-rpc.js",
    umdNamedDefine: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.OldWatchingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: true })
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  }
};

module.exports = {
  entry: "./lib/sz-json-rpc",
  output: {
    path: `${__dirname}/dist`,
    libraryTarget: "umd",
    library: "SzJsonRpc",
    filename: "sz-json-rpc.js",
    umdNamedDefine: true
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  }
};

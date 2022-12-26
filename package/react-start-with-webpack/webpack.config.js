const path = require("path");

module.exports = {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 8080,
  },
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    publicPath: "",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /[\.js|\.jsx]$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

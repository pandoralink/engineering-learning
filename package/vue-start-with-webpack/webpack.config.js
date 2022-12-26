const webpack = require("webpack");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 8080,
  },
  devtool: "inline-source-map",
  entry: path.join(__dirname, "./main.js"),
  output: {
    publicPath: "",
    path: path.join(__dirname, "./public"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "vue-start-with-webpack",
      template: "public/index.html",
      scriptLoading: "defer",
    }),
  ],
};

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",
  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    main: "./src/main.ts",
    ui: "./src/ui.tsx",
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      global: "window",
      process: JSON.stringify({ env: { NODE_ENV: "production" }, version: "0", platform: "browser" }),
    }),
    new HtmlWebpackPlugin({
      template: "./src/ui.html",
      filename: "ui.html",
      chunks: ["ui"],
      inject: "body",
      scriptLoading: "blocking",
    }),
    new HtmlInlineScriptPlugin(),
  ],
});

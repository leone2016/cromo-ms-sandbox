"use strict";

const path = require("path");
// const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const slsw = require("serverless-webpack");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  mode: "production",
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: "inline-cheap-module-source-map",
  externals: ["pdfkit", "bwip-js", "soap", "jsonpath", "microtime", "jimp"],
  resolve: {
    extensions: [".js", ".json", ".ts"],
    plugins: [new TsConfigPathsPlugin()],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: 1,
              workerParallelJobs: 1,
              // workerParallelJobs: slsw.lib.entries.length,
              // workerNodeArgs: ["--max-old-space-size=7168"],
            },
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
              configFile: "tsconfig.webpack.json",
            },
          },
        ],
        exclude: [/node_modules/, /\.(spec|e2e|d)\.ts$/],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          mangle: false,
        },
      }),
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/schema",
          to: "src/schema",
        },
        {
          from: "./.utransferrc",
          to: "",
        },
      ],
    }),
  ],
};

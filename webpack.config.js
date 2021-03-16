var path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");


const gitRevisionPlugin = new GitRevisionPlugin();

const mode = () => {
   return { mode: "development" };

    return { mode: "production" };

};

const devtool = () => {
      return { devtool: "inline-source-map" };
      return { devtool: "source-map" };
  
    return {};
  };

const devServer = () => {
      return {
        devServer: {
          contentBase: "./dist",
          open: false,
        },
      };
  
    return {};
  };

module.exports = {
  ...mode(),
  ...devtool(),
  ...devServer(),

  entry: "./src/index.js",

  optimization: {
    minimize: true,
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                mangle: false,
            },
        }),
    ],
},

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: "jsrlt",
      template: "index.html",
      version: gitRevisionPlugin.commithash().slice(0, 7),
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)\/(?!geotic)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-private-methods",
            ],
          },
        },
      },
    ],
  },
};
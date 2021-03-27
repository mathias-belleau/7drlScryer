var path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin')


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
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    new HtmlWebpackPlugin({
      title: "jsrlt",
      template: "index.html",
      version: gitRevisionPlugin.commithash().slice(0, 7),
    }),
    new CircularDependencyPlugin({
      // `onStart` is called before the cycle detection starts
      onStart({ compilation }) {
        console.log('start detecting webpack modules cycles');
      },
      // `onDetected` is called for each module that is cyclical
      onDetected({ module: webpackModuleRecord, paths, compilation }) {
        // `paths` will be an Array of the relative module paths that make up the cycle
        // `module` will be the module record generated by webpack that caused the cycle
        compilation.errors.push(new Error(paths.join(' -> ')))
      },
      // `onEnd` is called before the cycle detection ends
      onEnd({ compilation }) {
        console.log('end detecting webpack modules cycles');
      },
    })
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
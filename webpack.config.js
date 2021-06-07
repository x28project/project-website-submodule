const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const htmlConfigFound = fs.existsSync('../webpack.config.html.js');
const projectsConfigFound = fs.existsSync('../webpack.config.projects.js');
const imagesDirFound = fs.existsSync('../images');
if (!htmlConfigFound) {
  // eslint-disable-next-line no-console
  console.error('HTML config not found');
}
if (!projectsConfigFound) {
  // eslint-disable-next-line no-console
  console.error('Projects config not found');
}
if (!imagesDirFound) {
  // eslint-disable-next-line no-console
  console.error('Images directory not found');
}
if (!htmlConfigFound || !projectsConfigFound || !imagesDirFound) {
  process.exit();
}

global.projects = require('../webpack.config.projects');
const htmlWebpackPluginOptions = require('../webpack.config.html');
const definesWebpackPluginDefinitions = require('./webpack.config.defines');

module.exports = {
  devtool: 'source-map',
  entry: {
    'bundle.js': ['./src/index.js', './src/styles.scss'],
    'sw.js': './src/sw.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].min.css',
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ...definesWebpackPluginDefinitions,
    }),
    new HtmlWebpackPlugin({
      publicPath: 'http://localhost:8080/',
      inject: false,
      ...htmlWebpackPluginOptions,
    }),
    new HtmlWebpackTagsPlugin({
      tags: [
        'https://cdn.muicss.com/mui-0.10.3/css/mui.min.css',
        'https://cdn.muicss.com/mui-0.10.3/js/mui.min.js',
      ],
      append: false,
      usePublicPath: false,
    }),
    new HtmlWebpackTagsPlugin({
      tags: ['styles.min.css'],
      append: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: '../app.webmanifest',
          to: '../dist/app.webmanifest',
        },
        {
          context: '../images',
          from: 'favicon.(ico|svg)',
          to: '../dist/',
        },
        {
          context: '../images',
          from: '!(favicon.(ico|svg))',
          to: '../dist/images/',
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new JsonMinimizerPlugin({
        test: /\.webmanifest/i,
      }),
      new TerserPlugin(),
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name]',
  },
};

/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv({
      path: './.env.development',
    }),
  ],
  stats: {
    children: false,
    modules: false,
  },
  devServer: {
    contentBase: './build',
    hot: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: {
      children: false,
      modules: false,
    },
  },
};

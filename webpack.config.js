const webpack = require('webpack');
const path = require('path');

module.exports = {

  entry: path.join(__dirname, 'demo', 'index'),

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'demo'),
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // query: {
          // presets: ['es2015'],
        // },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      vue: {
        esModule: true,
      }
    }),
  ],

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: path.join(__dirname, 'node_modules', 'vue', 'dist', 'vue'),
    },
  },
};

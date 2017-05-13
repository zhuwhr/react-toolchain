/**
 * Adjusted based on React Starter Kit (https://www.reactstarterkit.com/)
 * 
 * Licensed under MIT license.
 */
var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var webpackMerge = require('webpack-merge');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var WebpackChunkHash = require('webpack-chunk-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.env.NODE_ENV === 'production';
var srcRoot = path.resolve(__dirname, 'src');

var baseConfig = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: srcRoot,
        loader: 'babel-loader',
      },

      {
        test: /\.eot(\?\S*)?$/,
        include: srcRoot,
        use: [{
          loader: 'url-loader',
        }],
      },

      {
        test: /\.otf(\?\S*)?$/,
        include: srcRoot,
        use: [{
          loader: 'url-loader',
        }],
      },

      {
        test: /\.svg(\?\S*)?$/,
        include: srcRoot,
        use: [{
          loader: 'url-loader',
          options: { mimetype: 'image/svg+xml' }
        }],
      },

      {
        test: /\.ttf(\?\S*)?$/,
        include: srcRoot,
        use: [{
          loader: 'url-loader',
          options: { mimetype: 'application/octet-stream' }
        }],
      },

      {
        test: /\.woff2?(\?\S*)?$/,
        include: srcRoot,
        use: [{
          loader: 'url-loader',
          options: { mimetype: 'application/font-woff' }
        }],
      },

      {
        test: /\.(jpe?g|png|gif)$/,
        include: srcRoot,
        use: [
          {
            loader: 'url-loader',
          }
        ],
      },

      {
        test: /\.less$/,
        // TODO: use extractTextPlugin for default styles
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          }
        ]
      },

    ]
  },

  output: {
    // Better to keep one outputPath before this PR accepted
    // https://github.com/robturtle/webpack-dev-middleware/issues/1
    path: path.resolve(__dirname, 'dist/public'),
  },

  stats: {
    colors: true,
    reasons: !isProduction,
    timings: true,
  },
};

var clientConfig = webpackMerge(baseConfig, {
  name: 'client',

  target: 'web',

  context: path.resolve(srcRoot, 'client'),

  entry: {
    client: ['babel-polyfill', './client.js'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              // css-loader
              sourceMap: !isProduction,
              // CSS modules
              modules: true,
              localIdentName: isProduction ? '[hash:base64:5]' : '[name]-[local]-[hash:base64:5]',
              // CSS Nano
              minimize: isProduction,
              discardComments: { removeAll: true }
            }
          }
        ]
      }
    ]
  },

  output: {
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    publicPath: '/',
  },

  devtool: isProduction ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',

  plugins: [
    // Libraries splitting
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new ManifestPlugin(),
    new WebpackChunkHash(),

    // Generate index.html
    new HtmlWebpackPlugin({
      template: '!!pug-loader!src/server/layout.pug'
    }),

    new ExtractTextPlugin("styles.css"),
  ],

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    // https://webpack.github.io/docs/configuration.html#node
    // https://github.com/webpack/node-libs-browser/tree/master/mock
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
});

var serverConfig = webpackMerge(baseConfig, {
  target: 'node',
  externals: [nodeExternals()],

  context: path.resolve(srcRoot, 'server'),

  entry: {
    server: ['babel-polyfill', './server.js']
  },

  output: {
    // A benefit is server.js is out of web root
    filename: '../server.js',
  },

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
});

module.exports = [clientConfig, serverConfig];

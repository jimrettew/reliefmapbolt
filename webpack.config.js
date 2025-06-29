const Dotenv = require('dotenv-webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'web',
  entry: path.resolve(__dirname, 'index.web.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDevelopment ? '[name].chunk.js' : '[name].[contenthash].chunk.js',
    publicPath: '/',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 6,
      maxAsyncRequests: 6,
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20,
          maxSize: 512000,
        },
        maps: {
          test: /[\\/]node_modules[\\/](@react-google-maps|react-native-maps)[\\/]/,
          name: 'maps',
          chunks: 'all',
          priority: 30,
        },
        icons: {
          test: /[\\/]node_modules[\\/](react-icons)[\\/]/,
          name: 'icons',
          chunks: 'all',
          priority: 25,
        },
        navigation: {
          test: /[\\/]node_modules[\\/](@react-navigation)[\\/]/,
          name: 'navigation',
          chunks: 'all',
          priority: 25,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
    usedExports: true,
    sideEffects: false,
    minimizer: [
      '...',
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-vector-icons': 'react-native-vector-icons/dist',
    },
    extensions: ['.web.tsx', '.web.js', '.tsx', '.ts', '.js', '.json', '.native.tsx'],
    fullySpecified: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!react-native|react-native-animatable|react-native-vector-icons|@react-navigation).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { loose: true }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isDevelopment ? '[name].[ext]' : '[name].[contenthash].[ext]',
              outputPath: 'static/media/',
              publicPath: '/static/media/',
            },
          },
        ],
      },
      {
        test: /\.json$/,
        type: 'json',
      },
      {
        test: /\.js$/,
        resolve: { fullySpecified: false },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new Dotenv({
      systemvars: true,
      safe: false,
      silent: true,
    }),
  
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'build'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
        {
          from: path.resolve(__dirname, 'node_modules/react-native-vector-icons/Fonts'),
          to: path.resolve(__dirname, 'build/fonts'),
          globOptions: {
            ignore: ['**/*.md'],
          },
        },
      ],
    }),
    ...(isDevelopment ? [] : [
      new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        exclude: [/\.map$/, /manifest$/, /\.htaccess$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-maps-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /^https:\/\/maps\.gstatic\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-maps-static-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      })
    ]),
  ],
  devServer: {
    static: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
    port: 3000,
    open: true,
  },
  mode: process.env.NODE_ENV || 'development',
};


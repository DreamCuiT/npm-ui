'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require("webpack");
const uglify = require('uglifyjs-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  // mode: 'production',
  context: path.resolve(__dirname, '../'),
  // optimization: {
  //   splitChunks: {
  //     // include all types of chunks
  //     chunks: 'all'
  //   }
  // },
  entry: {
    index: ['./src/index.js'],
    api: ['./src/plugins/api.js'],
    vender: ['vue','vue-router','vuex','element-ui','axios','monaco-editor','moment','bpmn-js','echarts']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: '/dist/',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'P8',
    umdNamedDefine: true,
  },
  // 不需要webpack处理，编译进文件中，在我们需要，使用它的时候可以通过CMD、AMD、或者window全局方式访问
  // externals: {
  //   "vue": 'vue',
  //   "axios": "axios",
  //   "element-ui": "element-ui",
  //   "moment": "moment",
  //   "monaco-editor": "monaco-editor",
  //   "echarts": "echarts"
  // },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'main': path.resolve(__dirname, '../src'),
      'packages': path.resolve(__dirname, '../packages'),
      'examples': path.resolve(__dirname, '../examples'),
      '~': path.resolve('src'),

    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('packages'),
          resolve('node_modules/bpmn-js'),
          resolve('node_modules/@babel/parser/lib'),
          resolve('node_modules/diagram-js/lib'),
          resolve('node_modules/@bpmn-io/element-templates-validator'),
          resolve('node_modules/bpmn-js-properties-panel/lib'),
          resolve('node_modules/element-ui/src'),
          resolve('node_modules/element-ui/packages'),
          resolve('node_modules/webpack-dev-server/client')
        ],
        options: {
          presets: ["@vue/babel-preset-jsx",["@babel/preset-env",{ "useBuiltIns": "usage","corejs": 3 }]],
          sourceType: 'unambiguous',
          plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-syntax-jsx", 
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-proposal-object-rest-spread",
              { "loose": true, "useBuiltIns": true }
            ]
          ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }, 
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      { 
        test:/\.scss/,
        use:[
          { loader: 'vue-style-loader' },
          { loader: 'css-loader'},
          { loader: 'sass-loader'},
          { loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, "../p8VuePlatform/src/assets/commonStyle/common.scss")
            }
          }
        ]
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    // new uglify(),
    // new CompressionWebpackPlugin(),
    // new MonacoWebpackPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
  //   new BundleAnalyzerPlugin(
  //     {
  //        analyzerMode: 'server',
  //        analyzerHost: '127.0.0.1',
  //        analyzerPort: 8889,
  //        reportFilename: 'report.html',
  //        defaultSizes: 'parsed',
  //        openAnalyzer: true,
  //        generateStatsFile: false,
  //        statsFilename: 'stats.json',
  //        statsOptions: null,
  //        logLevel: 'info'
  //          }
  // ),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: ['commons'] ,
      filename: 'common.bundle.[chunkhash].js',
      minChunks:function(module){
        return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0 && ['vue','vue-router','vuex','element-ui','axios','monaco-editor','moment','bpmn-js','echarts'].indexOf( module.resource.substr(module.resource.lastIndexOf('/')+1).toLowerCase() ) != -1
          )
    }
    }),
    new webpack.optimize.CompressionWebpackPlugin({
      name: 'vendor',
      minchunk: ({resource}) => {
        resource && resource.indexOf('node_modules') && resource.match(/\.js$/)
      }
    })
  ]
}
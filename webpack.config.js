const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminWebp = require('imagemin-webp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const exclude = [/node_modules/, resolve(__dirname, 'static', 'assets')];

module.exports = (options = {}) => {
  const isProduction = options.mode === 'production';
  const sourceMap = isProduction ? '' : 'eval-source-map';

  return {
    context: resolve(__dirname, 'src'),
    devtool: sourceMap,
    target: 'node',
    entry: {
      app: ['./js/app']
    },
    output: {
      path: resolve(__dirname, 'static', 'assets'),
      filename: 'js/[name].js',
      publicPath: 'assets/'
    },
    resolve: {
      extensions: ['.wasm', '.js', '.jsx', '.json', 'jpg', 'png']
    },
    performance: {
      hints: 'warning'
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: isProduction
            }
          }
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(png|jp(e*)g|gif|svg)$/i,
          use: [
            {
              loader: '@brigad/ideal-image-loader',
              options: {
                name: 'images/[name].[hash].[ext]',
                base64: isProduction,
                webp: isProduction ? undefined : false,
                warnOnMissingSrcset: !isProduction
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|svg|gif)$/i,
          include: exclude,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[hash].[ext]',
                emitFile: false
              }
            }
          ]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|flv)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: 'media/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true,
                attrs: [':data-src', ':data-srcset']
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader?name=/[hash].[ext]',
              options: {
                limit: 8192,
                outputPath: 'fonts/'
              }
            }
          ]
        }
      ]
    },
    devServer: {
      port: process.env.PORT || 3000,
      contentBase: resolve(process.cwd(), 'static'),
      watchContentBase: true,
      hot: true,
      open: true, // Automatically open the page in browser
      host: '0.0.0.0',
      historyApiFallback: true, // Using HTML5 History API based routing
      overlay: true // Error overlay to capture compilation related warnings and errors
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          sourceMap: true,
          parallel: true
        }),
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new MiniCssExtractPlugin({
          filename: 'css/[name].css',
          chunkFilename: 'css/[id].[hash:5].css'
        })
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        fetch:
          'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
      }),
      new webpack.DefinePlugin({
        __NODE_ENV__: JSON.stringify(options.mode)
      }),
      new ManifestPlugin(),
      new HtmlWebpackPlugin({
        // template: resolve(__dirname, 'layouts', 'partials', 'favicons.html'),
        filename: 'favicons.html',
        inject: false
      }),
      new WebappWebpackPlugin({
        logo: resolve(__dirname, 'src', 'images', 'logo_transparent.png'),
        cache: true,
        publicPath: 'assets',
        outputPath: 'icons',
        inject: 'force',
        favicons: {
          appName: 'ProSightful Counseling',
          developerName: 'Gilbert F. Sewovoe-Ekoue'
        }
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[id].[hash:5].css'
      }),
      new CopyWebpackPlugin([
        {
          from: 'fonts/**/**',
          to: resolve(__dirname, 'static', 'assets', 'fonts'),
          flatten: true
        },
        {
          from: 'images/**/**',
          to: resolve(__dirname, 'static', 'assets')
        },
        {
          from: 'images/**/**',
          to: './images/[name].webp'
        }
      ]),
      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production',
        pngquant: {
          quality: 75
        },
        plugins: [
          imageminMozjpeg({
            progressive: true,
            arithmetic: false,
            quality: 85,
            sample: ['2x2']
          }),
          imageminWebp({
            quality: 85
          })
        ]
      }),
      new UglifyJsPlugin({
        sourceMap: true
      }),
      new WorkboxPlugin.GenerateSW({
        swDest: 'sw.js',
        clientsClaim: true,
        skipWaiting: true
        /*
        precacheManifestFilename: 'js/precache-manifest.[manifestHash].js',
        importScripts: [
          '/assets/js/workbox-catch-handler.js'
        ],
        exclude: [
          /\.(png|jpe?g|gif|svg|webp)$/i,
          /\.map$/,
          /^manifest.*\\.js(?:on)?$/,
        ],
        offlineGoogleAnalytics: true,
        runtimeCaching: [{
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
          handler: 'cacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 20
            }
          }
        }]
        */
      })
    ]
  };
};

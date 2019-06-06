const { resolve } = require('path');
const glob = require('glob');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options = {}) => {
  const isProduction = options.mode === 'production';
  const sourceMap = isProduction ? '' : 'eval-source-map';

  return {
    context: resolve(__dirname, 'src'),
    devtool: sourceMap,
    target: 'node',
    watch: true,
    entry: {
      app: ['./js/app']
    },
    output: {
      path: resolve(__dirname, './static/assets'),
      filename: 'js/[name].js',
      publicPath: '/assets/'
    },
    module: {
      rules: [
        {
          test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader?name=/[hash].[ext]'
        },

        { test: /\.json$/, loader: 'json-loader' },

        {
          loader: 'babel-loader',
          test: /\.js?$/,
          exclude: /node_modules/,
          query: { cacheDirectory: true }
        },

        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },

        /*
        {
          test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        },
        {
        test: /\.(png|jpe?g|gif|svg|ico)(\?v=.+)?$/,
        exclude: /(\/fonts|webfonts)/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/'
          }
        }
      },
        {
          test: /\.(png|jp(e*)g|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                limit: 8000,
                outputPath: 'img/'
              }
            }
          ]
        }, */
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true
              }
            }
          ]
        }
      ]
    },
    devServer: {
      contentBase: (__dirname, './public'),
      hot: true,
      open: true
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          parallel: true
        })
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[id].[hash:5].css'
      }),
      new CopyWebpackPlugin([
        {
          from: './fonts/',
          to: 'fonts/',
          flatten: true
        }
      ]),
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
      // new PurgecssPlugin({
      //   paths: glob.sync('src/*')
      // })
    ]
  };
};
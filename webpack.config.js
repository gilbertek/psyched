const { resolve } = require('path');
const glob = require('glob');
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
      path: resolve(__dirname, 'static'),
      filename: 'js/[name].js',
      publicPath: '/static/'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', 'jpg', 'png'],
    },
    performance: {
      hints: 'warning',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        { test: /\.json$/, loader: 'json-loader' },
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
        {
          test: /\.(png|jp(e*)g|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                limit: 8000,
                outputPath: './images/',
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'font/',
              },
            },
          ],
        },
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
      hot: true,
      open: true,
      inline: true,
      compress: true,
      stats: 'minimal',
      host: '0.0.0.0'
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
        },
        {
          from: 'images/',
          to: 'images/'
        }
      ]),
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
      new PurgecssPlugin({
        paths: glob.sync(resolve(__dirname, './static/**/*'), {
          nodir: true
        })
      })
    ]
  };
};
var path = require('path');
var webpack = require('webpack');
var styleLintPlugin = require('stylelint-webpack-plugin');

var API_URL = process.env.API_URL || 'http://localhost:5555/';

module.exports = {
    entry: [
        'webpack-hot-middleware/client?reload=true?path=http://localhost:5000/__webpack_hmr',
        'react-hot-loader/patch',
        'babel-polyfill',
        './src/main.jsx'
    ],
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer'),
                                require('postcss-simple-vars')({
                                    variables: () => require('../src/theme/styleConfig.js')
                                }),
                                require('postcss-nested'),
                                require('postcss-calc'),
                                require('postcss-font-magician')
                            ]
                        }
                    }
                ],
                include: path.resolve(__dirname, '..', 'src')
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                'es2015',
                                'react',
                                'stage-0'
                            ],
                            plugins: [
                                'react-hot-loader/babel',
                                'transform-class-properties',
                                'transform-decorators-legacy',
                                ['module-resolver', {
                                    root: ['./src'],
                                    alias: {
                                        test: './test',
                                        underscore: 'lodash'
                                    }
                                }]
                            ]
                        }
                    },
                    {
                        loader: 'eslint-loader?{rules:{"no-console":0}}'
                    }
                ],
                include: path.resolve(__dirname, '..', 'src'),
            }
        ]
    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.css', '.scss']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new styleLintPlugin({
            configFile: path.resolve(__dirname, '..', '.stylelintrc'),
            context: path.resolve(__dirname, '..', 'src'),
            files: '**/*.?(scss|css)',
            failOnError: false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: {
                    configFile: '.eslintrc',
                    extensions: ['.js', '.jsx'],
                    ignorePath: '.gitignore',
                    cache: true,
                    formatter: require('eslint-friendly-formatter')
                },
                debug: true
            }
        })
    ]
};

let fs = require('fs');
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
const SveltePreprocess = require("svelte-preprocess");
const prod = true;

let definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
    WEBGL_RENDERER: true,
    CANVAS_RENDERER: true,
    VERSION: JSON.stringify(require('./package.json').version)
});

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'src/main.ts')
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: './',
        filename: 'js/bundle.js'
    },
    plugins: [
        definePlugin,
        new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['dist'] }),
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        /* new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }), */
        // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' /* chunkName= */, filename: 'js/vendor.bundle.js' /* filename= */ }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeComments: true,
                removeEmptyAttributes: true
            },
            hash: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }
            ],
            options: {
                concurrency: 100,
            },
        })
    ],
    resolve: {
        modules: [
            path.resolve('./src/'),
            path.resolve('./node_modules/')
        ],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.mjs', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
        }
    },
    module: {
        rules: [

            // { test: /\.(ts|tsx)$/, loader: 'ts-loader' },
            { test: /\.(ts|tsx)$/, use: [{loader: 'ts-loader'}]},
            { test: /\.(css)$/, use: [{loader: 'css-loader'}]},
            // { test: /phaser\.js$/, loader: 'expose-loader?Phaser', include: [path.join(__dirname, 'src')] },
            { test: /phaser\.js$/, use:[{loader: 'expose-loader?Phaser', options: { exposes: {globalName: 'Promise', override: true} }}], include: [path.join(__dirname, 'src')] },
            { test: /\.(js|jsx)$/, use: ['babel-loader'], include: [path.join(__dirname, 'src')] },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        compilerOptions: {
                            // Dev mode must be enabled for HMR to work!
                            dev: !prod
                        },
                        emitCss: false,
                        hotReload: prod,
                        hotOptions: {
                            // List of options and defaults: https://www.npmjs.com/package/svelte-loader-hot#usage
                            noPreserveState: false,
                            optimistic: true,
                        },
                        preprocess: SveltePreprocess({
                            scss: true,
                            sass: true
                            // postcss: {
                            //     plugins: [
                            //         Autoprefixer
                            //     ]
                            // }
                        })
                    }
                }
            },

            {
                // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false
                }
            }

        ]
    },
    optimization: {
        // splitChunks: {
        //     chunks: 'all'
        // },
        minimize: true
    }
};

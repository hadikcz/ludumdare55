let fs = require('fs');
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let SveltePreprocess = require('svelte-preprocess');
let definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    WEBGL_RENDERER: true,
    CANVAS_RENDERER: true,
    VERSION: JSON.stringify(require('./package.json').version),
    // INGAME_UI_CSS: JSON.stringify(fs.readFileSync('assets/images/ui/ingame/ingame_ui.css').toString().replace('px}', 'px;}'))
});
const prod = false;

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'src/main.ts')
        ],
        vendor: ['phaser']
    },
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        library: '[name]',
        libraryTarget: 'umd',
        filename: '[name].js'
    },
    devtool: 'cheap-source-map',
    watch: true,
    plugins: [
        definePlugin,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: true
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './dist']
            }
        })
    ],
    resolve: {
        modules: [
            path.resolve('./src/'),
            path.resolve('./node_modules/')
        ],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.mjs', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
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
                        emitCss: prod,
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
    }
};

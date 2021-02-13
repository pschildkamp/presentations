const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PrettierPlugin = require('prettier-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = (env) => {
    const context = path.resolve(__dirname, '..', env.context);
    const package = require(path.resolve(context, 'package.json'));

    return {
        context: context,
        // Where webpack looks to start building the bundle
        entry: [context + '/src/index.js'],

        // Where webpack outputs the assets and bundles
        output: {
            path: context + '/dist',
            filename: '[name].js',
            publicPath: '/',
        },

        // Customize the webpack build process
        plugins: [
            // Removes/cleans build folders and unused assets when rebuilding
            new CleanWebpackPlugin(),

            // Copies files from target to destination folder
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: context + '/public',
                        to: 'assets',
                        globOptions: {
                            ignore: ['*.DS_Store'],
                        },
                        noErrorOnMissing: true,
                    },
                ],
            }),

            new HtmlWebpackPlugin({
                template: context + '/src/index.ejs',
                title: package.config.presentation.title,
                description: package.config.presentation.description,
                filename: "index.html",
                inject: 'body',
                minify: true,
                showErrors: false
            }),

            // ESLint configuration
            new ESLintPlugin({
                files: ['.', 'src', 'config'],
                formatter: 'table',
            }),

            // Prettier configuration
            new PrettierPlugin(),
        ],

        // Determine how modules within the project are treated
        module: {
            rules: [
                // Templating
                {
                    test: /\.ejs$/, use: {
                        loader: 'ejs-compiled-loader', options: {
                            htmlmin: true,
                            htmlminOptions: {
                                removeComments: true
                            }
                        }
                    }
                },
                // JavaScript: Use Babel to transpile JavaScript files
                {test: /\.js$/, use: ['babel-loader']},
                // Images: Copy image files to build folder
                {test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource'},
                // Fonts and SVGs: Inline files
                {test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline'},
            ],
        },
        resolve: {
            extensions: ['.js', '.ejs', '.json', '.scss'],
            alias: {
                themes: path.join(__dirname, '..', 'themes')
            }
        }
    }
}

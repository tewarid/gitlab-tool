/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.html', '.css' ],
        fallback: {
            path: require.resolve('path-browserify'),
        },    
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },  
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: '**/*.html', context: 'src', to: '.' },
                { from: '**/*.css', context: 'src', to: '.' },
            ],
        }),
    ],
};

import path from 'path';
import webpackNodeExternals from 'webpack-node-externals';
import Dotenv from 'dotenv-webpack'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './server.js',
    target: 'node',
    mode: 'development',
    externals: [webpackNodeExternals()],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
        }, ],
    },
    plugins: [
        new Dotenv({
            path: './.env'
        }),
    ],
};
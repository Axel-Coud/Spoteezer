const path = require('path');

const config = {
    entry: ['./client/App.tsx'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loaders: 'ts-loader'
        }]
    },
    mode: "development"
};

module.exports = config;
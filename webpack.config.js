const path = require('path');

const config = {
    entry: ['./client/src/App.tsx'],
    output: {
        path: path.resolve(__dirname, 'client'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.tsx$/,
            exclude: /node_modules/,
            loaders: 'ts-loader'
        }, {
            test: /\.css$/,
            use: [
                { loader: "style-loader" },
                { loader: "css-loader" }
            ]
        }]
    },
    mode: "development"
};

module.exports = config;
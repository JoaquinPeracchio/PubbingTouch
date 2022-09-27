const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	watch: true,
	watchOptions: {
		ignored: /node_modules/,
		poll: true
	},
	optimization: {
		minimize: false
	},
	entry: {
		index: ['./src/js/global.js', './src/js/index.js']
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public/dist/js'),
	},
	plugins: [
		new webpack.ProvidePlugin({
			_: 'lodash',
		}),
	]
};
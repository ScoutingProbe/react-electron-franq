module.exports = {
	entry: './main.js',
	output: {
	filename: 'bundle.js'
	},
	node: {
	 fs: 'empty',
	 child_process: 'empty'
	},
	mode: 'development'
}
const os = require('os')

module.exports.initial = function(win){
	return new Promise((resolve,reject) => {
		let best = os.homedir()
		best = best.substring(0, 2)
		let search = 'Riot Games'

		let url = best + search
		fs.access(url, error => {
			reject(error)
		})

		resolve('hello')
	})
}
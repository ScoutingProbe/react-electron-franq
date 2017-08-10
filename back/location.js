const fs = require('fs')

module.exports.confirm = function confirm(l, w){
	return new Promise((resolve, reject) => {
		fs.access(l, (err) => {
			if (err) {
				resolve(new Array("file not found", l, w))
				reject(err)
			}
			else resolve(new Array("file found", l, w))
		})
	})
}

module.exports.inform = function inform(a){
	return new Promise((resolve, reject) => {
		a[2].webContents.send("location-inform", a[0])
		resolve(a)
	})
}

module.exports.store = function store(a){
	return new Promise((resolve, reject) => {
		if (a[0] == "file found") {
			fs.writeFile("./txt/location.txt", a[1], (error) => {
				if (error) reject(error)
				else resolve()
			})	
		}
		else if(a[0] = "file not found") {
			fs.writeFile("./txt/location.txt", a[0], (error) => {
				if (error) reject(error)
				else resolve()
			})
		}
		
	})
}
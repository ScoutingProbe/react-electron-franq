const fs = require('fs')

module.exports.initial = function initial(location, win){
	confirm(location, win)
	.then(store)
	.then(inform)
	.catch((error)=>{
		console.log(error)
	})
}

function confirm(location, win){
	return new Promise((resolve, reject) => {
		fs.access(location, (error) => {
			if (error) {
				resolve(new Array("file not found", location, win))
				reject(error)
			}
			else resolve(new Array("file found", location, win))
		})
	})
}

function store(array){
	return new Promise((resolve, reject) => {
		if (array[0] == "file found") {
			fs.writeFile("./txt/location.txt", array[1], (error) => {
				if (error) reject(error)
				else resolve(new Array(array[0], array[2]))
			})	
		}
		else if(array[0] = "file not found") {
			fs.writeFile("./txt/location.txt", array[0], (error) => {
				if (error) reject(error)
				else resolve(new Array(array[0], array[2]))
			})
		}
		
	})
}

function inform(array){
	return new Promise((resolve, reject) => {
		array[1].webContents.send("location-inform", array[0])
		resolve()
	})
}


const fs = require('fs')

//array[0] = lane
//array[1] = champion
//array[2] = window
module.exports.initial = function initial(array){
	read(array)
	.then(compare)
	.then(write)
	.then(inform)
	.catch((error)=>{
		console.log(error)
	})
}

function read(array){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/champion.txt', 'utf-8', (error, data)=>{
			if (error) reject(error)
			else {
				let champs = JSON.parse(data).data
				let champ = {"lane": array[0], "champion": array[1]}
				let win = array[2]
				resolve(new Array(champs, champ, win))
			}
		})
	})
}

function compare(array){
	return new Promise((resolve,reject)=>{
		let champs = array[0]
		let champ = JSON.stringify(array[1])
		let win = array[2]
		for (let i = 0; i < champs.length; i++){
			let current = JSON.stringify(champs[i])
			if (current === champ) {
				champs.splice(i, 1)
				return resolve(new Array(champs, win))
			}
		}
		
	})
}

function write(array){
	return new Promise((resolve,reject)=>{
		let champs = {"data": array[0]}
		fs.writeFile('./txt/champion.txt', JSON.stringify(champs), (error)=>{
			if (error) reject(error)
			else resolve(new Array(champs, array[1]))
		})
	})
}

function inform(array){
	console.log(array)
	return new Promise((resolve,reject)=>{
		array[1].webContents.send("champion-inform", array[0])
	})
}
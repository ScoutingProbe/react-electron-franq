const fs = require('fs')

module.exports.initial = function intitial(win){
	read(win)
	.then(inform)
	.catch((error)=>{
		console.log(error)
	})
}

function read(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/champion.txt', 'utf-8', (error,data)=>{
			if(error) reject(error)
			else resolve(new Array(JSON.parse(data), win))
		})
	})
}

function inform(array){
	return new Promise((resolve,reject)=>{
		array[1].webContents.send('champion-inform', array[0])
	})
}
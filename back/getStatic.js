const fs = require('fs')

module.exports.initial = function initial(win){
	read(win)
	.then(error)
	.then(inform)
	.catch((error)=>{
		console.log(error)
	})
}

function read(win){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static.txt", 'utf-8', (error,json)=>{
			if (error) reject(error)
			else {
				json = json.slice(0, json.lastIndexOf("\n"))
				json = JSON.parse(json)
				resolve(new Array(Object.keys(json.data), win))
			}
		})
	})
}

function error(array){
	return new Promise((resolve,reject)=>{
		if (Object.keys(array[0]).includes("status")) reject(new Error("getStatic.js: Static file stale with error"))
		else resolve(array)
	})
}

function inform(array){
	return new Promise((resolve,reject)=>{
		array[1].webContents.send("static-inform", array[0])
		resolve()
	})
}
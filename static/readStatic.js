const fs = require('fs')

module.exports.initial = function(win){
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

function success(win){
	win.webContents.send('static-inform', '&#10003;')
}

function fail(win, message){
	win.webContents.send('static-inform', message.concat(' &#10007;'))
}

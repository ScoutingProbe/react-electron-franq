const fs = require('fs')

module.exports.initial = function initial(win){
	read(win)
	.then(inform)
	.catch(array=>{
		let win = array[0]
		let error = array[1]
		win.webContents.send('op-inform', error)
		console.log(error)
	})

}

function read(win){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/op.txt", 'utf-8', (error, string)=>{
			if(error) reject(new Array(win,error))
			else resolve(new Array(JSON.parse(string), win))
		})
	})
}

function inform(array){
	return new Promise((resolve,reject)=>{
		array[1].webContents.send('champion-inform', array[0])
		array[1].webContents.send('op-inform', '&#10003;')
	})
}
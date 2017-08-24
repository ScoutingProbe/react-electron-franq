const fs = require('fs')

module.exports.initial = function intitial(win){
	readChampion(win)
	// .then(readOp)
	// .then(parse)
	.then(inform)
	.catch((error)=>{
		console.log(error)
	})
}

function readChampion(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/champion.txt', 'utf-8', (error,data)=>{
			if(error) reject(error)
			else resolve(new Array(JSON.parse(data), win))
		})
	})
}

// function readOp(array){
// 	return new Promise((resolve,reject)=>{
// 		fs.readFile('./txt/op.txt', 'utf-8', (error,data)=>{
// 			if (error) reject(error)
// 			else resolve(new Array(array[0], array[1], JSON.parse(data)))
// 		})
// 	})
// }

// //{"data":[{"lane":"Support","champion":"Janna"},{"lane":"Support","champion":"Sona"},{"lane":"Support","champion":"Soraka"}]}
// // static.lane.champ = array
// function parse(array){
// 	return new Promise((resolve,reject)=>{
// 		let champions = array[0]
// 		let win = array[1]
// 		let op = array[2]

// 		champions.data = champions.data.map((champ)=>{
// 			let lane = champ.lane
// 			let champion = champ.champion

// 			let winRatio = op.lane.champion
// 			champ["winRatio"] = winRatio
// 		})

// 		resolve(new Array(champions, win))
// 	})
// }

function inform(array){
	return new Promise((resolve,reject)=>{
		array[1].webContents.send('champion-inform', array[0])
	})
}
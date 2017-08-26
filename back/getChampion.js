const fs = require('fs')

module.exports.initial = function intitial(win){
	readChampion(win)
	.then(readOp)
	.then(parse)
	.then(inform)
	.catch((error)=>{
		console.log(error)
	})
}

function readChampion(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/champion.txt', 'utf-8', (error,data)=>{
			if(error) reject(error)
			else resolve(new Array(win, JSON.parse(data)))
		})
	})
}

function readOp(array){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/op.txt', 'utf-8', (error,data)=>{
			if (error) reject(error)
			else resolve(new Array(array[0], array[1], JSON.parse(data)))
		})
	})
}

//{"data":[{"lane":"Support","champion":"Janna"},{"lane":"Support","champion":"Sona"},{"lane":"Support","champion":"Soraka"}]}
function parse(array){
	return new Promise((resolve,reject)=>{
		let win = array[0]
		let champions = array[1]
		let op = array[2]

		champions.data.forEach(champ=>{
			let array = op[champ.champion][champ.lane.toLowerCase()]

			if (array === undefined) {
				champ["winRatio"] = "PickBan does not support troll picks :)"
				return
			}
			array.sort((a,b)=>{
				if (Object.values(a)[0] > Object.values(b)[0]) return -1
				else if (Object.values(a)[0] < Object.values(b)[0]) return 1
				else return 0
			})

			champ["winRatio"] = array
		})

		resolve(new Array(champions, win))
	})
}

function inform(array){
	return new Promise((resolve,reject)=>{
		array[1].webContents.send('champion-inform', array[0])
	})
}
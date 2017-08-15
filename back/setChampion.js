const fs = require('fs')

module.exports.check = function check(c){
	return new Promise((resolve,reject)=>{
		fs.open("./txt/champion.txt", "r", (e, d)=>{
			if (e) {
				if (e.code == "ENOENT"){
					create(c)
					.then(resolve)
				}
				else reject(e)
			}
			else {
				resolve(c)
			}
		})
	})
}

function create(c){
	return new Promise((resolve,reject)=>{
		fs.writeFile("./txt/champion.txt", JSON.stringify({"data": []}), (e)=>{
			if (e) reject(e)
			else resolve(c)
		})
	})
}

// array[0] = lane
// array[1] = championName
// array[2] = window
module.exports.initial = function initial(array){
	read(array)
	.then(push)
	.then(write)
	.then(inform)
	.catch((error)=>{
		console.log(error)
	})
}

function read(arr){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/champion.txt", (error,data)=>{
			if (error) reject(error)
			else {
				let a = JSON.parse(data.toString())
				let lane = arr[0]
				let champ = arr[1]
				let champion = {"lane":lane, "champion":champ}
				resolve(new Array(a, champion, arr[2]))
			}			
		})
	})
}

// array[0] = champions
// array[1] = champion
// array[2] = window
function push(array){
	return new Promise((resolve,reject)=>{
		let champs = array[0].data
		let champ = array[1]
		let win = array[2]

		for (let i = 0; i < champs.length; i++){		
			let left = JSON.stringify(champs[i])
			let right = JSON.stringify(champ)
			if (Object.is(left, right)) return resolve(new Array(array[0], array[2]))
		}
		array[0].data.push(champ)
		resolve(new Array(array[0], array[2]))
	})
}

function write(array){
	return new Promise((resolve,reject)=>{
		fs.writeFile("./txt/champion.txt", JSON.stringify(array[0]), (error)=>{
			if (error) reject(error)
			else resolve(array)
		})
	})
}

function inform(array){
	return new Promise((resolve,reject)=>{
		array[1].webContents.send("champion-inform", array[0])
	})
}

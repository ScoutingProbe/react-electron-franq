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

module.exports.read = function read(arr){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/champion.txt", (error,data)=>{
			if (error) reject(error)
			else {
				let a = JSON.parse(data.toString())
				let lane = arr[0]
				let champ = arr[1]
				let champion = {"champion":champ, "lane":lane}
				resolve(new Array(a, champion))
			}			
		})
	})
}

module.exports.push = function push(b){
	return new Promise((resolve,reject)=>{
		let all = b[0].data
		let champ = b[1]

		for (let i = 0; i < all.length; i++){		
			let left = JSON.stringify(all[i])
			let right = JSON.stringify(champ)
			console.log(left)
			console.log(right)
			if (JSON.stringify(all[i]) == JSON.stringify(champ)) resolve(b[0])
		}

		all.push(champ)
		b[0].data = all
		resolve(b[0])
	})
}

module.exports.write = function write(a){
	return new Promise((resolve,reject)=>{
		fs.writeFile("./txt/champion.txt", JSON.stringify(a), (error)=>{
			if (error) reject(error)
			else resolve()
		})
	})
}

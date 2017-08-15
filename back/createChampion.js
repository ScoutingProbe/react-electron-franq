const fs = require('fs')

module.exports.initial = function initial(){
	check()
	.catch((error)=>{
		console.log(error)
	})
}

function check(){
	return new Promise((resolve,reject)=>{
		fs.open("./txt/champion.txt", "r", (error, data)=>{
			if (error) {
				if (error.code == "ENOENT"){
					create()
					.then(resolve)
				}
				else reject(error)
			}
			else {
				resolve()
			}
		})
	})
}

function create(){
	return new Promise((resolve,reject)=>{
		fs.writeFile("./txt/champion.txt", JSON.stringify({"data": []}), (error)=>{
			if (error) reject(error)
			else resolve()
		})
	})
}
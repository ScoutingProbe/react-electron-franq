const fs = require('fs')

module.exports.read = function read(w){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static.txt", (error,data)=>{
			if (error) reject(error)
			else {
				let s = data.toString()
				s = s.slice(0, s.lastIndexOf("\n"))
				s = JSON.parse(s)
				resolve(new Array(s, w))
			}
		})
	})
}

module.exports.error = function error(a){
	return new Promise((resolve,reject)=>{
		if (Object.keys(a[0]).includes("status")) reject(new Error("Riot query problem"))
		else resolve(a)
	})
}

module.exports.keys = function keys(a){
	return new Promise((resolve,reject)=>{
		let k = Object.keys(a[0].data)
		resolve(new Array(k, a[1]))
	})
}

module.exports.inform = function inform(a){
	if (typeof(a[0]) == "string") a[0] = JSON.parse(a[0])
	return new Promise((resolve,reject)=>{
		a[1].webContents.send("champion-inform", a[0])
		resolve()
	})
}
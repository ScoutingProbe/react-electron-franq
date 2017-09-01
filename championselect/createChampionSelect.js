const fs = require('fs')
const http = require('http')
const cheerio = require('cheerio')

module.exports.initial = function initial(win){
	let base = "http://championselect.net/champions/"
	getChamps()
	.then(mutate)
	.then(request)
	.catch((error)=>{
		console.log(error)
	})
}

function getChamps(){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static_cache.txt", (error,data)=>{
			if (error) reject(error)
			else {
				let a = data.toString()
				a = a.slice(0, a.lastIndexOf("\n"))
				a = JSON.parse(a)
				a = Object.keys(a.data)
				resolve(a)
			}
		})
	})
}

function mutate(array){
	return new Promise((resolve,reject)=>{
		let obj = new Object()
		for (let i = 0; i < array.length; i++){
			let name = array[i]
			obj[name] = new Array()
		}
		resolve(obj)
	})
}


function request(c){
	return new Promise((resolve,reject)=>{
		let champs = Object.keys(c)
		let champ = champs[0].toLowerCase()
		const options = {
			"hostname": "championselect.net",
			"path": `/champions/${champ}`
		}

		const request = http.request(options, (response)=>{
			let data
			response.on('data', (chunk)=>{
				data += chunk
			})
			response.on('end',()=>{
				let page = cheerio.load(data.toString())
				console.log(page("#mount").text())
			})
		})

		request.on('error', (error)=>{
			throw new Error("championselect request error")
			reject(error)
		})

		request.end()
	})
}
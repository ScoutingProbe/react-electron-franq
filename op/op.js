const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')

//get name array
//request for every name
//load
//instantiate
//write 

module.exports.initial = function(){
	getNameArray()
	.then(request)
	.then(load)
	.catch((error)=>{
		console.log(error)
	})
}

function getNameArray(){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static.txt", "utf-8", (error,data)=>{
			if (error) reject(error)
			else {
				data = data.slice(0, data.lastIndexOf("\n"))
				data = JSON.parse(data)
				resolve(Object.keys(data.data))
			}
		})
	})
}

function request(array){
	return new Promise((resolve,reject)=>{
		let lanes = ["top", "jungle", "mid", "support", "adc"]
		for (let name of array){
			for (let lane of lanes){
				const request = https.request(`https://na.op.gg/champion/${name}/statistics/${lane}/matchups`, (response)=>{
					let data
					response.on('data', (chunk)=>{
						data += chunk
					})
					response.on('end', ()=>{
						load(data.toString())
					})
				})
				request.on('error', (error)=>{
					reject(error)
				})
			}
		}
	})
}

function load(string){
	console.log(string)
}
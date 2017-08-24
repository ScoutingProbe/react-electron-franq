const fs = require('fs')
const https = require('https')
const myUtil = require('./util.js')

module.exports.initial = function initial(){
	fresh()
	.then(getRegion)
	.then(request)
	.then(write)
	.catch((error)=>{
		console.log(error)
	})
}

function fresh(){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static.txt", "utf-8", (error,data)=>{
			if (error) Promise.reject(error)
			else {
				data = JSON.parse(data)
				if (data.data !== undefined) {
					version()
					.then((string)=>{
						if (string !== data.version) resolve
						else reject("static.js #content static.txt is fresh")
					})
				}
			}
		})
	})
	
}


function version(){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static.txt", "utf-8", (error, data)=>{
			if (error) reject(error)
			else {
				data = JSON.parse(data)
				resolve(data.version)
			}
		})
	})
}

function getRegion(){
	return new Promise((resolve, reject) => {
		fs.readFile("./txt/summoner.txt", 'utf-8', (error, data) => {
			if (error) reject(error)
			else {
				data = data.slice(data.indexOf("\n"))
				data = data.replace("\n", "")
				resolve(data)
			}
		})	
	})
}

function request(string){
	return new Promise((resolve, reject) => {
		//const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false"
		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": myUtil.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(string),
							"path": "/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false",
							"headers": header,
							"agent": false,
						}
		const request = https.request(options, (response) => {
			let data = ""
			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				resolve(JSON.parse(data))
			})
		})
		.on('error', (error) => {
			reject(error)
		})
		request.end()
	})
}

function setRegion(r) {
	switch (r) {
		case "RU":
			return "ru.api.riotgames.com"
		case "KR":
			return "kr.api.riotgames.com"
		case "BR1":
			return "br1.api.riotgames.com"
		case "OC1":
			return "oc1.api.riotgames.com"
		case "JP1":
			return "jp1.api.riotgames.com"
		case "NA1":
			return "na1.api.riotgames.com"
		case "EUN1":
			return "eun1.api.riotgames.com"
		case "EUW1":
			return "euw1.api.riotgames.com"
		case "TR1":
			return "tr1.api.riotgames.com"
		case "LA1":
			return "la1.api.riotgames.com"
		case "LA2":
			return "la2.api.riotgames.com"
	}
}

function write(string){
	return new Promise((resolve, reject) => {
		fs.writeFile("./txt/static.txt", JSON.stringify(string), (error) => {
			if (error) reject(error)
			else resolve()
		})
	})
}

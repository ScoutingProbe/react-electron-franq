const fs = require('fs')
const https = require('https')
const myUtil = require('./util.js')

module.exports.initial = function initial(){
	getRegion()
	.then(version)
	.then(fresh)
	.then(request)
	.then(write)
	.catch((error)=>{
		console.log(error)
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

function version(region){
	return new Promise((resolve, reject) => {
		// https://na1.api.riotgames.com/lol/static-data/v3/versions
		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": myUtil.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(region),
							"path": "/lol/static-data/v3/versions",
							"headers": header,
							"agent": false,
						}
		const request = https.request(options, (response) => {
			let data = ""
			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				data = JSON.parse(data)
				resolve(new Array(region, data[0])) //data[0] is current version
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

function fresh(array){
	let region = array[0]
	let version = array[1]
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static.txt", "utf-8", (error,data)=>{
			if (error) reject(error)
			else {
				data = JSON.parse(data)
				if (data.data !== undefined) {
					data.version === version ? reject("static.js #fresh") : resolve(region)
				}
				else resolve(region)
			}
		})
	})
}

function request(region){
	return new Promise((resolve, reject) => {
		//const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false"
		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": myUtil.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(region),
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
				resolve(data)
			})
		})
		.on('error', (error) => {
			console.log(`static.js #request ${error.message}`)
			reject(error)
		})
		request.end()
	})
}

function write(string){
	return new Promise((resolve, reject) => {
		fs.writeFile("./txt/static.txt", string, (error) => {
			if (error) reject(error)
			else resolve()
		})
	})
}
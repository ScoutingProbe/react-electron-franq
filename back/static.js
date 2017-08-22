const fs = require('fs')
const https = require('https')
const myUtil = require('./util.js')

module.exports.initial = function initial(win){
	check(win)
	.then(getTime)
	.then(getRegion)
	.then(request)
	.then(write)
	.catch((error)=>{
		console.log(error)
	})
}

function check(win){
	return new Promise((resolve,reject)=> {
		fs.readFile("./txt/static.txt", (error, data)=> {
			if (error) {
				if (error.code == "ENOENT") {
					create(win)
					.then((win)=>{
						resolve(win)
					})
				}
				else reject(error)	
			}
			else {
				resolve(win)
			}
		})
	})
}

function create(win) {
	return new Promise((resolve,reject)=>{
		let s = "\n" + (Date.now() - 3600000)
		fs.writeFile("./txt/static.txt", s, (error)=>{
			if (error) reject(error)
			else {
				resolve(win)
			}
		})
	})
}

function getTime(win) {
	return new Promise((resolve, reject)=>{
		fs.readFile("./txt/static.txt", (error,data)=>{
			if (error) reject(error)
			else {
				let t = data.toString()
				t = t.slice(t.lastIndexOf("\n")+1)
				t = parseInt(t)

				let j = data.toString()
				j = j.slice(0, j.lastIndexOf("\n"))

				let d = Date.now() - t
				if (d < 3600000) {
					reject(new Error("Riot static limit"))
				}
				else resolve(win)
			}
		})
	})
}

function getRegion(win){
	return new Promise((resolve, reject) => {
		fs.readFile("./txt/summoner.txt", 'utf-8', (error, data) => {
			if (error) reject(error)
			else {
				data = data.slice(data.indexOf("\n"))
				data = data.replace("\n", "")
				resolve(new Array(data, win))
			}
		})	
	})
}

//array[0] = region
//array[1] = win
function request(array){
	return new Promise((resolve, reject) => {
		//const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false"
		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": myUtil.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(array[0]),
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
				resolve(new Array(JSON.parse(data), array[1]))
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

//array[0] = json
//array[1] = win
function write(array){
	return new Promise((resolve, reject) => {
		let s = JSON.stringify(array[0])
		s += "\n" + Date.now()
		fs.writeFile("./txt/static.txt", s, (error) => {
			if (error) reject(error)
			else resolve()
		})
	})
}

const fs = require('fs')
const https = require('https')

module.exports.check = function check(w){
	return new Promise((resolve,reject)=> {
		fs.readFile("./txt/static.txt", (error, data)=> {
			if (error) {
				if (error.code == "ENOENT") {
					create(w)
					.then((w)=>{
						resolve(w)
					})
				}
				else reject(error)	
			}
			else {
				resolve(w)
			}
		})
	})
}

function create(w) {
	return new Promise((resolve,reject)=>{
		let s = "\n" + (Date.now() - 3600000)
		fs.writeFile("./txt/static.txt", s, (error)=>{
			if (error) reject(error)
			else {
				resolve(w)
			}
		})
	})
}

module.exports.getTime = function getTime(w) {
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
				else resolve(w)
			}
		})
	})
}

module.exports.getRegion = function getRegion(w){
	return new Promise((resolve, reject) => {
		fs.readFile("./txt/summoner.txt", (error, data) => {
			if (error) reject(error)
			else {
				let r = data.toString()
				r = r.slice(r.indexOf("\n"))
				r = r.replace("\n", "")
				resolve(new Array(r, w))
			}
		})	
	})
}

module.exports.request = function request(a){
	return new Promise((resolve, reject) => {
		const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false"

		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": "RGAPI-148b4411-582c-4e94-b156-a1d6ad218308",
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(a[0]),
							"path": "/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false",
							"headers": header,
							"agent": false,
						}
		let data = ""
		const request = https.request(options, (response) => {
			response.on('data', (d) => {
				data += d
			})
			response.on('end', () => {
				data = JSON.parse(data)
				resolve(new Array(data, a[1]))
			})
		})
		.on('error', (e) => {
			reject(e)
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

module.exports.update = function update(a){
	return new Promise((resolve, reject) => {
		let s = JSON.stringify(a[0])
		s += "\n" + Date.now()
		fs.writeFile("./txt/static.txt", s, (error) => {
			if (error) reject(error)
			else resolve(a)
		})
	})
}

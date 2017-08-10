const https = require('https')
const fs = require('fs')

module.exports.query = function query(r, a, s, w) {
	return new Promise((resolve, reject) => {		
		const url = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"

		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": "RGAPI-0a712bf5-f9f8-4366-8bfb-bbdd93a4bd7f",
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(r),
							"path": `/lol/summoner/v3/summoners/${setQuery(a)}${s}`,
							"headers": header,
							"agent": false,
						}

		let data = ""
		const request = https.request(options, (res) => {
			if (res.statusCode == 404 || res.statusCode == 400) resolve(new Array("summoner not found", w, r))
			res.on('data', (d) => {
				data += d
			})
			res.on('end', () => {
				data = JSON.parse(data)
				resolve(new Array(data, w, r))				
			})
		})
		.on('error', (e) => {
			reject(e)
		})
		request.end()
	})
}

function setQuery(a) {
	switch (a) {
		case "Account id":
			return "by-account/"
		case "Summoner name": 
			return "by-name/"
		case "Summoner id":
			return ""
	}
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

module.exports.inform = function inform(j) {
	return new Promise((res, rej) => {
		j[1].webContents.send("summoner-inform", j[0])
		res(j)	
	})
}

module.exports.store = function store(j){
	return new Promise((res, rej) => {
		let s = JSON.stringify(j[0]) + "\n" + j[2]
		fs.writeFile('./txt/summoner.txt', s, (err) => {
			if (err) rej(err)
			else res()
		})
	})
}
const https = require('https')
const fs = require('fs')

module.exports.initial = function initial(region, account, summoner, win){
	query(region, account, summoner, win)
	.then(write)
	.then(inform)
	.catch((error) => {
		console.log(error)
	})
}

function query(region, account, summoner, win) {
	return new Promise((resolve, reject) => {		
		const url = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"

		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": "RGAPI-148b4411-582c-4e94-b156-a1d6ad218308",
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(region),
							"path": `/lol/summoner/v3/summoners/${setQuery(account)}${summoner}`,
							"headers": header,
							"agent": false,
						}

		const request = https.request(options, (response) => {
			if (response.statusCode == 404 || response.statusCode == 400) {
				return resolve(new Array("summoner not found", win, region))
			}
			if (response.statusCode == 403) return resolve(new Array("riot developer key expired", win , region))
			let data = ""
			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				data = JSON.parse(data)
				resolve(new Array(data, win, region))				
			})
		})
		.on('error', (error) => {
			reject(error)
		})
		request.end()
	})
}

function setQuery(account) {
	switch (account) {
		case "Account id":
			return "by-account/"
		case "Summoner name": 
			return "by-name/"
		case "Summoner id":
			return ""
	}
}

function setRegion(region) {
	switch (region) {
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

// array[0] = summoner json
// array[1] = window
// array[2] = region
function write(array){
	return new Promise((resolve, reject) => {
		let s = JSON.stringify(array[0]) + "\n" + array[2]
		fs.writeFile('./txt/summoner.txt', s, (error) => {
			if (error) reject(error)
			else resolve(new Array(array[0], array[1]))
		})
	})
}

// array[0] = summoner json
// array[1] = window
function inform(array) {
	return new Promise((resolve, reject) => {
		array[1].webContents.send("summoner-inform", array[0])
		resolve()	
	})
}
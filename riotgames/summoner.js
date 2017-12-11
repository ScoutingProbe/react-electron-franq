// /lol/summoner/v3/summoners/by-account/{accountId}
// /lol/summoner/v3/summoners/by-name/{summonerName}
// /lol/summoner/v3/summoners/{summonerId}
const https = require('https')
const fs = require('fs')
const dry = require('../back/dry.js')

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
							"X-Riot-Token": dry.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": dry.setRegion(region),
							"path": `/lol/summoner/v3/summoners/${setQuery(account)}${summoner}`,
							"headers": header,
							"agent": false,
						}

		const request = https.request(options, (response) => {
			if (response.statusCode == 404 || response.statusCode == 400) {
				let string = `${region}, ${account}, ${summoner} not found`
				console.log(string)
				resolve(new Array(string, win, region))
				return
			}
			if (response.statusCode == 403) {
				console.log("riot developer key expired")
				resolve(new Array("riot developer key expired", win , region))
				return
			}
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
			console.log("")
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
		array[1].webContents.send("summoner", array[0])
		resolve()	
	})
}
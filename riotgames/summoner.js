// /lol/summoner/v3/summoners/by-account/{accountId}
// /lol/summoner/v3/summoners/by-name/{summonerName}
// /lol/summoner/v3/summoners/{summonerId}
const https = require('https')
const fs = require('fs')
const dry = require('../util/dry.js')

module.exports.initial = function initial(win, region, summoner){
	return new Promise((resolve,reject)=>{
		query(win, region, summoner)
		.then(produceMessage)
		.then(writeRegion)
		.then(writeResponse)
		.then(inform)
		.then(resolve)
		.catch((error) => {
			console.log(error)
		})
	})

}

function query(win, region, summoner) {
	return new Promise((resolve, reject) => {		
		//https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Duckiee

		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": dry.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": dry.setRegion(region),
							"path": `/lol/summoner/v3/summoners/by-name/${summoner}`,
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
				resolve(new Array(win, region, data))				
			})
		})
		.on('error', (error) => {
			reject(error)
		})
		request.end()
	})
}

function produceMessage(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let region = a[1]
		let response = a[2]

		if(typeof(response['name']) === 'string') resolve(new Array(win, region, response, 'ok'))
		
		let statusCode = response['status']['status_code']
		switch(statusCode) {
			case 400:
				resolve(new Array(win, region, response, '400 was thrown. Bad Request'))
			case 403:
				resolve(new Array(win, region, response, '403 was thrown. Forbidden. old riotgames api key'))
			case 404:
				resolve(new Array(win, region, response, '404 was thrown. Not found'))
			case 415:
				resolve(new Array(win, region, response, '415 was thrown. Unsupported Media Type'))
			case 429:
				resolve(new Array(win, region, response, '429 was thrown. Rate Limit Exceeded'))
			case 500:
				resolve(new Array(win, region, response, '500 was thrown. Internal Server Error'))
			default:
				resolve(new Array(win, region, response, 'Something went wrong'))
		}
		
	})
}

function writeRegion(a){
	return new Promise((resolve, reject) => {
		let win = a[0]
		let region = a[1]
		let response = a[2]
		let message = a[3]

		fs.writeFile('./txt/region.txt', region, error=>{
			if(error) reject(error)
			resolve(a)
		})
	})
}

function writeResponse(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let region = a[1]
		let response = a[2]
		let message = a[3]

		fs.writeFile('./txt/summoner.txt', JSON.stringify(response), error=>{
			if(error) reject(error)
			resolve(a)
		})
	})
}

function inform(a) {
	return new Promise((resolve, reject) => {
		let win = a[0]
		let region = a[1]
		let response = a[2]
		let message = a[3]

		win.webContents.send('summoner', message)

		if(message === 'ok') resolve(new Array(win, region, response))
		else console.log('cannot proceed. summoner#inform')
	})
}
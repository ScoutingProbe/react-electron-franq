const https = require('https')
const fs = require('fs')
const dry = require('./util.js')
const key = require('./key.js')

module.exports.initial = function(a){
	return new Promise((resolve,reject)=>{
		requestChampionMastery(a)
		.then(produceMessage)
		.then(write)
		.then(inform)
		.then(resolve)
		.catch(error=>{
			console.log(error)
		})
	})
}

module.exports.getChampionMasteryForSummoner = function(a){
	console.log('championMastery#getChampionMasteryForSummoner')
}

function requestChampionMastery(a){
	let win = a[0]
	let region = a[1]
	let summoner = a[2]

	return new Promise((resolve,reject)=>{
		//https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/24481735
		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": key.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": dry.setRegion(region),
							"path": `/lol/champion-mastery/v3/champion-masteries/by-summoner/${summoner['id']}`,
							"headers": header,
							"agent": false,
						}
		const request = https.request(options, (response)=>{
			let data = ''
			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				resolve(new Array(win, region, summoner, JSON.parse(data)))				
			})
		})

		request.on('error', error=>{
			reject(error)
		})

		request.end()
	})
}

function produceMessage(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let region = a[1]
		let summoner = a[2]
		let response = a[3]

		if(typeof(response[0]['championLevel']) === 'number') resolve(new Array(win, region, summoner, response, 'ok'))
		else {
			let statusCode = response['status']['status_code']
			switch(statusCode) {
				case 400:
					resolve(new Array(win, region, summoner, response, '400 was thrown. Bad Request'))
				case 403:
					resolve(new Array(win, region, summoner, response, '403 was thrown. Forbidden. old riotgames api key'))
				case 404:
					resolve(new Array(win, region, summoner, response, '404 was thrown. Not found'))
				case 415:
					resolve(new Array(win, region, summoner, response, '415 was thrown. Unsupported Media Type'))
				case 429:
					resolve(new Array(win, region, summoner, response, '429 was thrown. Rate Limit Exceeded'))
				case 500:
					resolve(new Array(win, region, summoner, response, '500 was thrown. Internal Server Error'))
				default:
					resolve(new Array(win, region, summoner, response, 'Something went wrong'))
			} 
		}
	})
}

function write(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let region = a[1]
		let summoner = a[2]
		let response = a[3]
		let message = a[4]

		fs.writeFile('./txt/championMastery.txt', JSON.stringify(response), error=>{
			if(error) reject(error)
			resolve(new Array(win, region, summoner, message))
		})		
	})
}

function inform(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let region = a[1]
		let summoner = a[2]
		let message = a[3]

		win.webContents.send('championMastery', message)
		if(message === 'ok') resolve(new Array(win, region, summoner))
		else console.log('cannot proceed. championMastery#inform')
	})
}
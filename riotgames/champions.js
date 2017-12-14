const fs = require('fs')
const https = require ('https')
const dry = require('../back/dry.js')

module.exports.initial = function(a){
	return new Promise((resolve,reject)=>{
		requestChampions(a)
		.then(produceMessage)
		.then(write)
		.then(inform)
		.then(resolve)
		.catch(error=>{
			console.log(error)
		})
	})
}

function requestChampions(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let region = a[1]
		let summoner = a[2]
//https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=allytips&tags=blurb&tags=enemytips&tags=format&tags=image&tags=keys&tags=lore&dataById=false
//allytips, blurb, enemytips, format, image, keys, lore

		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": dry.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": dry.setRegion(region),
							"path": `/lol/static-data/v3/champions?locale=en_US&tags=allytips&tags=blurb&tags=enemytips&tags=format&tags=image&tags=keys&tags=lore&dataById=true`,
							"headers": header,
							"agent": false,
						}

		const request = https.request(options, response=>{
			let buffer = ""
			response.on('data', chunk=>{
				buffer += chunk
			})
			response.on('end', ()=>{
				resolve(new Array(win, region, summoner, JSON.parse(buffer)))
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

		if(typeof(response['type']) === 'string') resolve(new Array(win, region, summoner, response, 'ok'))
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

		fs.writeFile('./txt/champions.txt', JSON.stringify(response), error=>{
			if (error) reject(error)

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
		win.webContents.send('champions', message)
		if(message === 'ok') resolve(new Array(win, region, summoner))
		else console.log('cannot proceed champions#inform')
	})
}
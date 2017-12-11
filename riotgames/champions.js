const fs = require('fs')
const https = require ('https')
const dry = require('../back/dry.js')

module.exports.initial = function(win){
	getRegion(win)
	.then(requestChampions)
	.then(receiveChampions)
	.then(store)
	.then(inform)
	.catch(error=>{
		console.log(error)
	})
}

function getRegion(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/summoner.txt', 'utf-8', (error,data)=>{
			if (error) reject(error)
			else {
				let region = data.substring(data.length - 3, data.length)
				resolve(new Array(win, region))
			}
		})
	})
}

function requestChampions(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let region = a[1]
//https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=allytips&tags=blurb&tags=enemytips&tags=format&tags=image&tags=keys&tags=lore&dataById=false
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
				resolve(new Array(win, JSON.parse(buffer)))
			})

		})
		request.on('error', error=>{
			reject(error)
		})
		request.end()
	})
}

function receiveChampions(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let response = a[1]

		try {
			let jax = response['data']['Jax']['id']
			if (jax === 24) resolve(a)
		}
		catch(e){
			let statusCode = response['status']['status_code']
			switch(statusCode) {
				case 400:
					resolve(new Array(win, '400 was thrown. Bad Request'))
				case 403:
					resolve(new Array(win, '403 was thrown. Forbidden. old riotgames api key'))
				case 404:
					resolve(new Array(win, '404 was thrown. Not found'))
				case 415:
					resolve(new Array(win, '415 was thrown. Unsupported Media Type'))
				case 429:
					resolve(new Array(win, '429 was thrown. Rate Limit Exceeded'))
				case 500:
					resolve(new Array(win, '500 was thrown. Internal Server Error'))
				default:
					resolve(new Array(win, 'Something went wrong'))
			}
		}
	})
}

function store(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let unsure = a[1]

		if (typeof(unsure) === 'string') resolve(a)

		fs.writeFile('./txt/champions.txt', JSON.stringify(a[1]), error=>{
			if (error) reject(error)
			
			let date = new Date()
			currentTime = date.toUTCString()
			console.log(`champions updated at ${currentTime}`)
			resolve(new Array(win, `champions updated at ${currentTime}`))
		})
	})
}

function inform(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let message = a[1]
		win.webContents.send('champions', message)
		resolve()
	})

}
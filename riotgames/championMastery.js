const https = require('https')
const fs = require('fs')
const dry = require('../back/dry.js')

module.exports.initial = function(win){
	getSummonerId(win)
	.then(requestChampionMasteries)
	.then(requestChampion)
	.catch(error=>{
		console.log(error)
	})
}

module.exports.getChampionMasteryForSummoner = function(win, summoner){
	console.log('championMastery#getChampionMasteryForSummoner')
}

function getSummonerId(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/summoner.txt', 'utf-8', (error, data)=>{
			if(error) throw error
			else {
				let region = data.substring(data.length - 3, data.length)
				let summonerId = data.substring(0, data.length - 4)
				summonerId = JSON.parse(summonerId)
				summonerId = summonerId["id"]
				resolve(new Array(win, region, summonerId))
			}
		})
	})
}

function requestChampionMasteries(array){
	let win = array[0]
	let region = array[1]
	let summonerId = array[2]
	return new Promise((resolve,reject)=>{
		//https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/24481735
		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": dry.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": dry.setRegion(region),
							"path": `/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}`,
							"headers": header,
							"agent": false,
						}
		const request = https.request(options, (response)=>{
			let data = ""
			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				resolve(new Array(win, JSON.parse(data)))				
			})
		})

		request.on('error', error=>{
			reject(error)
		})

		request.end()
	})
}

function receiveRequest(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let response = a[1]

		try {
			let championLevel = response[0]['championLevel']
			resolve(response)
		}
		catch(e) {
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

function readChampions(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let mastery = a[1]

		if (typeof(mastery) === 'string') resolve(a)

		fs.readFile('./txt/champions.txt', 'utf-8', (error, champions)=>{
			if(error) reject(error)

			try {
				champions = JSON.parse(champions)
				resolve(new Array(win, champions, mastery))
			}
			catch(e){
				resolve(new Array(win, `Error in champions.txt: ${champions}`, mastery))
			}
		})
	})
}

function foldChampionsIntoMastery(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let champions = a[1]
		let mastery = a[2]

		if (typeof(champions) === 'string') resolve(a)
		if (typeof(mastery) === 'string') resolve(a)

		let count = 0
		for(m in mastery){
			let championId = m['championId']
			m['name'] = champions['keys'][championId]

			let image = champions['data']['']
			//m['image'] = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${champions[]}`
		}


	})
}
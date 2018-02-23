const https = require('https')
const dry = require('../util/dry.js')
const fs = require('fs')

module.exports.initial = function(region, summonerId, championId, championName, index){
	return new Promise((resolve,reject)=>{
		//https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/24481735/by-champion/19
		const options = {
							'hostname': dry.setRegion(region),
							'path': `/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}`,
							'headers': {'X-Riot-Token': dry.RIOT_DEVELOPER_KEY}, // <= lol style 
							'agent': false
						}
		let mastery = ''
		const request = https.request(options, (response)=>{
			response.on('data', (chunk) => {
				mastery += chunk
			})
			response.on('end', ()=>{
				mastery = JSON.parse(mastery)
				resolve(new Array(mastery, championName, index))
			})
		})

		request.on('error', error=>{
			console.log(error)
		})

		request.end()	
	})
} 

function produceMastery(a){ // a = new Array(mastery, championName, index)
	return new Promise((resolve,reject)=>{
		if(typeof(mastery['championLevel']) == 'number') {
			let epochPlayTime = new Date(mastery['lastPlayTime'])
			let localDateString =  epochPlayTime.toLocaleDateString()
			let localTimeString = epochPlayTime.toLocaleTimeString()
			mastery['lastPlayTimeHuman'] = new Array(localDateString, localTimeString)
			mastery['championName'] = championName
			mastery['index'] = index
			resolve(mastery)
		}
		else {			
			switch(mastery['status']['status_code']) {
				case 400:
					resolve({'index': index, 'status': '400 was thrown bad request.'})
				case 403:
					resolve({'index': index, 'status': '403 was thrown forbidden old riotgames api key.'})
				case 404:
					resolve({'index': index, 'status': '404 was thrown not found.'})//`has 0 experience with ${championName}`
				case 415:
					resolve({'index': index, 'status': '415 was thrown unsupported media type.'})
				case 429:
					resolve({'index': index, 'status': '429 was thrown rate limit exceeded.'})
				case 500:
					resolve({'index': index, 'status': '500 was thrown internal server error'})
			} 
		}
	})
}
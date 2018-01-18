const https = require('https')
const dry = require('../back/dry.js')
const fs = require('fs')

module.exports.initial = function(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let client = a[1]

		let combinations = []
		client['myTeam'].map(player=>{
			requestChampionMasteries()
		})
	})
} 

function requestChampionMasteries(summonerId, championId, championName, region){
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
				mastery = produceMastery(mastery, championName)
				resolve(mastery)
			})
		})

		request.on('error', error=>{
			console.log(error)
		})

		request.end()	
	})
}






function produceMastery(mastery, championName){
	return new Promise((resolve,reject)=>{
		if(typeof(mastery['championLevel']) == 'number') {
			let epochPlayTime = new Date(mastery['lastPlayTime'])
			let localDateString =  epochPlayTime.toLocaleDateString()
			let localTimeString = epochPlayTime.toLocaleTimeString()
			mastery['lastPlayTimeHuman'] = new Array(localDateString, localTimeString)
			mastery['championName'] = championName
			resolve(mastery)
		}
		else {			
			switch(mastery['status']['status_code']) {
				case 400:
					resolve('400 was thrown bad request.')
					break
				case 403:
					resolve('403 was thrown forbidden old riotgames api key.')
					break
				case 404:
					resolve('404 was thrown not found.')//`has 0 experience with ${championName}`
					break
				case 415:
					resolve('415 was thrown unsupported media type.')
					break
				case 429:
					resolve('429 was thrown rate limit exceeded.')
					break
				case 500:
					resolve('500 was thrown internal server error')
					break
				default:
					resolve(`Something went wrong ${mastery}`)
					break
			} 
		}
	})
}
const https = require('https')
const dry = require('../back/dry.js')
const fs = require('fs')

module.exports.initial = function(win, mate, region){
	let championId = mate['championId'] || mate['championPickIntent']
	let championName = JSON.parse(fs.readFileSync('./txt/champions.txt'))['keys'][championId]
	//https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/24481735/by-champion/19
	const header = {	
						"Origin": null,
						"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
						"X-Riot-Token": dry.RIOT_DEVELOPER_KEY,
						"Accept-Language": "en-US,en;q=0.5",
					}

	const options = {
						"hostname": dry.setRegion(region),
						"path": `/lol/champion-mastery/v3/champion-masteries/by-summoner/${mate['summonerId']}/by-champion/${championId}`,
						"headers": header,
						"agent": false,
					}
	const request = https.request(options, (response)=>{
		let data = ''
		response.on('data', (chunk) => {
			data += chunk
		})
		response.on('end', () => {
			data = JSON.parse(data)
			produceMessage(win, data, mate['cellId'], championName)
		})
	})

	request.on('error', error=>{
		console.log(error)
	})

	request.end()
}

function produceMessage(win, data, cellId, championName){
	if(typeof(data['championLevel']) === 'number') humanize(win, data, cellId, championName)
	else {
		let statusCode = data['status']['status_code']
		switch(statusCode) {
			case 400:
				inform(win, '400 was thrown bad request.', cellId)
				break
			case 403:
				inform(win, '403 was thrown forbidden old riotgames api key.', cellId)
				break
			case 404:
				inform(win, `has 0 experience with ${championName}.`, cellId) //404 was thrown not found.
				break
			case 415:
				inform(win, '415 was thrown unsupported media type.', cellId)
				break
			case 429:
				inform(win, '429 was thrown rate limit exceeded.', cellId)
				break
			case 500:
				inform(win, '500 was thrown internal server error.', cellId)
				break
			default:
				inform(win, 'Something went wrong.', cellId)
				break
		} 
	}
}

function humanize(win, mastery, cellId, championName){
	epochPlayTime = new Date(mastery['lastPlayTime'])
	let localDateString =  epochPlayTime.toLocaleDateString()
	let localTimeString = epochPlayTime.toLocaleTimeString()
	mastery['lastPlayTimeHuman'] = new Array(localDateString, localTimeString)
	mastery['championName'] = championName
	inform(win, mastery, cellId)
}

function inform(win, mastery, cellId){
	win.webContents.send('championMastery', mastery, cellId)
}
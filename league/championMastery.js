const https = require('https')
const dry = require('../back/dry.js')

module.exports.initial = function(win, summonerId, championId, region){
	//https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/24481735/by-champion/19
	const header = {	
						"Origin": null,
						"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
						"X-Riot-Token": dry.RIOT_DEVELOPER_KEY,
						"Accept-Language": "en-US,en;q=0.5",
					}

	const options = {
						"hostname": dry.setRegion(region),
						"path": `/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}`,
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
			produceMessage(win, data, summonerId)
		})
	})

	request.on('error', error=>{
		console.log(error)
	})

	request.end()
}

function produceMessage(win, data, summonerId){
	if(typeof(data['championLevel']) === 'number') humanizeTime(win, data)
	else {
		let statusCode = data['status']['status_code']
		switch(statusCode) {
			case 400:
				inform(win, '400 was thrown. Bad Request', summonerId)
				break
			case 403:
				inform(win, '403 was thrown. Forbidden. old riotgames api key', summonerId)
				break
			case 404:
				inform(win, '404 was thrown. Not found', summonerId)
				break
			case 415:
				inform(win, '415 was thrown. Unsupported Media Type', summonerId)
				break
			case 429:
				inform(win, '429 was thrown. Rate Limit Exceeded', summonerId)
				break
			case 500:
				inform(win, '500 was thrown. Internal Server Error', summonerId)
				break
			default:
				inform(win, 'Something went wrong', summonerId)
				break
		} 
	}
}

function humanizeTime(win, mastery){
	epochPlayTime = new Date(mastery['lastPlayTime'])
	let localDateString =  epochPlayTime.toLocaleDateString()
	let localTimeString = epochPlayTime.toLocaleTimeString()
	mastery['lastPlayTimeHuman'] = new Array(localDateString, localTimeString)
	inform(win, mastery, mastery['playerId'])
}

function inform(win, mastery, summonerId){
	win.webContents.send('championMastery', mastery, summonerId)
}
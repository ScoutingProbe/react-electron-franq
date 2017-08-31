//403 forbidden, old key
//429 rate limit
//503 service unavailable

const https = require('https')
const fs = require('fs')
const readStatic = require('./readStatic.js')

module.exports.initial = function(win){
	getRegion(win)
	.then(request)
	.then(write)
	.catch(fail)
}

function getRegion(win){
	return new Promise((resolve, reject) => {
		fs.readFile("./txt/summoner.txt", 'utf-8', (error, data) => {
			if (error) reject(new Array(win,error))
			else {
				data = data.slice(data.indexOf("\n"))
				data = data.replace("\n", "")
				resolve(new Array(win,data))
			}
		})	
	})
}

function request(array){
	let win = array[0]
	let region = array[1]
	return new Promise((resolve, reject) => {
		//const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false"
		const header = {	
							"Origin": null,
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"X-Riot-Token": myUtil.RIOT_DEVELOPER_KEY,
							"Accept-Language": "en-US,en;q=0.5",
						}

		const options = {
							"hostname": setRegion(region),
							"path": "/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false",
							"headers": header,
							"agent": false,
						}
		const request = https.request(options, (response) => {
			let data = ""
			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				console.log(data)
				resolve([win,data])
			})
		})
		.on('error', (error) => {
			console.log(error)
			reject(new Array(win,error))
		})
		request.end()
	})
}

function write(array){
	let win = array[0]
	let string = array[1]
	return new Promise((resolve, reject) => {
		fs.writeFile("./txt/static.txt", string, (error) => {
			if (error) reject(new Array(win,error))
			else readStatic.initial(win)
		})
	})
}

function fail(array){
	let win = array[0]
	let message = array[1]
	win.webContents.send('static-inform', message.concat(' &#10007;'))
}

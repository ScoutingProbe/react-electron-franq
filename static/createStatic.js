const https = require('https')
const fs = require('fs')
const readStatic = require('./readStatic.js')
const myUtil = require('../back/util.js')

module.exports = {initial, stat, getRegion, setRegion, request, responseCode, write, inform}

function initial(win){
	stat(win)
	.then(getRegion)
	.then(request)
	.then(responseCode)
	.then(write)
	.catch(array=>{
		inform(array)
	})
}

function stat(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/static.txt', 'utf-8', (error,data)=>{
			if (error) {
				if (error.code === 'ENOENT') resolve(win)
				else reject(new Array(win,error))
			}
			else {
				data = JSON.parse(data)
				if (!Object.keys(data).includes('data')) {
					if (data.status.status_code === 403) {
						let message = "createStatic.js #stat 403 thrown (bad request or old key); trying again"
						win.webContents.send('static-message', message)
						console.log(message)
					}
					else if (data.status.status_code === 429){
						let oneHour = new Date(Date.now() + 3600000)
						let message = `createStatic.js #stat 429 thrown (rate limit); try again at ${oneHour}`
						win.webContents.send('static-message', message)
						console.log(message)
						reject([win, message])
					}
				}
				else {
					fs.stat('./txt/static.txt', (error, stats)=>{
						let oneHour = 3600000
						let time = Date.now() - stats.mtime
						let tryAgain = new Date(Date.now() + 3600000)

						if (time<oneHour) {
							let message = `createStatic.js #stat try again at ${tryAgain}`
							win.webContents.send('static-message', message)
							reject([win,message])
						}
						else resolve(win)
					})					
				}


				
			}
		})
	})
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
							"Accept-Language": "en-US,en;q=0.5"
						}

		const options = {
							"hostname": setRegion(region),
							"path": "/lol/static-data/v3/champions?locale=en_US&tags=image&dataById=false",
							"headers": header,
							"agent": false
						}

		const request = https.request(options, (response) => {
			let data = ""
			response.on('data', (chunk) => {
				data += chunk
			})
			response.on('end', () => {
				resolve([win,data])
			})
		})
		.on('error', (error) => {
			reject(new Array(win,error))
		})
		request.end()
	})
}

function setRegion(r) {
	switch (r) {
		case "RU":
			return "ru.api.riotgames.com"
		case "KR":
			return "kr.api.riotgames.com"
		case "BR1":
			return "br1.api.riotgames.com"
		case "OC1":
			return "oc1.api.riotgames.com"
		case "JP1":
			return "jp1.api.riotgames.com"
		case "NA1":
			return "na1.api.riotgames.com"
		case "EUN1":
			return "eun1.api.riotgames.com"
		case "EUW1":
			return "euw1.api.riotgames.com"
		case "TR1":
			return "tr1.api.riotgames.com"
		case "LA1":
			return "la1.api.riotgames.com"
		case "LA2":
			return "la2.api.riotgames.com"
	}
}

//200 ok
//403 forbidden, old key
//429 rate limit
//503 service unavailable
function responseCode(array){
	let win = array[0]
	let response = JSON.parse(array[1])
	return new Promise((resolve,reject)=>{
		if (response.data.Jax.id === 24) {
			win.webContents.send('static-message', '#createStatic.js #responseCode Response is good, static created')
			resolve(array)
		}
		else {
			console.log(response)
		}
	})


}

function write(array){
	let win = array[0]
	let string = array[1]
	return new Promise((resolve, reject) => {
		fs.writeFile("./txt/static.txt", string, (error) => {
			if (error) reject(new Array(win,error))
			else resolve(array)
		})
	})
}

function inform(array){
	let win = array[0]
	let message = array[1]
	win.webContents.send('static-inform', message.concat(' &#10007;'))
}

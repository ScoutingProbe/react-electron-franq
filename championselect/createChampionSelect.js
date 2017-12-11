const fs = require('fs')
const http = require('http')
const cheerio = require('cheerio')

//http://championselect.net/champions/leesin/matchups/all/strongpick
//http://championselect.net/champions/leesin/matchups/all/counter
//http://championselect.net/champions/leesin/matchups/all/tie
//http://championselect.net/champions/leesin/matchups/all/synergy

module.exports.initial = function initial(win){
	readPool()
	.then(scrapeStrongPick)
	// .then(scrapeCounter)
	// .then(scrapeTie)
	// .then(scrapeSynergy)
	// .then(inform)
	.catch(error=>{
		console.log(error)
	})
}

function readPool(){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/pool.txt",(error,data)=>{
			if (error) reject(error)
			else resolve(data)
		})
	})
}

function scrapeStrongPick(){
	return new Promise((resolve,reject)=>{
	})
}

function request(c){
	return new Promise((resolve,reject)=>{
		let champs = Object.keys(c)
		let champ = champs[0].toLowerCase()
		const options = {
			"hostname": "championselect.net",
			"path": `/champions/${champ}`
		}

		const request = http.request(options, (response)=>{
			let data
			response.on('data', (chunk)=>{
				data += chunk
			})
			response.on('end',()=>{
				let page = cheerio.load(data.toString())
				console.log(page("#mount").text())
			})
		})

		request.on('error', (error)=>{
			throw new Error("championselect request error")
			reject(error)
		})

		request.end()
	})
}
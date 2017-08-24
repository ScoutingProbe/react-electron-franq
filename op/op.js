const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')
const util = require('util')

// stat
// get lanes
// iterate
// write

module.exports.initial = function(){
	return new Promise((resolve,reject)=>{
		stat()
		.then(getLanes)
		.then(iterate)
		.then(write)
		.catch((error)=>{
			console.log(error)
		})
	})
}

function stat(){
	return new Promise((resolve,reject)=>{
		fs.stat("./txt/op.txt", (error, stats)=>{
			const threeDays = 259200000
			const now = Date.now()
			const then = stats.mtime

			if ((now - then) > threeDays) resolve()
			else reject(`op.js #stat ${(now-then)/86400000} of 72 hours since last write`) 
		})
	})
}

function getLanes(){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/lanes.txt", "utf-8", (error,data)=>{
			if (error) reject(error)
			else resolve(JSON.parse(data))
		})
	})
}

function iterate(object){
	return new Promise((resolve,reject)=>{
		Object.entries(object).forEach(([champ, lanes])=>{
			lanes.forEach((lane)=>{
				request(champ, lane, object, resolve)
			})
		})	
	})
}

//fuckme, i can't get this to work any other way.  
let count = 0
function request(champ, lane, object, resolve){
	const r = https.request(`https://na.op.gg/champion/${champ}/statistics/${lane}/matchups`, (response)=>{
		let data = ""
		response.on('data', (chunk)=>{
			data += chunk
		})
		response.on('end', ()=>{
			let i = object[champ].indexOf(lane)
			object[champ][i] = load(data.toString(), lane)
			count++
			let total = Object.entries(object).reduce((count, [champ,lanes])=>{
				return count + lanes.length
			}, 0)
			console.log(`count: ${count} of ${total}`)
			if (count === total) {
				resolve(object)
				console.log("requests done")
			}
		})
	})
	r.on('error', (error)=>{
		//request(champ, lane, object)
		console.log(`op.js #request fail; lane:${lane} champ:${champ}`)
	})
	r.end()
}

function load(string, lane){
	let records = {[lane]: new Array()}
	$ = cheerio.load(string, {ignoreWhitespace: true})

	let errorMessage = $("div.SectionLayerWrap>div.ContentWrap>p.Content").text()
	if (errorMessage.includes("There is not enough data available to display statistics for")){
		records[lane] = "There is not enough data available"
		return records
	}

	let winRatio = $(".MatchupChampionListTable>tbody>tr>td.WinRatio").text()	
	winRatio = winRatio.split("\n")
	winRatio = winRatio.map((i)=>{
		return i.replace(new RegExp(/\t*/), "")
	})
	winRatio = winRatio.filter((i)=>{
		if (i.length != 0) return i
	})
	
	let champName = $(".MatchupChampionListTable>tbody>tr>td.Champion").text()
	champName = champName.split("\n")
	champName = champName.map((i)=>{
		return i.replace(new RegExp(/\t*/), "")
	})
	champName = champName.filter((i)=>{
		if (i.length != 0) return i
	})

	if (champName.length == winRatio.length){
		champName.forEach((champ, champIndex)=>{
			let record = {}
			record[champ] = winRatio[champIndex]
			records[lane].push(record)
		})
	}
	return records
}

function write(records){
	return new Promise((resolve,reject)=>{
		fs.writeFile("./txt/op.txt", JSON.stringify(records), (error)=>{
			if (error) reject(error)
			else resolve()
		})
	})
}
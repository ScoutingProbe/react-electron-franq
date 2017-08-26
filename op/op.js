const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')
const util = require('util')

module.exports.initial = function(win){
	return new Promise((resolve,reject)=>{
		stat()
		.then(getLanes)
		.then(modify)
		.then(iterate)
		.then(write)
		.then(()=>{
			success(win)
		})
		.catch((error)=>{
			if (error.includes("op.js #stat")) {
				let string = error.slice(12)
				string = string.concat(" &#10007;")
				fail(string, win)
			}
			console.log(error)
		})
	})
}

function stat(){
	return new Promise((resolve,reject)=>{
		fs.stat("./txt/op.txt", (error, stats)=>{
			const oneDay = 86400000
			const now = Date.now()
			const then = stats.mtime

			if ((now - then) > oneDay) resolve()
			else reject(`op.js #stat Updated ${((now-then)/86400000).toPrecision(3)} hours ago; Wait for 24 hours`) 
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

function modify(object){
	return new Promise((resolve,reject)=>{
		Object.entries(object).forEach(([champ, lanes])=>{
			let newLanes = {}
			lanes.forEach((lane=>{
				newLanes[lane] = []
			}))
			object[champ] = newLanes
		})
		resolve(object)
	})
}

function iterate(object){
	return new Promise((resolve,reject)=>{
		Object.entries(object).forEach(([champ, lanes])=>{
			Object.entries(lanes).forEach(([lane, winRatios])=>{
				request(champ,lane,object,resolve)
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
			object[champ][lane] = load(data.toString(), lane)

			let total = 0
			Object.values(object).forEach(record=>{
				total += Object.keys(record).length
			})

			count++
			if (count === total) {
				console.log("requests done")
				resolve(object)
			}

			console.log(`count: ${count} of ${total}`)
		})
	})
	r.on('error', (error)=>{
		request(champ, lane, object, resolve)
		console.log(`op.js #request fail; lane:${lane} champ:${champ}`)
	})
	r.end()
}

function load(string, lane){
	let records = new Array()
	$ = cheerio.load(string, {ignoreWhitespace: true})

	let errorMessage = $("div.SectionLayerWrap>div.ContentWrap>p.Content").text()
	if (errorMessage.includes("There is not enough data available to display statistics for")){
		records = "There is not enough data available"
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
			records.push(record)
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

function success(win){
	win.webContents.send('op-inform', '&#10003;')
}

function fail(error, win){
	win.webContents.send('op-inform', error)
}
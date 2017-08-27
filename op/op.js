const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')
const util = require('util')

module.exports.initial = function(win){
	return new Promise((resolve,reject)=>{
		stat(win)
		.then(getLanes)
		.then(modify)
		.then(iterate)
		.then(write)
		.then(success)
		.catch(array=>{
			let win = array[0]
			let error = array[1]
			fail(win, error)
			console.log(error)
		})
	})
}

function stat(win){
	return new Promise((resolve,reject)=>{
		fs.stat("./txt/op.txt", (error, stats)=>{
			const oneDay = 86400000
			const now = Date.now()
			const then = stats.mtime

			if ((now - then) > oneDay) resolve(win)
			else {
				let string = `op.js #stat Updated ${((now-then)/86400000).toPrecision(3)} hours ago; Wait for 24 hours`
				reject(new Array(win, string)) 
			}
		})
	})
}

function getLanes(win){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/lanes.txt", "utf-8", (error,data)=>{
			if (error) reject((win, error))
			else resolve(new Array(win, JSON.parse(data)))
		})
	})
}

function modify(array){
	return new Promise((resolve,reject)=>{
		let object = array[1]
		Object.entries(object).forEach(([champ, lanes])=>{
			let newLanes = {}
			lanes.forEach((lane=>{
				newLanes[lane] = []
			}))
			object[champ] = newLanes
		})
		resolve(array[1] = object)
	})
}

function iterate(array){
	let object = array[1]
	let count = 0
	return new Promise((resolve,reject)=>{
		Object.entries(object).forEach(([champ, lanes])=>{
			Object.entries(lanes).forEach(([lane, winRatios])=>{
				request(champ,lane,object,resolve, count, array[0]) //array[0] is win
			})
		})
	})
}

//fuckme, i can't get this to work any other way.  
function request(champ, lane, object, resolve, count, win){
	const r = https.request(`https://na.op.gg/champion/${champ}/statistics/${lane}/matchups`, (response)=>{
		let data = ""
		response.on('data', (chunk)=>{
			data += chunk
		})
		response.on('end', ()=>{
			object[champ][lane] = load(data.toString(), lane)

			let records = Object.values(object)
			let total = Object.keys(records).reduce((sum, record)=>{
				return sum + record.length
			}, 0)

			count++
			if (count === total) {
				console.log("requests done")
				resolve(new Array(win,object))
			}

			let message = `count: ${count} of ${total}`
			win.webContents.send('op-inform', message)
			console.log(message)
		})
	})
	r.on('error', (error)=>{
		request(champ, lane, object, resolve, count, win)
		let string = `op.js #request fail; lane:${lane} champ:${champ}`
		win.webContents.send('op-inform', message)
		console.log(string)
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

function write(array){
	let win = array[0]
	let records = array[1]
	return new Promise((resolve,reject)=>{
		fs.writeFile("./txt/op.txt", JSON.stringify(records), (error)=>{
			if (error) reject(new Array(win,error))
			else resolve(win)
		})
	})
}

function success(win){
	win.webContents.send('op-inform', '&#10003;')
}

function fail(win, error){
	error = error.slice(12)
	error = error.concat(" &#10007;")
	win.webContents.send('op-inform', error)
}
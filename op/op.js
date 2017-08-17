const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')

//get name array
//request for every name
//load
//instantiate
//write 

module.exports.initial = function(){
	getNameArray()
	.then(request)
	.then(aggregate)
	.then(write)
	.catch((error)=>{
		console.log(error)
	})
}

function getNameArray(){
	return new Promise((resolve,reject)=>{
		fs.readFile("./txt/static.txt", "utf-8", (error,data)=>{
			if (error) reject(error)
			else {
				data = data.slice(0, data.lastIndexOf("\n"))
				data = JSON.parse(data)
				resolve(Object.keys(data.data))
			}
		})
	})
}

function request(champs){
	return new Promise((resolve,reject)=>{
		let lanes = ["top", "jungle", "mid", "support", "adc"]
		let objects = []
		let errors = 0
		lanes.forEach((lane,laneIndex,laneArray)=>{
			champs.forEach((champ, champIndex, champArray)=>{
				const request = https.request(`https://na.op.gg/champion/${champ}/statistics/${lane}/matchups`, (response)=>{
					let data = ""
					response.on('data', (chunk)=>{
						data += chunk
					})
					response.on('end', ()=>{
						objects.push(load(data.toString(), lane, champ))
						console.log(`objects:${objects.length+errors} total:${lanes.length*champs.length}`)
						if ((objects.length+errors) === (lanes.length*champs.length)) resolve(objects)

					})
				})
				request.on('error', (error)=>{
					errors += 1
					console.log(`op.js #request fail; lane:${lane} champ:${champ}`)
				})
				request.end()
			})
		})
		//count = 685 = (lanes.length*champs.length)
		//last stuck = 630
	})
}

function load(string, lane, name){
	$ = cheerio.load(string, {ignoreWhitespace: true})
		
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

	let binder = {}
	binder["lane"] = lane
	binder["champion"] = name
	binder["winRatio"] = new Array()

	if (champName.length == winRatio.length){
		champName.forEach((champ, champIndex, champArray)=>{
			let record = {}
			record["champion"] = champ
			record["winRatio"] = winRatio[champIndex]
			binder.winRatio.push(record)
		})
	}
	return binder
}

function loadError(lane, champ){
	let binder = {}
	binder["lane"] = lane
	binder["champion"] = champ
	binder["winRatio"] = new Array()
	return binder
}

function aggregate(binder){
	console.log("aggregate")
	console.log(binder.length)
	return new Promise((resolve,reject)=>{
		let book = {}
		book["top"] = {}
		book["mid"] = {}
		book["jungle"] = {}
		book["support"] = {}
		book["adc"] = {}

		binder.forEach((bound, binderIndex, binderArray)=>{
			let lane = bound.lane
			let champion = bound.champion
			let winRatio = bound.winRatio
			
			book[lane][champion] = winRatio

			
		})
		resolve(book)
		console.log(book)
	})
}

function write(book){
	return new Promise((resolve,reject)=>{
		fs.writeFile("./txt/op.txt", JSON.stringify(book), (error)=>{
			if (error) reject(error)
			else resolve()
		})
	})
}
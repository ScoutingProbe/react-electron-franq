const fs = require('fs')
const dry = require('../util/dry.js')

module.exports.initial = function(win, key, lane, count){
	readMastery(win, key, lane, count)
	.then(readChampions)
	.then(foldChampionsIntoSummonery)
	.then(readLolcounter)
	.then(foldLolcounterIntoSummonery)
	.then(write)
	.then(inform)
	.catch(error=>{
		console.log(error)
	})
}

function readMastery(win, key, lane, count){
	return new Promise((resolve, reject)=>{
		fs.readFile('./txt/championMastery.txt', 'utf-8', (error, data)=>{
			if(error) reject(error)
			resolve(new Array(win, key, lane, count, JSON.parse(data)))
		})
	})
}

function readChampions(a){
	return new Promise((resolve, reject)=>{
		fs.readFile('./txt/champions.txt', 'utf-8', (error, data)=>{
			if(error) reject(error)
			a.push(JSON.parse(data))
			resolve(a)
		})
	})
}

function foldChampionsIntoSummonery(a){
	return new Promise((resolve, reject)=>{
		let win = a[0]
		let key = a[1]
		let lane = a[2]
		let count = a[3]
		let masteries = a[4]
		let champions = a[5]

		for(let mastery of masteries){
			let championId = mastery['championId']
			let champion = champions['data'][championId]

			mastery['enemytips'] = champion['enemytips']
			mastery['name'] = champion['name']
			mastery['title'] = champion['title']
			mastery['loadingImage'] = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion['key']}_0.jpg`
			mastery['spriteImage'] = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${champion['key']}.png`
			mastery['allytips'] = champion['allytips']
			mastery['key'] = champion['key']
			mastery['lore'] = champion['lore']
			mastery['blurb'] = champion['blurb']
			humanizeTime(mastery['lastPlayTime'], mastery)
		}
		sortMasteries(masteries, key)
		resolve(new Array(win, lane, count, masteries))
	})
}

function humanizeTime(epochPlayTime, mastery){
	return new Promise((resolve,reject)=>{
		epochPlayTime = new Date(epochPlayTime)
		let localDateString =  epochPlayTime.toLocaleDateString()
		let localTimeString = epochPlayTime.toLocaleTimeString()
		mastery['lastPlayTimeHuman'] = new Array(localDateString, localTimeString)
		resolve(mastery)
	})
	
}

function sortMasteries(masteries, key){
	return new Promise((resolve,reject)=>{
		masteries = masteries.sort((a, b)=>{
			let valueA = a[key]
			let valueB = b[key]

			if(valueA < valueB) return 1
			else if(valueA === valueB) return 0
			else if(valueA > valueB) return -1
		})
		resolve(masteries)
	})
}

function readLolcounter(a){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/lolcounter.txt', 'utf-8', (error,data)=>{
			a.push(JSON.parse(data))
			resolve(a)
		})
	})
}

function foldLolcounterIntoSummonery(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let lane = a[1]
		let count = a[2]
		let summonery = a[3]
		let lolcounter = a[4]

		for(let summoner of summonery){
			let id = summoner['championId']

			let weaks = lolcounter[id]['weak'][lane].slice(0, count)
			for(let weak of weaks){
				weak['image'] =  `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${dry.getKey(weak['id'])}.png`
			}

			let strongs = lolcounter[id]['strong'][lane].slice(0, count)
			for(let strong of strongs){
				strong['image'] = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${dry.getKey(strong['id'])}.png`
			}

			let evens = lolcounter[id]['even'][lane].slice(0, count)
			for(let even of evens){
				even['image'] = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${dry.getKey(even['id'])}.png`
			}

			let goods = lolcounter[id]['good'][lane].slice(0, count)
			for(let good of goods){
				good['image'] = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${dry.getKey(good['id'])}.png`
			}

			summoner['weak'] = weaks
			summoner['strong'] = strongs
			
			summoner['even'] = evens
			summoner['good'] = goods
		}
		resolve(new Array(a[0], summonery))
	})
}

function write(a){
	return new Promise((resolve,reject)=>{
		fs.writeFile('./txt/summonery.txt', JSON.stringify(a[1]), error=>{
			if(error) reject(error)
			resolve(a)
		})
	})

}

function inform(a){
	return new Promise((resolve,reject)=>{
		a[0].webContents.send('summonery', a[1])
		resolve()
	})
}
const fs = require('fs')

module.exports.initial = function(win, key){
	readMastery(win, key)
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

function readMastery(win, key){
	return new Promise((resolve, reject)=>{
		fs.readFile('./txt/championMastery.txt', 'utf-8', (error, data)=>{
			if(error) reject(error)
			resolve(new Array(win, key, JSON.parse(data)))
		})
	})
}

function readChampions(a){
	return new Promise((resolve, reject)=>{
		fs.readFile('./txt/champions.txt', 'utf-8', (error, data)=>{
			if(error) reject(error)
			resolve(new Array(a[0], a[1], a[2], JSON.parse(data)))
		})
	})
}

function foldChampionsIntoSummonery(a){
	return new Promise((resolve, reject)=>{
		let masteries = a[2]
		let champions = a[3]

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
		sortMasteries(masteries, a[1])
		resolve(new Array(a[0], masteries))
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
			resolve(new Array(a[0], a[1], JSON.parse(data)))
		})
	})
}

function foldLolcounterIntoSummonery(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let masteries = a[1]
		let lolcounter = a[2]

		for(let mastery of masteries){
			let id = mastery['championId']
			mastery['lolcounter'] = lolcounter[id]
		}
		resolve(new Array(a[0], masteries))
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
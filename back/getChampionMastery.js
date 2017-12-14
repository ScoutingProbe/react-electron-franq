const fs = require('fs')

module.exports.initial = function(win){
	readMastery(win)
	.then(readChampions)
	.then(foldChampionsIntoMastery)
	.then(write)
	.then(inform)
	.catch(error=>{
		console.log(error)
	})
}

function readMastery(win){
	return new Promise((resolve, reject)=>{
		fs.readFile('./txt/championMastery.txt', 'utf-8', (error, data)=>{
			if(error) reject(error)
			resolve(new Array(win, JSON.parse(data)))
		})
	})
}

function readChampions(a){
	return new Promise((resolve, reject)=>{
		fs.readFile('./txt/champions.txt', 'utf-8', (error, data)=>{
			if(error) reject(error)
			resolve(new Array(a[0], a[1], JSON.parse(data)))
		})
	})
}

function foldChampionsIntoMastery(a){
	return new Promise((resolve, reject)=>{
		let masteries = a[1]
		let champions = a[2]

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

function write(a){
	return new Promise((resolve,reject)=>{
		fs.writeFile('./txt/championMasteryAugment.txt', JSON.stringify(a[1]), error=>{
			if(error) reject(error)
			resolve(a)
		})
	})

}

function inform(a){
	return new Promise((resolve,reject)=>{
		a[0].webContents.send('getChampionMastery', a[1])
		resolve()
	})
}
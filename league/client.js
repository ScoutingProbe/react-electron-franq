const fs = require('fs')

// C:\fakepath\2017-05-30T20-51-06_6672_LeagueClient.log
// C:\Riot Games\League of Legends
// C:\Riot Games\League of Legends\Logs\LeagueClient Logs

module.exports.initial = function initial(win, location){
	watch(win, location)
	.then(read)
	.then(parse)
	.then(inform)
	.catch(error=>{
		console.error(error)
	})
}

function watch(win, location){
	return new Promise((resolve,reject)=>{
		fs.watch(location, (event, file)=>{
			if(file.includes('LeagueClient.log')) resolve(new Array(win, `${location}\\${file}`))
		})
	})
}

function read(a){
	return new Promise((resolve,reject)=>{
		fs.readFile(a[1], 'utf-8', (error, data)=>{
			if(error) reject(error)
			a.push(data)
			resolve(a)
		})
	})
}

function parse(a){
	return new Promise((resolve,reject)=>{
		let data = a[2]
		let lines = data.split('\n')
		lines.reverse()
		console.log(lines)
		for(let line of lines){
			if(line.includes('/lol-champ-select/v1/session: {')) {
				let begin = line.indexOf('/lol-champ-select/v1/session: {') + 30
				let json = line.substring(begin)
				console.log(json)
				json = json.concat('}}')
				console.log(json)
				//json = JSON.parse(json)
				a[0].webContents.send('client', json)

				initial(a[0], a[1])
				resolve()
			}
		}
	})


}

function inform(a){
}
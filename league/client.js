const fs = require('fs')
const Tail = require('tail').Tail

//npm uninstall tail

// C:\fakepath\2017-05-30T20-51-06_6672_LeagueClient.log
// C:\Riot Games\League of Legends
// C:\Riot Games\League of Legends\Logs\LeagueClient Logs

// C:\\Users\\Andrew\\Desktop\\pickban\\league

// app_start
// lol-matchmaking| Matchmaking: entering state 'Searching'
// lol-gameflow| Gameflow: entering state 'ChampSelect'
// lol-champ-select| /lol-champ-select/v1/session: {
// lol-gameflow| Gameflow: entering state 'GameStart'
// lol-gameflow| Client is no longer running.
// app_terminate
module.exports.initial = function initial(win, location){
	fs.watch(location, (event,file)=>{
		console.log(`${event} ${file}`) 
		if(file){
			if(file.includes('LeagueClient.log')){
				let clientLog = new Tail(`${location}\\${file}`)
				clientLog.on('line', data=>{
					let json = null
					let message = null
					if(data.includes('app_start'))
						message = 'client open'
					else if(data.includes('lol-matchmaking| Matchmaking: entering state \'Searching\''))
						message = 'matchmaking search'
					else if(data.includes('lol-gameflow| Gameflow: entering state \'ChampSelect\''))
						message = 'gameflow champselect'
					else if(data.includes('/lol-champ-select/v1/session: {')){
						message = 'pickban'
						let begin = data.indexOf('{"actions":[[')
						let end = data.indexOf('],"timer":') + 1
						json = data.substring(begin, end)
						json = json.concat('}')
						json = JSON.parse(json)
					}
					else if(data.includes('lol-gameflow| Gameflow: entering state \'GameStart\''))
						message = 'gameflow gamestart'
					else if(data.includes('lol-gameflow| Client is no longer running.'))
						message = 'gameflow game end'
					else if(data.includes('app_terminate'))
						message = 'client close'
					
					if(json)
						win.webContents.send('client', json)
					if(message)
						win.webContents.send('client-message', message)

				})
				clientLog.on('error', error=>{
					console.log(error)
				})
			}
		}
	})
}
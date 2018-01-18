const fs = require('fs')
const Tail = require('tail').Tail
const child_process = require('child_process')
const championMastery = require('../league/championMastery.js')

// C:\Riot Games\League of Legends
// C:\Riot Games\League of Legends\Logs\LeagueClient Logs\2017-05-30T20-51-06_6672_LeagueClient.log

// C:\\Users\\Andrew\\Desktop\\pickban\\league

/*
'type: RECEIVE_SUCCESS'
'timer_parties-enter-queue'

'READY_CHECK_HIDE'
'timer_champ-select-lock-in'
'timer_champ-select-lock-in'
'timer_champ-select-lock-in'
'SAVE_SUCCESS'
'timer phase=BAN_PICK, current phase=FINALIZATION, outstanding timers: 1, should show=true'
'SAVE_SUCCESS' // loading
'SAVE_SUCCESS' //on summoner's rift

'Client is no longer running.'*/
module.exports.initial = function initial(a){ //a = new Array(win, location, interval)
	watchLogs(a)
	.then(tailLog)
	.then(produceClient)
	.catch(error=>{
		console.log(error)
	})

	// .then(fattenBans)
	// .then(fattenTheirTeam)
	// .then(requestMyTeamMasteries)
	// .then(fattenMyTeam)
	// .then(sendClient)
}

function watchLogs(a){
	return new Promise((resolve,reject)=>{
		let location = a[1].replace(/\\/g, '\\\\')
		fs.watch(location, (event, file)=>{
			if(event.includes('error')) reject(error)
			if(file.includes('_LeagueClient.log') && event.includes('rename')){
				a.push(`${location}\\\\${file}`)
				resolve(a)
			}		

			// if(file.includes('_LeagueClient.log') && event.includes('change')){
			// 	let filepath = `${location}\\${file}`
			// 	resolve(new Array(win, location, notepadInterval, filepath))
			// }
		})	
	})
}

function tailLog(a){ // a = new Array(win, location, interval, filepath)
	return new Promise((resolve,reject)=>{
		let tail = new Tail(a[3])
		a.pop()
		tail.on('line', line=>{
			let message = null
			let json = null

			if(line.includes('app_start'))
				message = 'client open'
			else if(line.includes('timer_login-rendered'))
				message = 'login rendered'
			else if(line.includes('type: RECEIVE_SUCCESS'))
				message = 'login'
			else if(line.includes('timer_parties-enter-queue')) 
				message = 'matchmaking search'
			else if(line.includes('READY_CHECK_USER_DECLINED'))
				message = 'game decline'
			else if(line.includes('READY_CHECK_USER_ACCEPTED'))
				message = 'game accept'
			else if(line.includes('READY_CHECK_HIDE')) 
				message = 'in lobby'
			else if(line.includes('GAMEFLOW_EVENT.STRANGER_DODGED')) //need this one
				message = 'dodge...matchmaking search'
			else if(line.includes('timer_champ-select-select-champion'))
				message = 'hover on champion'
			else if(line.includes('timer_champ-select-lock-in'))
				message = 'champion or ban lockin'
			else if(line.includes('/lol-champ-select/v1/session: {'))
				message = 'client update'
			else if(line.includes('SAVE_SUCCESS'))
				message = 'game start'
			else if(line.includes('Client is no longer running.'))  //need this one
				message = 'game end'
			else if(line.includes('app_terminate'))
				message = 'client close'
			else if(line.includes('/lol-champ-select/v1/session: {')){
				let begin = line.indexOf('{"actions":[[')
				let end = line.indexOf('],"timer":') + 1
				json = line.substring(begin, end)
				json = json.concat('}')	
			}

			if(json){
				try{ 
					json = JSON.parse(json)

				} catch(exception){
					message += '...json failed to parse'
					json = null
				}
			}

			if(message)
				a[0].webContents.send('client-message', message)

			switch(message){
				case 'login rendered':
					a[2] = setInterval(()=>{
						child_process.spawn('powershell.exe', 
											['-file', '.\\league\\notepadInterval.ps1', a[3]])
					}, 3000)
					break
				case 'app_terminate':
				case 'game start':
					clearInterval(a[2])
					child_process.exec('taskkill /im explorer.exe')
					break
				case 'client close':
					clearInterval(a[2])
					child_process.exec('taskkill /im explorer.exe')
					module.exports.initial(new Array(a[0], a[1], 0))
					tail.unwatch()
					reject('client close by user')
					break
			}

		})
		tail.on('error', error=>{
			reject(error)
		})
	})
}

function produceClient(a){
	return new Promise((resolve,reject)=>{
		console.log(a)
	})
}

function fattenBans(a){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/lolcounter.txt', 'utf-8', (error, lolcounter)=>{
			let client = a[5]
			let lane = client['myTeam'].reduce((l, player) =>{
				if(player['cellId'] === client['localPlayerCellId'])
					l += player['assignedPosition']
			}, '')
			let championId = client['myTeam'].reduce((c, player)=>{
				if(player['cellId'] === client['localPlayerCellId'])
					l = player['championId'] || player['championPickIntent']
			}, 0)

			console.log(`${lane} ${championId}`)

			// client['actions'][0].map(player=>{
			// 	let recommend = lolcounter
			// 	player['recommend'] =
			// })
		})
	})
}

// function myTeam(a){
// 	return new Promise((resolve,reject)=>{
// 		fs.readFile('./txt/champions.txt', 'utf-8', (error, champions)=>{
// 			if(error) reject(error)

// 			champions = JSON.parse(champions)
// 			a = a.push(champions)
			
// 			let win = a[0]
// 			let client = a[1]
// 			// let champions = a[2]

// 			client['myTeam'].map(player=>{
// 				let championId = player['championId']
// 				if(championId === 0)
// 					player['championName'] = '???'
// 				else
// 					player['championName'] = champions['keys'][championId]
// 			})

// 			client['myTeam'].map(player=>{
// 				let championPickIntent = player['championPickIntent']
// 				if(championPickIntent === 0)
// 					player['championPickIntentName'] = '???'
// 				else
// 					player['championPickIntentName'] = champions['keys'][championPickIntent]
// 			})
			
// 			client['theirTeam'].map(player=>{
// 				let championId = player['championId']
// 				if(championId === 0)
// 					player['championName'] = '???'
// 				else
// 					player['championName'] = champions['keys'][championId]
// 			})

// 			client['theirTeam'].map(player=>{
// 				let championPickIntent = player['championPickIntent']
// 				if(championPickIntent === 0)
// 					player['championPickIntentName'] = '???'
// 				else
// 					player['championPickIntentName'] = champions['keys'][championPickIntent]
// 			})
// 			resolve(a)
// 	})
// }

// function theirTeam(a){
// 	return new Promise((resolve,reject)=>{		
// 		let win = a[0]
// 		let client = a[1]
// 		let champions = a[2]
		
// 		client['theirTeam'].map(player=>{
// 			let championId = player['championId']
// 			if(championId === 0)
// 				player['championName'] = '???'
// 			else
// 				player['championName'] = champions['keys'][championId]
// 		})

// 		client['theirTeam'].map(player=>{
// 			let championPickIntent = player['championPickIntent']
// 			if(championPickIntent === 0)
// 				player['championPickIntentName'] = '???'
// 			else
// 				player['championPickIntentName'] = champions['keys'][championPickIntent]
// 		})
// 		resolve(a)
// 	})
// }


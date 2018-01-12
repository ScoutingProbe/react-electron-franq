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
module.exports.initial = function initial(win, location){
	watchLogs(win, location)
	.then(tailLog)
	// .then(insertNames)
	.catch(error=>{
		console.log(error)
	})
	.then(a=>{
		console.log(a[1])
		console.log(a[2])
	})
}

function watchLogs(win, location){
	return new Promise((resolve,reject)=>{
		let flag = true
		location = location.replace(/\\/g, '\\\\')
		fs.watch(location, (event, file)=>{
			// if(file.includes('_LeagueClient.log') && event.includes('rename') && flag){
			// 	flag = false
			// 	let filepath = `${location}\\${file}`
			// 	resolve(win, location, filepath)
			// }		
			if(event.includes('error')) reject(error)
			if(file.includes('_LeagueClient.log') && event.includes('change') && flag){
				flag = false
				let filepath = `${location}\\${file}`
				resolve(new Array(win, location, filepath))
			}
		})	
	})
}

function tailLog(a){
	return new Promise((resolve,reject)=>{
		let notepadInterval = 0
		let tail = new Tail(a[2])
		tail.on('line', data=>{
			let json = null
			let message = null

			if(data.includes('app_start'))
				message = 'client open'
			else if(data.includes('timer_login-rendered')){
				message = 'login rendered'
				notepadInterval = setInterval(()=>{
					child_process.spawn('powershell.exe', ['-file', '.\\league\\notepadInterval.ps1', a[2]])
				}, 3000)
			}
			else if(data.includes('type: RECEIVE_SUCCESS'))
				message = 'login'
			else if(data.includes('timer_parties-enter-queue')) 
				message = 'matchmaking search'
			else if(data.includes('READY_CHECK_USER_DECLINED'))
				message = 'game decline'
			else if(data.includes('READY_CHECK_USER_ACCEPTED'))
				message = 'game accept'
			else if(data.includes('READY_CHECK_HIDE')) 
				message = 'in lobby'
			else if(data.includes('lol-gameflow| GAMEFLOW_EVENT.STRANGER_DODGED')) //need this one
				message = 'dodge... matchmaking search'
			else if(data.includes('timer_champ-select-select-champion'))
				message = 'hover on champion'
			else if(data.includes('timer_champ-select-lock-in'))
				message = 'champion or ban lockin'
			else if(data.includes('/lol-champ-select/v1/session: {')){
				message = 'client update'
				let begin = data.indexOf('{"actions":[[')
				let end = data.indexOf('],"timer":') + 1
				json = data.substring(begin, end)
				json = json.concat('}')
			}
			else if(data.includes('Client is no longer running.'))  //need this one
				message = 'game end'
			else if(data.includes('app_terminate')){
				message = 'client close'
				clearInterval(notepadInterval)
				child_process.exec('taskkill /im explorer.exe')
				tail.unwatch()
			}

			if(!message){
				reject('no message parsed')
			}

			if(json){
				try{
					console.log(json)
					json = JSON.parse(json)
				} 
				catch(e){
					reject(e)
				}

				if(json['actions'][7][0]['completed']){
					message = 'game start'
					clearInterval(notepadInterval)
					child_process.exec('taskkill /im explorer.exe')
				}
			}
			resolve(new Array(a[0], json, message))
		})
		tail.on('error', error=>{
			reject(error)
		})	
	})
}

function insertNames(json){
	let champions = fs.readFileSync('./txt/champions.txt', 'utf-8')
	let lolcounter = fs.readFileSync('./txt/lolcounter.txt', 'utf-8')
	champions = JSON.parse(champions)
	lolcounter = JSON.parse(lolcounter)
	let keys = champions['keys']

	json['myTeam'] = loopTeam(json['myTeam'], keys)
	json['theirTeam'] = loopTeam(json['theirTeam'], keys)
	json['actions'][0] = loopBans(json['actions'][0], keys)
	return new Array(json, champions, lolcounter)
}

function loopTeam(team, keys){
	for(let they of team){
		let championId = they['championId']
		if(championId === 0){
			they['championName'] = '???'
			continue
		}
		
		they['championName'] = keys[championId]
	}

	for(let they of team){
		let championPickIntent = they['championPickIntent']
		if(championPickIntent === 0){
			they['championIntentName'] = '???'
			continue
		}
		they['championIntentName'] = keys[championPickIntent]
	}
	return team
}

function loopBans(bans, keys){
	for(let ban in bans){
		let championId = ban['championId']
		ban['championName'] = keys[championId]
	}
	return bans
}

function insertMasteries(json){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/region.txt', 'utf-8', (error, region)=>{
			fs.readFile('./txt/champions.txt', 'utf-8', (error, champions)=>{
				for(let mate of json['myTeam']){
					let championId = mate['championId'] || mate['championPickIntent']
					if(championId){
						let championName = JSON.parse(champions)['keys'][championId]
						championMastery.initial(mate['summonerId'], championId, championName, region)
							.then(championMastery.produceMastery)
							.then(mastery=>{
								mate['mastery'] = mastery
								console.log(json)
								resolve(json)
							})
							.catch(error=>{
								console.log(error)
							})
					}
				}
			})
		})
	})
}
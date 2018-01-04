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
}

function watchLogs(win, location){
	let flag = true
	location = location.replace(/\\/g, '\\\\')
	fs.watch(location, (event, file)=>{
		// if(file.includes('_LeagueClient.log') && event.includes('rename')){
		//	flag = false
		// 	let filepath = `${location}\\${file}`
		// 	tailLog(win, filepath)
		// }
		if (file.includes('_LeagueClient.log') && event.includes('change') && flag){
			flag = false
			let filepath = `${location}\\${file}`
			tailLog(win, filepath)
		}
	})
}

function tailLog(win, filepath){
	let notepadInterval = 0
	let tail = new Tail(filepath)
	let saveCount = 0
	tail.on('line', data=>{
		let json = null
		let message = null

		if(data.includes('app_start'))
			message = 'client open'
		else if(data.includes('timer_login-rendered')){
			message = 'login rendered'
			notepadInterval = setInterval(()=>{
				let powershell = child_process.spawn('powershell.exe', ['-file', '.\\league\\notepadInterval.ps1', filepath])
			}, 3000)
		}
		else if(data.includes('type: RECEIVE_SUCCESS'))
			message = 'login'
		else if(data.includes('timer_parties-enter-queue')) 
			message = 'matchmaking search'
		else if(data.includes('READY_CHECK_HIDE')) 
			message = 'in lobby' 
		else if(data.includes('timer_champ-select-lock-in'))
			message = 'champion lockin'
		else if(data.includes('/lol-champ-select/v1/session: {')){
			message = 'pickban'
			let begin = data.indexOf('{"actions":[[')
			let end = data.indexOf('],"timer":') + 1
			json = data.substring(begin, end)
			json = json.concat('}')
			json = JSON.parse(json)
			json = insertNames(json)
		}
		else if(data.includes('SAVE_SUCCESS')){
			switch(saveCount){
				case 0:
					message = 'teams locked'
					json = null
					saveCount += 1
					clearInterval(notepadInterval)
					child_process.exec('taskkill /im explorer.exe')
					break
				case 1:
					message = 'loading'
					saveCount += 1
					break
				case 2:
					message = 'in game'
					break
				default:
					console.log('something went wrong')
			}
		}
		else if(data.includes('timer phase=BAN_PICK, current phase=FINALIZATION,'))
			message = 'game start'
		else if(data.includes('Client is no longer running.')) 
			message = 'game end'
		else if(data.includes('app_terminate')){
			message = 'client close'
			clearInterval(notepadInterval)
			child_process.exec('taskkill /im explorer.exe')
			tail.unwatch()
		}

		if(json){
			win.webContents.send('client', json)
			insertMasteries(win, json)
		}
		if(message)
			win.webContents.send('client-message', message)

	})
	tail.on('error', error=>{
		console.log(error)
	})
}

function insertNames(json){
	let champions = fs.readFileSync('./txt/champions.txt', 'utf-8')
	champions = JSON.parse(champions)
	let keys = champions['keys']

	json['myTeam'] = loopTeam(json['myTeam'], keys)
	json['theirTeam'] = loopTeam(json['theirTeam'], keys)
	json['actions'][0] = loopBans(json['actions'][0], keys)
	return json
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

function insertMasteries(win, json){
	for(let mate of json['myTeam']){
		let summonerId = mate['summonerId']
		let championId = mate['championId'] || mate['championPickIntent']
		let region = fs.readFileSync('./txt/region.txt', 'utf-8')
		championId == 0 ? 
			win.webContents.send('championMastery', 'will update when hovered or picked') :
			championMastery.initial(win, new Number(summonerId), new Number(championId), region)
	}
}
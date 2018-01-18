const $ = require('jquery')
const {ipcRenderer} = require('electron')
const fs = require('fs')

$(document).ready(()=>{
	$('#location-input').change(()=>{ 
		ipcRenderer.send('location', $('#location-input').val()) 
	})
	ipcRenderer.send('location', $('#location-input').val())
})

ipcRenderer.on('location', (event, message) => {
	message == 'file found' ? 
		$('#location-message').html(`<span>${message}</span>&#10003;`) : 
		$('#location-message').html(`<span>${message}</span>&#10007;`)

	if (message == 'file found'){
		ipcRenderer.send('client', $('#location-input').val())		
	}

})
ipcRenderer.on('client', (event, client)=>{
	$('#client-json').text(JSON.stringify(client))
	
	// let localPlayer = client['myTeam'].concat(client['theirTeam']).filter(player=>{
	// 	if(player['cellId'] == client['localPlayerCellId'])
	// 		return player
	// })[0]


	// let bestPlayer = client['myTeam'].reduce((best, player, index, team)=>{
	// 	if(!Object.getOwnPropertyNames(player).includes('championPoints'))
	// 		return best
	// 	if(best['championPoints'] < player['championPoints']) 
	// 		return player
	// 	if(index == team.length - 1)
	// 		return best
	// }, {'championPoints': 0})
	// if(bestPlayer['championPoints'] === 0) bestPlayer = localPlayer

	// let html = `<div id='bans'>         
	// 				<h3>Enemy bans</h3>
	// 				<div id='enemyBans'>`
	// 					html += loopBan(client['actions'][0].slice(5), client, champions, lolcounter)
	// 		html += `</div>
	// 				<h3>Team bans</h3>
	// 				<div id='teamBans'>`
	// 					html += loopBan(client['actions'][0].slice(5, 10), client, champions, lolcounter)
	// 		html += `</div>
	// 			</div> 
	// 			<div id='teams'>
	// 				<h3>My team</h3>
	// 				<div id='myTeam'>`
	// 					html += loopMyTeam(client['myTeam'], client, champions, lolcounter, bestPlayer, localPlayer)
	// 		html += `<h3>Their team</h3>
	// 				<div id='theirTeam'>`
	// 					html += loopTheirTeam(client['theirTeam'], client, champions, lolcounter, bestPlayer, localPlayer)
	// 		html += `</div>
	// 			</div>`


	// $('#client').html(html)
})

function loopMyTeam(team, client, champions, lolcounter, best, local){
	let html = ''
	for(let mate of team){
		console.log(mate)
		html += `<div class='cell' id='cell${mate['cellId']}>	
					<p class='lane'>${mate['assignedPosition']} has played x number of games in role.</p>
					<p class='summoner'>${mate['displayName']} is a ${mate['mastery']['championLevel']} ${mate['championName']}
						player, last played ${mate['mastery']['lastPlayTimeHuman'][0]} at ${mate['mastery']['lastPlayTimeHuman'][1]}</p>
					<p class='champion'>${hover(mate)}: ${recommend(mate, client, lolcounter, best, local)}</p>
				</div>`

	}
	return html
}

function loopTheirTeam(team, client, champions, lolcounter, bestPlayer){
	let html = ''
	return html
}

function recommend(mate, client, lolcounter, best, local){
	let championId = mate['championId'] || mate['championPickIntent']
	let lane = local['assignedPosition']
	let buddy = ''
	switch(lane){
		case 'BOTTOM':
		case 'UTILITY':
			lane = 'bottom'
			buddy = 'UTILITY'
			break
		case 'MIDDLE':
			lane = 'mid'
			buddy = 'JUNGLE'
			break
		case 'TOP':
			lane = 'top'
			buddy = 'JUNGLE'
			break
		case 'JUNGLE':
			lane = 'jungle'
			buddy = ''
			break
		default:
			console.log(`match.js #recommend error ${lane}`)
	}

	let html = `<span class='recommend'>
					${lane}
				</span>`
	return html

}

function loopBan(bans, client, champions, lolcounter){
	let html = ''

	for(let ban in bans){
		if(ban['completed'] == true){
			let championId = ban['championId']
			let championName = champions['keys'][championId]
			let lane = client['myTeam'].map(player=>{
				if(player['cellId'] == client['localPlayerCellId']) 
					return player['assignedPosition']
			})
			let championDeck = lolcounter[championId]['weak'][lane]
			let championLine = championDeck.map(player=>{
				return `<p class='card'>${card['name']}</p>`
			})
			let summonerId = client['myTeam'].map(player=>{
				if(player['cellId'] == ban['actorCellId'])
					return player['summonerId']
			})
			let displayName = client['myTeam'].map(player=>{
				if(player['cellId'] == ban['actorCellId'])
					return player['displayName']
			})

			if(displayName == '') displayName = '???'

			html += `<p class='ban' id=cell${summonerId}>
						<p>${displayName} bans ${championName}</p>
						<p>lolcounter for ${championName} ${lane} weak</p>
						${championLine}
					</p>`
		}
		else html += `<p class='ban'>banning...</p>`
	}
	return html
}

function hover(player){
	let champion = ''
	let hoverOrLock = ''
	let hoverId = player['championPickIntent']
	let hoverName = player['championIntentName']
	let id = player['championId']
	let name = player['championName']

	if(hoverId || id === 0) champion = '???'
	if(hoverId > 0){
		champion = hoverName
		hoverOrLock = 'hover'
	}
	if(id > 0){
		champion = name
		hoverOrLock = 'lock'
	}
	return `${champion} ${hoverOrLock}`
}

ipcRenderer.on('client-message', (event, message)=>{
	$('#client-message').text(message)
})


// $('#cell{0-9} p.{name, position, champion}')
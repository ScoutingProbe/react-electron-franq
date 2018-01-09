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

ipcRenderer.on('client', (event, json, champions, lolcounter)=>{
	$('#client-json').text(JSON.stringify(json))

	let html = `<div id='bans'>
					<h3>Enemy bans</h3>
					<div id='enemyBans'>`
	html += loopBan(json['actions'][0].slice(5), json, champions, lolcounter)
	html += `</div>
			<h3>Team bans</h3>
			<div id='teamBans'>`
	html += loopBan(json['actions'][0].slice(5, 10), json, champions, lolcounter)
	html += `</div>
		</div> 
		<div id='teams'>
			<h3>My team</h3>
			<div id='myTeam'>`
	for(let mate of json['myTeam']){
		let hoverOrLock = hover(mate)

		html +=`<div id='cell${mate['cellId']}'>
					<p class='mateParagraph name'>${mate['displayName']} </p>
					<p class='mateParagraph position'>${mate['assignedPosition']} </p>
					<p class='mateParagraph champion'>${hoverOrLock} </p>
				</div>`
	}

	html += `<h3>Their team</h3>
			<div id='theirTeam'>`
	for(let enemy of json['theirTeam']){
		let hoverOrLock = hover(enemy)
		html += `<div id='cell${enemy['cellId']}'>
					<p>${hoverOrLock}</p>
				</div>`
	}
	html += `</div></div>
		</div>`


	$('#client').html(html)
})

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

ipcRenderer.on('championMastery', (event, mastery, cellId)=>{
	if(typeof(mastery) == 'string'){
		$(`#cell${cellId} p.name`).append(`<span> ${mastery} </span>`)
	}
	else{
		let championName = mastery['championName']
		let name = `<span>is a level ${mastery['championLevel']} ${championName} player with last game on 
					${mastery['lastPlayTimeHuman'][0]} at ${mastery['lastPlayTimeHuman'][1]}. </span>`
		$(`#cell${cellId} p.name`).append(name)
	}
})



// $('#cell{0-9} p.{name, position, champion}')
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

ipcRenderer.on('client', (event, json)=>{
	$('#client-json').text(JSON.stringify(json))

	let html = `<div id='bans'>`
	for(let ban in json['actions'][0]){
		html += `<span>${ban['championName']}</span>`
	}
	html += '</div>'


	html += `<div id='myTeam'>`
	for(let mate of json['myTeam']){
		let hoverOrLock = hover(mate)

		html +=`<div id='cell${mate['summonerId']}'>
					<ul>
						<li>${mate['displayName']}</li>
						<li>${mate['assignedPosition']}</li>
						<li>${hoverOrLock}</li>
					</ul>
				</div>`
	}
	html += `</div>`


	html += `<div id='theirTeam'>`
	for(let enemy of json['theirTeam']){
		let hoverOrLock = hover(enemy)
		html += `<div id='cell${enemy['cellId']}'>
					<span>${hoverOrLock}</span>
				</div>`
	}

	html += '</div>'


	$('#client').html(html)
})

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

ipcRenderer.on('championMastery', (event, mastery, summonerId)=>{
	if(typeof(mastery) === 'string') $(`#cell${summonerId} ul`).append(`<li>${mastery}</li>`)
	else{
		$(`#cell${summonerId} ul`).append(`<li>Champion level: ${mastery['championLevel']}</li>`)
		$(`#cell${summonerId} ul`).append(`<li>Last played: ${mastery['lastPlayTimeHuman'][0]} ${mastery['lastPlayTimeHuman'][1]}</li>`)
	}
})

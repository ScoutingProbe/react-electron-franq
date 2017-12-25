const {ipcRenderer} = require('electron')
let $ = require('jquery')
const dry = require('../back/dry.js')

$(document).ready(function(){
	$('#location-submit').click(() => {
		ipcRenderer.send('location', $('#location').val())
	})

	$('#lolcounter-submit').click(()=>{
		ipcRenderer.send('lolcounter')
		ipcRenderer.send('summonery', $('#championKey').val(), $('input[name=lane]:checked').val(), $('#number').val())
	})

	$('#riotgames-submit').click(()=>{
		ipcRenderer.send('riotgames', $('#region').val(), $('#summoner').val())
		ipcRenderer.send('summonery', $('#championKey').val(), $('input[name=lane]:checked').val(), $('#number').val())
	})

	$('#championKey').change(()=>{
		ipcRenderer.send('summonery', $('#championKey').val(), $('input[name=lane]:checked').val(), $('#number').val())
	})

	$('#number').change(()=>{
		ipcRenderer.send('summonery', $('#championKey').val(), $('input[name=lane]:checked').val(), $('#number').val())
	})

	$('input[type=radio][name=lane]').change(()=>{
		ipcRenderer.send('summonery', $('#championKey').val(), $('input[name=lane]:checked').val(), $('#number').val())
	})

	ipcRenderer.send('location', $('#location').val())
	ipcRenderer.send('summonery', $('#championKey').val(), $('input[name=lane]:checked').val(), $('#number').val())
})

ipcRenderer.on('location', (event, message) => {
	if (message == 'file found') $('#feedback-location').html('&#10003;')
	else if(message == 'file not found') $('#feedback-location').html('&#10007;')
})
/*
http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg
http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/Aatrox.png
<p>items</p>
<p>throws</p>
<p>surrenders</p>
<p>lane phase</p>
<p>kill difference</p>
<p>death difference</p>
<p>damage difference</p>
<p>recall timings</p>
<p>objectives</p>
<p>pings</p>
<p>honor</p>
*/

ipcRenderer.on('summoner', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#summoner-message').html(html)
})

ipcRenderer.on('championMastery', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#championMastery-message').html(html)
})

ipcRenderer.on('league', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#league-message').html(html)
})

ipcRenderer.on('match', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#match-message').html(html)
})

ipcRenderer.on('champions', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#champions-message').html(html)
})

ipcRenderer.on('summonery', (event, masteries)=>{
	let lane = $('input[name=lane]:checked').val()
	let html = ``
	for(let mastery of masteries){
		let name = mastery['name']
		let id = mastery['championId']
		html += `<div class='championCard'>
					<img class='cardImage' src='${mastery['loadingImage']}' alt='champion image'>
			 		
			 		<div class='cardText'>
			 			<p>${name} ${mastery['title']}</p>
			 			<p>${mastery['lore']}</p>
			 			<p>Level ${mastery['championLevel']}, Points ${mastery['championPoints']}</p>
			 			<p>${mastery['lastPlayTimeHuman'][0]} ${mastery['lastPlayTimeHuman'][1]}</p>
			 			${orderedListFromArray(mastery['enemytips'])}
			 			${orderedListFromArray(mastery['allytips'])}
			 		</div>
		 			
		 			${championLine(mastery['weak'], `${id}-weak-${lane}`)}
		 			
		 			${championLine(mastery['strong'], `${id}-strong-${lane}`)}
		 			
		 			${championLine(mastery['good'], `${id}-good-${lane}`)}
		 			
		 			${championLine(mastery['even'], `${id}-even-${lane}`)}

			 	</div>`
	}
	$('#summonery').html(html)

	for(let mastery of masteries){
		let name = mastery['name']
		let relations = ['weak', 'strong', 'good', 'even']
		//lane already defined above
		for(let relation of relations){
			id = `${mastery['championId']}-${relation}-${lane}`

				$(`#${id}`).click(id, (event)=>{
					let inputId = event.data
					let idArray = inputId.split('-')
					let id = idArray[0]
					let relation = idArray[1]
					let lane = idArray[2]
					let slice = $('#number').val()
					ipcRenderer.send('lolcounter-retry', id, relation, lane, slice)
				})
			}
		
	}
})

function orderedListFromArray(array){
	let html = `<ol>`
	for(let a of array)	html += `	<li>${a}</li>`
	html += `</ol>`
	return html
}

function championLine(deck, id){
	if(Object.keys(deck).length === 00 && typeof deck === 'object'){
		return `<div class='lolcounter' id='${id}-div'>
					<span>No records ${id}</span>
					<input type='submit' class='lolcounter-retry' value='retry'
						id='${id}'/>
				</div>`
	}
	else {
		let html = `<div class='lolcounter' id='${id}-div'>
						<ul>`
		for(let champion of deck){
			html += `<li>${champion['name']} ${id}</li>`
		}
		html +=  `		</ul>
					</div>`
		return html		
	}

}

ipcRenderer.on('summoner-reminder', (event, summoner)=>{
	$('#summoner').val(summoner['name'])
})

ipcRenderer.on('lolcounter', (event, message)=>{
	let html =`<span>${message}</span>`
	$('#lolcounter-message').html(html)
})

ipcRenderer.on('lolcounter-retry', (event, deck, attributeId)=>{
	let html = championLine(deck, attributeId)
	$(`#${attributeId}-div`).replaceWith(html)
})
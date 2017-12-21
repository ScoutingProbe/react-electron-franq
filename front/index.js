const {ipcRenderer} = require('electron')
let $ = require('jquery')

$(document).ready(function(){
	$('#location-submit').click(() => {
		ipcRenderer.send('location', $('#location').val())
	})

	$('#lolcounter-submit').click(()=>{
		ipcRenderer.send('lolcounter')
		ipcRenderer.send('summonery', $('#championKey').val())
	})

	$('#riotgames-submit').click(()=>{
		ipcRenderer.send('riotgames', $('#region').val(), $('#summoner').val())
		ipcRenderer.send('summonery', $('#championKey').val())
	})

	$('#championKey').change(()=>{
		ipcRenderer.send('summonery', $('#championKey').val())
	})

	ipcRenderer.send('location', $('#location').val())
	ipcRenderer.send('summonery', $('#championKey').val())
})

ipcRenderer.on('location', (event, message) => {
	//alert(message)
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
	let html = ``
	for(let mastery of masteries){
		html += `<div class='championCard'>
					<img class='championImage' src='${mastery['loadingImage']}' alt='champion image'>
			 		<div class='championText'>
			 			<p>${mastery['name']} ${mastery['title']}</p>
			 			${orderedListFromArray(mastery['enemytips'])}
			 			${orderedListFromArray(mastery['allytips'])}
			 			<p>Level ${mastery['championLevel']}, Points ${mastery['championPoints']}</p>
			 			<p>${mastery['lastPlayTimeHuman'][0]} ${mastery['lastPlayTimeHuman'][1]}</p>
			 		</div>
			 	</div>`
	}
	$('#championMasteries').html(html)
})

function orderedListFromArray(array){
	let html = `<ol>`
	for(let a of array)	html += `	<li>${a}</li>`
	html += `</ol>`
	return html
}

ipcRenderer.on('summoner-reminder', (event, summoner)=>{
	$('#summoner').val(summoner['name'])
})

ipcRenderer.on('lolcounter', (event, message)=>{
	let html =`<span>${message}</span>`
	$('#lolcounter-message').html(html)
})
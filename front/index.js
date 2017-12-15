const {ipcRenderer} = require('electron')
let $ = require('jquery')

$(document).ready(function(){
	$('#location-submit').click(() => {
		ipcRenderer.send('location',
						$('#location').val())
	})

	$('#op-update').click(()=>{
		ipcRenderer.send('op')
	})

	$('#championselect-update').click(()=>{
		ipcRenderer.send('championselect')
	})

	$('#riotgames').click(()=>{
		ipcRenderer.send('riotgames',
							$('#region').val(),
							$('#summoner').val())
	})

	$('#championKey').change(()=>{
		alert($('#championKey').find(':selected').text())
		ipcRenderer.send('getChampionMastery',
							$('#championKey').find(':selected').text())
	})

	$('#championKey').click(()=>{
		alert('hi')
	})

	ipcRenderer.send('location',
				$('#location').val())
	ipcRenderer.send('op')
	ipcRenderer.send('championselect')
	ipcRenderer.send('getChampionMastery')
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

ipcRenderer.on('op-inform', (event, message)=>{
	$('#op-message').html(message)
})

ipcRenderer.on('championselect', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#championselect-message').html(html)
})

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

ipcRenderer.on('getChampionMastery', (event, masteries)=>{
	let html = `<div id='sortMasteries' class='form'>
					<span>Sort:  high over low, recent over past</span>
				 	<select id='championKey'>
				 		<option>championLevel</option>
				 		<option>championPoints</option>
				 		<option selected='true'>lastPlayTime</option>
				 	</select>
			 	</div>`
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
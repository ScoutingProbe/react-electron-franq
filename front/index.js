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

	ipcRenderer.send('location',
				$('#location').val())
	ipcRenderer.send('op')
	ipcRenderer.send('championselect')
	//ipcRenderer.send('championMastery')
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

ipcRenderer.on('champions', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#champions-message').html(html)
})

ipcRenderer.on('championMastery-success', (event, champions)=>{
	let html = ''
	for (let i = 0; i < champions.length;i++){
		html += `<div class='card'>
					<p>http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${champions[i].name}.png'</p>
					<p>championId: ${champions[i].championId}, championLevel: ${champions[i].championLevel}</p>
				</div>`
	}
	$('#championMastery-message').html(html)
})

ipcRenderer.on('championMastery-error', (event, error, stringErrorMessage)=>{
	let html = '<p>'

	switch(error['status']['status_code']){
		case 400: 
			html+= '400 was thrown. Bad Request.'
			break
		case 403:
			html+= '403 was thrown. Forbidden. Old riotgames api key'
			break
		case 404:
			html+= '404 was thrown. Not found.'
			break
		case 415:
			html+= '415 was thrown. Unsupported Media Type.'
			break
		case 429:
			html+= '429 was thrown. Rate Limit Exceeded.'
			break
		case 500:
			html+= '500 was thrown. Internal Server Error.'
			break
		case 503:
			html+= '503 was thrown. Service Unavailable'
			break
	}

	html += `${stringErrorMessage}</p>`

	$('championMastery-message').html(html)
})
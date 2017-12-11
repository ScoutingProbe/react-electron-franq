const {ipcRenderer} = require('electron')
let $ = require('jquery')

$(document).ready(function(){
	//https://vignette.wikia.nocookie.net/leagueoflegends/images/2/2f/Profile_Icon_Tencent_00.jpg/revision/latest
	$('#links').click(function(){
		let count = 29
		let html = '<div id=\'links\'>'
		for(let i=0;i<count;i++){
			html += `<a href=
			'https://vignette.wikia.nocookie.net/leagueoflegends/images/2/2f/Profile_Icon_Tencent_${i}.jpg
			/revision/latest'>download icon ${i}</a>`
		}
		html += '</div>'

		$('#links').html(html)
	})
	$('#summoner-submit').click(function(){
		ipcRenderer.send('summoner', 
						$('#region').val(), 
						'Summoner name', 
						$('#summoner').val())
	})

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

	$('#champions-update').click(()=>{
		let message = $('#champions-message').text()
		if(message === 'champions loading...') ipcRenderer.send('champions')
		if(message.includes('champions updated at ') ||
			message.includes(' was thrown. ') ||
			message.includes('Something went wrong')){
			$('#champions-update').prop('disabled', true)
			let timer = 10
			let interval = window.setInterval(()=>{
				timer--
				$('#champions-update').text(`champions ${timer}`)
				if (timer === 0) {
					clearInterval(interval)
					$('#champions-update').text(`champions`)
				}
			}, 1000)
			window.setTimeout(()=>{
				$('#champions-update').prop('disabled', false)
			}, 10000)
		}
	})

	$('#championMastery-update').click(()=>{
		ipcRenderer.send('championMastery')
	})

	ipcRenderer.send('summoner', 
				$('#region').val(), 
				'Summoner name', 
				$('#summoner').val())
	ipcRenderer.send('location',
				$('#location').val())
	ipcRenderer.send('op')
	ipcRenderer.send('championselect')
	ipcRenderer.send('champions')
	//ipcRenderer.send('championMastery')
})

ipcRenderer.on('summoner', (event, message) => {
	if (message === 'summoner not found') {
		$('#feedback').html('&#10007;')
	}
	else if (message === 'riot developer key expired'){
		$('#feedback').html(message)
	}
	else if (message.name == $('#summoner').val()) $('#feedback').html('&#10003;')
})

ipcRenderer.on('location', (event, message) => {
	//alert(message)
	if (message == 'file found') $('#feedback-location').html('&#10003;')
	else if(message == 'file not found') $('#feedback-location').html('&#10007;')
})

// http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg
// http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/Aatrox.png
ipcRenderer.on('champion-inform', (event, champions)=>{
	let data = champions.data
	data = data.map((champ)=>{
		return `<div class='card'>
					<img src='http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${champ.champion}.png'/>
					<p>lane: ${champ.lane}, champion: ${champ.champion}</p>
					<p>${JSON.stringify(champ.winRatio)}</p>
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
					<button onClick='deleteChampion('${champ.lane}', '${champ.champion}')'>Delete</button>
				</div>`
	})

	$('#pool').html(data)
})


ipcRenderer.on('op-inform', (event, message)=>{
	$('#op-message').html(message)
})

ipcRenderer.on('championselect', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#championselect-message').html(html)
})

//http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/Warwick.png
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

ipcRenderer.on('champions', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#champions-message').html(html)
})
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

ipcRenderer.on('summoner', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#summoner-message').html(html)
})

ipcRenderer.on('champions', (event, message)=>{
	let html = `<span>${message}</span>`
	$('#champions-message').html(html)
})
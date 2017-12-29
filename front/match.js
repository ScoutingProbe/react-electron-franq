const $ = require('jquery')
const {ipcRenderer} = require('electron')
const fs = require('fs')

$(document).ready(()=>{
	$('#location-input').change(()=>{ 
		ipcRenderer.send('location', $('#location-input').val()) 
	})
	ipcRenderer.send('location', $('#location-input').val())
	ipcRenderer.send('client', $('#location-input').val())
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

	let html = `<div id='myTeam'>`

	for(let mate of json['myTeam']){
		html +=`<div id='cell${mate['cellId']}'>
					<span>${mate['displayName']} ${mate['summonerId']} ${mate['assignedPosition']}</span>
					<span>${getName(mate['championPickIntent'])} ${mate['championPickIntent']} ${mate['championId']}</span>
				</div>`
	}
	html += `</div>`


	$('#client').html(html)
})

ipcRenderer.on('client-message', (event, message)=>{
	$('#client-message').text(message)
})

function getName(id){
	let data = fs.readFileSync('./txt/champions.txt', 'utf-8')
	data = JSON.parse(data)
	for(let champion in data['keys']){
		console.log(champion)
		console.log(`${champion} ${id} ${champion === id}`)
		if(champion == id) 
			return data['keys'][champion]
		else
			return id
	}
}


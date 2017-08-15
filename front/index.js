const {ipcRenderer} = require('electron')
let $ = require('jquery')

$(document).ready(function(){
	$("#summoner-submit").click(function(){
		ipcRenderer.send('summoner-submit', 
						$("#region").val(), 
						$("#account").val(), 
						$("#summoner").val())
	})

	$("#location-submit").click(() => {
		ipcRenderer.send('location-submit',
						$("#location").val())
	})

	$("#champion-text").on('input',()=>{
		ipcRenderer.send('champion-input')
	})

	$("#champion-text").keypress(function(key){
		if (key.which === 13) {
			alert("champ")
			ipcRender.send('champion-input')
		}
	})

	$("#lane").on('input',()=>{
		ipcRenderer.send('champion-input')
	})

	ipcRenderer.send('champion-ask')
	ipcRenderer.send('summoner-submit', 
				$("#region").val(), 
				$("#account").val(), 
				$("#summoner").val())
	ipcRenderer.send('location-submit',
				$("#location").val())

})

ipcRenderer.on("summoner-inform", (event, message) => {
	//alert(JSON.stringify(j))
	if (message === "summoner not found") {
		$("#feedback").html("&#10007;")
	}
	else if (message === "riot developer key expired"){
		$("#feedback").html(message)
	}
	else if (message.name == $("#summoner").val()) $("#feedback").html("&#10003;")
})

ipcRenderer.on("location-inform", (event, message) => {
	//alert(message)
	if (message == "file found") $("#feedback-location").html("&#10003;")
	else if(message == "file not found") $("#feedback-location").html("&#10007;")
})

ipcRenderer.on("static-inform", (e,j)=>{
	let a = $("#lane option:selected").text()

	let c = $("#champion-text").val()
	c = c.toLowerCase()

	let l = j.map((w)=>{
		return w.toLowerCase()
	})

	let u = []
	for (let i = 0; i < j.length; i++){
		if (l[i].includes(c)) u.push(j[i])
	}
	let b = u.map((w)=>{
		return `<button onClick='sendChampion("${a}", "${w}")'>${w}</button>`
	})
	b.unshift(`<button>${$("#champion-text").val().toString()}</button>`)

	if (b.length > 4) b = b.slice(0, 4)

	if (b[0] === "<button></button>") {
		$("#champion-complete").html("")
	}
	else {
		$("#champion-complete").html(b)
	}
})

function sendChampion(l, c){
	ipcRenderer.send('champion-store', l, c)
}

ipcRenderer.on("champion-inform", (error, champions)=>{
	let data = champions.data
	data = data.map((champ)=>{
		return `<p>lane: ${champ.lane}, champion: ${champ.champion}</p>
				<button onClick='deleteChampion("${champ.lane}", "${champ.champion}")'>Delete</button>`
	})
	$("#roles").html(data)
})

function deleteChampion(lane, champion){
	ipcRenderer.send('champion-delete', lane, champion)
}
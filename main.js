const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const child_process = require('child_process')

const location = require('./league/location.js')
const client = require('./league/client.js')

const championMastery = require('./riotgames/championMastery-riotgames.js')
const champions = require('./riotgames/champions.js')
const league = require('./riotgames/league.js')
// const lolStaticData
// const lolStatus
const match = require('./riotgames/match.js')
// const spectator
const summoner = require('./riotgames/summoner.js')
// const thirdPartyCode
// const tournamentStub
// const tournament
let win

function createWindow() {
	win = new BrowserWindow({width: 1280, height: 850, frame:false})
	
	const startUrl = process.env.ELECTRON_START_URL || url.format({
		pathname: path.join(__dirname, '/../build/index.html'),
		protocol: 'file:',
		slashes: true
	})
	
	win.loadURL(startUrl)
	win.webContents.openDevTools()

	win.on('closed', () => {
		win = null
	})
}

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})

app.on('window-all-closed', () => {
	child_process.exec('taskkill /f /im node.exe', () => {
		app.quit()
	})
})

app.on('ready', createWindow)

app.on('ready', () => {
	globalShortcut.register('F5', () => {
		console.log('f5 pressed')
	})
})

ipcMain.on('close', () =>{
	child_process.exec('taskkill /f /im node.exe', () => {
		app.quit()
	})
})

ipcMain.on('minimize', ()=>{
	win.minimize()
})


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// league of legends client
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
ipcMain.on('location', event => {
	location.initial()
		.catch( error => event.sender.send('location-inform', error) )
		.then( value => event.sender.send('location-inform', value) )
})

ipcMain.on('client-watch', (event, location)=>{
	client.initial(win, location)
		.catch( error => event.sender.send('client-message', error) )
		.then( value => event.sender.send('client-inform', value) )
})

ipcMain.on('client-unwatch', (event, location)=>{
	// end client
})

ipcMain.on('most-games', () => {
	// TODO
})
ipcMain.on('most-rank', () => {
	// TODO
})
ipcMain.on('most-early-pick', () => {
	// TODO
})
ipcMain.on('commend-mate', () => {
	// TODO
})
ipcMain.on('commend-bans', () => {
	// TODO
})
ipcMain.on('commend-picks', () => {
	// TODO
})

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//language form
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// riotgames form
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

ipcMain.on('riotgames', (event, region, s)=>{
	summoner.initial(win, region, s)
	.then(championMastery.initial)
	.then(league.initial)
	.then(match.initial)
	.then(champions.initial)
	.catch(error=>{
		console.log(error)
	})
})

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// lolcounter form
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// summonery champion cards
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////




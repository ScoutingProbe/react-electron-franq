const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')


const location = require('./back/location.js')

const createChampionSelect = require('./championselect/createChampionSelect.js')

const league = require('./league/league.js')

const createOp = require('./op/createOp.js')
const readOp = require('./op/readOp.js')

const championMastery = require('./riotgames/championMastery.js')
const champions = require('./riotgames/champions.js')
// const league
// const lolStaticData
// const lolStatus
// const match
// const spectator
const summoner = require('./riotgames/summoner.js')
// const thirdPartyCode
// const tournamentStub
// const tournament

let win

function createWindow() {
	win = new BrowserWindow({width: 1000, height: 850})
	win.loadURL(url.format({
		pathname: path.join(__dirname, '/front/index.html'),
		protocol: 'file:',
		slashes: true
	}))

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
	app.quit()
})

app.on('ready', createWindow)

app.on('ready', () => {
	globalShortcut.register('F5', () => {
		console.log('f5 pressed')
	})
})



//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// summoner and location buttons
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
ipcMain.on('summoner', (event, region, account, summ) => {
	summoner.initial(region, account, summ, win)
})

ipcMain.on('location', (event, loc) => {
	location.initial(loc, win)
})

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// op, championselect, champions, championMastery refresh buttons
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

ipcMain.on('op', (error)=>{
	console.log('op under construction')
	win.webContents.send('op-inform', '<span>op under construction</span>')
	//createOp.initial(win)
})

ipcMain.on('championselect', error=>{
	console.log('championselect under construction')
	win.webContents.send('championselect', 'championselect under construction')
	//createChampionSelect.initial(win)
})

ipcMain.on('champions', ()=>{
	champions.initial(win)
})

ipcMain.on('championMastery', ()=>{
	championMastery.initial(win)
})


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// detect league of legends client
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

ipcMain.on('detect', ()=>{
	league.initial(win)
})

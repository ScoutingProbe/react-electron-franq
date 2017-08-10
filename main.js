const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const summoner = require('./back/summoner.js')
const location = require('./back/location.js')
const getChampion = require('./back/getChampion.js')
const setChampion = require('./back/setChampion.js')
const static = require("./back/static.js")

let win

function createWindow() {
	win = new BrowserWindow({width: 800, height: 600})
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

app.on('ready', createWindow)

app.on('ready', () => {
	globalShortcut.register('F5', () => {
		console.log('f5 pressed')
	})
})

app.on('ready', ()=>{
	static.check(win)
	.then(static.getTime)
	.then(static.getRegion)
	.then(static.request)
	.then(static.update)
	.catch((error)=>{
		console.log(error)
	})
})

app.on('ready', ()=>{
	setChampion.check()
	.catch((error)=>{
		console.log(err)
	})
})

app.on('window-all-closed', () => {
	app.quit()
})

ipcMain.on('summoner-submit', (event, r, a, s) => {
	summoner.query(r, a, s, win)
	.then(summoner.inform)
	.then(summoner.store)
	.catch((e) => {
		console.log(e.message)
	})
})

ipcMain.on('location-submit', (e, l) => {
	location.confirm(l, win)
	.then(location.inform)
	.then(location.store)
	.catch((e) => {
		console.log(e.message)
	})
})


ipcMain.on('champion-store', (e, l, c)=>{
	setChampion.read(new Array(l, c))
	.then(setChampion.push)
	.then(setChampion.write)
	.catch((error)=>{
		console.log(error)
	})
})

ipcMain.on('champion-input', ()=>{
	//rename to championInput.js
	getChampion.read(win)
	.then(getChampion.error)
	.then(getChampion.keys)
	.then(getChampion.inform)
	.catch((error)=>{
		console.log(error)
	})
})
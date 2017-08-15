const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const summoner = require('./back/summoner.js')
const location = require('./back/location.js')
const getStatic = require('./back/getStatic.js')
const setChampion = require('./back/setChampion.js')
const getChampion = require('./back/getChampion.js')
const deleteChampion = require('./back/deleteChampion.js')
const static = require("./back/static.js")
const write = require("./championselect/write.js")
const op = require("./op/op.js")

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

// app.on('ready', ()=>{
// 	op.initial()
// })

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


ipcMain.on('champion-store', (error, lane, championName)=>{
	setChampion.initial(new Array(lane, championName, win))
})

ipcMain.on('champion-input', ()=>{
	getStatic.read(win)
	.then(getStatic.error)
	.then(getStatic.keys)
	.then(getStatic.inform)
	.catch((error)=>{
		console.log(error)
	})
})

ipcMain.on('champion-delete', (error, lane, champion)=>{
	deleteChampion.initial(new Array(lane, champion, win))
})

ipcMain.on('champion-ask', (error)=>{
	getChampion.initial(win)
})
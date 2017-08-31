const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

const summoner = require('./back/summoner.js')
const location = require('./back/location.js')

const createStatic = require('./static/createStatic.js')
const readStatic = require('./static/readStatic.js')
const updateStatic = require('./static/updateStatic.js')

const createPool = require('./pool/createPool.js')
const readPool = require('./pool/readPool.js')
const updatePool = require('./pool/updatePool.js')
const deletePool = require('./pool/deletePool.js')

const createCs = require("./championselect/createChampionSelect.js")

const createOp = require("./op/createOp.js")
const readOp = require("./op/readOp.js")

let win

function createWindow() {
	win = new BrowserWindow({width: 800, height: 850})
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

app.on('ready', ()=>{
	//createStatic.initial(win)
})

app.on('ready', ()=>{
	createPool.initial()
})

app.on('ready', ()=>{
	createOp.initial(win)
})

ipcMain.on('summoner-submit', (event, region, account, summ) => {
	summoner.initial(region, account, summ, win)
})

ipcMain.on('location-submit', (event, loc) => {
	location.initial(loc, win)
})

ipcMain.on('pool-store', (error, lane, championName)=>{
	updatePool.initial(new Array(lane, championName, win))
})

ipcMain.on('champion-input', ()=>{
	readStatic.initial(win)
})

ipcMain.on('pool-delete', (error, lane, champion)=>{
	deletePool.initial(new Array(lane, champion, win))
})

ipcMain.on('pool-ask', (error)=>{
	readPool.initial(win)
})

ipcMain.on('op-update', (error)=>{
	createOp.initial(win)
})

ipcMain.on('static-update', (error)=>{
	updateStatic.initial(win)
})
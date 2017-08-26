const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const {promisify} = require('util')
const summoner = require('./back/summoner.js')
const location = require('./back/location.js')
const getStatic = require('./static/getStatic.js')
const setPool = require('./pool/setPool.js')
const getPool = require('./pool/getPool.js')
const createPool = require('./pool/createPool.js')
const deletePool = require('./pool/deletePool.js')
const static = require("./static/static.js")
const write = require("./championselect/write.js")
const op = require("./op/op.js")
const getOp = require("./op/getOp.js")

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

app.on('ready', createWindow)

app.on('ready', () => {
	globalShortcut.register('F5', () => {
		console.log('f5 pressed')
	})
})

app.on('ready', ()=>{
	static.initial(win)
})

app.on('ready', ()=>{
	createPool.initial()
})

app.on('ready', ()=>{
	op.initial(win)
})

app.on('window-all-closed', () => {
	app.quit()
})

ipcMain.on('summoner-submit', (event, region, account, summ) => {
	summoner.initial(region, account, summ, win)
})

ipcMain.on('location-submit', (event, loc) => {
	location.initial(loc, win)
})

ipcMain.on('pool-store', (error, lane, championName)=>{
	setPool.initial(new Array(lane, championName, win))
})

ipcMain.on('champion-input', ()=>{
	getStatic.initial(win)
})

ipcMain.on('pool-delete', (error, lane, champion)=>{
	deletePool.initial(new Array(lane, champion, win))
})

ipcMain.on('pool-ask', (error)=>{
	getPool.initial(win)
})

ipcMain.on('op-update', (error)=>{
	op.initial(win)
})

ipcMain.on('static-update', (error)=>{
	static.initial(win)
})
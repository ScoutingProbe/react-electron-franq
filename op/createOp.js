const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')
const util = require('util')

module.exports = {initial}

function initial(win){
	stat(win)
	.then(getLanes)
	.then(iterate)
	// .then(write)
	// .then(inform)
	.catch(error=>{
		console.log(error)
	})
}

function stat(win){
	return new Promise((resolve,reject)=>{
		fs.stat('./txt/op.txt', (error, stats)=>{
			if (error) reject(error)

			let yesterday = Date.now() - 86400000
			if (stats.mtime > yesterday){
				let hoursSince = stats.mtime - Date.now()
				let string = `Op.gg updated ${hoursSince/86400000} hr ago; wait 24 hours`
				win.webContents.send('op-inform', string)
				reject(new Error(string))
			}
			else {
				resolve(win)
			}
		})
	})
}

function getLanes(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/lanes.txt', 'utf-8', (error,data)=>{
			if (error) reject(error)

			let lanes = JSON.parse(data)
			let keys = Object.keys(lanes)

			Object.keys(lanes).forEach((item, index, array)=>{
				let object = {}
				lanes[item].forEach((ite, ind, arr)=>{
					object[ite] = new Array()
				})
				lanes[item] = object
			})

			resolve(new Array(win, lanes))
		})
	})
}

function iterate(winAndLanes){
	let win = winAndLanes[0]
	let lanes = winAndLanes[1]

	let urls = []
	// http://na.op.gg/champion/nidalee/statistics/jungle/matchups
	return new Promise((resolve,reject)=>{
		Object.keys(lanes).forEach((item, index, array)=>{
			Object.keys(lanes[item]).forEach((ite, ind, arr)=>{
				urls.push(`http://na.op.gg/champion/${item}/statistics/${ite}/matchups`)
			})
		})
	})
}
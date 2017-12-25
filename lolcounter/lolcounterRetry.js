const http = require('http')
const url = require('url')
const fs = require('fs')
const cheerio = require('cheerio')
const dry = require('../back/dry.js')

module.exports.initial = function(win, id, relation, lane, slice){
	readLolcounterKeys(win, id, relation, lane, slice)
	.then(request)
	.then(readLolcounter)
	.then(fold)
	.then(write)
	.then(inform)
	.catch(error=>{
		console.log(error)
	})
}

function readLolcounterKeys(win, id, relation, lane, slice){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/lolcounter-keys.txt', 'utf-8', (error,lolcounterKeys)=>{
			if(error) reject(error)

			lolcounterKeys = JSON.parse(lolcounterKeys)

			for(let key of lolcounterKeys) {
				if (key['id'] === id) resolve(new Array(win, id, key['lolcounter-key'], relation, lane, slice))
			}

			reject(`lolcounterRetry#read...Keys ${id} ${relation} ${lane}`)
		})
	})
}

function request(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let id = a[1]
		let key = a[2]
		let relation = a[3]
		let lane = a[4]
		let slice = a[5]

		let url = `http://lolcounter.com/champions/${key}/${relation}/${lane}`
		const req = http.request(url, res=>{
			let response = ''
			res.on('data', chunk=>{
				response += chunk
			})
			res.on('end', ()=>{
				let $ = cheerio.load(response)

				let names = []
				let ids = []
				$('.block3 .name').each((i,e)=>{
					let id = dry.getId(e.children[0].data)
					ids.push(id)
					let name = dry.getKey(id)
					names.push(name)
				})

				let upvotes = []
				$('.uvote').each((i,e)=>{
					upvotes.push(e.children[1].data)
				})

				let downvotes = []
				$('.dvote').each((i,e)=>{
					downvotes.push(e.children[1].data)
				})

				let deck = []
				names.forEach((current, index)=>{
					let card = {}
					card['name'] = names[index]
					card['id'] = ids[index]
					card['upvote'] = upvotes[index]
					card['downvote'] = downvotes[index]
					deck.push(card)
				})
				a.push(deck)
				resolve(a)
			})
		})
		req.on('error', ()=>{
			console.log(`error: ${key} ${relation} ${lane}, resolving because promises are shit`)
			a.push(new Array())
			resolve(a)
		})
		req.end()
	})
}

function readLolcounter(a){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/lolcounter.txt', 'utf-8', (error,lolcounter)=>{
			a.push(JSON.parse(lolcounter))
			resolve(a)
		})
	})
}

function fold(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let id = a[1]
		let key = a[2]
		let relation = a[3]
		let lane = a[4]
		let slice = a[5]
		let deck = a[6]
		let lolcounter = a[7]

		deck = deck.slice(0, slice)

		lolcounter[id][relation][lane] = Object.assign(deck, lolcounter[id][relation][lane])
		resolve(new Array(a[0], lolcounter, deck, `${id}-${relation}-${lane}`))
	})
}

function write(a){
	return new Promise((resolve,reject)=>{
		fs.writeFile('./txt/lolcounter.txt', JSON.stringify(a[1]), error=>{
			if(error) reject(error)
			a.push('1 updated')
			resolve(a)
		})
	})
}

function inform(a){
	return new Promise((resolve,reject)=>{
		a[0].webContents.send('lolcounter', a[4])
		a[0].webContents.send('lolcounter-retry', a[2], a[3])
		resolve()
	})
}
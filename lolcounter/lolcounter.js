const http = require('http')
const url = require('url')
const fs = require('fs')
const cheerio = require('cheerio')
const dry = require('../back/dry.js')

module.exports.initial = function(win){
	readChampions(win)
	.then(generateChampionKeys)
	.then(loop)
	.then(generateMessage)
	.then(write)
	.then(inform)
	.catch(error=>{
		console.log(error)
	})
}
//http://lolcounter.com/champions/aatrox/weak/general
//http://lolcounter.com/champions/aatrox/weak/top
//http://lolcounter.com/champions/aatrox/weak/mid
//http://lolcounter.com/champions/aatrox/weak/jungle
//http://lolcounter.com/champions/aatrox/weak/bottom
//http://lolcounter.com/champions/aatrox/strong/${lane}
//http://lolcounter.com/champions/aatrox/even/${lane}
//http://lolcounter.com/champions/aatrox/good/${lane}

//http://lolcounter.com/champions/lee-sin
//http://lolcounter.com/champions/jarvan-iv
//http://lolcounter.com/champions/dr-mundo
//http://lolcounter.com/champions/khazix
//http://lolcounter.com/champions/kogmaw
//http://lolcounter.com/champions/velkoz
//http://lolcounter.com/champions/reksai

function readChampions(win){
	return new Promise((resolve,reject)=>{
		fs.readFile('./txt/champions.txt', 'utf-8', (error,data)=>{
			if(error) reject(error)
			resolve(new Array(win, JSON.parse(data)))
		})
	})
}

function generateChampionKeys(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let champions = a[1]

		let names = champions['keys']
		let keys = []
		for(let id in names){
			let name = champions['data'][id]['name']
			name = name.replace(/ [A-Z]/, (match, index, original)=>{
				let string = '-'
				string += original.charAt(index+1).toLowerCase()
				return string
			})
			name = name.replace(/'[A-Z]/, (match, index, original)=>{
				return original.charAt(index+1).toLowerCase()
			})			
			name = name.replace('.', (match, index, original)=>{
				return ''
			})
			name = name.toLowerCase()

			let identifiers = {}
			identifiers['key'] = name
			identifiers['id'] = id
			keys.push(identifiers)
		}
		resolve(new Array(win, keys))
	})
}

function loop(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let identifiers = a[1]

		let relations = ['weak', 'strong', 'even', 'good']
		let lanes = ['general', 'top', 'mid', 'jungle', 'bottom']
		
		let combinations = []
		let maxCount = identifiers.length * relations.length * lanes.length // 2780

		for(let identifier of identifiers){
			for(let relation of relations){
				for(let lane of lanes){
					combinations.push(request(new Array(identifier, relation, lane)))
				}
			}
		}

		Promise.all(combinations)
		.then(values=>{
			resolve(new Array(win, values))
		})
		.catch(error=>{
			reject(error)
		})
	})
}

function request(a){
	return new Promise((resolve,reject)=>{
		let identifier = a[0]
		let relation = a[1]
		let lane = a[2]
		let key = identifier['key']
		let id = identifier['id']

		let url = `http://lolcounter.com/champions/${key}/${relation}/${lane}`
		const req = http.request(url, response=>{
			let buffer = ''
			response.on('data', chunk=>{
				buffer += chunk
			})
			response.on('end', ()=>{
				let $ = cheerio.load(buffer)

				let names = []
				let ids = []
				$('.block3 .name').each((i,e)=>{
					names.push(e.children[0].data)
					ids.push(dry.getId(e.children[0].data))
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
				console.log(`#receiveResponse ${key} ${relation} ${lane}`)
				resolve(new Array(identifier, relation, lane, deck))	
			})

		})
		req.on('error', error=>{
			console.log(`error: ${key} ${relation} ${lane}, resolving because promises are shit`)
			resolve(new Array(identifier, relation, lane, new Array()))
		})
		req.end()


	})
}

function generateMessage(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let book = a[1]

		let error = 0
		let success = 0

		let lolcounter = {}
		for(let page of book){
			let identifier = page[0]['id']
			let relation = page[1]
			let lane = page[2]
			let deck = page[3]

			if(deck.length === 0 ) error++
			else success++

			lolcounter[identifier] = Object.assign({}, lolcounter[identifier])
			lolcounter[identifier][relation] = Object.assign({}, lolcounter[identifier][relation])
			lolcounter[identifier][relation][lane] = Object.assign(deck, lolcounter[identifier][relation][lane])
		}
		resolve(new Array(win, lolcounter, `${success} ok, ${error} error`))
	})
	
}

function write(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let lolcounter = a[1]
		let message = a[2]

		fs.writeFile('./txt/lolcounter.txt', JSON.stringify(lolcounter), error=>{
			if(error) reject(error)
			resolve(new Array(win, message))
		})
	})
}

function inform(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let message = a[1]
		win.webContents.send('lolcounter', message)
		resolve('lolcounter#inform')
	})
}
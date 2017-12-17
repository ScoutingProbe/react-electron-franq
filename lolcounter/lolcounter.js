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
	// .then(write)
	// .then(inform)
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
//http://lolcounter.com/champions/aatrox/good <-no lane

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
		let lolcounter = {}
		let count = 0

		for(let identifier of identifiers){
			for(let relation of relations){
				for(let lane of lanes){
					request(win, identifier, relation, lane, lolcounter, resolve, count)
					.then(receiveResponse)
					.catch(error=>{
						reject(error)
					})
					
				}
			}
		}
	})
}

function request(win, identifier, relation, lane, lolcounter, finalResolve, count){
	return new Promise((resolve,reject)=>{
		let key = identifier['key']
		let id = identifier['id']

		let url = `http://lolcounter.com/champions/${key}/${relation}/${lane}`
		const request = http.request(url, response=>{
			let buffer = ''
			response.on('data', chunk=>{
				buffer += chunk
			})
			response.on('end', ()=>{
				console.log(url)
				resolve(new Array(win, identifier, relation, lane, lolcounter, finalResolve, count, buffer))
			})

		})
		request.on('error', error=>{
			reject(error)
		})
		request.end()
	})
}

function receiveResponse(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let identifier = a[1]
		let key = identifier['key']
		let id = identifier['id']
		let relation = a[2]
		let lane = a[3]
		let lolcounter = a[4]
		let finalResolve = a[5]
		let count = a[6]
		let response = a[7]

		let $ = cheerio.load(response)

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
			card['name'] = name[index]
			card['id'] = ids[index]
			card['upvote'] = upvotes[index]
			card['downvote'] = downvotes[index]
			deck.push(card)
		})

		lolcounter[id][relation][lane] = deck
		count++
		finalResolve(new Array(win, lolcounter))
		resolve()
	})
}


function generateMessage(a){
	return new Promise((resolve,reject)=>{
		let win = a[0]
		let lolcounter = a[1]
		console.log(lolcounter)
		console.log('trigger')
	})
	
}
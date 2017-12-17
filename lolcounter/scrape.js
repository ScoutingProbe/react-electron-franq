const cheerio = require('cheerio')
const http = require('http')
const fs = require('fs')
const dry = require('../back/dry.js')

module.exports.initial = function(){
	request()
	.then(receiveResponse)
	.catch(error=>{
		console.log(error)
	})
}

function request(){
	return new Promise((resolve,reject)=>{
		let url = 'http://lolcounter.com/champions/aatrox/good'

		const request = http.request(url, response=>{
			let buffer = ''
			response.on('data', chunk=>{
				buffer += chunk
			})
			response.on('end', ()=>{
				resolve(buffer)
			})

		})
		request.on('error', error=>{
			reject(error)
		})
		request.end()		
	})
}

function receiveResponse(response){
	return new Promise((resolve,reject)=>{
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
			card['name'] = names[index]
			card['id'] = ids[index]
			card['upvote'] = upvotes[index]
			card['downvote'] = downvotes[index]
			deck.push(card)
		})

		console.log(deck)
	})
}


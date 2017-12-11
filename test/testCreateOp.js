const assert = require('assert')
const {initial, stat, getLanes, modify, iterate, write, success, fail} = require('../op/createOp.js')

//https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Duckiee
//back:   backPass backReceive 
//front:  frontPass frontReceive
describe('createSummoner.js test', function(){

//backReceive:  window, summonerName, region
//request riotgames:  window, response
//store response: window
//backPass:  {none}
	it('backReceive', function(){
		backReceive({'window': null, 'summonerName': 'Duckiee', 'region': 'NA1'})
		.then((object)=>{
			assert(object['window'] === null)

			let response = {
							    "profileIconId": 518,
							    "name": "Duckiee",
							    "summonerLevel": 30,
							    "accountId": 38833060,
							    "id": 24481735,
							    "revisionDate": 1508158532000
							}
			response = JSON.stringify(response)
			assert(object['response'] === response)
		})

		backReceive({'window': null, 'summonerName': 'MistGunner', 'region': 'NA1'})
		.then((object)=>{
			assert(object['window'] === null)

			let response = {
							    "profileIconId": 3006,
							    "name": "MistGunner",
							    "summonerLevel": 30,
							    "accountId": 33316941,
							    "id": 20374342,
							    "revisionDate": 1508185812000
							}
			response = JSON.stringify(response)
			assert(object['response'] === response)
		})
	})
})


describe('createOp.js tests', function(){
	it('1 of 6 #stat', function(){
		assert(stat(null).then(null === null))
	})

	it('2 of 6 #getLanes', function(){
		getLanes(null).then((win,data)=>{
			assert(win === null)
			assert(data.jax === ['top', 'jungle']) 
		})
	})

	it('3 of 6 #modify', function(){
		getLanes(null).then(modify).then(array=>{
			let object = array[1]
			assert(Object.keys(object).includes('Jax'))
			assert(Object.values(object).includes({'top': [], 'jungle': []}))
		})
	})

	it('4 of 6 #iterate', function(){
		getLanes(null).then(modify).then(iterate).then(array=>{
			let object = array[1]
		})
	})
})


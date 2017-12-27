const fs = require('fs')

module.exports.RIOT_DEVELOPER_KEY = "RGAPI-2b7cbd7d-7c0d-4279-8447-b076f7d9e8ab"

module.exports.setRegion = function(region) {
	switch (region) {
		case "RU":
			return "ru.api.riotgames.com"
		case "KR":
			return "kr.api.riotgames.com"
		case "BR1":
			return "br1.api.riotgames.com"
		case "OC1":
			return "oc1.api.riotgames.com"
		case "JP1":
			return "jp1.api.riotgames.com"
		case "NA1":
			return "na1.api.riotgames.com"
		case "EUN1":
			return "eun1.api.riotgames.com"
		case "EUW1":
			return "euw1.api.riotgames.com"
		case "TR1":
			return "tr1.api.riotgames.com"
		case "LA1":
			return "la1.api.riotgames.com"
		case "LA2":
			return "la2.api.riotgames.com"
	}
}

module.exports.getId = function(name){
	let data = fs.readFileSync('./txt/champions.txt', 'utf-8')
	let keys = JSON.parse(data)['keys']

	name = name.replace(' ', '')
	name = name.replace('.', '')
	name = name.replace('\'', '') 
	name = name.toLowerCase()

	for(let id in keys){
		let key = keys[id].toLowerCase()
		if(name === key) return id
	}

	if(name === 'wukong') return 63

	throw new Error(`dry#getId ${name}`)	
}

module.exports.getKey = function(id){
	let data = fs.readFileSync('./txt/champions.txt', 'utf-8')
	let keys = JSON.parse(data)['keys']
	return keys[id]
}
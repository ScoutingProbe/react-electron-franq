class Summoner(){
	constructor(region, user, championPool){
		this.region = region
		this.user = user
		this.championPool = championPool
		console.log("summoner created");
	}

	getRegion(){
		return this.region
	}
	getUser(){
		return this.user
	}
	getChampionPool(){
		return this.championPool
	}
	setChampionPool(c){
		this.championPool = c
	}
}

module.exports.Summoner = Summoner
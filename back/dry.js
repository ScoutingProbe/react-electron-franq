module.exports.RIOT_DEVELOPER_KEY = "RGAPI-42b8a8d7-373e-4a0c-82a8-9f6794a47ebe"

module.exports.setRegion = function setRegion(region) {
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

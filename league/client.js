const fs = require('fs')

module.exports.initial = function initial(win){
	newest(win)
	.then(read)
	.catch(error=>{
		console.log(error)
	})

	//find newest file
	//read the file
	//send the message to front
	//close the json
	//send the json to front 

}

function newest(win){
	return new Promise((resolve,reject)=>{
		fs.watch('C:\\Riot Games\\League of Legends\\Logs\\LeagueClient Logs', (eventType, filename)=>{
			console.log(filename)
			console.log(eventType)
			if(filename.includes('LeagueClient.log')) resolve(filename)
			
		})
	})
}

function read(filename){
	console.log("called")
	return new Promise((resolve,reject)=>{
		filename = `C:\\Riot Games\\League of Legends\\Logs\\LeagueClient Logs\\${filename}`
		fs.readFile(filename,'utf-8', (error,data)=>{
			if(error) reject(error)
			else {
				let lines = data.split('\n')
				console.log(lines[lines.length - 3])
				console.log(lines[lines.length - 2])
				console.log(lines[lines.length - 1])
			}
		})
	})
}
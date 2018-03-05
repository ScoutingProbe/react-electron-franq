const os = require('os')
const child_process = require('child_process')
const fs = require('fs')

module.exports.initial = function(win){
	return new Promise((resolve,reject) => {


		child_process.exec(`wmic logicaldisk get name`, (error, stdout, stderr) => {
			if(error) 
				reject(error)

			let firstEmptyDriveIndex = -1
			let drives = stdout
							.split('\n')
							.map( (val, ind) => { 
								val = val.replace(/\r/gi, '')
										 .replace(/ /gi, '')
								if(val === '' &&
									firstEmptyDriveIndex === -1)
										firstEmptyDriveIndex = ind
								return val

							})
							.slice(1, firstEmptyDriveIndex)

			let riotLocation = ''
			let missCount = 0
			drives.map( drive => {
				let uri = drive + '\\Riot Games'
				fs.stat(uri, (error, stats) => {
					if(error) {
						console.log(`Riot Games not found in ${drive}`)
						missCount++
					}
					else {
						console.log(`Riot Games found in ${drive}`)
						riotLocation = uri + '\\Riot Games\\League of Legends\\Logs\\LeagueClient Logs'
						resolve(riotLocation)
					}

					if(error && 
						missCount === drives.length &&
						riotLocation === ''){
							let homedir = os.homedir()
							let homeDrive = homedir.slice(0,2)
							let program64 = homeDrive + '\\Program Files'
							let program32 = homeDrive + '\\Program Files (x86)'

							drives = new Array(program64, program32)

							missCount = 0
							drives.map( drive => {
								uri = drive + '\\Riot Games'
								fs.stat(uri, (error, stats) => {
									if(error){
										console.log(`Riot Games not found in ${drive}`)
										missCount++
									}
									else {
										console.log(`Riot Games found in ${drive}`)
										riotLocation = uri + '\\Riot Games\\League of Legends\\Logs\\LeagueClient Logs'
											resolve(riotLocation)
									}

									if(error && 
										missCount === drives.length &&
										riotLocation === '') {

									}
								})
							})

					}
				})
			})
		})
	})
}

module.exports.initial()
.catch(error => console.log(error))
.then()
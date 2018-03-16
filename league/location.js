const os = require('os')
const child_process = require('child_process')
const fs = require('fs')

module.exports.initial = function(){
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

			let homedir = os.homedir()
			drives.push(homedir)
			drives.push(homedir + '\\Saved Games')
			drives.push(homedir + '\\Desktop')

			let homeDrive = homedir.slice(0,2)
			drives.push(homeDrive + '\\Program Files')
			drives.push(homeDrive + '\\Program Files (x86)')

			drives.map( drive => {
				let uri = drive + '\\Riot Games'
				fs.stat(uri, (error, stats) => {
					if(error) 
						console.log(`Riot Games not found in ${drive}`)
					else {
						console.log(`Riot Games found in ${drive}`)
						let riotLocation = uri + '\\Riot Games\\League of Legends\\Logs\\LeagueClient Logs'
						resolve(riotLocation)
					}
				})
			})
		})
	})
}
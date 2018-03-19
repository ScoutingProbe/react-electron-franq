const fs = require('fs')
const child_process = require('child_process')
const Tail = require('tail').Tail

// C:\Riot Games\League of Legends
// C:\Riot Games\League of Legends\Logs\LeagueClient Logs\2017-05-30T20-51-06_6672_LeagueClient.log
// C:\\Users\\Andrew\\Desktop\\pickban\\league
// E:\\Riot Games\\League of Legends\\Logs\\LeagueClient Logs
// E:\Riot Games\League of Legends\Logs\LeagueClient Logs\2018-03-15T18-45-32_26288_LeagueClient.log
module.exports.initial = function initial(win, location){
	return new Promise((resolve,reject)=>{
		location = location.replace(/\\/g, '\\\\')

		let message = ''
		let client = ''
		let interval = 0

		let watcher = fs.watch(location, (event, file)=>{
			if(event.includes('error')) 
				reject(error)		

			if(file.includes('_LeagueClient.log') && 
				( event.includes('change') || event.includes('rename') ) ) {
					let path = `${location}\\\\${file}`

					let powershell_path = path.replace(/\\\\/g, '/')
					console.log(powershell_path)
					console.log(typeof powershell_path)


					// let child = child_process.spawn('powershell.exe', ['./notepadInterval.ps1', '-location', powershell_path])
					// child.stdout.on("data",function(data){
					// 	console.log("Powershell Data: " + data);
					// });
					// child.stderr.on("data",function(data){
					// 	console.log("Powershell Errors: " + data);
					// });
					// child.on("exit",function(){
					// 	console.log("Powershell Script finished");
					// });
					// child.stdin.end(); //end input

					let tail = new Tail(path)
					tail.on('error', error => console.log(error) )
					tail.on('line', line => {
						states.map( state => {
							if( line.includes(state) ){
								message = state
								console.log(state)
							}
						})



					})



			}
		}) //watcher end
	})


}



const states = [
	'app_start',
	'timer_login-rendered',
	'type: RECEIVE_SUCCESS',
	'timer_parties-enter-queue',
	'READY_CHECK_USER_DECLINED',
	'READY_CHECK_USER_ACCEPTED',
	'READY_CHECK_HIDE',
	'GAMEFLOW_EVENT.STRANGER_DODGED',
	'timer_champ-select-select-champion',
	'timer_champ-select-lock-in',
	'/lol-champ-select/v1/session: {',
	'Client is no longer running.',
	'app_terminate'
]

const intervalStates = [
	'timer_login-rendered',		//league locks logfiles: start interval
	'SAVE_SUCCESS',				//game start: end interval
	'app_terminate'				//duh: end interval
]


module.exports.initial(null, 'E:\\Riot Games\\League of Legends\\Logs\\LeagueClient Logs')
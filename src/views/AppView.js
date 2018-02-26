import Bans from '../containers/BansContainer.js'
import Control from '../containers/ControlContainer.js'
import ControlLeague from '../containers/ControlLeagueContainer.js'
import Display from '../containers/DisplayContainer.js'
import TheirTeam from '../containers/TheirTeamContainer.js'
import MyTeam from '../containers/MyTeamContainer.js'
import Settings from '../containers/SettingsContainer.js'
import ControlSettings from '../components/ControlSettingsComponent.js'
import React from 'react'
import '../css/App.css'

export default function AppView(props){
	return (
		<div id='app'>		
			<div id='controls'>
				<ControlLeague/>
				<ControlSettings {...props}/>
				<Control/>
			</div>
			<Settings {...props}/>
			<Bans {...props}/>
			<MyTeam {...props}/>
			<TheirTeam {...props}/>
			<Display {...props}/>
		</div>
	)
}
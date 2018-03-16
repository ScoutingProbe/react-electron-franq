import BansContainer from '../containers/BansContainer.js'
import ControlMinimizeCloseContainer from '../containers/ControlMinimizeCloseContainer.js'
import DisplayContainer from '../containers/DisplayContainer.js'
import TheirTeamContainer from '../containers/TheirTeamContainer.js'
import MyTeamContainer from '../containers/MyTeamContainer.js'
import SettingsContainer from '../containers/SettingsContainer.js'
import CommendComponent from '../components/CommendComponent.js'
import ControlRiotComponent from '../components/ControlRiotComponent.js'
import ControlLolcounterComponent from '../components/ControlLolcounterComponent.js'
import ControlLeagueComponent from '../components/ControlLeagueComponent.js'
import ControlSettingsComponent from '../components/ControlSettingsComponent.js'
import React from 'react'
import '../css/App.css'

export default function AppView(props){
	return (
		<div id='app'>
			<ControlLeagueComponent {...props}/>
			<div id='controls-top-right'>
				<ControlSettingsComponent/>
				<ControlMinimizeCloseContainer/>				
			</div>
			<div id='controls-bottom'>
				<ControlRiotComponent {...props}/>
				<ControlLolcounterComponent/>			
			</div>
			<SettingsContainer/>
			<CommendComponent {...props}/>
			<BansContainer/>
			<MyTeamContainer/>
			<TheirTeamContainer/>
		</div>
	)
}



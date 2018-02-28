import BansContainer from '../containers/BansContainer.js'
import ControlMinimizeCloseContainer from '../containers/ControlMinimizeCloseContainer.js'
import ControlLeagueContainer from '../containers/ControlLeagueContainer.js'
import DisplayContainer from '../containers/DisplayContainer.js'
import TheirTeamContainer from '../containers/TheirTeamContainer.js'
import MyTeamContainer from '../containers/MyTeamContainer.js'
import SettingsContainer from '../containers/SettingsContainer.js'
import ControlSettingsComponent from '../components/ControlSettingsComponent.js'
import React from 'react'
import '../css/App.css'

export default function AppView(props){
	return (
		<div id='app'>		
			<div id='controls'>
				<ControlLeagueContainer/>
				<ControlSettingsComponent/>
				<ControlMinimizeCloseContainer/>
			</div>
			<SettingsContainer/>
			<MyTeamContainer/>
			<TheirTeamContainer/>
			<DisplayContainer/>
			<BansContainer/>
		</div>
	)
}
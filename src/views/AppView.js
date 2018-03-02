import BansContainer from '../containers/BansContainer.js'
import ControlMinimizeCloseContainer from '../containers/ControlMinimizeCloseContainer.js'
import DisplayContainer from '../containers/DisplayContainer.js'
import TheirTeamContainer from '../containers/TheirTeamContainer.js'
import MyTeamContainer from '../containers/MyTeamContainer.js'
import SettingsContainer from '../containers/SettingsContainer.js'
import RecommendContainer from '../containers/RecommendContainer.js'
import ControlRiotComponent from '../components/ControlRiotComponent.js'
import ControlLolcounterComponent from '../components/ControlLolcounterComponent.js'
import ControlLeagueComponent from '../components/ControlLeagueComponent.js'
import ControlSettingsComponent from '../components/ControlSettingsComponent.js'
import React from 'react'
import '../css/App.css'

export default function AppView(props){
	return (
		<div id='app'>
			<div id='controls-left'>
				<ControlSettingsComponent/>
				<ControlMinimizeCloseContainer/>				
			</div>
			<div id='controls-right'>
				<ControlLeagueComponent/>
				<ControlRiotComponent/>
				<ControlLolcounterComponent/>			
			</div>
			<SettingsContainer/>
			<RecommendContainer/>
			<MyTeamContainer/>
			<TheirTeamContainer/>
			<DisplayContainer/>
			<BansContainer/>
		</div>
	)
}
import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Bans from '../components/Bans.js'
import Control from '../components/Control.js'
import ControlLeague from '../components/ControlLeague.js'
import Display from '../components/Display.js'
import TheirTeam from '../components/TheirTeam.js'
import MyTeam from '../components/MyTeam.js'
import Settings from '../components/Settings.js'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'

import '../css/App.css'

// christian sepulveda hack
const electron = window.require('electron');
// const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;
// end hack

window.require('electron-react-devtools').install()

class App extends Component {
	render() {
		return (
			<div id='app'>		
				<div id='controls'>
					<ControlLeague/>
					<Control alt='settings'/>
					<Control alt='minimize'/>
					<Control alt='close'/>
				</div>
				<Settings/>
				<Bans/>
				<MyTeam/>
				<TheirTeam/>
				<Display/>

			</div>
		);
	}

	static getStores(){
		return [
			LanguageStore,
			RegionStore,
			ClientStore
		]
	}

	static calculateState(prevState){
		return{
			language: LanguageStore.getState(),
			region: RegionStore.getState(),
			client: ClientStore.getState(),
			onWatch: Actions.watch,
			onUnwatch: Actions.unwatch,
			onGoIndex: Actions.goIndex,
			onGoSettings: Actions.goSettings,
			onChangeLanguage: Actions.changeLanguage,
			onChangeRegion: Actions.changeRegion
		}		
	}
}


export default Container.create(App)
import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import LolStaticDataStore from '../stores/LolStaticDataStore.js'
import watchLeague from '../png/league.png'
import unwatchLeague from '../png/cancel.png'
import $ from 'jquery'

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer

class ControlLeagueComponent extends Component{
	render(){
		return(
			<div id='league'>	
				<input id='watch' className='control' type='image' src={watchLeague} 
					onClick={this.watch} alt='watch'/>
				<input id='unwatch' className='control' type='image' src={unwatchLeague} 
					onClick={this.unwatch} style={{display:'none'}} alt='unwatch'/>	
				<span className='control'> i will update you on messages received from the league client</span>
			</div>
		)
	}

	static getStores(){
		return [
			LanguageStore,
			RegionStore,
			ClientStore,
			LolStaticDataStore
		]
	}

	static calculateState(previous){
		return{
			language: LanguageStore.getState(),
			region: RegionStore.getState(),
			client: ClientStore.getState(),
			lolStaticData: LolStaticDataStore.getState(),
			onWatch: Actions.watch,
			onUnwatch: Actions.unwatch,
			onGoIndex: Actions.goIndex,
			onGoSettings: Actions.goSettings,
			onChangeLanguage: Actions.changeLanguage,
			onChangeRegion: Actions.changeRegion
		}		
	}

	watch(){
		$('#watch').hide()
		$('#unwatch').show()
	}

	unwatch(){
		$('#watch').show()
		$('#unwatch').hide()
	}	
}



export default Container.create(ControlLeagueComponent)
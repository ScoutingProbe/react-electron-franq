import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import LolStaticDataStore from '../stores/LolStaticDataStore.js'
import riot from '../png/riot.jpg'
import $ from 'jquery'

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer

class ControlRiotComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.onClickRiot = this.onClickRiot.bind(this)
	}

	onClickRiot(){
	}

	render(){
		return(
			<div id='riot'>
				<input className='control' type='image' src={riot}
					alt='riotgames' onClick={this.onClickRiot}/>
				<span> i will update you on messages received from the league client</span>
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

}

export default Container.create(ControlRiotComponent)
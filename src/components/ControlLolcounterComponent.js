import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import LolStaticDataStore from '../stores/LolStaticDataStore.js'
import lolcounter from '../png/lolcounter.ico'
import $ from 'jquery'

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer

class ControlLolcounterComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.onClickLolcounter = this.onClickLolcounter.bind(this)
	}

	onClickLolcounter(){
	}

	render(){
		return(
			<div id='lolcounter'>
				<input className='control' type='image' src={lolcounter}
					alt='settings' onClick={this.onClickLolcounter}/>
				<span>I will update you with messages recieved from lolcounter</span>
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

export default Container.create(ControlLolcounterComponent)
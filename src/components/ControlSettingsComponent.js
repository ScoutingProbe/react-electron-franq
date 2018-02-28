import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import settings from '../png/settings.png'
import $ from 'jquery'

class ControlSettingsComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.onClickSettings = this.onClickSettings.bind(this)
	}

	onClickSettings(){
		switch($('#settings').css('display')){
			case 'none':
				$('#settings').show()
				$('#bans').hide()
				$('#my-team').hide()
				$('#their-team').hide()
				$('#display').hide()
				break
			default:
				$('#settings').hide()
				$('#bans').show()
				$('#my-team').show()
				$('#their-team').show()
				$('#display').show()
		}
		let language = $('input[name=language]:checked').id
		let region = $('input[name=region]:checked').id

		if(language)
			this.props.onChangeLanguage(language)
		if(region)
			this.props.onChangeRegion(region)
	}

	render(){
		return(
			<input className='control' type='image' src={settings}
				alt='settings' onClick={this.onClickSettings}/>
		)
	}
	
	static getStores(){
		return [
			LanguageStore,
			RegionStore,
			ClientStore
		]
	}

	static calculateState(previous){
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

export default Container.create(ControlSettingsComponent)
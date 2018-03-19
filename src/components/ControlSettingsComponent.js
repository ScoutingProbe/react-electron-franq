import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'
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
				$('#recommend').hide()
				break
			default:
				$('#settings').hide()
				$('#bans').show()
				$('#my-team').show()
				$('#their-team').show()
				$('#display').show()
				$('#recommend').show()
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
		return getStores()
	}

	static calculateState(previous){
		return calculateState(previous)	
	}

}

export default Container.create(ControlSettingsComponent)
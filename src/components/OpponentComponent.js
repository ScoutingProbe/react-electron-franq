import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import $ from 'jquery'

class MateComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		console.log(props)
	}

	render(){
		return(
			<div className='opponent'>
				<p>{this.props.championId === 0 ? '' : 'selected ' + this.props.championId} 
					{this.props.championPickIntent === 0 ? '' : 'hovered ' + this.props.championPickIntent}
				</p>
			</div>
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

export default Container.create(MateComponent)

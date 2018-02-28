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
	}

	render(){
		return(
			<div className='mate'>
				<button>
					{this.props.displayName}
					{this.props.championId === 0 ? '' : ' selects ' + this.props.championId} 
					{this.props.championPickIntent === 0 ? '' : ' hovers ' + this.props.championPickIntent}
				</button>
				<p>{this.props.assignedPosition}</p>
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

import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import LolStaticDataStore from '../stores/LolStaticDataStore.js'

class MateComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
	}

	render(){
		return(
			<div className='mate'>
				<div>
					<p>Silver V: 100 lp</p>
					<button style={{display:'block'}}>
						{this.props.displayName} is {this.props.assignedPosition}
					</button>
				</div>
				
				{this.props.championId === 0 ? 
					<p></p> : 
					<div>
						<button>{this.state.lolStaticData.getChampionName(this.props.championId)} select</button>
						<p>Level 7: 500games</p>
					</div>
				} 
				{this.props.championPickIntent === 0 ? 
					<p></p> : 
					<div>
						<button>{this.state.lolStaticData.getChampionName(this.props.championPickIntent)} hover</button>
						<p>Level 7: 500games</p>
					</div>	
				}

							
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

export default Container.create(MateComponent)

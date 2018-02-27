import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import $ from 'jquery'

class RegionComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.regionChange = this.regionChange.bind(this)

	}

	regionChange(event){
		this.props.onChangeRegion(event.currentTarget.id)
	}

	render(){
		return(
			<div id='region'>
				<p className='en'>Enter region</p>
				<p className='kr'>지역 입력</p>
				<p className='cn'>输入地区</p>
				<p className='sp'>Entrar en la región</p>
				<p className='po'>Inserir região</p>
				<input type='radio' name='region' id='RU'
						onChange={this.regionChange}
						checked={this.props.region === 'RU'}/>
				<label>RU</label>
				<input type='radio' name='region' id='KR'
						onChange={this.regionChange}
						checked={this.props.region === 'KR'}/>
				<label>KR</label>
				<input type='radio' name='region' id='BR1'
						onChange={this.regionChange}
						checked={this.props.region === 'BR1'}/>
				<label>BR1</label>
				<input type='radio' name='region' id='OC1'
						onChange={this.regionChange}
						checked={this.props.region === 'OC1'}/>
				<label>OC1</label>
				<input type='radio' name='region' id='JP1'
						onChange={this.regionChange}
						checked={this.props.region === 'JP1'}/>
				<label>JP1</label>
				<input type='radio' name='region' id='NA1'
						onChange={this.regionChange}
						checked={this.props.region === 'NA1'}/>
				<label>NA1</label>
				<input type='radio' name='region' id='EUN1'
						onChange={this.regionChange}
						checked={this.props.region === 'EUN1'}/>
				<label>EUN1</label>
				<input type='radio' name='region' id='EUW1'
						onChange={this.regionChange}
						checked={this.props.region === 'EUW1'}/>
				<label>EUW1</label>
				<input type='radio' name='region' id='TR1'
						onChange={this.regionChange}
						checked={this.props.region === 'TR1'}/>
				<label>TR1</label>
				<input type='radio' name='region' id='LA1'
						onChange={this.regionChange}
						checked={this.props.region === 'LA1'}/>
				<label>LA1</label>
				<input type='radio' name='region' id='LA2'
						onChange={this.regionChange}
						checked={this.props.region === 'LA2'}/>
				<label>LA2</label>
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

export default Container.create(RegionComponent)
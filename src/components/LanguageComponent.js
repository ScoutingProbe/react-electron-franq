import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import $ from 'jquery'

class LanguageComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.languageChange = this.languageChange.bind(this)

	}

	languageChange(event){
		this.props.onChangeLanguage(event.currentTarget.id)
	}

	render(){
		let language = $('input[name=language]:checked').prop('id')
		return(
			<div id='language'>
				<p className='en'>Enter your language</p>
				<p className='kr'>당신의 언어를 입력하십시오</p>
				<p className='cn'>输入你的语言</p>
				<p className='sp'>Ingrese su idioma</p>
				<p className='po'>Digite seu idioma</p>

				<input type='radio' name='language' id='english'
				onChange={this.languageChange} 
				checked={language === 'english'}/>
				<label>English</label>

				<input type='radio' name='language' id='korean'
				onChange={this.languageChange} 
				checked={language === 'korean'}/>
				<label>한국어</label>

				<input type='radio' name='language' id='chinese' 
				onChange={this.languageChange} 
				checked={language === 'chinese'}/>
				<label>中文</label>

				<input type='radio' name='language' id='spanish'
				onChange={this.languageChange} 
				checked={language === 'spanish'}/>
				<label>Español</label>

				<input type='radio' name='language' id='portuguese'
				onChange={this.languageChange} 
				checked={language === 'portuguese'}/>
				<label>Português</label>
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

export default Container.create(LanguageComponent)
import React, {Component} from 'react'
import {Container} from 'flux/utils'
import LanguageStore from '../stores/LanguageStore.js'
import ClientStore from '../stores/ClientStore.js'
import RegionStore from '../stores/RegionStore.js'
import Actions from '../actions/Actions.js'

class Settings extends Component{
	static getStores(){
		return [ClientStore, LanguageStore, RegionStore]
	}

	static calculateState(prevState){
		return {
			client: ClientStore.getState(),
			language: LanguageStore.getState(),
			region: RegionStore.getState()
		}
	}
	render(){
		let language = LanguageStore.getState()
		let region = RegionStore.getState()

		return(
			<div id='settings'>
				<div id='language'>
					<p>I need the language you read</p>
					<input type='radio' name='language' onClick={this.languageClicker} id='english'/>
					<label>English</label>
					<input type='radio' name='language' onClick={this.languageClicker} id='korean'/>
					<label>한국어</label>
					<input type='radio' name='language' onClick={this.languageClicker} id='chinese'/>
					<label>中文</label>
					<input type='radio' name='language' onClick={this.languageClicker} id='spanish'/>
					<label>Español</label>
					<input type='radio' name='language' onClick={this.languageClicker} id='portuguese'/>
					<label>Português</label>
				</div>
				<div id='region'>
					<p>I need the region you play league on</p>
					<input type='radio' name='region' id='RU'/>
					<label>RU</label>
					<input type='radio' name='region' id='KR'/>
					<label>KR</label>
					<input type='radio' name='region' id='BR1'/>
					<label>BR1</label>
					<input type='radio' name='region' id='OC1'/>
					<label>OC1</label>
					<input type='radio' name='region' id='JP1'/>
					<label>JP1</label>
					<input type='radio' name='region' id='NA1'/>
					<label>NA1</label>
					<input type='radio' name='region' id='EUN1'/>
					<label>EUN1</label>
					<input type='radio' name='region' id='EUW1'/>
					<label>EUW1</label>
					<input type='radio' name='region' id='TR1'/>
					<label>TR1</label>
					<input type='radio' name='region' id='LA1'/>
					<label>LA1</label>
					<input type='radio' name='region' id='LA2'/>
					<label>LA2</label>
				</div>
				<p>I will look for lolcounter</p>
				<p>You speak {language} and you play on {region}</p>
			</div>
		)
	}

	languageClicker(){
		let language = document.querySelector('input[name=language]:checked').id
		Actions.changeLanguage(language)
	}
}

export default Container.create(Settings)
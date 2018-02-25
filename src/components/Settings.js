import React, {Component} from 'react'
import {Container} from 'flux/utils'
import LanguageStore from '../stores/LanguageStore.js'
import ClientStore from '../stores/ClientStore.js'
import RegionStore from '../stores/RegionStore.js'
import Actions from '../actions/Actions.js'
import $ from 'jquery'

class Settings extends Component{
	componentDidMount(){
		console.log(`${LanguageStore.getState()} ${RegionStore.getState()}`)
		switch(LanguageStore.getState()){
			case 'korean':
				document.getElementById('korean').checked = true
				break
			case 'chinese':
				document.getElementById('chinese').checked = true
				break
			case 'spanish':
				document.getElementById('spanish').checked = true
				break
			case 'portuguese':
				document.getElementById('portuguese').checked = true
				break
			default:
				document.getElementById('english').checked = true
		}

		switch(RegionStore.getState()){
			case 'RU':
				document.getElementById('RU').checked = true
				break
			case 'KR':
				document.getElementById('KR').checked = true
				break
			case 'BR1':
				document.getElementById('BR1').checked = true
				break
			case 'OC1':
				document.getElementById('OC1').checked = true
				break
			case 'JP1':
				document.getElementById('JP1').checked = true
				break
			case 'EUN1':
				document.getElementById('EUN1').checked = true
				break
			case 'EUW1':
				document.getElementById('EUW1').checked = true
				break
			case 'TR1':
				document.getElementById('TR1').checked = true
				break
			case 'LA1':
				document.getElementById('LA1').checked = true
				break
			case 'LA2':
				document.getElementById('LA2').checked = true
				break
			default:
				document.getElementById('NA1').checked = true
		}

		switch(LanguageStore.getState()){
			default:
				$('.en').show()
				$('.kr').hide()
				$('.cn').hide()
				$('.sp').hide()
				$('.po').hide()
				break
			case 'korean':
				$('.en').hide()
				$('.kr').show()
				$('.cn').hide()
				$('.sp').hide()
				$('.po').hide()			
				break
			case 'chinese':
				$('.en').hide()
				$('.kr').hide()
				$('.cn').show()
				$('.sp').hide()
				$('.po').hide()
				break
			case 'spanish':
				$('.en').hide()
				$('.kr').hide()
				$('.cn').hide()
				$('.sp').show()
				$('.po').hide()
				break
			case 'portuguese':
				$('.en').hide()
				$('.kr').hide()
				$('.cn').hide()
				$('.sp').hide()
				$('.po').show()
				break
		}		
	}

	render(){
		return(
			<div id='settings'>
				<div id='language'>
					<p className='en'>Enter your language</p>
					<p className='kr'>당신의 언어를 입력하십시오</p>
					<p className='cn'>输入你的语言</p>
					<p className='sp'>Ingrese su idioma</p>
					<p className='po'>Digite seu idioma</p>
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
					<p className='en'>Enter region</p>
					<p className='kr'>지역 입력</p>
					<p className='cn'>输入地区</p>
					<p className='sp'>Entrar en la región</p>
					<p className='po'>Inserir região</p>
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
				<p>{LanguageStore.getState()} {RegionStore.getState()}</p>
				<input type='button' id='save' onClick={this.saveClicker} value='save'/>
			</div>
		)
	}

	languageClicker(){
		let language = document.querySelector('input[name=language]:checked').id
		LanguageStore.reduce(language, 'change-language')
	}

	saveClicker(){
		document.getElementById('settings').style.display = 'none'
		document.getElementById('bans').style.display = 'block'
		document.getElementById('left').style.display = 'block'
		document.getElementById('center').style.display = 'block'
		document.getElementById('right').style.display = 'block'
	}

	static getStores(){
		return [LanguageStore, ClientStore, RegionStore]
	}

	static calculateState(prevState){
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

export default Container.create(Settings)
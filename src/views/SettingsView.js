import React, {Component} from 'react'
import LanguageComponent from '../components/LanguageComponent.js'
import $ from 'jquery'

export default function SettingsView(props){
	return(
		<div style={{display:'none'}} id='settings'>
			<Region {...props}/>
			<LanguageComponent {...props}/>
			<Save {...props}/>
		</div>
	)
}

function Language(props){
	return(
		<div id='language'>
			<p className='en'>Enter your language</p>
			<p className='kr'>당신의 언어를 입력하십시오</p>
			<p className='cn'>输入你的语言</p>
			<p className='sp'>Ingrese su idioma</p>
			<p className='po'>Digite seu idioma</p>
			<input type='radio' name='language' onClick={languageClicker} id='english'/>
			<label>English</label>
			<input type='radio' name='language' onClick={languageClicker} id='korean'/>
			<label>한국어</label>
			<input type='radio' name='language' onClick={languageClicker} id='chinese'/>
			<label>中文</label>
			<input type='radio' name='language' onClick={languageClicker} id='spanish'/>
			<label>Español</label>
			<input type='radio' name='language' onClick={languageClicker} id='portuguese'/>
			<label>Português</label>
		</div>
	)
}

function languageClicker(){
	console.log(this)
}



function Region(props){
	return(
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
	)
}

function Save(props){
	// let language = $('input[name=language]:checked').prop('id')
	// let region = $('input[name=region]:checked').prop('id')

	return (
		<div>
			<input type='button' id='save' onClick={saveClicker} value='save'/>
			<span>{props.language} {props.region}</span>
		</div>
	)
}

function saveClicker(props){
	$('#settings').hide()
	$('#bans').show()
	$('#left').show()
	$('#center').show()
	$('#right').show()
}

function componentDidMount(){
	switch(this.state.language){
		case 'korean':
			$('korean').checked = true
			break
		case 'chinese':
			$('chinese').checked = true
			break
		case 'spanish':
			$('spanish').checked = true
			break
		case 'portuguese':
			$('portuguese').checked = true
			break
		default:
			$('english').checked = true
	}

	switch(this.state.language){
		case 'RU':
			$('#RU').checked = true
			break
		case 'KR':
			$('#KR').checked = true
			break
		case 'BR1':
			$('#BR1').checked = true
			break
		case 'OC1':
			$('#OC1').checked = true
			break
		case 'JP1':
			$('#JP1').checked = true
			break
		case 'EUN1':
			$('#EUN1').checked = true
			break
		case 'EUW1':
			$('#EUW1').checked = true
			break
		case 'TR1':
			$('#TR1').checked = true
			break
		case 'LA1':
			$('#LA1').checked = true
			break
		case 'LA2':
			$('#LA2').checked = true
			break
		default:
			$('#NA1').checked = true
	}	
}
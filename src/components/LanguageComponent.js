import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'
import $ from 'jquery'

class LanguageComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.languageChange = this.languageChange.bind(this)

	}

	languageChange(event){
		console.log(event.currentTarget.id)
		console.log(this.props.onChangeLanguage)
		switch(event.currentTarget.id){
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

		this.props.onChangeLanguage(event.currentTarget.id)
	}

	render(){
		return(
			<div id='language'>
				<p className='en'>Enter your language</p>
				<p className='kr'>당신의 언어를 입력하십시오</p>
				<p className='cn'>输入你的语言</p>
				<p className='sp'>Ingrese su idioma</p>
				<p className='po'>Digite seu idioma</p>

				<input type='radio' name='language' id='english'
				onChange={this.languageChange} 
				checked={this.props.language === 'english'}/>
				<label>English</label>

				<input type='radio' name='language' id='korean'
				onChange={this.languageChange} 
				checked={this.props.language === 'korean'}/>
				<label>한국어</label>

				<input type='radio' name='language' id='chinese' 
				onChange={this.languageChange} 
				checked={this.props.language === 'chinese'}/>
				<label>中文</label>

				<input type='radio' name='language' id='spanish'
				onChange={this.languageChange} 
				checked={this.props.language === 'spanish'}/>
				<label>Español</label>

				<input type='radio' name='language' id='portuguese'
				onChange={this.languageChange} 
				checked={this.props.language === 'portuguese'}/>
				<label>Português</label>
			</div>
		)
	}

	static getStores(){
		return getStores()
	}

	static calculateState(previous){
		return calculateState(previous)	
	}

}

export default Container.create(LanguageComponent)
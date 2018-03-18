import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'

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
				<label htmlFor='RU'>RU</label>
				<input type='radio' name='region' id='KR'
						onChange={this.regionChange}
						checked={this.props.region === 'KR'}/>
				<label htmlFor='KR'>KR</label>
				<input type='radio' name='region' id='BR1'
						onChange={this.regionChange}
						checked={this.props.region === 'BR1'}/>
				<label htmlFor='BR1'>BR1</label>
				<input type='radio' name='region' id='OC1'
						onChange={this.regionChange}
						checked={this.props.region === 'OC1'}/>
				<label htmlFor='OC1'>OC1</label>
				<input type='radio' name='region' id='JP1'
						onChange={this.regionChange}
						checked={this.props.region === 'JP1'}/>
				<label htmlFor='JP1'>JP1</label>
				<input type='radio' name='region' id='NA1'
						onChange={this.regionChange}
						checked={this.props.region === 'NA1'}/>
				<label htmlFor='NA1'>NA1</label>
				<input type='radio' name='region' id='EUN1'
						onChange={this.regionChange}
						checked={this.props.region === 'EUN1'}/>
				<label htmlFor='EUN1'>EUN1</label>
				<input type='radio' name='region' id='EUW1'
						onChange={this.regionChange}
						checked={this.props.region === 'EUW1'}/>
				<label htmlFor='EUW1'>EUW1</label>
				<input type='radio' name='region' id='TR1'
						onChange={this.regionChange}
						checked={this.props.region === 'TR1'}/>
				<label htmlFor='TR1'>TR1</label>
				<input type='radio' name='region' id='LA1'
						onChange={this.regionChange}
						checked={this.props.region === 'LA1'}/>
				<label htmlFor='LA1'>LA1</label>
				<input type='radio' name='region' id='LA2'
						onChange={this.regionChange}
						checked={this.props.region === 'LA2'}/>
				<label htmlFor='LA2'>LA2</label>
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

export default Container.create(RegionComponent)
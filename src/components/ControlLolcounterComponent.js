import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'
import lolcounter from '../png/lolcounter.ico'

class ControlLolcounterComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.onClickLolcounter = this.onClickLolcounter.bind(this)
	}

	onClickLolcounter(){
	}

	render(){
		return(
			<div id='lolcounter'>
				<input className='control' type='image' src={lolcounter}
					alt='settings' onClick={this.onClickLolcounter}/>
				<span>I will update you with messages recieved from lolcounter</span>
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

export default Container.create(ControlLolcounterComponent)
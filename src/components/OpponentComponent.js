import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'

class MateComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
	}

	render(){
		return(
			<div className='opponent'>
				<p>{this.props.championId === 0 ? '' : 'selected ' + this.props.championId} 
					{this.props.championPickIntent === 0 ? '' : 'hovered ' + this.props.championPickIntent}
				</p>
			</div>
		)
	}

	static getStores(){
		return getStores()
	}

	static calculateState(previous){
		return calculateState()	
	}
}

export default Container.create(MateComponent)

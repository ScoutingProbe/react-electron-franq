import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'

class OpponentComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
	}

	render(){
		return(
			<div className='opponent'>
				<p>
					{this.props.championId === 0 ? '' : 'selected ' + this.state.lolStaticData.getChampionName(this.props.championId)} 
					{this.props.championPickIntent === 0 ? '' : 'hovered ' + this.state.lolStaticData.getChampionName(this.props.championPickIntent)}
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

export default Container.create(OpponentComponent)

import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from '../components/utils.js'

class BanComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
	}

	render(){
		return (
			<p className='ban'>
				ban {this.props.completed ? this.state.lolStaticData.getChampionName(this.props.championId) : ''}
			</p>
		)
	}

	static getStores(){
		return getStores()
	}

	static calculateState(previous){
		return calculateState(previous)
	}
}

export default Container.create(BanComponent)
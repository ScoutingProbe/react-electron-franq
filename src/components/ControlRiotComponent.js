import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'
import riot from '../png/riot.jpg'

const {ipcRenderer} = window.require('electron')

class ControlRiotComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
		this.onClickRiot = this.onClickRiot.bind(this)
		this.onClickRiot()
	}

	onClickRiot(){
		ipcRenderer.send('most-mains', this.props.client.myTeam)
		ipcRenderer.send('most-games', this.props.client.myTeam)
		ipcRenderer.send('most-rank', this.props.client.myTeam)
		ipcRenderer.send('most-early-pick', this.props.client.myTeam)
		ipcRenderer.send('commend-mate', this.props.client.myTeam)
		ipcRenderer.send('commend-bans', this.props.client.myTeam, this.props.client.actions)
		ipcRenderer.send('commend-picks', this.props.client.myTeam, this.props.client.theirTeam, this.props.client.actions)
	}

	render(){
		return(
			<div id='riot'>
				<input className='control' type='image' src={riot}
					alt='riotgames' onClick={this.onClickRiot}/>
				<span> i will update you on messages received from the league client</span>
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

export default Container.create(ControlRiotComponent)
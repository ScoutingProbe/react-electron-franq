import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'
import watchLeague from '../png/league.png'
import unwatchLeague from '../png/cancel.png'
import $ from 'jquery'

const {ipcRenderer} = window.require('electron')

class ControlLeagueComponent extends Component{
	watch(){
		$('#watch').hide()
		$('#unwatch').show()
		ipcRenderer.send('location')
	}

	unwatch(){
		$('#watch').show()
		$('#unwatch').hide()
	}
	
	render(){
		return(
			<div id='controls-top-left'>	
				<input id='watch' className='control' type='image' src={watchLeague} 
					onClick={this.watch} alt='watch'/>
				<input id='unwatch' className='control' type='image' src={unwatchLeague} 
					onClick={this.unwatch} style={{display:'none'}} alt='unwatch'/>	
				<p id='league'>i will update you on messages received from the league client</p>
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

export default Container.create(ControlLeagueComponent)
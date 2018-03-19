import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'
import watchLeague from '../png/league.png'
import unwatchLeague from '../png/cancel.png'
import $ from 'jquery'

const {ipcRenderer} = window.require('electron')

class ControlLeagueComponent extends Component{
	constructor(props){
		super(props)
		this.render = this.render.bind(this)
		this.watch = this.watch.bind(this)
		this.unwatch = this.unwatch.bind(this)
	}

	watch(){
		$('#watch').hide()
		$('#unwatch').show()
		$('#league').text(`Watching ${this.props.location}`)
		ipcRenderer.send('client-watch', this.props.location)
	}

	unwatch(){
		$('#watch').show()
		$('#unwatch').hide()
		$('#league').text(`Stopped watching`)
		ipcRenderer.send('client-unwatch', this.props.location)
	}
	
	render(){
		return(
			<div id='controls-top-left'>	
				<input id='watch' className='control' type='image' src={watchLeague} 
					onClick={this.watch} alt='watch'/>
				<input id='unwatch' className='control' type='image' src={unwatchLeague} 
					onClick={this.unwatch} style={{display:'none'}} alt='unwatch'/>	
				<p id='league'>Click to start watching for new league game</p>
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
import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from '../components/utils.js'

// christian sepulveda hack
// const electron = window.require('electron')
// const ipcRenderer  = electron.ipcRenderer
// // end hack
// const fs = electron.remote.require('fs')
// import {ipcRenderer} from 'electron'

class CommendComponent extends Component {
	render(){
		return (
			<div id='recommend'>
				<p>most mains </p>
				<p>most games </p>
				<p>most rank</p>
				<p>most early pick</p>
				<p>commend mate</p>
				<p>commend bans</p>
				<p>commend picks </p>
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

export default Container.create(CommendComponent)


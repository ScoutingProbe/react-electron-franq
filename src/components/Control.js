import React, {Component} from 'react'
import settings from '../png/settings.png'
import minimize from '../png/minimize.png'
import close from '../png/close.png'
import $ from 'jquery'

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer;

export default class Control extends Component{
	componentDidMount(){
		document.getElementById('settings').style.display = 'none'
	}
	
	render(){
		let clicker = null
		let button = null
		switch(this.props.alt){
			case 'close':
				clicker = onClickClose
				button = close
				break
			case 'minimize':
				clicker = onClickMinimize
				button = minimize
				break
			case 'settings':
				clicker = onClickSettings
				button = settings
				break
			default:
				break
		}

		return(
			<input className='control' type='image' src={button} 
				alt={this.props.alt} onClick={clicker}/>
		)
	}
}

function onClickClose(){
	ipcRenderer.send('close')
}

function onClickMinimize(){
	ipcRenderer.send('minimize')
}

function onClickSettings(){
	switch(document.getElementById('settings').style.display){
		case 'none':
			document.getElementById('settings').style.display = 'block'
			document.getElementById('bans').style.display = 'none'
			document.getElementById('left').style.display = 'none'
			document.getElementById('center').style.display = 'none'
			document.getElementById('right').style.display = 'none'
			break
		default:
			document.getElementById('settings').style.display = 'none'
			document.getElementById('bans').style.display = 'block'
			document.getElementById('left').style.display = 'block'
			document.getElementById('center').style.display = 'block'
			document.getElementById('right').style.display = 'block'
	}

	ipcRenderer.send('settings')
}


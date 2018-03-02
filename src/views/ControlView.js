import React from 'react'

import minimize from '../png/minimize.png'
import close from '../png/close.png'
import riot from '../png/riot.jpg'
import lolcounter from '../png/lolcounter.ico'

// christian sepulveda hack
const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer
// // end hack
// const fs = electron.remote.require('fs')
// import {ipcRenderer} from 'electron'

export default function ControlView(props){
	return(
		<div>
			<input className='control' type='image' src={minimize}
				alt='minimize' onClick={onClickMinimize}/>				
			<input className='control' type='image' src={close} 
				alt='close' onClick={onClickClose}/>			
		</div>
	)
}

function onClickClose(){
	ipcRenderer.send('close')
}

function onClickMinimize(){
	ipcRenderer.send('minimize')
}
import React from 'react'

import minimize from '../png/minimize.png'
import close from '../png/close.png'

// const electron = window.require('electron')
// const ipcRenderer  = electron.ipcRenderer;

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
	window.ipcRenderer.send('close')
}

function onClickMinimize(){
	window.ipcRenderer.send('minimize')
}

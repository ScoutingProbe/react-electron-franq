import React from 'react'

import minimize from '../png/minimize.png'
import close from '../png/close.png'

const {ipcRenderer} = window.require('electron')

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
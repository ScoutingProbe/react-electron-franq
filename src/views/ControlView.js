import React from 'react'
import settings from '../png/settings.png'
import minimize from '../png/minimize.png'
import close from '../png/close.png'
import $ from 'jquery'
const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer;

export default function ControlView(props){
	return(
		<div>
			<input className='control' type='image' src={close} 
				alt='close' onClick={onClickClose}/>
			<input className='control' type='image' src={minimize}
				alt='minimize' onClick={onClickMinimize}/>
			<input className='control' type='image' src={settings}
				alt='settings' onClick={onClickSettings}/>
		</div>
	)
}

function onClickClose(){
	ipcRenderer.send('close')
}

function onClickMinimize(){
	ipcRenderer.send('minimize')
}

function onClickSettings(){
	switch($('#settings').css('display')){
		case 'none':
			$('#settings').show()
			$('#bans').hide()
			$('#left').hide()
			$('#center').hide()
			$('#right').hide()
			break
		default:
			$('#settings').hide()
			$('#bans').show()
			$('#left').show()
			$('#center').show()
			$('#right').show()
	}
}


import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import AppContainer from './containers/AppContainer.js';
import LanguageStore from './stores/LanguageStore.js'
import registerServiceWorker from './registerServiceWorker.js';
import $ from 'jquery'

// christian sepulveda hack
// const electron = window.require('electron');
// const fs = electron.remote.require('fs');
// const ipcRenderer  = electron.ipcRenderer;
// end hack

window.require('electron-react-devtools').install()

ReactDOM.render(<AppContainer />, document.getElementById('root'));
registerServiceWorker();

switch(LanguageStore.getState()){
	default:
		$('.en').show()
		$('.kr').hide()
		$('.cn').hide()
		$('.sp').hide()
		$('.po').hide()
		break
	case 'korean':
		$('.en').hide()
		$('.kr').show()
		$('.cn').hide()
		$('.sp').hide()
		$('.po').hide()			
		break
	case 'chinese':
		$('.en').hide()
		$('.kr').hide()
		$('.cn').show()
		$('.sp').hide()
		$('.po').hide()
		break
	case 'spanish':
		$('.en').hide()
		$('.kr').hide()
		$('.cn').hide()
		$('.sp').show()
		$('.po').hide()
		break
	case 'portuguese':
		$('.en').hide()
		$('.kr').hide()
		$('.cn').hide()
		$('.sp').hide()
		$('.po').show()
		break
}


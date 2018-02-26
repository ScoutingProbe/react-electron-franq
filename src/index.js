import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import AppContainer from './containers/AppContainer.js';
import registerServiceWorker from './registerServiceWorker.js';

// christian sepulveda hack
// const electron = window.require('electron');
// const fs = electron.remote.require('fs');
// const ipcRenderer  = electron.ipcRenderer;
// end hack

window.require('electron-react-devtools').install()

ReactDOM.render(<AppContainer />, document.getElementById('root'));
registerServiceWorker();

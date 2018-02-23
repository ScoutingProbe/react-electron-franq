import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/App.js';
import registerServiceWorker from './registerServiceWorker.js';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

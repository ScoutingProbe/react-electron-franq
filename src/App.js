import React, { Component } from 'react'
import './App.css'
import settings from './settings.png'
import minimize from './minimize.png'
import close from './close.png'
import league from './league.png'

// christian sepulveda hack
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;
// end hack



class App extends Component {
	render() {
		return (
			<div id='app'>
				<div id='left'>
					<DisplayBans className='component' data='bans'/>
					<Mate className='component' data='Duckiee'/>
					<Mate className='component' data='Scarlett'/>
					<Mate className='component' data='Destiny'/>
					<Mate className='component' data='Smix'/>
					<Mate className='component' data='Megumi'/>
				</div>
				<div id='center'>
					<input className='control' type='image' src={league}/>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
				</div>
				<div id='right'>
					<input className='control' type='image' src={settings}/>
					<input className='control' type='image' src={minimize}/>
					<input className='control' type='image' src={close}/>
					<Opponent className='component' data='Warwick'/>
					<Opponent className='component' data='Jarvan 4'/>
					<Opponent className='component' data='Sejuani'/>
					<Opponent className='component' data='Leona'/>
					<Opponent className='component' data='Janna'/>
				</div>
			</div>
		);
	}
}


class Mate extends Component {
	render(){
		return (
			<div className='mate'>
				<p>{this.props.data}</p>
			</div>
		)
	}
}

class Opponent extends Component{
	render(){
		return (
			<div className='opponent'>
				<p>{this.props.data}</p>
			</div>
		)
	}
}

class DisplayBans extends Component{
	render(){
		return(
			<div id='display-bans'>
				<p>display bans</p>
			</div>
		)
	}
}

export default App;

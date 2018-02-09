import React, { Component } from 'react'
import './App.css'
import settings from './settings.png'
import minimize from './minimize.png'
import close from './close.png'
import league from './league.png'

//electron react plumbing///////////////////
const electron = window.require('electron')
// const fs = electron.remote.require('fs')
const ipcRenderer  = electron.ipcRenderer
////////////////////////////////////////////

class App extends Component {
	render() {
		return (
			<div class='app'>
				<div id='controls'>
					<input class='control' type='image' src={league}/>
					<input class='control' type='image' src={settings}/>
					<input class='control' type='image' src={minimize}/>
					<input class='control' type='image' src={close}/>
					
				</div>
				<div class='column'>
					<DisplayBans data='bans'/>

					<Mate data='Duckiee'/>
					<Mate data='RiotRazer'/>
					<Mate data='MistGunner'/>
					<Mate data='IanLezinski'/>
					<Mate data='TimMcdaniel'/>
				</div>

				<div class='column' id='dynamic-display'>
					<p>dynamic display</p>
				</div>

				<div class='column'>
					<DisplayBans data='bans'/>
					<Opponent data='sejuani'/>
					<Opponent data='caitlyn'/>
					<Opponent data='maokai'/>
					<Opponent data='lee sin'/>
					<Opponent data='what the fuck'/>
				</div>


			</div>
		);
	}

	componentDidMount(){
		ipcRenderer.on('client', (event, client) => {
			this.setState( previousState => {
				return {client: client}
			})
		})
	}
}


class Mate extends Component {
	render(){
		return (
			<div class='mate'>
				<p>{this.props.data}</p>
			</div>
		)
	}
}

class Opponent extends Component{
	render(){
		return (
			<div class='opponent'>
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

import React, { Component } from 'react'
import './App.css'
import settings from './settings.png'
import minimize from './minimize.png'
import close from './close.png'
import watchLeague from './league.png'
import unwatchLeague from './cancel.png'

// christian sepulveda hack
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;
// end hack

window.require('electron-react-devtools').install()

class App extends Component {
	render() {
		return (
			<div id='app'>
				<div id='controls'>
					<ControlLeague/>
					<Control image={settings} clicker={onClickSettings}/>
					<Control image={minimize} clicker={onClickMinimize}/>
					<Control image={close} clicker={onClickClose}/>
				</div>
				<div id='left'>
					<Mate className='component' data='Duckiee'/>
					<Mate className='component' data='Scarlett'/>
					<Mate className='component' data='Destiny'/>
					<Mate className='component' data='Smix'/>
					<Mate className='component' data='Megumi'/>
				</div>
				<div id='center'>
					<Opponent className='component' data='Warwick'/>
					<Opponent className='component' data='Jarvan 4'/>
					<Opponent className='component' data='Sejuani'/>
					<Opponent className='component' data='Leona'/>
					<Opponent className='component' data='Janna'/>
				</div>
				<div id='right'>
					<p id='dynamic-display'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
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

class Control extends Component{
	render(){
		return(
			<input className='control' type='image' src={this.props.image} 
				onClick={this.props.clicker} />
		)
	}
}

class ControlLeague extends Component{
	constructor(props){
		super(props)
		this.clicker = this.clicker.bind(this)
		this.state = {watch:true}
	}
	render(){
		let displayWatch = ''
		let displayUnwatch = ''
		if(this.state.watch){
			displayWatch = {display:'inline'}
			displayUnwatch = {display:'none'}
		}
		else {
			displayWatch = {display:'none'}
			displayUnwatch = {display:'inline'}
		}

		return(
			<div>
				<input className='control' type='image' src={watchLeague} 
					onClick={this.clicker} style={displayWatch}/>
				<input className='control' type='image' src={unwatchLeague} 
					onClick={this.clicker} style={displayUnwatch}/>
				<span className='control'> i will update you on messages received from the league client</span>
			</div>
		)
	}
	clicker(event){
		if(this.state.watch){
			ipcRenderer.send('watch-league')
			this.setState(previous => {
				return {watch:false}
			})
		} else{
			ipcRenderer.send('unwatch-league')
			this.setState(previous => {
				return {watch:true}
			})
		}
	}	
}

function onClickClose(){
	ipcRenderer.send('close')
}

function onClickMinimize(){
	ipcRenderer.send('minimize')
}

function onClickSettings(){
	ipcRenderer.send('settings')
}

export default App;

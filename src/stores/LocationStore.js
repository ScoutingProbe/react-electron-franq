import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'

const {ipcRenderer} = window.require('electron')

class LocationStore extends ReduceStore{
	constructor(){
		super(Dispatcher)
		ipcRenderer.send('location')
	}

	getInitialState(){
		ipcRenderer.on('location-inform', (event, location) => {
			console.log(location)
			return location
		})
	}

	reduce(state, action) {
		console.log(state)
		console.log(action)
		return state
	}
}

export default new LocationStore()
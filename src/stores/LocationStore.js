import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'
import Actions from '../actions/Actions.js'

const {ipcRenderer} = window.require('electron')

class LocationStore extends ReduceStore{
	constructor(){
		super(Dispatcher)
		ipcRenderer.send('location')
	}

	getInitialState(){
		ipcRenderer.on('location-inform', (event, location) => {
			Actions.informLocation(location)
			ipcRenderer.send('client-watch', location)
		})
		return ''
	}

	reduce(action, state) {
		return state.location
	}
}

export default new LocationStore()
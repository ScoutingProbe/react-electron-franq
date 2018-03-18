import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'
import Actions from '../actions/Actions.js'

const {ipcRenderer} = window.require('electron')

class ClientStore extends ReduceStore{
	constructor(){
		super(Dispatcher)
	}

	getInitialState(){
		ipcRenderer.on('client-inform', (event, client) => {
		})
		return ''
	}

	reduce(state, action){
		return state
	}
}

export default new ClientStore()
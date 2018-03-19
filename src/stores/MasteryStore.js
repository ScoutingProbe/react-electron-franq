import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'
import Actions from '../actions/Actions.js'

const {ipcRenderer} = window.require('electron')

class MasteryStore extends ReduceStore{
	constructor(){
		super(Dispatcher)
	}

	getInitialState(){
		ipcRenderer.on('mastery-inform', (event, mastery) => {
			Actions.informMastery(mastery)
		})
		return ''
	}

	reduce(action, state) {
		return state
	}
}

export default new MasteryStore()
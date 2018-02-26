import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'

// christian sepulveda hack
//const electron = window.require('electron')
// const fs = electron.remote.require('fs')
//const ipcRenderer  = electron.ipcRenderer
// end hack

class RegionStore extends ReduceStore{
	constructor(){
		super(Dispatcher)

	}

	getInitialState(){
		return 'NA1'
	}
	
	reduce(state, action){
		if(action.type === 'CHANGE_REGION')
			return action.region
		else
			return state
	}
}

export default new RegionStore()


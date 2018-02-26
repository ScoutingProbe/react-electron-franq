import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'

class ClientStore extends ReduceStore{
	constructor(){
		super(Dispatcher)
	}

	getInitialState(){
		return null
	}

	reduce(state, action){
		return state
	}
}

export default new ClientStore()
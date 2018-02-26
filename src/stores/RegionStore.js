import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'

class RegionStore extends ReduceStore{
	constructor(){
		super(Dispatcher)

	}

	getInitialState(){
		return 'NA1'
	}
	
	reduce(state, action){
		return state
	}
}

export default new RegionStore()
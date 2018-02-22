import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'

class BanStore extends ReduceStore<Object>{
	constructor(){
		super(Dispatcher)
	}
	getInitialState():Object{
		return {}
	}

	reduce(state:Object, action:Object):Object{
		if(action.type === 'update')
			return state
	}
}
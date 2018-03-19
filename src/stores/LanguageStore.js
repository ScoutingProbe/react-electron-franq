import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'

class LanguageStore extends ReduceStore{
	constructor(){
		super(Dispatcher)
	}

	getInitialState(){
		return 'english'
	}

	reduce(state, action) {
		if(action.type === 'CHANGE_LANGUAGE')
			return action.language
		else 
			return state
	}
}

export default new LanguageStore()
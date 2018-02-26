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
		return state
	}
}

export default new LanguageStore()
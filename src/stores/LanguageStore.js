import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'

class LanguageStore extends ReduceStore{
	constructor(){
		super(Dispatcher)
	}

	getInitialState(){
		return 'english'
	}

	reduce(state, action) {
		console.log(`languagestore ${state} ${action}`)
		return state
	}
}

export default new LanguageStore()
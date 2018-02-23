import {ReduceStore} from 'flux/utils'
import Dispatcher from '../actions/Dispatcher.js'
import ActionTypes from '../actions/ActionTypes.js'
import LanguageStore from '../stores/LanguageStore.js'
import ClientStore from '../stores/ClientStore.js'

class RegionStore extends ReduceStore{
	constructor(){
		super(Dispatcher)

	}

	getInitialState(){
		return 'NA1'
	}
	
	reduce(state, action){
		switch(action.type){
			case ActionTypes.WATCH:
				break
			case ActionTypes.UNWATCH:
				break
			case ActionTypes.GO_INDEX:
				break
			case ActionTypes.GO_SETTINGS:
				break
			case ActionTypes.CHANGE_LANGUAGE:
				break
			case ActionTypes.CHANGE_REGION:
				break
			default:
				return state
		}
	}
}

export default new RegionStore()
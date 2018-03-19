import ActionTypes from '../actions/ActionTypes.js'
import Dispatcher from './Dispatcher.js'

const Actions = {
	watch(){
		Dispatcher.dispatch({
			type: ActionTypes.WATCH
		})
	},
	unwatch(){
		Dispatcher.dispatch({
			type: ActionTypes.UNWATCH
		})
	},
	goIndex(){
		Dispatcher.dispatch({
			type: ActionTypes.GO_INDEX
		})
	},
	goSettings(){
		Dispatcher.dispatch({
			type: ActionTypes.GO_SETTINGS
		})
	},
	changeLanguage(language){
		Dispatcher.dispatch({
			type: ActionTypes.CHANGE_LANGUAGE,
			language
		})
	},
	changeRegion(region){
		Dispatcher.dispatch({
			type: ActionTypes.CHANGE_REGION,
			region
		})
	},
	informLocation(location){
		Dispatcher.dispatch({
			type: ActionTypes.INFORM_LOCATION,
			location
		})
	},
	informMastery(mastery){
		Dispatcher.dispatch({
			type: ActionTypes.INFORM_MASTERY,
			mastery
		})
	}
}

export default Actions
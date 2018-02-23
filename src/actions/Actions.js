import ActionTypes from '../actions/ActionTypes.js'
import Dispatcher from './Dispatcher.js'

export default class Actions{
	watch(){
		Dispatcher.dispatch({
			type: ActionTypes.WATCH
		})
	}
	unwatch(){
		Dispatcher.dispatch({
			type: ActionTypes.UNWATCH
		})
	}
	goIndex(){
		Dispatcher.dispathc({
			type: ActionTypes.GO_INDEX
		})
	}
	goSettings(){
		Dispatcher.dispatch({
			type: ActionTypes.GO_SETTINGS
		})
	}
	changeLanguage(language){
		Dispatcher.dispatch({
			type: ActionTypes.CHANGE_LANGUAGE,
			language
		})
	}
	changeRegion(region){
		Dispatcher.dispatch({
			type: ActionTypes.CHANGE_REGION,
			region
		})
	}
}
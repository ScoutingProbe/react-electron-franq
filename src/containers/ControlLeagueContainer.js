import {Container} from 'flux/utils'
import ControlLeagueView from '../views/ControlLeagueView.js'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'

function getStores(){
	return [
		LanguageStore,
		RegionStore,
		ClientStore
	]
}

function getState(){
	return{
		language: LanguageStore.getState(),
		region: RegionStore.getState(),
		client: ClientStore.getState(),
		onWatch: Actions.watch,
		onUnwatch: Actions.unwatch,
		onGoIndex: Actions.goIndex,
		onGoSettings: Actions.goSettings,
		onChangeLanguage: Actions.changeLanguage,
		onChangeRegion: Actions.changeRegion
	}		
}

export default Container.createFunctional(ControlLeagueView, getStores, getState)
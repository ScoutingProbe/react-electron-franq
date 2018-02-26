import {Container} from 'flux/utils'
import LanguageStore from '../stores/LanguageStore.js'
import ClientStore from '../stores/ClientStore.js'
import RegionStore from '../stores/RegionStore.js'
import Actions from '../actions/Actions.js'
import SettingsView from '../views/SettingsView.js'

function getStores(){
	return [LanguageStore, ClientStore, RegionStore]
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

export default Container.createFunctional(SettingsView, getStores, getState)
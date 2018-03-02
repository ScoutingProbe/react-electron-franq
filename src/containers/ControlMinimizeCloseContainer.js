import {Container} from 'flux/utils'
import ControlView from '../views/ControlView'
import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import LolStaticDataStore from '../stores/LolStaticDataStore.js'

function getStores(){
	return [
		LanguageStore,
		RegionStore,
		ClientStore,
		LolStaticDataStore
	]
}

function getState(){
	return{
		language: LanguageStore.getState(),
		region: RegionStore.getState(),
		client: ClientStore.getState(),
		lolStaticData: LolStaticDataStore.getState(),
		onWatch: Actions.watch,
		onUnwatch: Actions.unwatch,
		onGoIndex: Actions.goIndex,
		onGoSettings: Actions.goSettings,
		onChangeLanguage: Actions.changeLanguage,
		onChangeRegion: Actions.changeRegion
	}		
}

export default Container.createFunctional(ControlView, getStores, getState)
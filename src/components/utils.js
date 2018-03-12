import Actions from '../actions/Actions.js'
import LanguageStore from '../stores/LanguageStore.js'
import RegionStore from '../stores/RegionStore.js'
import ClientStore from '../stores/ClientStore.js'
import LocationStore from '../stores/LocationStore.js'
import LolStaticDataStore from '../stores/LolStaticDataStore.js'

export function getStores(){
	return [
		LanguageStore,
		RegionStore,
		ClientStore,
		LocationStore,
		LolStaticDataStore
	]
}

export function calculateState(previous){
	return{
		language: LanguageStore.getState(),
		region: RegionStore.getState(),
		client: ClientStore.getState(),
		location: LocationStore.getState(),
		lolStaticData: LolStaticDataStore.getState(),
		onWatch: Actions.watch,
		onUnwatch: Actions.unwatch,
		onGoIndex: Actions.goIndex,
		onGoSettings: Actions.goSettings,
		onChangeLanguage: Actions.changeLanguage,
		onChangeRegion: Actions.changeRegion,
		onInformLocation: Actions.informLocation
	}	
}
import {Container} from 'flux/utils'
import {getStores, getState} from './utils.js'
import SettingsView from '../views/SettingsView.js'

export default Container.createFunctional(SettingsView, getStores, getState)
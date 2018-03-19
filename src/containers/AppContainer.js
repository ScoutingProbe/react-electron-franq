import {Container} from 'flux/utils'
import AppView from '../views/AppView.js'
import {getStores, getState} from './utils.js'

export default Container.createFunctional(AppView, getStores, getState)
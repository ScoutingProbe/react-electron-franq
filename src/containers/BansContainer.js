import {Container} from 'flux/utils'
import BansView from '../views/BansView.js'
import {getStores, getState} from './utils.js'

export default Container.createFunctional(BansView, getStores, getState)
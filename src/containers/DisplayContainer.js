import {Container} from 'flux/utils'
import DisplayView from '../views/DisplayView.js'
import {getStores, getState} from './utils.js'

export default Container.createFunctional(DisplayView, getStores, getState)
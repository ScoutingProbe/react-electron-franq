import {Container} from 'flux/utils'
import ControlView from '../views/ControlView'
import {getStores, getState} from './utils.js'

export default Container.createFunctional(ControlView, getStores, getState)
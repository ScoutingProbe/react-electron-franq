import {Container} from 'flux/utils'
import TheirTeamView from '../views/TheirTeamView.js'
import {getStores, getState} from './utils.js'

export default Container.createFunctional(TheirTeamView, getStores, getState)
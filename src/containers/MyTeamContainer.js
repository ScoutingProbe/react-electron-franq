import {Container} from 'flux/utils'
import MyTeamView from '../views/MyTeamView.js'
import {getStores, getState} from './utils.js'

export default Container.createFunctional(MyTeamView, getStores, getState)
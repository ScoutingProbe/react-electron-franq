import React, {Component} from 'react'
import {Container} from 'flux/utils'
import {getStores, calculateState} from './utils.js'

class MateComponent extends Component{
	constructor(props){
		super(props)
		this.props = props
	}

	render(){
		return(
			<div className='mate'>
				<div>
					<p>Silver V: 100 lp</p>
					<button style={{display:'block'}}>
						{this.props.displayName} is {this.props.assignedPosition}
					</button>
				</div>
				
				{this.props.championId === 0 ? 
					<p></p> : 
					<div>
						<button>{this.state.lolStaticData.getChampionName(this.props.championId)} select</button>
						<p>Level 7: 500games</p>
					</div>
				} 
				{this.props.championPickIntent === 0 ? 
					<p></p> : 
					<div>
						<button>{this.state.lolStaticData.getChampionName(this.props.championPickIntent)} hover</button>
						<p>Level 7: 500games</p>
					</div>	
				}

							
			</div>
		)
	}

	static getStores(){
		return getStores()
	}

	static calculateState(previous){
		return calculateState(previous)	
	}
}

export default Container.create(MateComponent)

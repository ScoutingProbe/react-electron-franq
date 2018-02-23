import React, {Component} from 'react'
import Mate from '../components/Mate.js'
export default class MyTeam extends Component{
	render(){
		return (
			<div id='left'>
				<Mate className='component' data='Duckiee'/>
				<Mate className='component' data='Scarlett'/>
				<Mate className='component' data='Destiny'/>
				<Mate className='component' data='Smix'/>
				<Mate className='component' data='Megumi'/>
			</div>
		)
	}
}
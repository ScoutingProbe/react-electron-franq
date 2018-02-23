import React, {Component} from 'react'
import Opponent from '../components/Opponent.js'
export default class TheirTeam extends Component{
	render(){
		return (
			<div id='center'>
				<Opponent className='component' data='Warwick'/>
				<Opponent className='component' data='Jarvan 4'/>
				<Opponent className='component' data='Sejuani'/>
				<Opponent className='component' data='Leona'/>
				<Opponent className='component' data='Janna'/>
			</div>
		)
	}
}
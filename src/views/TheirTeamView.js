import React from 'react'
import OpponentContainer from '../containers/OpponentContainer.js'

export default function TheirTeamView(props){
	return (
		<div id='center'>
			<OpponentContainer className='component' data='Warwick'/>
			<OpponentContainer className='component' data='Jarvan 4'/>
			<OpponentContainer className='component' data='Sejuani'/>
			<OpponentContainer className='component' data='Leona'/>
			<OpponentContainer className='component' data='Janna'/>
		</div>
	)	
}
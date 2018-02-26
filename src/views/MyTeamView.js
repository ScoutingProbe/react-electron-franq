import React from 'react'
import Mate from '../containers/MateContainer.js'

export default function MyTeamView(props){
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
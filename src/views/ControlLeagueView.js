import React from 'react'
import watchLeague from '../png/league.png'
import unwatchLeague from '../png/cancel.png'
import $ from 'jquery'

export default function ControlLeagueView(props){
	return(
		<div>
			<span className='control'> i will update you on messages received from the league client</span>
			<input id='watch' className='control' type='image' src={watchLeague} 
				onClick={watch} alt='watch'/>
			<input id='unwatch' className='control' type='image' src={unwatchLeague} 
				onClick={unwatch} style={{display:'none'}} alt='unwatch'/>	
		</div>
	)
}

function watch(){
	$('#watch').hide()
	$('#unwatch').show()
}

function unwatch(){
	$('#watch').show()
	$('#unwatch').hide()
}
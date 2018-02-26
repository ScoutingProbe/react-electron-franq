import React from 'react'
import watchLeague from '../png/league.png'
import unwatchLeague from '../png/cancel.png'

export default function ControlLeagueView(props){
	return(
		<div>
			<input id='watch' className='control' type='image' src={watchLeague} 
				onClick={watch} alt='watch'/>
			<input id='unwatch' className='control' type='image' src={unwatchLeague} 
				onClick={unwatch} style={{display:'none'}} alt='unwatch'/>
			<span className='control'> i will update you on messages received from the league client</span>
		</div>
	)
}

function watch(){
	document.getElementById('watch')
		.style.display = 'none'
	document.getElementById('unwatch')
		.style.display = 'inline'
}

function unwatch(){
	document.getElementById('watch')
		.style.display = 'inline'
	document.getElementById('unwatch')
		.style.display = 'none'
}
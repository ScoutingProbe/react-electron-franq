import React, {Component} from 'react'
import watchLeague from '../png/league.png'
import unwatchLeague from '../png/cancel.png'

export default class ControlLeague extends Component{
	render(){
		return(
			<div>
				<input id='watch' className='control' type='image' src={watchLeague} 
					onClick={this.watch} alt='watch'/>
				<input id='unwatch' className='control' type='image' src={unwatchLeague} 
					onClick={this.unwatch} style={{display:'none'}} alt='unwatch'/>
				<span className='control'> i will update you on messages received from the league client</span>
			</div>
		)
	}
	watch(){
		document.getElementById('watch')
			.style.display = 'none'
		document.getElementById('unwatch')
			.style.display = 'inline'
	}

	unwatch(){
		document.getElementById('watch')
			.style.display = 'inline'
		document.getElementById('unwatch')
			.style.display = 'none'
	}
}
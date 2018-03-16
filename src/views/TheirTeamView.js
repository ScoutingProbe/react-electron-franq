import React from 'react'
import OpponentComponent from '../components/OpponentComponent.js'

export default function TheirTeamView(props){
	if(props.client === '')
		return <div id='their-team'></div>
	else {
		return (
			<div id='their-team'>
				<OpponentComponent {...props.client.theirTeam[0]}/>
				<OpponentComponent {...props.client.theirTeam[1]}/>
				<OpponentComponent {...props.client.theirTeam[2]}/>
				<OpponentComponent {...props.client.theirTeam[3]}/>
				<OpponentComponent {...props.client.theirTeam[4]}/>
			</div>
		)			
	}

}
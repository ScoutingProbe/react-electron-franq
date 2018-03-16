import React from 'react'
import MateComponent from '../components/MateComponent.js'

export default function MyTeamView(props){
	if(props.client === '')
		return <div id='my-team'></div>
	else {
		return (
			<div id='my-team'>
				<MateComponent {...props.client.myTeam[0]}/>
				<MateComponent {...props.client.myTeam[1]}/>
				<MateComponent {...props.client.myTeam[2]}/>
				<MateComponent {...props.client.myTeam[3]}/>
				<MateComponent {...props.client.myTeam[4]}/>
			</div>
		)		
	}
	
}
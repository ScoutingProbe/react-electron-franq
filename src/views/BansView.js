import React from 'react'
import BanComponent from '../components/BanComponent'

export default function BansView(props){
	if(props.client === '') 
		return <div id='ban'></div> 
	else {
		return(
			<div id='bans'>
				<BanComponent {...props.client.actions[0][0]}/>
				<BanComponent {...props.client.actions[0][1]}/>
				<BanComponent {...props.client.actions[0][2]}/>
				<BanComponent {...props.client.actions[0][3]}/>
				<BanComponent {...props.client.actions[0][4]}/>
				<BanComponent {...props.client.actions[0][5]}/>
				<BanComponent {...props.client.actions[0][6]}/>
				<BanComponent {...props.client.actions[0][7]}/>
				<BanComponent {...props.client.actions[0][8]}/>
				<BanComponent {...props.client.actions[0][9]}/>
			</div>
		)
	}
}


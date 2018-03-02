import React from 'react'

export default function RecommendView(props){
	let myTeam = props.client.myTeam
	console.log(myTeam)
	return (
		<div id='recommend'>
			<p>Most games: Duckiee</p>
			<p>Earliest pick:  Solo or Feed</p>
			<p>Ban for Warwick: 1, 2, 3</p>
			<p>Pick with Warwick:  1, 2, 3</p>
		</div>
	)	
}
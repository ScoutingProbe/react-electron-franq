import React, {Component} from 'react'

export default class Opponent extends Component{
	render(){
		return (
			<div className='opponent'>
				<p>{this.props.data}</p>
			</div>
		)
	}
}
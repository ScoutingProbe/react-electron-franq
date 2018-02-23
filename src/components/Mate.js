import React, {Component} from 'react'

export default class Mate extends Component {
	render(){
		return (
			<div className='mate'>
				<p>{this.props.data}</p>
			</div>
		)
	}
}
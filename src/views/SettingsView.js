import React from 'react'
import LanguageComponent from '../components/LanguageComponent.js'
import RegionComponent from '../components/RegionComponent.js'
import $ from 'jquery'

export default function SettingsView(props){
	return(
		<div style={{display:'none'}} id='settings'>
			<RegionComponent {...props}/>
			<LanguageComponent {...props}/>
		</div>
	)
}
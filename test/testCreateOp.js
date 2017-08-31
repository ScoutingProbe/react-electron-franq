const assert = require('assert')
const {initial, stat, getLanes, modify, iterate, write, success, fail} = require('../op/createOp.js')

describe('createOp.js tests', function(){
	it('1 of 6 #stat', function(){
		assert(stat(null).then(null === null))
	})

	it('2 of 6 #getLanes', function(){
		getLanes(null).then((win,data)=>{
			assert(win === null)
			assert(data.jax === ['top', 'jungle']) 
		})
	})

	it('3 of 6 #modify', function(){
		getLanes(null).then(modify).then(array=>{
			let object = array[1]
			assert(Object.keys(object).includes('Jax'))
			assert(Object.values(object).includes({'top': [], 'jungle': []}))
		})
	})

	it('4 of 6 #iterate', function(){
		getLanes(null).then(modify).then(iterate).then(array=>{
			let object = array[1]
		})
	})
})


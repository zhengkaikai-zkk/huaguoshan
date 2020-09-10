import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

// 全局通用组件状态
export default{
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}

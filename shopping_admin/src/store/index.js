/**
 * vuex 的核心管理对象
 */
import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/store/router/modules'
import common from '@/store/common/modules'

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		router,
    common
	}
})


// 获取 状态:  this.$store.state.task.status
// 更新状态:  this.$store.dispatch('task/setStatus', '状态');

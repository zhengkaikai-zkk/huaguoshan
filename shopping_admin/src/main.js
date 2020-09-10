import Vue from 'vue'
import App from './App'
import 'babel-polyfill'	//IE 与 360 全兼容模式

import axios from '@/http'
import qs from 'qs'
import PubSub from 'pubsub-js'
import router from '@/router/index'
import proxyConfig from '@/config/proxyConfig'
import { fullPath } from '@/config/filtersConfig'
import moment from 'moment'	// 时间格式化
import message from './utils/message'
import Notification from './utils/notification'
import store from '@/store/index'
import request from '@/utils/request'
import common from '@/utils/common'
import ElementUI from 'element-ui' 
// element-ui 默认样式
// import 'element-ui/lib/theme-chalk/index.css'
import './element-variables.scss'	// 自定义 element-ui 主题

Vue.prototype.$config = proxyConfig
// 设置过滤器
Vue.filter('fullPath',fullPath)

Vue.use(ElementUI)

//Vue.prototype.HOST = '/api'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$moment = moment
Vue.prototype.$message = message
Vue.prototype.$notify = Notification
Vue.prototype.$common = common;

//axios.defaults.baseURL = 'https://www.madoujiang.com/api/'


Vue.prototype.$request = request

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})

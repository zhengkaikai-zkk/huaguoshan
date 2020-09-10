import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 环境切换配置
import proxyConfig from '@/conf/proxyConfig'
Vue.prototype.$proxyConfig = proxyConfig

//移动端字体大小
import '@/assets/css/media.css';

//移动端图标
import '@/assets/font/iconfont.css';

//引入常用组件
import myPlugin from '@/components/index.js'
Vue.use(myPlugin)

//引入常用方法
//日期
import time from '@/utils/time_utils'
Vue.prototype.$time = time
//正则验证
import check from '@/utils/check_utils'
Vue.prototype.$check = check
//图片
import img_utils from '@/utils/img_utils'
Vue.prototype.$imgUtils = img_utils
//引入request
import axios from './http'
Vue.prototype.$axios = axios
import request from './utils/request'
Vue.prototype.$request = request
//过滤器加载
import {fullPath} from '@/utils/filters.js'
Vue.prototype.$fullPath = fullPath
Vue.filter('fullPath', fullPath)
//通用
import common from '@/utils/common'
Vue.prototype.$common = common
import times from '@/utils/time_utils'
Vue.prototype.$times = times

// 轮播图组件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

//vue的参数序列化插件
import qs from 'qs'
Vue.prototype.$qs = qs

// Vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
import { Lazyload } from 'vant';
Vue.use(Lazyload,{
  filter: {
    progressive (listener) {
      var host = document.location.host;
      var result = "";
      if(listener.src && listener.src.search('/upload/') != -1){
        if(host.search('www.') != -1 ){
          result = document.location.protocol + "//" + host + listener.src
        }else{
          console.log(listener)
          host = '192.168.0.122:8090'
          result = document.location.protocol + "//" + host + listener.src
        }
      }else if(listener.src && listener.src.search('/upload/') == -1){
        result = listener.src;
      }
      listener.src = result
    }
  },
});




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

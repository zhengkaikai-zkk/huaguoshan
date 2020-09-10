/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import router from '@/router/index'

// axios 配置
axios.defaults.timeout = 20000
axios.defaults.baseURL= '/api'//开发路径
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// http request 拦截器
axios.interceptors.request.use(
  config => {
  	var token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = token
    }

    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          localStorage.removeItem('usertoken');
          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.path },
            })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error)
  },
)

export default axios

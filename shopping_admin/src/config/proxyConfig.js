var proxyConfig = {
  //开发环境
  dev: {
    // 服务url
    serviceUrl: 'http://127.0.0.1:8080/',

    // 是否显示菜单管理操作按钮
    isShowMenuOpertionBtn: true
  },


  //线上环境
  prod: {
    // 服务url
    serviceUrl: document.location.protocol + "//" + document.location.host,

    // 是否显示菜单管理操作按钮
    isShowMenuOpertionBtn: false,
  }
}

export default (process.env.NODE_ENV === 'development' ? proxyConfig.dev : proxyConfig.prod)

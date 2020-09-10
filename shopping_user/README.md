# 移动端模板说明
### **1.	技术栈：Vue + axios + Vant**
### **2.	Git地址：**
http://192.168.0.2:11001/dashan_net/vue_mobile_templet_spa.git
### **3.	目录结构**
public: 静态资源目录，打包时直接输出

src：源码目录

	assets：静态资源目录，打包时会参与编译
		css：样式文件
			media.css：移动端字体适配文件
			public.scss：公用样式文件，项目中多次使用的颜色抽象成变量到这里，以及一些常用的css代码块抽象成函数
	components：组件目录，内置一些常用组件，组件文件夹中附带说明文档
	conf：配置目录 
	router：路由目录
	store：vuex仓库
	utils：公用方法目录
		check_utils.js：表单验证方法合集
		common.js：通用方法合集
		filters.js：图片过滤器
		img_utils.js：图片操作方法合集
		wx_utils.js：微信方法集合
		request.js：结合van对axios的二次封装
		time_utils.js：时间操作方法合集
		websocket.js：websocket方法合集

views：视图目录

App.vue：根视图文件

http.js：基于axios配置登录拦截器

main.js：项目入口文件

.gitignore：配置git提交忽略文件

babel.config.js：babel配置文件，参：https://babel.docschina.org/docs/en/

package-lock.json：锁定插件版本的文件，下载插件时自动生成

package.json：项目基本信息

README.md：项目说明

vue.config.js：配置文件，设置了常用设置，更多设置请参考：https://cli.vuejs.org/config/


### **4.	文件及变量等的命名规则**
.vue视图文件，首字母大写驼峰命名，例：AboutUs.vue

文件夹及除.vue文件外的文件，全小写加下划线连接，例：img_utils.js，about_us.scss

html中的class，id，name等属性名，全小写加下划线连接，例：my_wallet

js中的变量，函数名等，首字母小写驼峰命名，例：getInfo()

常量，全大写命名，DEV

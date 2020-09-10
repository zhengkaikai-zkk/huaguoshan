
import Vue from 'vue'
import Router from 'vue-router'
import request from '@/utils/request.js'
import store from '@/store/index'
import Manage from '../views/Manage'
import NProgress from 'nprogress'
// NProgress 进度条样式, 可自行找到该文件进行编辑样式
import 'nprogress/nprogress.css'

Vue.use(Router)

// 管理员需要登录权限的路由在这里
var routers = [
  {
  	path: '/manage/welcome',
  	component: () => import('@/views/manage/Welcome'),
  	meta: {
  		title: '首页'
  	}
  },
  {
    path: '/manage/sys_advice',
    component: () => import('@/views/manage/system/Advice'),
    meta: {
    	title: '意见反馈'
    }
  },
  {
    path: '/manage/user_list',
    component: () => import('@/views/manage/user/UsInfo'),
    meta: {
    	title: '用户信息'
    }
  },
  {
    path: '/manage/user_flow',
    component: () => import('@/views/manage/user/UsFlow'),
    meta: {
    	title: '用户资金流水'
    }
  },
  {
    path: '/manage/user_invite',
    component: () => import('@/views/manage/user/UsInvite'),
    meta: {
    	title: '用户推广'
    }
  },
  {
    path: '/manage/goods_list',
    component: () => import('@/views/manage/goods/Goods'),
    meta: {
    	title: '商品列表'
    }
  },
  {
    path: '/manage/goods_add',
    component: () => import('@/views/manage/goods/AddGoods'),
    meta: {
    	title: '添加商品'
    }
  },
  {
    path: '/manage/goods_update',
    component: () => import('@/views/manage/goods/UpdateGoods'),
    meta: {
    	title: '编辑商品'
    }
  },
  {
    path: '/manage/goods_category',
    component: () => import('@/views/manage/goods/Category'),
    meta: {
    	title: '商品分类'
    }
  },
  {
    path: '/manage/order_list',
    component: () => import('@/views/manage/order/Order'),
    meta: {
    	title: '订单列表'
    }
  },
  {
    path: '/manage/order_details',
    component: () => import('@/views/manage/order/Details'),
    meta: {
    	title: '订单详情'
    }
  },
  {
    path: '/manage/refund_list',
    component: () => import('@/views/manage/order/Refund'),
    meta: {
    	title: '退款订单'
    }
  },
  {
    path: '/manage/refund_details',
    component: () => import('@/views/manage/order/RefundDetails'),
    meta: {
    	title: '退款订单详情'
    }
  },
  {
    path: '/manage/profit_list',
    component: () => import('@/views/manage/finance/ProfitList'),
    meta: {
    	title: '平台收益明细'
    }
  },
  {
    path: '/manage/profit_map',
    component: () => import('@/views/manage/finance/ProfitMap'),
    meta: {
    	title: '平台收益统计'
    }
  },
  {
    path: '/manage/withdrawal_list',
    component: () => import('@/views/manage/finance/Withdrawal'),
    meta: {
    	title: '提现记录'
    }
  },
  {
    path: '/manage/params_list',
    component: () => import('@/views/manage/system/Params'),
    meta: {
    	title: '参数维护'
    }
  },
  {
    path: '/manage/level_list',
    component: () => import('@/views/manage/system/Level'),
    meta: {
    	title: '会员等级维护'
    }
  },
  {
    path: '/manage/advert_list',
    component: () => import('@/views/manage/system/Advert'),
    meta: {
    	title: '广告列表'
    }
  },
  {
    path: '/manage/advert_opera',
    component: () => import('@/views/manage/system/AdvertOpera'),
    meta: {
    	title: '新增或编辑广告'
    }
  },
  {
      path: '/manage/authority_role',
      component: () => import('@/views/manage/authority/Role'),
      meta: {
          title: '角色管理'
      }
  },
  {
      path: '/manage/authority_account',
      component: () => import('@/views/manage/authority/Account'),
      meta: {
          title: '账号管理'
      }
  },
  {
      path: '/manage/authority_menu',
      component: () => import('@/views/manage/authority/Menu'),
      meta: {
          title: '菜单管理'
      }
  },
]

// 不需要角色权限的路径
var publicUrl = [
  '/',
  '/err_404',
  '/login',
  '/manage',
  '/manage/welcome'
]

var router = new Router(
  {
    mode: "history",
    base:"/admin/",
    // 公共路径
    routes: [
    	{
    		path: '/',
    		component: () => import( '@/views/Login'),
    		meta: {
    			title: '登录',
    		},
    	},
    	{
    		path: '/login',
    		component: () => import( '@/views/Login'),
    		meta: {
    			title: '登录',
    		},
    	},
      {
      	path: '/err_404',
      	component: () => import( '@/views/error/404'),
      	meta: {
      		title: '找不到页面',
      	},
      },
    	{
    		path: '/manage',
    		component: Manage,
    		meta: {
    			title: '首页',
    			requireAuth: true,
    		},
    		redirect: '/manage/welcome',
    		children: routers
    	},
      {
        // 通配符, 匹配所有路径, 没有匹配相应的路径时会进入到这里
        path: '*',
        component: () => import( '@/views/error/404'),
      }
    ]
  }
)

// 页面加载进度样式配置
NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
})

router.beforeEach((to, form, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start();

  var token = sessionStorage.getItem('adminToken');
  var paths = JSON.parse(sessionStorage.getItem('menuList'));
  var index = -1;
  if(paths){
    index = paths.findIndex(item => {return to.path.indexOf(item.requestUrl) != -1 });
  }
  if(token
      && paths
      && publicUrl.indexOf(to.path) == -1
      && index == -1){
    next({
      path: '/err_404'
    })
  }

	// 路由变化修改title
	if(to.meta.title) {
		document.title = to.meta.title
	}

	// 退出登录
	if(to.fullPath == '/login') {
    routers && routers.splice(1)
		sessionStorage.removeItem('adminToken')
	}

	//登陆拦截
	if(to.matched.some(r => r.meta.requireAuth)) { // 判断该路由是否需要登录权限
		if(token != null && token != "" ) { // 判断当前的token是否存在
			next();
		} else {
			console.log(token)
			next({
				path: '/login',
				query: {
					redirect: to.fullPath
				} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	} else {
		next()
	}
})

router.afterEach((to, form)=>{
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})

export default router;

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes= [
    {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '../views/Index.vue'),
        children: [
            {
                path: '/',
                component: () => import( /* webpackChunkName: "home" */ '@/views/index/Home.vue'),
            },
            {
                path: '/home',
                name: 'Home',
                component: () => import(/* webpackChunkName: "home" */ '@/views/index/Home.vue'),
                meta: {
                    title: '首页',
                }
            },
            {
                path: '/classify',
                component: () => import(/* webpackChunkName: "classify" */ '@/views/index/Classify.vue'),
                meta: {
                    title: '分类',
                }
            },
            {
                path: '/cart',
                component: () => import(/* webpackChunkName: "cart" */ '@/views/index/Cart.vue'),
                meta: {
                    title: '购物车',
                }
            },
            {
                path: '/my',
                name: '我的',
                component: () => import(/* webpackChunkName: "my" */ '@/views/index/My.vue'),
                meta: {
                    title: '我的',
                    requireAuth: true
                }
            },
        ]
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/register',
        component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
        meta: {
            title: '注册',
        },
    },
    {
        path: '/forget',
        component: () => import(/* webpackChunkName: "forget" */ '@/views/Forget.vue'),
        meta: {
            title: '忘记密码',
        },
    },
    {
        path: '/info',
        component: () => import(/* webpackChunkName: "forget" */ '@/views/my/Info.vue'),
        meta: {
            title: '修改个人资料',
            requireAuth: true
        },
    },
    {
        path: '/wallet',
        component: () => import(/* webpackChunkName: "wallet" */ '@/views/my/Wallet.vue'),
        meta: {
            title: '我的钱包',
        },
    },  
    {
        path: '/withdraw',
        component: () => import(/* webpackChunkName: "withdraw" */ '@/views/my/Withdraw.vue'),
        meta: {
            title: '申请提现',
        },
    },
    {
        path: '/bank',
        component: () => import(/* webpackChunkName: "bank" */ '@/views/my/Bank.vue'),
        meta: {
            title: '我的银行卡',
        },
    },
    {
        path: '/bank_add',
        component: () => import(/* webpackChunkName: "bank_add" */ '@/views/my/BankAdd.vue'),
        meta: {
            title: '绑定银行卡',
        },
    },
    {
        path: '/withdraw_flowing',
        component: () => import(/* webpackChunkName: "withdraw_flowing" */ '@/views/my/WithdrawFlowing.vue'),
        meta: {
            title: '提现记录',
        },
    },
    {
        path: '/flowing',
        component: () => import(/* webpackChunkName: "flowing" */ '@/views/my/Flowing.vue'),
        meta: {
            title: '账户流水',
        },
    },
    {
        path: '/coupon',
        component: () => import(/* webpackChunkName: "coupon" */ '@/views/my/Coupon.vue'),
        meta: {
            title: '我的优惠券',
        },
    },
    {
        path: '/coupon_center',
        component: () => import('@/views/goods/CouponCenter.vue'),
        meta: {
            title: '领劵中心',
        },
    },
    {
        path: '/coupon_history',
        component: () => import('@/views/my/CouponHistory.vue'),
        meta: {
            title: '优惠券记录',
        },
    },
    {
        path: '/invite',
        component: () => import('@/views/my/Invite.vue'),
        meta: {
            title: '邀请朋友',
        },
    },
    {
        path: '/vip',
        component: () => import('@/views/my/Vip.vue'),
        meta: {
            title: '会员中心',
        },
    },
    {
        path: '/address',
        component: () => import('@/views/my/Address.vue'),
        meta: {
            title: '我的收货地址',
        },
    },
    {
        path: '/address_edit',
        component: () => import('@/views/my/AddressEdit.vue'),
        meta: {
            title: '添加收货地址',
        },
    },
    {
        path: '/collect',
        component: () => import('@/views/my/Collect.vue'),
        meta: {
            title: '我的收藏',
        },
    },
    {
        path: '/history',
        component: () => import('@/views/my/History.vue'),
        meta: {
            title: '我的足迹',
            requireAuth: true
        },
    },
    {
        path: '/safety',
        component: () => import('@/views/my/Safety.vue'),
        meta: {
            title: '安全中心',
        },
    },
    {
        path: '/update_pwd',
        component: () => import('@/views/my/UpdatePwd.vue'),
        meta: {
            title: '修改密码',
            requireAuth: true
        },
    },
    {
        path: '/update_phone',
        component: () => import('@/views/my/UpdatePhone.vue'),
        meta: {
            title: '修改手机号',
            requireAuth: true
        },
    },
    {
        path: '/feedback',
        component: () => import('@/views/my/Feedback.vue'),
        meta: {
            title: '意见反馈',
        },
    },
    {
        path: '/feedback_list',
        component: () => import('@/views/my/FeedbackList.vue'),
        meta: {
            title: '反馈列表',
        },
    },
    {
        path: '/feedback_detail',
        component: () => import('@/views/my/FeedbackDetail.vue'),
        meta: {
            title: '反馈详情',
        },
    },
    {
        path: '/message',
        component: () => import('@/views/my/Message.vue'),
        meta: {
            title: '消息列表',
        },
    },
    {
        path: '/message_detail',
        component: () => import('@/views/my/MessageDetail.vue'),
        meta: {
            title: '消息详情',
        },
    },
    {
        path: '/goods_detail',
        component: () => import('@/views/goods/GoodsDetail.vue'),
        meta: {
            title: '商品详情',
        },
    },
    {
        path: '/order_confirm/:code',
        component: () => import('@/views/goods/OrderConfirm.vue'),
        meta: {
            title: '确认订单',
            requireAuth: true
        },
    },
    {
        path: '/pay',
        component: () => import('@/views/goods/Pay.vue'),
        meta: {
            title: '支付',
            requireAuth: true
        },
    },
    {
        path: '/order',
        component: () => import('@/views/goods/Order.vue'),
        meta: {
            title: '我的订单',
        },
    },
    {
        path: '/order_detail',
        component: () => import('@/views/goods/OrderDetail.vue'),
        meta: {
            title: '订单详情',
        },
    },
    {
        path: '/refund',
        component: () => import('@/views/goods/Refund.vue'),
        meta: {
            title: '申请退款',
        },
    },
    {
        path: '/evaluation',
        component: () => import('@/views/goods/Evaluation.vue'),
        meta: {
            title: '商品评价',
        },
    },
    {
        path: '/search',
        component: () => import('@/views/goods/Search.vue'),
        meta: {
            title: '商品列表',
        },
    },
    


    



    {
        path: '/login',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        meta: {
            title: '关于',
            requireAuth: true
        }
    },
    
    
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
      var token = localStorage.getItem('userToken');
        if (token) {
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.path}
            })
        }
    }
    else {
        next();
    }
})

export default router
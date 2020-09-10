<template>
    <div id="my">
        <img src="@/assets/img/my/bg.png" alt="">
        <div class="d_my">
            <div class="d_tit">
                <span>我的</span>
                <div>
                    <span v-if="message">{{message>100? '...': message}}</span>
                    <img src="@/assets/img/my/message.png" @click="$router.push('/message')" alt="">
                </div>
            </div>
            <div class="info">
                <div class="d_info">
                    <li>
                        <van-image width="100%" height="100%" fit="cover" :src="user.avatar | fullPath" />
                    </li>
                    <div>
                        <p>
                            {{user.nick}}&nbsp;
                            <img v-if="user.level==1" src="@/assets/img/vip/vip-1.png" alt="等级">
                            <img v-if="user.level==2" src="@/assets/img/vip/vip-2.png" alt="等级">
                            <img v-if="user.level==3" src="@/assets/img/vip/vip-3.png" alt="等级">
                            <img v-if="user.level==4" src="@/assets/img/vip/vip-4.png">
                        </p>
                        <span v-if="user.phone">{{$common.encryptPhone(user.phone)}}</span>
                    </div>
                </div>
                <span @click="$router.push('/info')"><img src="@/assets/img/my/update.png" alt="">修改个人资料</span>
            </div>
            <div class="case">
                <div class="d_he" @click="$router.push('/wallet')">
                    <div>
                        <img src="@/assets/img/my/money.png" alt="">
                        <span class="titl">我的钱包</span>
                    </div>
                    <div>
                        <span>资金管理</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="d_money">
                    <div>
                        <span>余额</span>
                        <li>￥{{wallet.balance}}</li>
                    </div>
                    <div>
                        <span>提现中</span>
                        <li>￥{{wallet.doWidthdrawal}}</li>
                    </div>
                    <div>
                        <span>已提现</span>
                        <li>￥{{wallet.withdrawal}}</li>
                    </div>
                    <div>   
                        <span>银行卡</span>
                        <li>{{bankCarNum}}张</li>
                    </div>
                </div>
            </div>

            <div class="case">
                <div class="d_he">
                    <div>
                        <img src="@/assets/img/my/order.png" alt="">
                        <span class="titl">我的订单</span>
                    </div>
                    <div @click="$router.push('/order')">
                        <span>查看全部订单</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="d_order">
                    <div @click="$router.push('/order?status=0')">
                        <img src="@/assets/img/my/order-1.png" alt="">
                        <li>待付款</li>
                    </div>
                    <div @click="$router.push('/order?status=1')">
                        <img src="@/assets/img/my/order-2.png" alt="">
                        <li>待发货</li>
                    </div>
                    <div @click="$router.push('/order?status=2')">
                        <img src="@/assets/img/my/order-3.png" alt="">
                        <li>待收货</li>
                    </div>
                    <div @click="$router.push('/order?status=3')">
                        <img src="@/assets/img/my/order-4.png" alt="">
                        <li>待评价</li>
                    </div>
                    <div @click="$router.push('/order?status=-2')">
                        <img src="@/assets/img/my/order-5.png" alt="">
                        <li>交易关闭</li>
                    </div>
                </div>
            </div>

            <div class="case">
                <div class="d_he" @click="$router.push('/wallet')">
                    <div>
                        <img src="@/assets/img/my/services.png" alt="">
                        <span class="titl">我的服务</span>
                    </div>
                </div>
                <div class="services">
                    <div @click="$router.push('/coupon')">
                        <i class="iconfont">&#xe60e;</i>
                        <li>优惠券</li>
                    </div>
                    <div @click="$router.push('/invite')">
                        <i class="iconfont">&#xe60b;</i>
                        <li>邀请好友</li>
                    </div>
                    <div @click="$router.push('/vip')">
                        <i class="iconfont">&#xe610;</i>
                        <li>会员中心</li>
                    </div>
                    <div @click="$router.push('/address')">
                        <i class="iconfont">&#xe60a;</i>
                        <li>地址管理</li>
                    </div>
                    <div @click="$router.push('/collect')">
                        <i class="iconfont">&#xe60f;</i>
                        <li>我的收藏</li>
                    </div>
                    <div @click="$router.push('/history')">
                        <i class="iconfont">&#xe60c;</i>
                        <li>我的足迹</li>
                    </div>
                    <div @click="$router.push('/safety')">
                        <i class="iconfont">&#xe611;</i>
                        <li>安全中心</li>
                    </div>
                    <div @click="$router.push('/feedback')">
                        <i class="iconfont">&#xe60d;</i>
                        <li>意见反馈</li>
                    </div>
                </div>
            </div>    

        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            wallet: {
                balance: '--',
                doWidthdrawal: '--',
                withdrawal: '--'
            },
            bankCarNum: '--',
            user: {
                nick: '--',
            },
            message: 0,
        }
    },
    methods:{
        getInfo(){
            this.$request.post({
                url: '/us/info/details',
                success: res => {
                    this.wallet= res.usWallet;
                    this.user= res.usInfo;
                    this.bankCarNum=res.usBankCards;
                    this.message= res.messages;
                },
                finally: () => {
                      
                }
            });
        }
    },
    mounted(){
        window.scrollTo(0, 0);
        this.getInfo();
        // setTimeout(() => {
        //     if(localStorage.getItem('usInfo')){
        //         this.user=JSON.parse(localStorage.getItem('usInfo'))
        //     }
        // }, 100);
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#my{
    position: relative;
    font-size: 1.4rem;
    padding-bottom: 5rem;
    &>img{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: -1;
    }
}
.d_my{
    padding: 0 0.9rem;
    .d_tit{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.7rem;
        padding: 1rem 0;
        color: #fff;
        div{
            position: relative;
            span{
                font-size: 1rem;
                position: absolute;
                top: -0.5rem;
                right: -0.6rem;
                display: inline-block;
                border-radius: 1rem;
                min-width: 1rem;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                background: #FFF;
                color: $color;
                padding: 1px;
                letter-spacing: 0;
            }
        }
        img{
            width: 1.7rem;
            display: inline-block;

        }
    }
}
.info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    .d_info{
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        letter-spacing: 0;
        &>div{
            margin-left: 0.9rem;
        }
        p{
            font-size: 1.6rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            &>img{
                width: 1.8rem;
                margin-left: .4rem;
            }
        }
        li{
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 50%;
            border: 1px solid #fff;
            overflow: hidden;
        }
    }
    &>span{
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        img{
            width: 1.5rem;
            margin-right: 0.6rem;
        }
    }
}
.case{
    background: #fff;
    border-radius: 0.5rem;
    margin-top: 1.2rem;
    .d_he{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.9rem 0.9rem;
        border-bottom: 1px solid #F6F6F6;
        font-size: 1.2rem;
        &>div{
            display: flex;
            align-items: center;
        }
        img{
            width: 2.3rem;
            margin-right: 0.5rem;
        }
        span{
            margin-right: 0.4rem;
        }
        .titl{
            color: #000;
            font-size: 1.4rem;
        }
    }
    .d_money{
        display: flex;
        justify-content: space-around;
        padding: 1rem 0.9rem;
        div{
            text-align: center;
        }
        li{
            padding: 0.52rem 0;
            color: $color;
            letter-spacing: 0;
        }
    }
    .d_order{
        display: flex;
        justify-content: space-around;
        padding: 1rem 0.9rem;
        letter-spacing: 0;
        text-align: center;
        font-size: 1.35rem;
        img{
            width: 2.5rem;
        }
    }
    .services{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 1rem 0.9rem;
        letter-spacing: 0;
        text-align: center;
        font-size: 1.35rem;
        i{
            font-size: 3.2rem;
            color: $color;
        }
        li{
            margin-top: 0.3rem;
        }
        div{
            width: 25%;
            padding: 1rem 0;
        }
    }
}

</style>
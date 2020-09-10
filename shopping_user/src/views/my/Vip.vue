<template>
    <div id="vip">
        <pageHeader/>
        <img src="@/assets/img/vip/vip-bg.png" alt="背景图">
        <div class="heade">
            <li>
                <van-image width="100%" height="100%" fit="cover" lazy-load :src="$store.state.all.user.avatar | fullPath" />
            </li>
            <p>{{user.nick}}</p>
            <div v-for="item in typeList">
                <div class="card" v-if="user.memberLevel==item.memberLevel">
                    当前会员等级:&nbsp;&nbsp;<img v-if="item.image" :src="item.image" alt="">{{item.text}}
                </div>
            </div>
            <!-- <div v-if="user.memberLevel==2">
                当前会员等级:&nbsp;&nbsp;<img src="@/assets/img/vip/vip-2.png" alt="">白金会员
            </div>
            <div v-if="user.memberLevel==3">
                当前会员等级:&nbsp;&nbsp;<img src="@/assets/img/vip/vip-3.png" alt="">钻石会员
            </div>
            <div v-if="user.memberLevel==4">
                当前会员等级:&nbsp;&nbsp;<img src="@/assets/img/vip/vip-4.png" alt="">超级会员
            </div>
            <div v-if="user.memberLevel==5">
                当前会员等级:&nbsp;&nbsp;<img src="@/assets/img/vip/vip-4.png" alt="">非会员用户
            </div> -->
        </div>

        <div class="table">
            <div class="thead">会员等级说明</div>
            <div class="tr">
                <span class="th_1">非会员用户</span>
                <span class="th_2">无折扣优惠</span>
            </div>
            <div class="tr" v-for="(item,index) in list">
                <span>
                    <img :src="item.icon | fullPath" alt="">{{item.name}}
                </span>
                <span>可享受{{item.exclusiveDiscount}}折优惠</span>
            </div>
        </div>

        <div class="table table2">
            <div class="thead">会员等级升级条件</div>
            <div class="tr">
                <span class="th_1">非会员用户</span>
                <span class="th_2">普通注册用户</span>
            </div>
            <div class="tr" v-for="(item,index) in list">
                <span>
                    <img :src="item.icon | fullPath" alt="">{{item.name}}
                </span>
                <span>{{item.remark}}</span>
            </div>
        </div>

        <div class="foot">
            <p>当前距离可申请升级会员还差邀请 <b>{{num}}</b> 个好友</p>
            <button class="big_btn" @click="show=true">申请升级会员</button>
            <!-- <div><img src="@/assets/img/vip/vip-btn.png" alt="申请升级会员" @click="show=true"></div> -->
        </div>

        <!-- 弹框 -->
        <div class="d_popup" v-if="show">
            <div>
                <div><van-icon name="close" size="3rem" @click="show=false"/></div>
                <img :src="contactWeChat | fullPath" alt="">
                
                <!-- <div class="d_banner" v-if="contactWeChat.length>0">
                    <swiper :options="swiperOption" class="d_swiper">
                        <swiper-slide v-for="(item,index) in contactWeChat" :key="index" class="d_slide">
                            <img :src="item | fullPath" alt="">
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>	
                    </swiper>
                </div> -->
                
                <p class="d_pop">长按识别二维码</p>
                <p>添加商家客服微信</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            user: {
                avatar: '',
                memberLevel: 5
            },
            list: [],
            num: 0,
            show: false,
            contactWeChat: [],
            swiperOption:{
				loop:true,
                // autoplay: true,
				pagination: {
					el: '.swiper-pagination',
					clickable :true,
                },
            },
            typeList: [
                {memberLevel: 1, text: '黄金会员', image: require('@/assets/img/vip/vip-1.png')},
                {memberLevel: 2, text: '白金会员', image: require('@/assets/img/vip/vip-2.png')},
                {memberLevel: 3, text: '钻石会员', image: require('@/assets/img/vip/vip-3.png')},
                {memberLevel: 4, text: '超级会员', image: require('@/assets/img/vip/vip-4.png')},
                {memberLevel: 5, text: '非会员用户'}
            ]

        }
    },

    methods: {
        getList(){
            this.$request.post({
                url: '/us/level/list',
                success: res => {
                    this.list= res.list;
                    // this.num=res.num;
                    // this.contactWeChat=JSON.parse(res.contactWeChat);
                    this.contactWeChat= res.contactWeChat;
                },
            });
        },
    },

    mounted(){
        this.$store.dispatch('all/setUser');
        if(localStorage.getItem('usInfo')){
            this.user=JSON.parse(localStorage.getItem('usInfo'))
            this.user.memberLevel =5
            console.log(this.user)
        }
        this.getList();
    }
}
</script>

<style>
#vip .d_icon img{
    width: 2rem;
    margin-right: 0.4rem;
}
#vip .swiper-pagination-bullet-active{
    background: #fff;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#vip{
    position: relative;
    font-size: 1.33rem;
    color: #9099A8;
    padding: 0 1rem;
    padding-top: 5.9rem;
    padding-bottom: 1rem;
    &>img{
        width: 100%;
        position: absolute;
        top: 4rem;
        left: 0;
        right: 0;
        z-index: -1;
    }
    .heade{
        text-align: center;
        color: #fff;
        font-size: 1.6rem;
        margin-bottom: 1rem;
        li{
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 50%;
            border: 1px solid #fff;
            overflow: hidden;
            display: inline-block;
            margin-bottom: 0.2rem;
        }
        .card{
            font-size: 1.52rem;
            @include all_flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.8rem;
            img{
                width: 1.9rem;
                margin-right: 0.3rem;
            }
        }
    }
        
    .table{
        border-radius: 0.5rem;
        color: #9099A8;
        font-size: 1.35rem;
        margin-bottom: 1.3rem;
        background-color: #fff;
        overflow: hidden;
        .thead{
            border-bottom: 1px solid #f5f5f5;
            padding: 0.9rem;
        }
        .tr{
            @include all_flex;
            border-bottom: 1px solid #f5f5f5;

            span{
                width: 50%;
                text-align: center;
                padding: 0.9rem 0;
                box-sizing: border-box;
                @include all_flex;
                align-items: center;
                justify-content: center;
            }
            &>span:first-child{
                border-right: 1px solid #f5f5f5;
                text-align: left;
            }
        }
        img{
            width: 2rem;
            margin-right: 0.4rem;
        }
        
    }
    .table2{
        .tr{
            &>span:first-child{
                width: 35%;
            }
            &>span:last-child{
                width: 65%;
                font-size: 1.14rem;
                text-align: left;
                padding-left: 0.8rem;
                justify-content:flex-start;
            }
        }
    }
    .foot{
        border-radius: 0.5rem;
        background-color: #fff;
        text-align: center;
        padding-top: 1.8rem;
        padding-bottom: 1.8rem;
        div{
            padding: 1.8rem 4.5rem;
        }
        p{
            margin-bottom: 2rem;
        }
        b{
            color: $color;
            font-size: 1.52rem;
        }
        img{
            width: 100%;
        }
    }
}
/* ----------弹框css------------ */
.d_popup{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.7);
    text-align: center;
    color: #fff;
    font-size: 1.3rem;
    img{
        width: 12.5rem;
        margin-top: 0.5rem;
    }
    .d_pop{
        padding-top: 0.6rem;
        padding-bottom: 0.8rem;
    }
    .d_banner{
        width: 12.5rem;
        margin-top: 0.5rem;
        img{
            width: 12.5rem;
            height: 12.5rem;
        }
        .d_swiper{
            height: 15.5rem;
        }
    }
}
.big_btn{
    background: $color;
    color: #fff;
    font-size: 1.71rem;
    border-radius: 3rem;
    height: 3.6rem;
    width: 70%;
}
.big_btn:active{
    opacity: .8;
}
</style>
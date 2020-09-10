<template>
    <div id="home">
        <div class="d_search" :class="classIn? 'search_bg':''">
            <van-search
                v-model="name"
                show-action
                shape="round"
                background="rgba(255,255,255,0)"
                placeholder="请输入商品名称"
                @search="toSearch"
                @focus="openSelect"
                >
                <template #action>
                    <div class="d_action">
                        <span v-if="$store.state.all.isRead">{{$store.state.all.isRead>100? '...': $store.state.all.isRead}}</span>
                        <img src="@/assets/img/my/message.png" alt="">
                    </div>
                </template>
            </van-search>
        </div>
        <div class="home_bg">
            <swiper :options="swiperOption" class="d_swiper">
                <swiper-slide v-for="(item,index) in 3" :key="index" class="d_slide">
                </swiper-slide>
            </swiper>
        </div>
        <div class="brand">
            <div class="card" v-for="item in brandList" @click="$router.push('/search?oneCategoryId='+item.categoryId)">
                <img :src="item.img | fullPath" alt="">
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="coupon">
            <div class="remark">
                <span>领劵中心</span>
                <div @click="$router.push('/coupon_center')">更多<van-icon name="arrow" size="1.6rem"/></div>
            </div>
            <div class="cou_con">
                <div style="display: inline-block">
                    <div class="d_coupon">
                        <div>
                            <p>女装满100-5</p>
                            <span>满100元可使用</span>
                        </div>
                        <div>￥<span>5</span></div>
                    </div>
                </div>
                <div style="display: inline-block">
                    <div class="d_coupon">
                        <div>
                            <p>女装满100-5</p>
                            <span>满100元可使用</span>
                        </div>
                        <div>￥<span>5</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="d_tabs">
            <ul>
                <li :class="active==1? 'active':''" @click="active=1">
                    <p>人气</p>
                    <span>精选好物</span>
                </li>
                <li :class="active==2? 'active':''" @click="active=2">
                    <p>精选</p>
                    <span>猜你喜欢</span>
                </li>
            </ul>
        </div>
        <div class="shop_list">
            <div class="shop_card" v-for="item in list" @click="$router.push('/goods_detail?id='+ item.id)">
                <li>
                    <van-image width="100%" height="100%" fit="cover" lazy-load :src="item.productCover | fullPath" />
                </li>
                <div class="d_card">
                    <p>{{item.productTitle}}</p>
                    <div class="sales">销量{{item.salesVolume}}</div>
                    <div class="d_price">
                        <div v-if="isLogin">
                            <span>￥{{item.price.toFixed(2)}}</span>&nbsp;
                            <s>￥{{item.originalPrice.toFixed(2)}}</s>
                        </div>
                        <div v-else style="color:#F05447">登录可见</div>
                        <img src="@/assets/img/home/cart.png" alt="">
                        
                    </div>
                </div>
            </div>
        </div>

        <!-- 弹框 -->
        <van-overlay :show="showHistory" z-index="101">
            <div class="d_over">
                <van-search placeholder="输入关键词搜索" v-model="name" show-action @search="toSearch" @cancel="closeSelect" @focus="openSelect"/>
                <div class="sera_card" v-for="item in historyList" @click="$router.push('/search?name='+item)">
                    <div>
                        <van-icon name="search" size="1.5rem"/>
                        <span>{{item}}</span>
                    </div>
                    <van-icon name="home-o" size="1.5rem"/>
                </div>
                <div class="clear_all" @click="clearSelect">清空输入历史</div>
            </div>
        </van-overlay>


    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    data(){
        return{
            name: '',
            brandList:[
                {img: require('@/assets/img/home/home-01.png'), name:'角阀'},
                {img: require('@/assets/img/home/home-02.png'), name:'水嘴'},
                {img: require('@/assets/img/home/home-03.png'), name:'软管'},
                {img: require('@/assets/img/home/home-04.png'), name:'龙头'},
                {img: require('@/assets/img/home/home-05.png'), name:'坐便器'},
                {img: require('@/assets/img/home/home-06.png'), name:'地漏'},
                {img: require('@/assets/img/home/home-07.png'), name:'下水'},
                {img: require('@/assets/img/home/home-08.png'), name:'沐浴花洒'},
                {img: require('@/assets/img/home/home-09.png'), name:'手持花洒'},
                {img: require('@/assets/img/home/home-10.png'), name:'玻璃胶'},
            ],
            swiperOption:{
				loop:true,
                autoplay: {
                    delay: 500
                },
                speed: 1000,
            },
            active: 1,
            isLogin: true,
            shopImg: require('@/assets/img/common/shop-2.png'),
            classIn: false,
            moodsList: [],
            likeList: [],
            list: [],
            showHistory: false,
            historyList: [],
        }
    },

    methods:{
        /* 监听滚动事件 */
        listenerFunction(e) {
            document.addEventListener('scroll', this.handleScroll, true);
        },
        handleScroll () {
            // console.log(window.pageYOffset)
            if(window.pageYOffset>60){
                this.classIn=true;
            }else{
                this.classIn=false;
            }
        },
        
        //获取商品列表
        getList(){
            this.$request.post({
                url: '/us/productInfo/public/listTop10',
                success: res =>{
                    this.moodsList= res.popularity;
                    this.likeList= res.productInfos;
                    this.list= res.popularity;
                }
            })
        },

        //打开搜索记录
        openSelect(){
            if(this.historyList){
                this.showHistory=true
            }
        },
        //关闭搜索记录
        closeSelect(){
            this.showHistory=false
        },
        //清空搜索记录
        clearSelect(){
            localStorage.removeItem('historyList')
            this.historyList=[];
        },

        //搜索
        toSearch(){
            if(!this.name){
    			this.$toast.fail('搜索内容不能为空');
                return; 
            }
            let historyList=[];
            let arr=JSON.parse(localStorage.getItem('historyList'));
            historyList= arr? arr.slice(-9): historyList;
            historyList.push(this.name);
            localStorage.setItem('historyList',JSON.stringify(historyList))
            this.$router.push({
                path:'/search', 
                query:{'name':this.name}
            });
        }
    },


    mounted(){
        this.listenerFunction();
        this.getList();
        this.$store.dispatch('all/setUser');
        this.historyList=JSON.parse(localStorage.getItem('historyList'));
    },
    beforeDestroy () {
        document.removeEventListener("scroll", this.listenerFunction);
    },
    watch: {
        active(val){
            if(val==1){
                this.list= this.moodsList;
            }else{
                this.list= this.productInfos;
            }
        }
    }
}
</script>

<style>
#home .van-search__content{
    background-color: #fff;
}
#home .van-search__action{
    padding: 0 12px;
}
#home .van-search__action:active{
    background: none;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
.shop_list{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 3vw;
    padding-bottom: 2rem;

    &>div:nth-child(2n){
        margin-right: 0;
    }
}
.shop_card{
    width: 45.5vw;
    margin-right: 3vw;
    margin-top: 1rem;
    background: #fff;
    border-radius: 0.6rem;
    overflow: hidden;
    box-sizing: border-box;
    &>li{
        width: 100%;
        height: 45vw;
    }
    .d_card{
        padding: 0 0.5rem;
        p{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            color: #222;
            font-size: 1.33rem;
            margin: 0.6rem 0;
        }
        .sales{
            font-size: 0.95rem;
            letter-spacing: 0;
        }
    }
    .d_price{
        margin-top: 0.3rem;
        margin-bottom: 0.9rem;
        letter-spacing: 0;
        font-size: 0.95rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        & span:first-child{
            font-size: 1.33rem;
            color: $color;
        }
        img{
            width: 2.3rem;
        }
    }
}


#home{
    .d_search{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        .d_action{
            position: relative;
            height: 34px;
            padding: 2px 0;
            box-sizing: border-box;
            span{
                font-size: 10px;
                position: absolute;
                top: -2px;
                right: -3px;
                display: inline-block;
                border: 1px solid #fff;
                border-radius: 11px;
                min-width: 11px;
                height: 11px;
                line-height: 11px;
                text-align: center;
                background: #fff;
                padding: 1px;
                letter-spacing: 0;
            }
            img{
                height: 100%;
                display: inline-block;

            }
        }
    }
    .search_bg{
        background: linear-gradient(to right, #FF6243, #D8083A);
    }
    .home_bg{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: -1;
        box-sizing: border-box;
        .d_swiper{
            height: 55vw;
        }
        img{
            width: 100%;
            height: 55vw;
        }
        .d_slide{
            background: linear-gradient(to right, #FF6243, #D8083A);
        }
    }
    .brand{
        background: #fff;
        margin: 13rem 0.8rem 1rem 0.8rem;
        padding-top: 0.7rem;
        border-radius: 0.8rem;
        padding: 0.6rem 1.2rem;
        font-size: 1.14rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        text-align: center;
        .card{
            width: 17.5%;
            margin-bottom: 0.6rem;
            padding-right: 3.1%;
            overflow: hidden;
            &:nth-child(5n){
                padding-right: 0;
            }
            img{
                width: 100%;
                border-radius: 50%;
            }
        }
    }
    .coupon{
        background: #fff;
        margin: 0 1rem;
        padding: 1rem;
        border-radius: 0.8rem;
        color: #707070;
        font-size: 1.3rem;
        .remark{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            div{
                display: flex;
                i{
                    position: relative;
                    top: 1px;
                }
            }
        }
        .cou_con{
            display: flex;
            overflow-x: auto;
            transition: all .5s;
            margin-bottom: 0.2rem;
            &::-webkit-scrollbar {
                display: none;
            }
            &.-o-scrollbar{
                -moz-appearance: none !important; 
            }    
            -ms-overflow-style: none;
        }
        .d_coupon{
            background: url('../../assets/img/home/coupon.png') no-repeat;
            background-size: 100% auto;
            width: 16.4rem;
            height: 4.1rem;
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            margin-right: 1rem;
            &>div:last-child{
                width: 30%;
                line-height: 4rem;
                letter-spacing: 0;
                color: $color;
                text-align: center;
                span{
                    font-size: 1.9rem;
                }
            }
            &>div:first-child{
                width: 70%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-size: 0.95rem;
                p{
                    color: #000;
                    font-size: 1.14rem;
                    margin-bottom: 0.2rem;
                }
            }
        }
    }
    .d_tabs{
        display: flex;
        justify-content: center;
        margin-top: 1.3rem;
        padding-bottom: 0.7rem;
        ul{
            text-align: center;
            display: flex;
        }
        li{
            width: 7rem;
            p{
                font-size: 1.71rem;
                margin-bottom: 0.5rem;
                transition: all .7s;
            }
            span{
                font-size: 0.95rem;
                border-radius: 1rem;
                padding: 0.2rem 0.6rem;
                transition: all .5s;
            }
            
        }
        .active{
            transition: all 1s;
            p{
                color: $color;
            }
            span{
                background: $color;
                color: #fff;
            }
        }
    }
    
}
/* 搜索历史记录弹框css */
.d_over{
    background: #fff;
    width: 100%;
    height: 100%;
    .sera_card{
        display: flex;
        justify-content: space-between;
        padding: 1.5rem 1rem;
        border-bottom: 1px solid #f1f1f1;
        &>div{
            display: flex;
            align-items: center;
        }
    }
    .clear_all{
        text-align: center;
        margin-top: 1.5rem;
    }
}
</style>
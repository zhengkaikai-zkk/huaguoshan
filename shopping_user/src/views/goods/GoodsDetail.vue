<template>
    <div id="goods_detail">
        <div class="d_banner">
            <swiper :options="swiperOption" class="d_swiper">
                <swiper-slide v-for="(item,index) in shopImgs" :key="index" class="d_slide">
                    <img :src="item | fullPath" alt="">
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>	
            </swiper>
            <p v-if="!classIn" class="d_back" @click="$router.go(-1)"><van-icon name="arrow-left" /></p>
            <div v-else class="head">
                <pageHeader class="h_page" title="商品宝贝"/>
            </div>
        </div>
        <div class="d_con">
            <p>{{detail.productTitle}}</p>
            <div class="coupon" v-if="couponList.length>0" @click="showCoupon=true">
                <div>{{couponList[0].productCoupon.name}}</div>
                <div>领券<van-icon name="arrow" size="1.43rem"/></div>
            </div>
            <div class="d_count">
                <span>商品编号： {{detail.id}}</span>
                <span>销量： {{detail.salesVolume}}</span>
            </div>
            <div class="d_count">
                <span class="brand">商品品牌： {{detail.brand}}</span>
                <div>
                    <button v-if="detail.status==2" class="lab-2">库存充足</button>
                    <button v-if="detail.status==3" class="lab-1">库存不足</button>
                    <button v-if="detail.status==4" class="lab-1">无货</button>
                </div>
            </div>
            <div class="d_price" v-if="isLogin">
                市场价: <span >￥{{detail.originalPrice.toFixed(2)}}</span>
                <s>￥{{detail.price.toFixed(2)}}</s>
            </div>
            <div class="d_price" v-else>马上升级会员，享受更高优惠</div>
        </div>

        <div class="sel" @click="show=true">
            <span>共 <font>{{specNum}}</font> 种规格</span>
            <div><span>请选择规格</span><van-icon name="arrow" size="1.43rem"/></div>
        </div>
        <div class="sel" @click="showEvaluate=true">
            <span>查看评价</span><van-icon name="arrow" class="col" size="1.43rem"/>
        </div>
        <div class="d_detail">
            <p class="remark"><span>商品详情</span></p>
            <div v-html="detail.details"></div>
        </div>

        <div class="footer">
            <div class="handle">
                <div @click="collect()">
                    <img src="@/assets/img/goods/detail-1.png" v-if="!collectId"/>
                    <img src="@/assets/img/goods/detail-2.png" v-else/>
                    <p>{{!collectId?'收藏':'已收藏'}}</p>
                </div>
                <div @click="showShare">
                    <img src="@/assets/img/goods/detail-4.png"/>
                    <p>分享</p>
                </div>
                <div @click="$router.push('/cart')">
                    <img src="@/assets/img/goods/detail-3.png"/>
                    <p>购物车</p>
                </div>
            </div>
            <div class="confirm" >
                <button class="btn_cart" @click="show=true" v-if="detail.status==2">加入购物车</button>
                <button @click="show=true" v-if="detail.status==2">立即购买</button>
                <button class="no_shop" v-else>商品已下架</button>
            </div>
        </div>

        <!-- 弹框 -->
        <van-popup v-model="show" position="bottom" :style="{ height: '120vw' }">
            <Specifcation 
                v-if="goodsId" 
                :productId="goodsId" 
                :cover="detail.productCover" 
                :initStock="detail.stock" 
                :initPrice="detail.originalPrice"
                :status="detail.status"
                @func="getMsgFormSon" 
                @getData="getData"/>
        </van-popup>
        <van-popup v-model="showCoupon" position="bottom" :style="{ height: '115vw' }">
            <p class="coupon_tit">当前优惠</p>
            <div class="coupon_list">
                <div class="card" v-for="(item,index) in couponList">
                    <div class="shop_img">
                        <div><span>￥</span>{{item.productCoupon.money}}</div>
                        <span>{{item.productCoupon.condition}}</span>
                    </div>
                    <div class="d_card" @click="checkChange(item,index)">
                        <p>{{item.productCoupon.name}}</p>
                        <div class="time">有效期: {{parseTime(item.productCoupon.effectiveTime)}}</div>
                    </div>
                    <div v-if="item.receive" class="tesu_btn yesDraw"><div>已领取</div></div>
                    <div v-else class="tesu_btn" @click="toDraw(item.productCoupon.id)"><div>领取</div></div>
                </div>
            </div>
            <div class="coupon_close" @click="showCoupon=false">关闭</div>
        </van-popup>
        <van-popup v-model="showEvaluate" position="right" :style="{ width: '100vw',height: '100vh' }">
            <div id="score">
                <div class="page_head">
                    <i @click="showEvaluate=false" class="iconfont back_img">&#xe618;</i>
                    <p>宝贝评价</p>
                    <span>&nbsp;</span>
                </div>
                
                <div class="score_list">
                    <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
                        <div class="score_card" v-for="item in evalList">
                            <div class="to_user">
                                <li>
                                    <van-image width="100%" height="100%" fit="cover" lazy-load :src="item.usInfo.avatar | fullPath" round/>
                                </li>
                                <div>
                                    <p>{{item.usInfo.nick}}</p>
                                    <span>{{$common.getDay(item.createTime)}}&nbsp;{{item.skuSpecs}}</span>
                                </div>
                            </div>
                            <div class="score_con">{{item.content}}</div>
                        </div>
                    </van-list>
                </div>
            </div>
        </van-popup>
        <Share ref="share"/>
    </div>
</template>

<script>
import Share from '@/components/share/Share'
import Specifcation from '@/components/specification/spec'

export default {
    components:{
        Share,
        Specifcation,

    },
    data(){
        return{
            swiperOption:{
                loop:true,
                autoplay: true,
                delay: 3000,
                // speed: 1000,
				pagination: {
					el: '.swiper-pagination',
					clickable :true,
                },
            },
            
            show: false,
            goodsId: '',
            goodsCover: '',
            detail: {
                originalPrice: 0,
                price: 0,
            },
            classify: {},
            collectId: 0,
            shopImgs: [],
            goods: {
                picture: ''
            },
            isLogin: true,
            specNum: 0,
            showCoupon: false,
            couponList: [],

            /* 宝贝评价 */
            showEvaluate: false,
            evalList: [],
            evaluateMum: 0,
            classIn: false,
            avatar: require('@/assets/img/common/shop-2.png'),  
            page:{
	    		pageNo: 0,
				pageSize: 10,
	    	},
	    	van: {
        		loading: true,
				finished: false,
				error: false,
				text: '没有更多了',
            },
            
            

        }
    },

    

    methods:{
        getData(val){
            console.log(val)
            if(!val.id){this.$toast('请选择规格'); return}
            if(val.type=='cart'){
                this.addCart(val)
            }else if(val.type=='buy'){
                this.toBuy(val)
            }
        },
        addCart(data){
            let img=data.img.slice(data.img.indexOf('/file'))
            this.$request.post({
                url: '/us/shoppingCart/addCart',
                params: {
                    productId: this.goodsId,
                    price: data.price,
                    productNum: data.count,
                    imgUrl: img,
                    skuId: data.id,
                    skuSpecsValue: data.specName,
                },
                success: res =>{
                    this.$toast('已为您加入购物车')
                },
                finally: ()=>{
                    this.show= false
                }
            })
        },
        toBuy(data){
            let img=data.img.slice(data.img.indexOf('/file'))
            let form=[{
                productId: this.goodsId,
                productTitle: this.detail.productTitle,
                productPrice: data.price,
                productNum: data.count,
                images: img,
                skuId: data.id,
                skuSpecs: data.specName,
                deliveryMoney: this.detail.freightPrice
            }]
            this.$request.post({
                url: '/us/orderInfo/addSettle',
                params: {
                    data: JSON.stringify(form)
                },
                success: res =>{
                    this.$router.push('/order_confirm/'+res)
                },
                finally: ()=>{
                    this.show= false
                }
            })
        },

        showShare(){
            const ua = window.navigator.userAgent.toLowerCase()
            if (ua.indexOf('micromessenger') < 0) {
                this.$toast('微信分享只能在微信浏览器内完成')
            }else{
                this.$refs.share.flag= true;
                this.$refs.share.tuneUp(this.$common.getUrl()+'/user/goods_detail?id='+this.goodsId, _ => {},true)
            }
            
        },
        //获取详情
        getDetail(){
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/productInfo/public/details',
                params: {
                    productId: this.goodsId
                },
                success: res => {
                    this.detail=res.productInfo;
                    this.collectId=res.isCollect;
                    this.shopImgs=JSON.parse(res.productInfo.albumPics);
                    // this.evaluateMum= res.productScores
                    this.show= this.$route.query.cart==-1? true: false
                },
                finally: () => {
                    loading.clear();
                }
            });
        },
        //收藏
        collect(){
            const loading = this.$toast.loading({
                mask: true,
                message: '收藏中...',
                duration: 0
            });
            let idArr=[];
            if(this.collectId){    //取消收藏
                idArr[0]=this.collectId;
                this.$request.post({
                    url: '/us/collect/delete',
                    params: {
                        idArr: JSON.stringify(idArr)
                    },
                    success: res => {
                        this.getDetail();
                    },
                    finally: () => {
                        loading.clear();
                    }
                });
            }else{    
                idArr[0]=this.goodsId;
                this.$request.post({
                    url: '/us/collect/add',
                    params: {
                        idArr: JSON.stringify(idArr)
                    },
                    success: res => {
                        this.getDetail();
                    },
                    finally: () => {
                        loading.clear();
                    }
                });
            }
            
        },

        //获取评价列表
        getEvalList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.$request.post({
                url: '/us/productScore/list',
                params: {
                    productId: this.goodsId,
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize
                },
                success: res => {
                    this.evalList=res.list;
					if(res.list.length==0){
						this.van.text = '暂无评价';
					}
					if(this.page.pageNo >= res.pages){
						this.van.finished = true;
						this.van.loading = false;
					}
                },
                allError: ()=>{
		        	this.page.pageNo --;
					this.van.error = true;
				},
				finally: ()=>{
					this.van.loading = false;
				}
            });
        },

        //领取优惠券
        toDraw(id){
            this.$request.post({
                url: '/us/productCoupon/receive',
                params: {
                    id,
                },
                success: res =>{
                    this.getCouponList();
                    this.$toast('领取成功')
                }
            })
        },

        //获取优惠券列表
        getCouponList(){
            this.$request.post({
                url: '/us/productCoupon/details',
                params: {
                    productId: this.goodsId,
                },
                success: res =>{
                    this.couponList= res;
                }
            })
        },

        //获取全部规格
        getParent(){
            this.$request.post({
                url: '/us/productGroup/list',
                params: {
                    productId: this.goodsId,
                },
                success: res =>{
                    this.specNum=res.length;
                }
            })
        },

        parseTime(timeStr){
            let startTime= JSON.parse(timeStr).startTime
            let endTime= JSON.parse(timeStr).endTime
            return this.$times.getDay(startTime, '/') + ' ~ ' + this.$times.getDay(endTime, '/')
        },
        //关闭弹框
        getMsgFormSon(data){
            this.show= data;
        },
        /* 监听滚动事件 */
        listenerFunction(e) {
            document.addEventListener('scroll', this.handleScroll, true);
        },
        handleScroll () {
            // console.log(window.pageYOffset)
            if(window.pageYOffset>125){
                this.classIn=true;
            }else{
                this.classIn=false;
            }
        },

    },

    mounted(){
        window.scrollTo(0, 0);
        this.listenerFunction();
        this.goodsId= this.$route.query.id;
        if(this.goodsId){
            this.getDetail();
            this.getParent();
            this.getCouponList();
            this.getEvalList();
        }
        // this.show= this.$route.query.cart==-1? true: false
        let token= localStorage.getItem('userToken')
        if(token){
            // this.$store.dispatch('all/setUser');
            this.isLogin=true;
        }
    },

    created(){
        
    },

    beforeDestroy () {
        document.removeEventListener("scroll", this.listenerFunction);
    },
}
</script>

<style lang="scss">
@import '@/assets/css/public.scss';
.d_detail{
    img{
        width: 100%;
        display: block;
    }
}
#goods_detail #page_header{
    background: linear-gradient(to right, #FF6243, #D8083A);
    color: #fff;
}
#goods_detail .van-stepper__minus{
    background-color: #fff;
    color: $color;
    border: 1px solid $color;
}
#goods_detail .van-stepper__plus{
    background-color: $color;
    color: #fff;
    border: 1px solid $color;
}
#goods_detail .van-stepper__input{
    background: #fff;
    color: $color;
}
#goods_detail{
    .van-sku__goods-price{
        color: #F05447;
    }
    .van-sku-row__item--active{
        color: #fff;
        background: $color;
    }
    .van-sku-actions .van-button--danger{
        background: $color;
    }
    .van-sku-actions .van-button--warning{
        background: #FEE7D7;
        color: #EE8B42;
    }
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#goods_detail{
    font-size: 1.33rem;
    padding-bottom: 4.4rem;
}
.d_banner{
    background: #fff;
    position: relative;
    img{
        width: 100%;
        height: 98vw;
    }
    .d_swiper{
        height: 98vw;
    }
    .head{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        background: #fff;
        z-index: 99;
    }
    .d_back{
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 99;
        background: #222;
        opacity: .6;
        color: #fff;
        border-radius: 50%;
        height: 3.2rem;
        width: 3.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.9rem;
    }
}
.d_con{
    background: #fff;
    padding: 1.4rem 1rem 1.2rem 1rem;
    letter-spacing: 0;
    color: $gary;
    p{
        font-size: 1.71rem;
        color: #222;
        font-weight: bold;
        letter-spacing: 1px;
        margin-bottom: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
    }
    .coupon{
        background: #FFEFEE;
        color: #F54B40;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 0.4rem;
        padding: .7rem;
        margin-bottom: 1rem;
        div{
            display: flex;
            align-items: center;
            i{
                margin-left: .3rem;
            }
        }
    }
    .d_count{
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.6rem;
        button{
            border-radius: 0.3rem;
            padding: 0.1rem 0.8rem;
        }
        .lab-1{
            background: #FFF1F5;
            color: #C1164B;
        }
        .lab-2{
            background: #ECF4FF;
            color: #7CACF1;
            margin-left: 0.1rem;
        }
        .lab-2:hover{
            background: rgb(197, 210, 230);
            color: rgb(99, 148, 218);
        }
        .brand{
            width: 50%;
        }
    }
    .d_price{
        color: $color;
        font-weight: bold;
        font-size: 1.5rem;
        span{
            font-size: 1.6rem;
            margin-left: 0.5rem;
        }
        s{
            font-size: 1.2rem;
            color: #C0C8D3;
            font-weight: normal;
            margin-left: 0.9rem;
        }
    }
}
.sel{
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem;
    background: #fff;
    margin-top: 0.9rem;
    margin-bottom: 0.9rem;
    color: #222;
    div{
        display: flex;
        align-items: center;
    }
    .van-icon{
        top: 1px;
        margin-left: 0.4rem;
    }
    font{
        color: $color;
    }
    .col{
        color: $color;
    }
}
.d_detail{
    background: #fff;
    padding-bottom: 1rem;
    .remark{
        text-align: center;
        padding: 1rem;
        span{
            position: relative;
            color: $color;
            &::before{
                content: '';
                position: absolute;
                top: 0.8rem;
                left: -2.5rem;
                width: 2rem;
                height: 0.1rem;
                background: $color;
            }
            &::after{
                content: '';
                position: absolute;
                top: 0.8rem;
                right: -2.5rem;
                width: 2rem;
                height: 0.1rem;
                background: $color;
            }
        }
    }
}
.d_vip{
    letter-spacing: 0;
    color: #bbb;
    position: relative;
    top: 2px;
    font-size: 1.2rem;
}
/* -----------底部栏css */
.footer{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: #fff;
    border-top: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    img{
        width: 2rem;
    }
    .handle{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        padding-left: 0.5rem;
        width: 40%;
        &>div{
            width: 30%;
            text-align: center;
        }
    }
    .confirm{
        display: flex;
        width: 60%;
        button{
            background: $color;
            color: #fff;
            font-size: 1.4rem;
            font-weight: bold;
            width: 50%;
            height: 4.3rem;
        }
        .btn_cart{
            background: #FEE7D7;
            color: #EE8B42;
        }
        .no_shop{
            // opacity: .4;
            width: 100%;
            background: rgba(0,0,0, .4);
        }
    }
}

/* 优惠券 */
.coupon_tit{
    text-align: center;
    color: $color;
    font-weight: bold;
    font-size: 1.52rem;
    padding-top: 3.2vw;
    padding-bottom: 1.4vw;
}
.coupon_close{
    text-align: center;
    background: $color;
    color: #fff;
    height: 3.81rem;
    line-height: 3.81rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}
.coupon_list{
    height: 85vw;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}
.card{
    display: flex;
    align-items: center;
    margin-left: 3vw;
    margin-right: 3vw;
    margin-top: 0.9rem;
    overflow: hidden;
    letter-spacing: 0;
    background-color: #FFEFEE;
    .shop_img{
        width: 25vw;
        height: 25vw;
        background-image: url('../../assets/img/my/coupon.png');
        background-size: 100% auto;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div{
            font-size: 2.5rem;
            margin-bottom: 0.4rem;
            span{
                font-size: 1.4rem;
            }
        }
        &>span{
            font-size: 1rem;
            color: #eee;
        }
    }
    .d_card{
        height: 25vw;
        width: 53vw;
        font-size: 1.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 0.9rem;
        box-sizing: border-box;
        &>p{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-size: 1.7rem;
            margin-top: 1rem;
            color: #000000;
        }
        .classify{
            font-size: 1.2rem;
        }
        .time{
            font-size: 0.95rem;
            color: $gary;
            border-top: 1px solid #DFBDC7;
            padding: 0.8rem 0;
        }
    }
    .tesu_btn{
        height: 25vw;
        width: 16vw;
        font-size: 1.33rem;
        text-align: center;
        color: $color;
        box-sizing: border-box;
        padding: .5rem 0;
        div{
            border-left: 1px dashed $color;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            
        }
    }
    .yesDraw{
        color: #aaa;
        div{
            border-left: 1px dashed #aaa;
        }
    }
    .tesu_btn:hover{
        opacity: .6;
        font-weight: bold;
    }
}
/* 宝贝评价 */
#score{
    .page_head{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4.6rem;
        color: #000;
        border-bottom: 1px solid #f5f5f5;
        i{
            font-size: 2.3rem;
            margin-left: 0.7rem;
        }
        p{
            margin-right: 2.2rem;
            font-size: 1.6rem;
        }
    }
    .score_list{
        height: calc(100vh - 4.6rem);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .score_card{
        padding: 1rem 1rem;
        font-size: 1.14rem;
        color: #000;
        .to_user{
            display: flex;
            margin-bottom: 0.3rem;
            li{
                height: 3.2rem;
                width: 3.2rem;
                margin-right: 1rem;
            }
            div{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
            span{
                color: $gary;
            }
        }
        .score_con{
            margin-left: 3.2rem;
            background: #F6F6F6;
            line-height: 2rem;
            padding: 0.65rem 1rem;
            border-radius: 0.5rem;
            font-size: 1.33rem;
        }
    }
}

</style>
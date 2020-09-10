<template>
    <div id="goods_detail">
        <div class="d_banner">
            <swiper :options="swiperOption" class="d_swiper" v-if="shopImgs.length>0">
                <swiper-slide v-for="(item,index) in shopImgs" :key="index" class="d_slide">
                    <img :src="item | fullPath" />
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>	
            </swiper>
            <p class="d_back" @click="$router.go(-1)"><van-icon name="arrow-left" /></p>
        </div>
        <div class="d_con">
            <p>{{detail.productName}}</p>
            <div class="d_count">
                <span>商品11编号： {{detail.id}}</span>
                <span>销量： {{detail.salesVolume}}</span>
            </div>
            <div class="d_count">
                <span class="brand">商品分类： {{classify.name}}</span>
                <!-- <div>
                    <button class="lab-1">{{detail.minBuyNum}}个起订</button>
                    <button class="lab-2">{{detail.surplusNum? '库存充足':'库存不足'}}</button>
                </div> -->
                <div><button class="lab-2" @click="$router.push('/search?categoryId='+classify.id)">点击浏览同类商品</button></div>
            </div>
            <div class="d_price" v-if="isLogin">
                专享会员价: <span >￥{{$store.state.all.exclusiveDiscount? (detail.currentPrice*$store.state.all.exclusiveDiscount/10).toFixed(2) : detail.currentPrice.toFixed(2)}}</span>
                <s>普通会员价: ￥{{detail.oldPrice.toFixed(2)}}</s>
            </div>
            <div class="d_price" v-else>马上升级会员，享受更高优惠</div>
        </div>

        <div class="sel" @click="show=true">
            <span>共 <font color="#DB4141">{{sku.list.length}}</font> 种规格</span>
            <div><span>请选择规格</span><van-icon name="arrow" /></div>
        </div>
        <div class="d_detail">
            <p class="remark"><span>商品详情</span></p>
            <div v-html="detail.productDesc"></div>
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
                <button @click="show=true">加入购物车</button>
                <button @click="show=true" v-if="detail.status==1">立即购买</button>
                <button v-else>商品已下架</button>
            </div>
        </div>

        <!-- 弹框 -->
        <van-sku
            v-model="show"
            :sku="sku"
            :goods="goods"
            :goods-id="goodsId"
            :hide-stock="sku.hide_stock"
            :start-sale-num="detail.minBuyNum"
            @buy-clicked="onBuyClicked"
            @add-cart="onAddCartClicked"
            :buy-text="detail.status==1? '立即购买':'商品已下架'"
            ref="getSku"
        >
            <template slot="sku-header-price" slot-scope="props">
                <div class="van-sku__goods-price">
                    <span class="van-sku__price-symbol">￥</span>
                    <span class="van-sku__price-num" v-if="!$store.state.all.exclusiveDiscount">{{ Number(props.price).toFixed(2)}}</span>
                    <span class="van-sku__price-num" v-if="$store.state.all.exclusiveDiscount">{{ Number(props.price*$store.state.all.exclusiveDiscount/10).toFixed(2)}}</span>
                    <del class="d_vip" v-if="$store.state.all.exclusiveDiscount">￥{{ Number(props.price).toFixed(2)}}</del>
                </div>
            </template>
        </van-sku>

        <!-- <Share ref="share"/> -->
    </div>
</template>

<script>
// import Share from '@/components/utils/Share'

export default {
    // components:{
    //     Share
    // },
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
            detail: {
                currentPrice: 0,
                oldPrice: 0,
            },
            classify: {},
            collectId: 0,
            shopImgs: [],
            //商品规格
            sku: {
                // 数据结构见下方文档
                // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
                // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
                tree: [
                    // {
                    //     k: '颜色', // skuKeyName：规格类目名称
                    //     v: [
                    //         {
                    //             id: '30349', // skuValueId：规格值 id
                    //             name: '红色', // skuValueName：规格值名称
                    //             imgUrl: 'https://img.yzcdn.cn/2.jpg', // 规格类目图片，只有第一个规格类目可以定义图片
                    //         },
                    //     ],
                    //     k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                    // },

                ],
                // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
                list: [
                    {
                        id: 2259, // skuId，下单时后端需要
                        price: 0, // 价格（单位分）
                        s1: '1215', // 规格类目 k_s 为 s1 的对应规格值 id
                        s2: '1192', // 规格类目 k_s 为 s2 的对应规格值 id
                        s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                        stock_num: 0 // 当前 sku 组合对应的库存
                    },
                ],
                price: 1, // 默认价格（单位元）
                stock_num: 227, // 商品总库存
                collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
                none_sku: false, // 是否无规格商品
                
            },
            goods: {
                picture: ''
            },

            isAddress: false,
            isLogin: false

        }
    },

    

    methods:{
        showShare(){
            this.$refs.share.flag= true;
            console.log(this.$refs.share.flag)
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
                    id: this.goodsId
                },
                success: res => {
                    this.detail=res.productInfo;
                    this.collectId=res.isCollection;
                    this.shopImgs=JSON.parse(res.productInfo.productImgs);
                    this.goods.picture=this.$common.getUrl()+res.productInfo.productCover;
                    this.sku.stock_num=res.productInfo.surplusNum; 
                    this.sku.price=res.productInfo.currentPrice; 
                    this.classify=res.productCategory;
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
            if(this.collectId){    //取消收藏
                this.$request.post({
                    url: '/us/collection/cancelCollection',
                    params: {
                        id: this.collectId
                    },
                    success: res => {
                        this.getDetail();
                    },
                    finally: () => {
                        loading.clear();
                    }
                });
            }else{    
                this.$request.post({
                    url: '/us/collection/collection',
                    params: {
                        productInfoId: this.goodsId
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

        //----------------规格组件相关-----------
        //购买,结算
        onBuyClicked(data){         //点击购买回调
            if(this.detail.status!=1) return
            let productSpecsValue,imgUrl;
            var picture=this.goods.picture;
            imgUrl=picture.substring(picture.search('/files'))
            var selectedSkuValues=this.$refs.getSku.selectedSkuValues;
            let selectedSkuName=[];
            selectedSkuValues.forEach(item=>{
                selectedSkuName.push(item.name)
                if(item.imgUrl){
                    imgUrl=item.imgUrl.substring(item.imgUrl.search('/files'))
                }
            })
            productSpecsValue=selectedSkuName.join(';');
            let productSpecsId,productSpecsPrice,productNum;
            if(data){
                productSpecsId=data.selectedSkuComb.id;
                productNum=data.selectedNum;
                productSpecsPrice=data.selectedSkuComb.price/100;
            }
            var form= [{
                productId: this.goodsId,
                productName: this.detail.productName,
                productNum: productNum,
                productSpecsId: productSpecsId,
                productSpecs: productSpecsValue,
                productPrice: productSpecsPrice,
                productCover: imgUrl,
                deliverPrice: this.detail.deliverPrice,
            }]
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/order/addSettle',
                params: {
                    data: JSON.stringify(form)
                },
                success: result =>{
                    this.$router.push('/order_confirm/'+result)
                },
                finally: ()=>{
                    loading.clear();
                }
            })
            
        },

        //加入购物车
        onAddCartClicked(data){
            let productSpecsValue,imgUrl;
            var picture=this.goods.picture;
            imgUrl=picture.substring(picture.search('/files'))
            var selectedSkuValues=this.$refs.getSku.selectedSkuValues;
            let selectedSkuName=[];
            selectedSkuValues.forEach(item=>{
                selectedSkuName.push(item.name)
                if(item.imgUrl){
                    imgUrl=item.imgUrl.substring(item.imgUrl.search('/files'))
                }
            })
            productSpecsValue=selectedSkuName.join(';');
            let productSpecsId,productSpecsPrice,productNum;
            if(data){
                productSpecsId=data.selectedSkuComb.id;
                productNum=data.selectedNum;
                productSpecsPrice=data.selectedSkuComb.price/100;
            }
            this.$request.post({
                url: '/us/shoppingCart/add',
                params: {
                    productId: this.goodsId,
                    productSpecsId: productSpecsId,
                    productNum: productNum,
                    productSpecsPrice: productSpecsPrice,
                    productSpecsValue: productSpecsValue,
                    imgUrl: imgUrl
                },
                success: res => {
                    this.$toast.success('已加入购物车')
                    this.show=false
                },
            });
        },

        //获取全部规格
        getParent(){
            this.$request.post({
                url: '/us/productAttributeKey/public/details',
                params: {
                    productId: this.goodsId,
                },
                success: res =>{
                    var list=res;
                    list.forEach(item => {
                        item.k_s=item.ks;
                        item.v.forEach(i=>{
                            i.name=i.attributeValue
                            if(i.imgUrl){
                                i.imgUrl=this.$common.getUrl()+i.imgUrl
                            }
                        })
                    });
                    this.sku.tree=list;
                }
            })
        },

        //获取组合规格
        getSpecList(){
            this.$request.post({
                url: '/us/productSpecs/public/list',
                params: {
                    productId: this.goodsId,
                },
                success: res =>{
                    var list=res;
                    list.forEach(item=>{
                        item.stock_num=item.stockNum
                        item.price=item.price*100
                    })
                    this.sku.list=list;
                    console.log(list)
                }
            })
        },

        //获取地址
        getAddressList(){
            this.$request.post({
                url: '/us/address/list',
                success: res => {
                    this.isAddress= res.length==0?false:true;
                },
            });
        },
        
        

    },

    mounted(){
        window.scrollTo(0, 0);
        // this.getAddressList();
        this.goodsId= this.$route.query.id;
        if(this.goodsId){
            this.getDetail();
            this.getParent();
            this.getSpecList();
        }
        this.show= this.$route.query.cart==-1? true: false
        let token= localStorage.getItem('userToken')
        if(token){
            this.$store.dispatch('all/setUser');
            this.isLogin=true;
        }
        // this.$refs.share.tuneUp(this.$common.getUrl()+'/user/goods_detail?id='+this.goodsId, _ => {})
    }
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
    font-size: 1.4rem;
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
    .d_back{
        position: absolute;
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
    padding: 1.5rem 1rem 1.2rem 1rem;
    letter-spacing: 0;
    color: #C0C8D3;
    p{
        font-size: 1.8rem;
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
    .d_count{
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.6rem;
        button{
            border-radius: 0.3rem;
            padding: 0.1rem 0.8rem;
        }
        .lab-1{
            background: #FEE7D7;
            color: #E9AF84;
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
        color: #F05447;
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
            margin-left: 0.5rem;
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
}
.d_detail{
    background: #fff;
    padding-bottom: 1rem;
    .remark{
        text-align: center;
        padding: 1rem;
        span{
            position: relative;
            color: #294D7D;
            &::before{
                content: '';
                position: absolute;
                top: 0.8rem;
                left: -2.5rem;
                width: 2rem;
                height: 0.1rem;
                background: #294D7D;
            }
            &::after{
                content: '';
                position: absolute;
                top: 0.8rem;
                right: -2.5rem;
                width: 2rem;
                height: 0.1rem;
                background: #294D7D;
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
        &>button:first-child{
            background: #FEE7D7;
            color: #EE8B42;
        }
    }
}
</style>
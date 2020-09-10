<template>
    <div id="order_confirm">
        <pageHeader/>
        <div class="address" @click="showAddress=true">
            <div class="d_address" >
                <span class="iconfont iconimg">&#xe619;</span>
                <div>
                    <p><span>{{address.receiveName}}</span><span>{{address.receivePhone}}</span></p>
                    <p>{{address.region}} {{address.details}}</p>
                </div>
            </div>
            <van-icon color="#ccc" size="1.6rem" name="arrow" />
        </div>

        <div  v-for="itemChild in goodsList">
            <div class="card">
                <div class="d_card" v-for="item in itemChild">
                    <div>
                        <img :src="item.images | fullPath">
                        <div>
                            <p>{{item.productTitle}}</p>
                            <span class="d_size">{{item.skuSpecs}}</span>
                        </div>
                    </div>
                    <div class="d_price">
                        <p>￥{{item.price.toFixed(2)}}</p><!-- (vip? item.price*vip/10 : item.price) -->
                        <span>x{{item.productNum}}</span>
                    </div>
                </div>
                <!-- <div class="shopattr" v-if="vip">
                    <span>会员专享折扣</span>
                    <p style="color: #F05447">{{vip}}折</p>
                </div> -->
                <div class="shopattr" @click="show=true">
                    <span>配送方式</span>
                    <p>{{itemChild.deliveryMoney? '快递 ￥'+itemChild.deliveryMoney.toFixed(2): '快递 免邮'}}</p><!-- <van-icon color="#ccc" size="1.6rem" name="arrow" /> -->
                </div>
                <div class="shopattr" v-if="itemChild[0].couponFlowVOList.length!=0" @click="openCoupon(itemChild)">
                    <span>商品优惠</span>
                    <p><a>-￥{{itemChild.couponMoney.toFixed(2)}}</a>&nbsp;&nbsp;<van-icon color="#ccc" size="1.6rem" name="arrow" /></p>
                </div>
            </div>
        </div>

        <div class="d_remark">
            <div class="express" v-if="vip">
                <span>会员专享折扣</span>
                <p style="color: #F05447">{{vip}}折</p>
            </div>
            <div>
                <span>订单备注</span>
                <input type="text" placeholder="选填，请输入订单备注信息" v-model="orderNotes">
            </div>
        </div>

        <!-- 底部栏 -->
        <div class="footer">
            <span>共{{allNum}}件</span>
            <div>
                <p v-if="radio=='1'" class="d_total">总计: <span>￥{{changePrice.toFixed(2)}}</span></p>
                <p v-else class="d_total">总计: <span>￥{{(changePrice/2 + changePrice*procedurePrice + (deliveryPrice==''? 0:deliveryPrice)).toFixed(2)}}</span></p>
            </div>
            <div class="btn">
                <button @click="submit">提交订单</button>
            </div>
        </div>

        <!-- 弹框 -->
        <van-popup v-model="showAddress" position="right" :overlay="true" style="z-index: 2025;width:  100%;height: 100vh;" >
            <div id="address">
                <div class="pageHeader">
                    <img src="@/assets/img/back.png" alt="返回" @click="showAddress=false">
                    <p>我的地址</p>
                    <div>&nbsp;</div>
                </div>
                <div class="skip" @click="$router.replace('/address_edit?type=1')">添加收货地址</div>
                <div class="d_list">
                    <div class="card" v-for="(item,index) in list">
                        <div @click="seleAddress(item)">
                            <li>{{index+1}}</li>
                            <div>
                                <p>{{item.contactName}}&nbsp;&nbsp;{{item.contactPhone}}</p>
                                <span>{{item.region+' '+item.details}}</span>
                            </div>
                        </div>
                        <!-- <p @click="$router.push('/address_edit?type=1&id='+item.id)">编辑</p> -->
                    </div>
                </div>
                <div v-if="list.length==0" class="no_data">暂未添加地址</div>
            </div>
        </van-popup>  

        <!-- <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
            <div class="d_pop">
                <p class="pop_tit">配送方式</p>
                <van-radio-group v-model="radio">
                    <van-radio name="1" label-position="left">快递 免邮</van-radio>
                </van-radio-group>
                <div class="big_btn" @click="show=false"><button>完成</button></div>
            </div>
        </van-popup> -->

        <van-popup v-model="showCoupon" position="bottom" :style="{ height: '50%' }">
            <div v-for="(itemChild,index) in goodsList">
                <div class="d_pop" v-if="activeGoodsId==itemChild.productId">
                    <p class="pop_tit">商品优惠</p>
                    <van-radio-group v-model="couponSeleList[index]">
                        <van-radio :name="item.couponId" label-position="left" v-for="item in itemChild.couponList" @click="couponClick(item)">
                            <a class="coupon_a">￥{{item.productCoupon.money.toFixed(2)}}</a>{{item.productCoupon.condition}}
                        </van-radio>
                    </van-radio-group>
                    <div class="big_btn" @click="showCoupon=false"><button>完成</button></div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    data(){
        return{
            /* 优惠券和运费 */
            show: false,
            radio: '1',
            showCoupon: false,
            radioCoupon: 0,
            couponSeleList: [],
            activeGoodsId: '',

            goodsList: [],
            address: {},
            showAddress: false,
            list: [],
            orderNotes: '',
            allPrice: 0,
            allNum: 0,
            changePrice: 0,
            deliveryPrice: 0,
            procedurePrice: 0,   //手续费
            toRouter: false,
            vip: 0,
            deliveryText: '',
            serviceText: '',

        }
    },

    methods:{
        //提交订单
        submit(){
            if(!this.address.id){this.$toast.fail('请选择地址');return}
            let couponSeleList= [];
            console.log(this.goodsList)
            this.goodsList.forEach(item=>{
                if(item.seleCouponId){
                    let obj={
                        productId: item.productId,
                        couponId: item.seleCouponId,
                    }
                    couponSeleList.push(obj)
                }
            })

            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/orderInfo/subSettle',
                params:{
                    code: this.$route.params.code,
                    addressId: this.address.id,
                    orderNotes: this.orderNotes,
                    data: JSON.stringify(couponSeleList)

                },
                success: res=>{
                    // this.toRouter=false;
                    this.$router.replace('/pay?id='+res)
                },
                finally: ()=>{
                    loading.clear();
                }
            })
        },

        //获取准备订单信息
        getSettle(){
            this.$request.post({
                url: '/us/orderInfo/getSettle',
                params:{
                    code: this.$route.params.code
                },
                success: res=>{
                    res.forEach(itemChild=>{
                        itemChild.forEach(item=>{
                            this.allNum+=item.productNum;
                            this.allPrice+=(item.price* item.productNum);
                            itemChild.couponList= item.couponFlowVOList;
                            itemChild.productId= item.productId;
                            itemChild.deliveryMoney= item.deliveryMoney;

                            if(item.couponFlowVOList.length>0){
                                itemChild.couponMoney= item.couponFlowVOList[0].productCoupon.money;
                                itemChild.seleCouponId= item.couponFlowVOList[0].couponId;
                                this.couponSeleList.push(item.couponFlowVOList[0].couponId)
                            }
                        })
                    })
                    this.goodsList=res;
                    console.log(res)

                    if(this.vip){
                        this.allPrice= this.allPrice*this.vip/10;
                    }
                    let couponMoneys= 0;
                    let deliveryMoney= 0;
                    res.forEach(itemChild=>{
                        if(itemChild.couponMoney){
                            couponMoneys+=itemChild.couponMoney;
                        }
                        if(itemChild.deliveryMoney){
                            deliveryMoney+=itemChild.deliveryMoney;
                        }
                    })
                    this.allPrice=this.allPrice+ deliveryMoney;

                    this.changePrice= this.allPrice-couponMoneys;
                    this.deliveryMoney=res.deliveryMoney;
                    this.serviceText= res.poundagePrompt;
                    this.procedurePrice= res.depPayPoundage;
                },
                error: (res)=>{
                    if(res=="支付超时，请重新下单"){
                        this.$router.go(-1)
                    }
                },
                finally: ()=>{
                }
            })
        },
        //获取地址
        getList(){
            this.$request.post({
                url: '/us/address/list',
                success: res => {
                    this.list=res;
                    res.forEach((item,index) => {
                        if(index==0){
                            this.address=item;
                        }
                        if(item.isDefault==1){
                            this.address=item;
                        }
                    });
                },
            });
        },
        seleAddress(item){
            this.address=item;
            this.showAddress=false
        },

        //打开优惠券弹窗
        openCoupon(item){
            this.showCoupon=true
            this.activeGoodsId= item.productId;
        },
        
        //单选框改变时
        couponClick(item){
            console.log(item)
            this.goodsList.forEach(itemChild=>{
                if(item.productId==itemChild.productId){
                    itemChild.couponMoney= item.productCoupon.money;
                    itemChild.seleCouponId= item.couponId;
                }
            })
            let couponMoneys= 0;
            this.goodsList.forEach(itemChild=>{
                if(itemChild.couponMoney){
                    couponMoneys+=itemChild.couponMoney;
                }
            })
            this.changePrice= this.allPrice-couponMoneys;
        }
    },

    mounted(){
        this.$store.dispatch('all/setUser');
        this.vip= localStorage.getItem('vip')? localStorage.getItem('vip'): 0;
        this.getSettle();
        this.getList();

    },

    beforeRouteLeave (to, from , next) {
        if(to.path=='/pay'){
            next()
        }else{
            //清除redis里的订单数据
            this.$request.post({
                url: '/us/orderInfo/delSettle',
                params:{
                    code: this.$route.params.code
                },
                success: res=>{
                    next()
                },
                allError: res=>{
                    next(false)
                }
            })
        }
    },
    

    
}
</script>

<style lang=scss>
@import '@/assets/css/public.scss';
#order_confirm .van-stepper__minus{
    background-color: #fff;
    color: $color;
    border: 1px solid $color
}
#order_confirm .van-stepper__plus{
    background-color: $color;
    color: #fff;
    border: 1px solid $color;
}
#order_confirm .van-stepper__input{
    background: #fff;
    color: #F05447;
}
#order_confirm .van-radio__icon--checked .van-icon{
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';

#order_confirm{
    padding: 5.6rem 1rem 1rem 1rem;
    font-size: 1.4rem;
    padding-bottom: 4.8rem;
    .van-radio{
        justify-content: space-between;
        margin-top: 1rem;
    }
}
.address{
    background: #fff; 
    letter-spacing: 0;
    color: #222;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 1rem;
    border-radius: 0.5rem;
}
.d_address{
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    .iconimg{
        margin-right: 0.8rem;
        margin-left: 0.5rem;
        font-size: 3rem;
        color: $color;
    }
    p:first-child{
        margin-bottom: 0.7rem;
    }
    p{
        font-size: 1.2rem;
        span{
            font-size: 1.4rem;
        }
        &>span:first-child{
            font-weight: bold;
            margin-right: 1rem;
        }
    }
}
/* 列表css */
.card{
    background: #fff;
    border-radius: 0.5rem;
    letter-spacing: 0;
    margin-top: 1rem;
    img{
        width: 4.8rem;
        width: 4.8rem;
        border-radius: 0.5rem;
        display: block;
        margin-right: 0.9rem;
    }
    .d_card{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        padding: 0.9rem;
        color: #222;
        &>div:first-child{
            display: flex;
            align-items: center;
            p{
                overflow:hidden;
                text-overflow: ellipsis;//显示省略号
                display:-webkit-box;
                -webkit-line-clamp: 1;//块元素显示的文本行数
                /*! autoprefixer: off */
                -webkit-box-orient: vertical;
                /* autoprefixer: on */
            }
        }
        &>div:last-child{
            text-align: right;
        }
        .d_size{
            background: #f6f6f6;
            color: #C0C8D3;
            font-size: 1rem;
            padding: 0.1rem 0.5rem;
            border-radius: 0.2rem;
            display: inline-block;
            margin-top: 0.6rem;
        }
        .d_price{
            color: #9099A8;
            margin-left: 0.5rem;
            p{
                color: $color;
                font-weight: bold;
                font-size: 1.5rem;
                margin-bottom: 0.4rem;
            }
        }
    }

    .shopattr{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        padding: 1rem;
        font-size: 1.33rem;
        span{
            color: #333;
        }
        p{
            display: flex;
            align-items: center;
            color: #666;
        }
        a{
            color: #E6A23C;
            font-size: 1.2rem;
            letter-spacing: 0;
        }
    }
}

.d_remark{
    background: #fff; 
    color: #222;
    border-radius: 0.5rem;
    margin-top: 1rem;
    margin-bottom: 2.2rem;
    &>div{
        display: flex;
        align-items: center;
        padding: 1rem 1rem;
    }
    .express{
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        p{
            display: flex;
            align-items: center;
            color: #666;
        }
        .vip{
            letter-spacing: 0;
            a{
                font-size: 1.3rem;
                color: #E6A23C;
            }
        }
        a{
            color: #E6A23C;
            font-size: 1.2rem;
            letter-spacing: 0;
        }
    }
    input{
        border: none;
        width: 20.5rem;
        margin-left: 1.2rem;
    }
}
/* ----------底部css------- */
.footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    height: 4.7rem;
    font-size: 1rem;
    letter-spacing: 0;
    &>span{
        font-size: 1.52rem;
        color: #111;
        font-weight: bold;
        margin-left: 1rem;
    }
    .d_total{
        font-size: 1.4rem;
        font-weight: bold;
        letter-spacing: 0;
        span{
            color: $color;
        }
    }
    .btn{
        display: flex;
        button{
            color: #fff;
            height: 4.7rem;
            width: 9.4rem;
            font-size: 1.52rem;
            letter-spacing: 1px;
            background: $color;
        }
    }
}
/* ----------地址css---------- */
#address{
    padding-top: 4rem;
    font-size: 1.4rem;
    color: #222;
    .skip{
        position: fixed;
        right: 1rem;
        top: 1.4rem;
        z-index: 199;
        font-size: 1.2rem;
        letter-spacing: 0;
    }
    .d_list{
        margin: 0.9rem;
        background: #fff;
        border-radius: 0.5rem;
    }
    .card{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.9rem;
        letter-spacing: 0;
        border-bottom: 1px solid #f3f3f3;
        &>div{
            display: flex;
            align-items: center;
            // border-right: 1px solid #f3f3f3;
            width: 90%;
            p{
                margin-bottom: 0.5rem;
            }
            span{
                font-size: 1.2rem;
            }
        }
        li{
            background: #f5f5f5;
            color: #C0C8D3;
            width: 1.8rem;
            height: 1.8rem;
            text-align: center;
            line-height: 1.8rem;
            border-radius: 50%;
            font-size: 1.3rem;
            margin-right: 0.8rem;
        }
        &>p{
            color: #9099A8;
            text-align: right;
            padding-left: 0.5rem;
            width: 10%;
        }
    }
}
.pageHeader{
    position: fixed;
    width: 100%;
    height: 4rem;
    line-height: 4rem;
    top: 0;
    left: 0;
    background-color: #fff;
    color: #333;
    z-index: 100;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
        height: 1.8rem;
        display: block;
        margin-left: 1rem;
    }
    p{
        margin-right: 2.2rem;
        font-size: 1.6rem;
    }
}
/* ----------弹框 */
.d_pop{
    padding: 0 1rem;
    p{
        text-align: center;
        color: #111;
        font-size: 1.5rem;
        padding: 1rem 0;
    }
    .big_btn{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
    }
    button{
        background: $color;
        color: #fff;
        width: 100%;
        height: 3.8rem;
        border-radius: 3.8rem;
    }
    .coupon_a{
        color: #E6A23C;
        margin-right: 1.5rem;
        font-size: 1.5rem;
    }
}
</style>
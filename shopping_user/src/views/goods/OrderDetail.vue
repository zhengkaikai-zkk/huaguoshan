<template>
    <div id="order_detail">
        <pageHeader/>
        <div class="d_address">
            <span class="iconfont iconimg">&#xe619;</span>
            <div>
                <p><span>{{detail.receiveName}}</span><span>{{detail.receivePhone}}</span></p>
                <p>{{detail.receiveAddress}}</p>
            </div>
        </div>

        <div class="card">
            <div class="d_tit">
                <span>商品信息</span>
                <font v-for="i in statusList" v-if="detail.status == i.status" color="#EE8B42">{{i.name}}</font>
            </div>
            <div class="d_card" v-for="item in goodsList" @click="$router.push('/goods_detail?id='+item.productId)">
                <div class="d_img">
                    <van-image width="100%" height="100%" fit="cover" lazy-load :src="item.images | fullPath" />
                </div>
                <div class="d_con">
                    <p>{{item.productTitle}}</p>
                    <span>{{item.skuSpecs}}</span>
                    <div>
                        <font>￥{{(item.price * detail.exclusiveDiscount/10).toFixed(2)}}</font>
                        <span>x{{item.productNum}}</span>
                    </div>
                </div>
            </div>
            <div class="handle">
                <!-- <div class="">
                    <span>折扣</span>
                </div> -->
                <div>
                    共{{goodsList.length}}件商品&nbsp;&nbsp;
                    <a style="margin: .5rem">合计：￥{{(detail.totalPrice*detail.exclusiveDiscount/10)}}</a>
                    {{detail.payType?'实':'需'}}付款：<font>￥{{Number(detail.payPrice).toFixed(2)}}</font>
                </div>
                <div class="notice">( *注：需付款= 合计 + 运费合计 - 优惠合计 )</div>
                <div>
                    <button v-if="detail.status==0" class="btn_1" @click="showCancel=true">取消订单</button>
                    <button v-if="detail.status==0" class="btn_2" @click="$router.push('/pay?id='+id)">立即付款</button>
                    <button v-if="detail.status==2" class="btn_2" @click="doReceive">确认收货</button>
                    <button v-if="detail.status==1" class="btn_1" @click="$router.push('/refund?id='+id)">申请退款</button>
                    <span v-if="detail.status==-3">退款成功</span>
                    <button v-if="detail.status==3" class="btn_2" @click="$router.push('/evaluation?id='+id)">立即评价</button>
                    <button v-if="detail.status==4 || detail.status==-1 || detail.status==-3" class="btn_1" @click="remove">删除订单</button>
                </div>
            </div>
        </div>

        <div class="d_order">
            <p>订单信息</p>
            <li>
                <span>订单编号: {{detail.orderNo}}</span>
                <font color="#EE8B42" @click="$common.copy(detail.orderNo)">复制</font>
            </li>
            <li v-if="detail.expressNumber">
                <span>物流单号: {{detail.expressNumber}}</span>
                <font color="#EE8B42" @click="$common.copy(detail.expressNumber)">复制</font>
            </li>
            <li v-if="detail.expressCompany">订单备注: {{detail.orderNotes}}</li>
            <li v-if="detail.expressCompany">快递公司: {{detail.expressCompany}}</li>
            <li>运费合计&nbsp;: ￥{{detail.deliveryTotalMoney}}.00</li>
            <li>优惠合计&nbsp;: ￥{{Number(detail.couponTotalMoney).toFixed(2)}}</li>
            <!-- <li >商品优惠&nbsp;&nbsp;&nbsp;: 满10减10</li> -->
            <li>创建时间: {{$common.getDate(detail.createTime)}}</li>
            <li v-if="detail.payTime">付款时间: {{$common.getDate(detail.payTime)}}</li>
            <li v-if="detail.deliveryTime">发货时间: {{$common.getDate(detail.deliveryTime)}}</li>
            <li v-if="detail.receiveTime">完成时间: {{$common.getDate(detail.receiveTime)}}</li>
        </div>

        <!-- 弹框 -->
        <van-popup v-model="showCancel" position="bottom">
            <div class="d_popup">
                <div class="tit">取消订单</div>
                <span>请选择取消订单的原因</span>
                <van-radio-group v-model="reason">
                    <van-cell-group>
                        <van-cell :title="item" v-for="item in reasonList" clickable @click="reason = item">
                            <van-radio slot="right-icon" :name="item"/>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
                <div class="confirm">
                    <button @click="showCancel=false">暂不取消</button>
                    <button @click="cancel">确定取消</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    data(){
        return{
            status: 3,
            active: 4,
            
            id: '',
            detail: {
                status: 1,
                totalAmount: 0,
                totalPrice: 0,
                payPrice: 0,
                exclusiveDiscount: 10,
                couponTotalMoney: 0,

            },
            goodsList: [],
            user: {},
            statusList: [
                {status: -3,name: '退款成功'},
                {status: -2,name: '交易关闭'},
                {status: -1,name: '退款中'},
                {status: 0,name: '待付款'},
                {status: 1,name: '待发货'},
                {status: 2,name: '待收货'},
                {status: 3,name: '待评价'},
                {status: 4,name: '交易完成'},
                {status: 10,name: '已删除'},
            ],
            showCancel: false,
            reasonList: [
                '我不想买了',
                '信息填写错误，重新拍',
                '卖家缺货',
                '其他原因',
            ],
            reason: '我不想买了',
        }
    },

    methods:{
        getDetail(){
            this.$request.post({
                url: '/us/orderInfo/details',
                params: {
                    id: this.id
                },
                success: res =>{
                    this.goodsList=res.orderProducts;
                    this.detail=res.orderInfo;
                    this.user=res.usAddress;
                },
            })
        },

        //删除
        remove(){
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/orderInfo/delete',
                params: {
                    id: this.id,
                },
                success: res => {
                    this.$toast.success('删除成功');
                    this.$router.replace('/order')
				},
				finally: () => {
                    loading.clear();
                }
            })
        },

        //确认收货
        doReceive(){
            this.$dialog.confirm({
                title: '提示',
                message: '是否要确认收货吗？'
                }).then(() => {
                    this.$request.post({
                        url: '/us/orderInfo/receive',
                        params: {
                            id: this.id,
                        },
                        success: res => {
                            this.$toast.success('确认收货成功');
                            this.getDetail();
                        },
                        finally: () => {

                        }
                    })
                }).catch(() => {
                // on cancel
            });
        },

        //取消订单
        cancel(){
            this.showCancel=false
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/orderInfo/cancel',
                params: {
                    id: this.id,
                    reason: this.reason
                },
                success: res => {
                    this.$toast.success('已取消订单');
                    this.$router.replace('/order')
				},
				finally: () => {
                    loading.clear();
                }
            })
        },
        
    },

    mounted(){
        this.id= this.$route.query.id;
        if(this.id){
            this.getDetail();
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/css/public.scss';
#order_detail .van-radio__icon--checked .van-icon{
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#order_detail{
    padding: 5.6rem 1rem 1rem 1rem;
}
.d_address{
    background: #fff;
    letter-spacing: 0;
    color: #222;
    display: flex;
    align-items: center;
    padding: 1.2rem 1rem;
    border-radius: 0.5rem;
    .iconimg{
        margin-right: 0.8rem;
        margin-left: 0.5rem;
        font-size: 3.1rem;
        color: $color;
    }
    p:first-child{
        margin-bottom: 0.7rem;
    }
    p{
        font-size: 1.1rem;
        span{
            font-size: 1.33rem;
        }
        &>span:first-child{
            font-weight: bold;
            margin-right: 1rem;
        }
        
    }
}
.d_order{
    background: #fff;
    border-radius: 0.5rem;
    padding-bottom: 2.3rem;
    font-size: 1.2rem;
    color: #222;
    margin-top: 1rem;
    &>p{
        height: 3.6rem;
        display: flex;
        align-items: center;
        padding: 0 0.9rem;
        border-bottom: 1px solid #f5f5f5;
        font-size: 1.33rem;
    }
    &>li{
        display: flex;
        justify-content: space-between;
        padding: 1rem 1rem 0 1rem;
    }
}
/* --------------物流组件css--------------- */
.logistics{
    letter-spacing: 0;
    color: #9099A8;
    padding: 1rem;
    &>div{
        display: flex;
        align-items: flex-start;
    }
    .d_time{
        font-size: 1rem;
        margin-right: 0.8rem;
    }
    .d_line{
        position: relative;
        width: 1rem;
        margin-top: 0.7rem;
        .bag{
            position: absolute;
            top: 0;
            z-index: 200;
            background: #fff;
        }
    }
    .d_log{
        font-size: 1.33rem;
        margin-top: 0.4rem;
        margin-left: 0.7rem;
        position: relative;
        div{
            display: flex;
            align-items: center;
        }
        p{
            font-size: 1.1rem;
            margin-top: 0.2rem;
            margin-bottom: 0.8rem;
            position: relative;
        }
        .act::before{
            content: '';
            position: absolute;
            top: 0.5rem;
            left: -1.3rem;
            background: $color;
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            z-index: 1;
        }
        &::before{
            content: '';
            position: absolute;
            top: 1rem;
            left: -1.1rem;
            height: 100%;
            border-left: 1px solid #9099A8;
            z-index: 1;
        }
    }
    .no_line{
        &::before{
            border-left: none;
        }
    }
    .active{
        color: $color;
        .d_log::before{
            border-left: 1px solid $color;
        }
        .no_line{
            &::before{
                border-left: none;
            }
        }
        
    }
}
/* 列表css */
.card{
    background: #fff;
    border-radius: 0.5rem;
    letter-spacing: 0;
    font-size: 1.33rem;
    margin-top: 1rem;
    .d_tit{
        display: flex;
        align-items: center;
        color: #222;
        height: 3.6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.9rem;
        border-bottom: 1px solid #f5f5f5;
    }
    .d_img{
        width: 19.5vw;
        height: 19.5vw;
        border-radius: 0.4rem;
        overflow: hidden;
        img{
            width: 100%;
            width: 100%;
            border-radius: 0.5rem;
            display: block;
        }
    }
    .d_card{
        display: flex;
        align-items: center;
        padding: 0.9rem;
        border-bottom: 1px solid #f5f5f5;
        .d_con{
            width: 78%;
            box-sizing: border-box;
            padding-left: 0.7rem;
            p{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                color: #222;
                margin-bottom: 0.5rem;
            }
            &>span{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                display: inline-block;
                width: 100%;
                font-size: 1.3rem;
            }
            &>div{
                display: flex;
                justify-content: space-between;
                margin-top: 0.4rem;
                font{
                    // font-weight: bold;
                    color: $color;
                }
            }
        }
    }
    .handle{
        text-align: right;
        font-size: 1.2rem;
        color: #222;
        padding-right: 0.9rem;
        padding-top: 0.5rem;
        padding-bottom: 1rem;
        &>div{
            padding: 0.4rem 0;
            span{
                color: #EE8B42;
                font-size: 1.1rem;
                margin-right: 1rem;
            }
        }
        font{
            color: $color;
            font-size: 1.8rem;
        }
        .btn_1{
            border: 1px solid #9099A8;
            color: #9099A8;
            padding: 0.4rem 1.3rem;
        }
        .btn_2{
            border: 1px solid $color;
            background: $color;
            color: #fff;
            padding: 0.4rem 1.4rem;
            margin-left: 0.5rem;
        }
        .notice{
            color: #aaa;
            font-size: 1rem;
        }
        

    }
}
/* ------弹框css-----*/
.d_popup{
    color: #222;
    padding: 0 1rem;
    padding-bottom: 1rem;
    font-size: 1.2rem;
    .tit{
        font-size: 1.5rem;
        text-align: center;
        padding: 1.3rem 0;
    }
    &>span{
        color: #aaa;
        display: block;
        margin-bottom: 2rem;
    }
    .confirm{
        display: flex;
        width: 100%;
        border-radius: 1.9rem;
        overflow: hidden;
        margin-top: 4rem;
        button{
            background: $color;
            color: #fff;
            font-size: 1.4rem;
            font-weight: bold;
            width: 50%;
            height: 3.8rem;
        }
        &>button:first-child{
            background: #FEE7D7;
            color: #EE8B42;
        }
    }
    .d_reason{
        overflow-y: hidden;
        height: 30vh;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .d_switch{
        padding: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .radio{
            display: flex;
            justify-content: space-between;
            width: 15rem;
        }
    }
}
</style>
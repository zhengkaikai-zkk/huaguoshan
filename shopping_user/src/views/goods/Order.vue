<template>
    <div id="order">
        <div class="d_header">
            <div class="d_search">
                <van-search v-model="page.productTitle" show-action shape="round" placeholder="请输入搜索关键词">
                    <template #left>
                        <img src="@/assets/img/back.png" @click="$router.go(-1)" alt="返回">
                    </template>
                    <template #action>
                        <div class="d_action" @click="onSearch">
                            搜索
                        </div>
                    </template>
                </van-search>
            </div>
            <div class="tabs">
                <span :class="active==item.status? 'active':''" v-for="(item,index) in tabList" @click="active=item.status">{{item.name}}</span>
            </div>
        </div>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div class="order">
                <div class="card" v-for="item in list">
                    <div class="d_tit" @click="$router.push('/order_detail')">
                        <span>订单编号: {{item.orderNo}}</span>
                        <font color="#EE8B42" v-for="(i,index) in stautsList" :key="index" v-if="i.status==item.status">{{i.name}}</font>
                    </div>
                    <div class="d_card" v-for="i in item.orderProducts" @click="$router.push('/order_detail?id='+item.id)">
                        <div class="d_img">
                            <van-image width="100%" height="100%" fit="cover" lazy-load :src="i.images | fullPath" />
                        </div>
                        <div class="d_con">
                            <p>{{i.productTitle}}</p>
                            <span>{{i.skuSpecs}}</span>
                            <div>
                                <b>￥{{((i.price*item.exclusiveDiscount/10).toFixed(2))}}</b><!-- *item.exclusiveDiscount/10 -->
                                <span>x{{i.productNum}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="handle">
                        <div>共{{item.orderProducts.length}}件商品&nbsp;&nbsp;
                            <span style="margin: .5rem">合计：￥{{(item.totalPrice*item.exclusiveDiscount/10).toFixed(2)}}</span>
                            {{item.payType?'实':'需'}}付款(含运费)：<font>￥{{item.payPrice.toFixed(2)}}</font>
                        </div>
                        <div v-if="item.status==0" >
                            <button class="btn_1" @click="showCancel=true;id=item.id">取消订单</button>
                            <button class="btn_2" @click="$router.push('/pay?id='+item.id)">立即付款</button>
                        </div>
                        <div v-if="item.status==2">
                            <button class="btn_2" @click="doReceive(item.id)">确认收货</button>
                        </div>
                        <div v-if="item.status==3">
                            <button class="btn_2" @click="$router.push('/evaluation?id='+item.id)">立即评价</button>
                        </div>
                        <div v-if="item.status==4 || item.status==-1 || item.status==-3">
                            <button class="btn_1" @click="remove(item.id)">删除订单</button>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>

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
            tabList: [  
                {status: -9,name: '全部'},
                {status: 0,name: '待付款'},
                {status: 1,name: '待发货'},
                {status: 2,name: '待收货'},
                {status: 3,name: '待评价'},
                {status: 4,name: '已完成'},
                {status: -2,name: '交易关闭'},
            ],
            stautsList: [
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
            active: 0,
            list: [],
            page:{
	    		pageNo: 0,
                pageSize: 10,
                status: 0,
                productTitle: '',
	    	},
	    	van: {
        		loading: true,
				finished: false,
				error: false,
				text: '没有更多了',
            },
            showCancel: false,
            reasonList: [
                '我不想买了',
                '信息填写错误，重新拍',
                '卖家缺货',
                '其他原因',
            ],
            reason: '我不想买了',
            id: '',
            value: '',   //搜索关键字
        }
    },

    methods: {
        getList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.$request.post({
                url: '/us/orderInfo/list',
                params: this.page,
                success: res => {
                    if(this.page.type==1){
						this.num = res.list.length;
					}
					res.list.forEach(item => {
						this.list.push(item);
					});
					if(res.list.length==0){
						this.van.text = '暂无订单';
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
        
        //删除
        remove(id){
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/orderInfo/delete',
                params: { id },
                success: res => {
                    this.$toast.success('删除成功');
                    this.clear();
                    this.getList();
				},
				finally: () => {
                    loading.clear();
                }
            })
        },
        //确认收货
        doReceive(id){
            this.$dialog.confirm({
                title: '提示',
                message: '是否要确认收货吗？'
                }).then(() => {
                    this.$request.post({
                        url: '/us/orderInfo/receive',
                        params: { id },
                        success: res => {
                            this.$toast.success('确认收货成功');
                            this.clear();
                            this.getList();
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
                    this.clear();
                    this.getList();
				},
				finally: () => {
                    loading.clear();
                }
            })
        },

        onSearch(){
            this.clear();
            this.active=-9;
            this.getList();

        },

        //重置数据
        clear(){
            this.van.loading=true
            this.van.finished=false
            this.van.error=false
            this.van.text='没有更多了'
            this.page.pageNo=0
            this.list=[];
        },
    },

    mounted(){
        let status=this.$route.query.status;
        if(status){
            this.active=status;
        }else{
            this.getList();
        }
        
    },

    watch:{
        active(val){
            if(val==-9){
                this.page.status=''
            }else{
                this.page.status=this.active;
                this.page.productTitle= '';
            }
            this.clear();
            this.getList();
        }
    }


}
</script>

<style lang="scss">
@import '@/assets/css/public.scss';
#order .van-radio__icon--checked .van-icon{
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#order{
    padding-top: calc(4rem + 55px);
    padding-bottom: 3rem;
}
.d_header{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 99;
    .d_search{
        background: #fff;
        height: 55px;
        img{
            height: 20px;
            margin-right: 5px;
        }
        .d_action{
            width: 60px;
            background: $color;
            color: #fff;
            border-radius: 20px;
            text-align: center;
            &:hover{
                opacity: .5;
            }
        }
    }
    .tabs{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #222;
        font-size: 1.4rem;
        height: 4rem;
        letter-spacing: 0;
        padding: 0 1rem;
        background: #f5f5f5;
        overflow-x: auto;
        white-space:nowrap;
        &::-webkit-scrollbar {
            display: none;
        }
        span{
            white-space:nowrap;
            padding: 0 0.8rem;
        }
    }
}
.active{
    color: $color;
    font-weight: bold;
}
.order{
    padding: 0 1rem;
}
/* 列表css */
.card{
    background: #fff;
    border-radius: 0.5rem;
    letter-spacing: 0;
    font-size: 1.33rem;
    margin-bottom: 1rem;
    .d_tit{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #222;
        height: 3.6rem;
        padding: 0 0.9rem;
        border-bottom: 1px solid #f5f5f5;
    }
    .d_img{
        width: 19vw;
        height: 19vw;
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
                margin-bottom: 0.6rem;
            }
            &>span{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                display: inline-block;
                width: 100%;
            }
            &>div{
                display: flex;
                justify-content: space-between;
                margin-top: 0.4rem;
                b{
                    color: $color;
                    font-weight: normal;
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
}
</style>
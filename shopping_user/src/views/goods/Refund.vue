<template>
    <div id="refund">
        <pageHeader/>
        <div class="refund">
            <div class="topic">
                <span>退款商品</span>
            </div>
            <div class="d_card" v-for="item in goodsList">
                <div class="d_img">
                    <van-image width="100%" height="100%" fit="cover" lazy-load :src="item.images | fullPath" />
                </div>
                <div class="d_con">
                    <p>{{item.productTitle}}</p>
                    <span>{{item.skuSpecs}}</span>
                    <div>
                        <span>x{{item.productNum}}</span>
                    </div>
                </div>
            </div>
            <div class="topic">
                <span>退款金额：<a href="">￥{{Number(detail.payPrice).toFixed(2)}}</a></span>
            </div>
            <div class="reason">
                <p>退款原因：</p>
                <textarea v-model="reason" placeholder="请输入你的退款原因" maxlength="200"></textarea>
            </div>
            <div class="reason" >
                <p>上传凭证：</p>
                <imgUpload :imgList="imgList" @change="imgChange" @remove="imgRemove" />
            </div>
        </div>
        <div class="btn">
            <van-button round type="info" :loading="btnLoad" loading-text="提交中..." @click="toSubmit" block>确认退款</van-button>
        </div>


    </div>
</template>

<script>
import imgUpload from '@/components/imgUpload/imgUpload'

export default {
    components: {
        imgUpload
    },

    data(){
        return{
            id: '',
            reason: '',
            imgList: [],
            btnLoad: false,
            goodsList: [],
            detail: [],

        }
    },

    methods: {
        //提交退款
        toSubmit(){
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/orderRefund/refund',
                params: {
                    orderId: this.id,
                    reason: this.reason,
                    voucher: JSON.stringify(this.imgList)
                },
                success: res =>{
                    this.$toast('已提交退款，请等待审核');
                    this.$router.push('order?status=9')
                },
                finally: () => {
                    loading.clear();
                }
            })
        },

        //获取订单信息
        getDetail(){
            this.$request.post({
                url: '/us/orderInfo/details',
                params: {
                    id: this.id
                },
                success: res =>{
                    this.goodsList=res.orderProducts;
                    this.detail=res.orderInfo;
                    // this.user=res.usAddress;
                },
            })
        },

        //上传图片相关
        imgChange(img){
            this.imgList.push(img)
        },
        imgRemove(index){
            this.imgList.splice(index,1)
        }
    },

    mounted(){
        this.id= this.$route.query.id;
        if(this.id){
            this.getDetail();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
/* 列表css */
#refund{
    padding: 4.6rem 1rem 2rem 1rem;
}
.refund{
    background: #fff;
    border-radius: 0.5rem;
    letter-spacing: 0;
    font-size: 1.33rem;
    margin-top: 1rem;
    padding-bottom: 2.5rem;
    .topic{
        display: flex;
        align-items: center;
        color: #222;
        height: 4rem;
        padding: 0 0.9rem;
        border-bottom: 1px solid #f5f5f5;
        a{
            color: $color;
        }
    }
    .reason{
        color: #222;
        padding: 0 0.9rem;
        p{
            padding: 1rem 0;
        }
        textarea{
            border:none;
            resize: none;
            width: 100%;
            height: 5.5rem;
            background: #F5f5f5;
            border-radius: .5rem;
            padding: 1rem 1rem;
            box-sizing: border-box;
            line-height: 2rem;
            
            
        }
    }
    .d_img{
        width: 19.5vw;
        height: 19.5vw;
        border-radius: 0.5rem;
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
                    font-weight: bold;
                    color: $color;
                }
            }
        }
    }
}
.btn{
    text-align: center;
    margin-top: 2.5rem;
    padding: 0 5rem;
    button{
        font-size: 1.6rem;
        height: 3.8rem;
        background-color: $color;
        border: 1px solid $color;
    }        
}
</style>
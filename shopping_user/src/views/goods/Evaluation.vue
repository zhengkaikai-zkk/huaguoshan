<template>
    <div id="evaluation">
        <pageHeader/>
        <div v-for="item in evalList">
            <div class="evaluation">
                <div class="topic">
                    <span>商品评价</span>
                    <div>
                        <van-rate v-model="item.commentScore" size="2rem" @change="onChange" />
                        <a>{{item.commentScore==1? '差评': item.commentScore==2||item.commentScore==3 ?'中评': '好评'}}</a>
                    </div>
                </div>
                <div class="d_card">
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
            </div>

            <div class="evaluation">
                <div class="reason">
                    <p>评价内容</p>
                    <textarea v-model="item.content" placeholder="请输入你的评价内容" maxlength="200"></textarea>
                </div>
                <div class="reason pad_bott">
                    <!-- <p>订单评价</p> -->
                    <div>
                        <span>描述相符</span>
                        <van-rate v-model="item.descrMatch" size="2rem" allow-half @change="onChange" />
                        <a>{{item.descrMatch.toFixed(1)}}</a>
                    </div>  
                    <div>
                        <span>物流服务</span>
                        <van-rate v-model="item.logistics" size="2rem" allow-half @change="onChange" />
                        <a>{{item.logistics.toFixed(1)}}</a>
                    </div>
                    <div>
                        <span>服务态度</span>
                        <van-rate v-model="item.serviceAttitude" size="2rem" allow-half @change="onChange" />
                        <a>{{item.serviceAttitude.toFixed(1)}}</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="btn">
            <van-button round type="info" :loading="btnLoad" loading-text="提交中..." @click="toSubmit" block>提交评价</van-button>
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
            evalList: [],


        }
    },

    methods: {
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
                    res.orderProducts.forEach(item=>{
                        let obj={
                            productId: item.productId,
                            productTitle: item.productTitle,
                            skuSpecs: item.skuSpecs,
                            productNum: item.productNum,
                            images: item.images,
                            commentScore: 5,
                            descrMatch: 5,
                            logistics: 5,
                            serviceAttitude: 5,
                            content: '',

                        }
                        this.evalList.push(obj);
                    })
                    
                },
            })
        },
        
        toSubmit(){
            this.$request.post({
                url: '/us/productScore/comment',
                params: {
                    orderId: this.id,
                    data: JSON.stringify(this.evalList),
                },
                success: res =>{
                    this.$toast.success('评价成功')
                    this.$router.push('/order?status='+4)
                    
                },
            })
        },

        onChange(){
            
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

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
/* 列表css */
#evaluation{
    padding: 4.6rem 1rem 1rem 1rem;
}
.evaluation{
    background: #fff;
    border-radius: 0.5rem;
    letter-spacing: 0;
    font-size: 1.33rem;
    margin-top: 1rem;
    .topic{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #222;
        height: 4rem;
        padding: 0 0.9rem;
        border-bottom: 1px solid #f5f5f5;
        a{
            color: $color;
        }
        div{
            display: flex;
            align-items: flex-end;
            a{
                margin-left: 1rem;
            }
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
            height: 10rem;
            background: #F5f5f5;
            border-radius: .8rem;
            padding: 1rem 1rem;
            box-sizing: border-box;
            line-height: 2rem;
        }
        &>div{
            display: flex;
            align-items: flex-end;
            padding-bottom: 1rem;
            span{
                margin-right: 1rem;
            }
            a{
                color: #d3c9cf;
                margin-left: 1rem;
                font-size: 1.33rem;
            }
        }
    }
    .pad_bott{
        padding-top: 1rem;
        padding-bottom: .5rem;
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
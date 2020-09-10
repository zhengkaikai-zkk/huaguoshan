<template>
    <div id="cart">
        <div class="d_header">
            <p>购物车<span>({{total}})</span></p>
            <span @click="showDel=!showDel">{{showDel?'取消':'管理'}}</span>
        </div>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div class="d_list">
                <div class="d_card" v-for="(item,index) in list" v-if="list.length>0">
                    <div>
                        <van-checkbox v-model="item.checked" icon-size="1.6rem" @click="checkChange(item,index)"/>
                        <div class="shop_img" @click="item.productInfo.status==2? $router.push('/goods_detail?id='+item.productId): ''">
                            <van-image width="100%" height="100%" radius="0.5rem" fit="cover" lazy-load :src="item.images | fullPath" />
                        </div>
                    </div>
                    <div style="width:100%;">
                        <p class="title">{{item.productInfo.productTitle}}</p>
                        <span class="d_label">{{item.productInfo.status==2 && item.status==-1? '请重新选择商品规格':item.skuSpecs}}</span>
                        <p class="d_price" v-if="item.productInfo.status==2 && item.status!=-1">
                            <!-- <span v-if="$store.state.all.exclusiveDiscount">￥{{(item.price * $store.state.all.exclusiveDiscount/10).toFixed(2)}}</span> -->
                            <span>￥{{item.price.toFixed(2)}}</span>
                            <van-stepper v-model="item.productNum" integer min="1" button-size="2rem" @change="onChange(item)"/>
                        </p>
                        <p class="c_reset" v-if="item.productInfo.status==2 && item.status==-1">
                            <button @click="reelect(item.id,item.productId)">重选</button>
                        </p>
                        <p v-if="item.productInfo.status!=2" style="text-align: right;color:#F56C6C">商品已过期</p>
                    </div>
                </div>
            </div>
        </van-list>

        <!-- 底部栏 -->
        <div class="d_footer">
            <li class="check_all" @click="checkAll">
                <!-- <div><van-icon name="success" v-if="allCheck"/></div>
                <span>全选</span> -->
                <van-checkbox :value="allCheck" icon-size="1.6rem"><span class="c_a">全选</span></van-checkbox>
            </li>
            <div v-if="!showDel">
                <!-- <p class="d_total" v-if="$store.state.all.exclusiveDiscount">总计: <span>￥{{(allPrice*$store.state.all.exclusiveDiscount/10).toFixed(2)}}</span></p> -->
                <p class="d_total">总计: <span>￥{{allPrice.toFixed(2)}}</span></p>
                <p class="no_deliver">不含运费</p>
            </div>
            <div class="btn">
                <button v-if="!showDel" @click="addSettle">结算</button>
                <button v-if="showDel" style="background: #EE8B42;"  @click="removeOrCollet(1)">收藏</button>
                <button v-if="showDel" style="background: #C1164B;" @click="removeOrCollet(2)">删除</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list:[
                // {num: 4, normsCount:15,checked:false},
                // {num: 5, normsCount:15,checked:false},
                // {num: 6, normsCount:15,checked:false},
                // {num: 3, normsCount:15,checked:false},
                
            ],
            allCheck: false,
            showDel: false,
            
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
            allPrice:0,//总金额
            total: 0, //总条数
        }
    },

    methods:{
        //结算
        addSettle(){
            if(this.allPrice<=0) {this.$toast.fail('请选择有效商品');return}
            var form = [];
            let flag=true
            this.list.forEach(item =>{
                if(item.checked && (item.productInfo.status==1 || item.status==-1)) flag=false
                if(item.checked && item.productInfo.status==2){
                    form.push({
                        productId: item.productId,
                        productTitle: item.productInfo.productTitle,
                        productPrice: item.price,
                        productNum: item.productNum,
                        images: item.images,
                        skuId: item.skuId,
                        skuSpecs: item.skuSpecs,
                        deliveryMoney: item.productInfo.freightPrice,
                        shoppingCartId: item.id,
                    })
                }
            })
            if(form.length==0){this.$toast.fail('请选择');return}
            if(!flag){this.$toast.fail('有商品已过期或有商品没有规格');return}

            console.log(form)

            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/orderInfo/addSettle',
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

        //获取购物车列表
        getList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.$request.post({
                url: '/us/shoppingCart/list',
                params: this.page,
                success: res => {
                    this.total=res.cartNum;
                    if(this.page.type==1){
						this.num = res.list.length;
					}
					res.list.forEach(item => {
                        item.checked=false
						this.list.push(item);
					});
					if(res.list.length==0){
						this.van.text = '你还没有添加商品到购物车哦';
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

        //多选收藏或删除
        removeOrCollet(type){
            var list = [];
            this.list.forEach(item =>{
                if(item.checked){
                    if(type==1){
                        list.push(item.productId);
                    }else{
                        list.push(item.id);
                    }
                }
            })
            if(list.length==0){this.$toast.fail('请选择');return}
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            if(type==1){
                this.$request.post({
                    url: '/us/collect/add',
                    params:{
                        idArr: JSON.stringify(list)
                    },
                    success: result => {
                        this.$toast.success('收藏成功');
                        this.clear();
                        this.getList();
                    },
                    finally: () => {
                        loading.clear();
                    }
                })
            }else{
                this.$request.post({
                    url: '/us/shoppingCart/deleteMore',
                    params:{
                        idArr: JSON.stringify(list)
                    },
                    success: result => {
                        this.$toast.success('删除成功');
                        this.clear();
                        this.getList();
                    },
                    finally: () => {
                        loading.clear();
                    }
                })
            }
        },
        
        //重置数据
        clear(){
            this.van.loading=true
            this.van.finished=false
            this.van.error=false
            this.van.text='没有更多了'
            this.page.pageNo=0
            this.list=[];
            this.allCheck=false
            this.allPrice=0

        },

        // 选中单个触发
        checkChange(item,index){
    		var price = item.price*item.productNum;
            if(item.checked){
                if(item.productInfo.status==2) this.allPrice = this.allPrice + price;
            }else{
                if(item.productInfo.status==2) this.allPrice = this.allPrice - price;
            }
            for(var i=0;i<this.list.length;i++){
                if(!this.list[i].checked){
                    this.allCheck=false;
                    break;
                }else{
                    this.allCheck=true;
                }
            }
        },

        // 选中全部或取消选中全部
        checkAll(){
            this.allCheck=!this.allCheck;
            if(this.allCheck){
                this.allPrice=0;
                this.list.forEach((item, index) =>{
                    this.list[index].checked = true
                    if(item.productInfo.status==2){
                        this.allPrice+=item.productNum*item.price
                    }
                    
                })
            }else{
                this.list.forEach((item, index) =>{
                    this.list[index].checked = false
                })
                this.allPrice = 0;
            }
        },

        //重选规格
        reelect(id,productId){
            this.$request.post({
                url: '/us/shoppingCart/deleteMore',
                params:{
                    idArr: '['+id+']'
                },
                success: result => {
                    this.$router.push('/goods_detail?cart=-1&id='+productId)
                    // this.clear();
                    // this.getList();
                },
                finally: () => {
                }
            })
        },
        

        //个数改变时调用
        onChange(item){
            var oldPrice=this.allPrice;
            this.allPrice=0;
            this.list.forEach((i, index) =>{
                if(i.checked && i.productInfo.status==2){
                    this.allPrice+=i.productNum*i.price
                }
            })
            if(this.allPrice==0){
                this.allPrice=oldPrice;
            }
            
        },
    },
    
    mounted(){
        this.getList();
        this.$store.dispatch('all/setUser');
    }
}
</script>

<style lang=scss>
@import '@/assets/css/public.scss';
#cart .van-stepper__minus{
    background-color: #fff;
    color: $color;
    border: 1px solid $color
}
#cart .van-stepper__plus{
    background-color: $color;
    color: #fff;
    border: 1px solid $color;
}
#cart .van-stepper__input{
    background: #fff;
    color: $color;
}
#cart .van-checkbox__icon--checked .van-icon {
    color: #fff;
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#cart{
    padding-top: 4.6rem;
    padding-bottom: 8.7rem;
}
.d_header{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    color: #222;
    padding: 0 1rem;
    height: 4.7rem;
    letter-spacing: 0;
    p{
        font-size: 1.58rem;
    }
    span{
        font-size: 1.33rem;
        font-weight: normal;
    }
}
.d_list{
    margin: 1rem 1rem;
    border-radius: 0.6rem;
    background: #fff;
}
.d_card{
    display: flex;
    align-items: center;
    color: #999;
    border-bottom: 1px solid #f5f5f5;
    padding: 2rem 0.8rem 1rem 0.8rem;
    letter-spacing: 0;
    &>div:first-child{
        display: flex;
        align-items: center;
    }
    .shop_img{
        width: 20vw;
        height: 20vw;
        padding: 0 0.6rem;
    }
}
.title{
    display: flex;
    justify-content: space-between;
    font-size: 1.45rem;
    color: #333;
    margin-bottom: 0.7rem;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:1;
    /*! autoprefixer: ignore next */
    -webkit-box-orient: vertical;
}
.d_label{
    background: #f5f5f5;
    color: #C0C8D3;
    font-size: 1rem;
    padding: 0.2rem 0.6rem;
    border-radius: 0.3rem;
    display: inline-block;
}
.d_price{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    color: $color;
    span{
        font-size: 1.4rem;
        font-weight: bold;
    }
}
.c_reset{
    text-align: right;
}
.c_reset button{
    border: 1px solid $color;
    border-radius: 1rem;
    padding: 0.2rem 0.8rem;
    font-size: 1rem;
    color: $color;
}
.d_footer{
    position: fixed;
    bottom: 5.5rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    height: 4.7rem;
    font-size: 1rem;
    box-shadow: 1px 1px 5px #cfcfcf;
    .check_all{
        margin-left: 0.9rem;
        margin-right: 0.9rem;
        .c_a{
            font-size: 1.52rem;
            font-weight: 600;
            position: relative;
            top: 1px;
        }
    }
    .d_total{
        font-size: 1.4rem;
        font-weight: bold;
        letter-spacing: 0;
        // margin-bottom: 0.25rem;
        span{
            color: $color;
        }
    }
    .no_deliver{
        font-size: 0.95rem;
    }
    .btn{
        display: flex;
        background: $color;
        button{
            color: #fff;
            height: 4.7rem;
            width: 9.4rem;
            font-size: 1.6rem;
            letter-spacing: 1px;
        }
        & button:first-child{
            background: $color;
        }
    }
    

    
}
</style>
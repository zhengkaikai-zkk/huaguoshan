<template>
    <div id="spec">
        <!-- 规格弹框 -->
        
            <div class="d_head">
                <img :src="sepcValue.img" alt="">
                <div>
                    <div class="d_price">￥{{sepcValue.price.toFixed(2)}}</div>
                    <p>剩余 {{sepcValue.stock}} 件</p>
                    <div>{{resList.every(obj =>{return obj.isSle})? '已选': '选择'}} {{parentArr.join('; ')}}</div>
                </div>
                <li class="close" @click="toClose"><van-icon name="close" /></li>
            </div>
            <div class="d_size" >
                <div v-for="(item,index) in sepcList">
                    <p>{{item.groupName}}</p>
                    <div class="d_classify">
                        <span 
                            v-for="(item2) in item.productItems"
                            :class="resList.some((obj)=>{return obj.id==item2.id && obj.isSle})? 'active': ''"
                            @click="specChange(item2,item, index)"
                        >
                            {{item2.itemName}}
                        </span>
                    </div>
                    
                </div>
            </div>
            <div class="pop_foo">
                <div class="d_count">
                    <span>购买数量</span>
                    <van-stepper v-model="sepcValue.count" integer min="1" :max="sepcValue.stock" button-size="2rem" @overlimit="overlimit()" integer/>
                </div>
                <div class="d_btn" v-if="status!=1 && sepcValue.stock!=0">
                    <button @click="getResultTo('cart')">加入购物车</button>
                    <button @click="getResultTo('buy')">立即购买</button>
                </div>
                <div class="no_stock" v-if="status!=1 && sepcValue.stock==0">
                    <button @click="noSpec">加入购物车</button>
                    <button @click="noSpec">立即购买</button>
                </div>
                <div><div class="no_shop" v-if="status==1">商品已下架</div></div>
            </div>
        
    </div>
</template>

<script>
export default {
    props:{
        productId: '',
        cover: '',
        initPrice: '',
        initStock: '',
        status: '',
    },
    data(){
        return{
            show: true,
            active: 0,

            sepcList: [],
            resList: [],
            parentArr: [],
            sepcValue: {
                id: '',
                price: 0,
                stock: 0,
                img: require('@/assets/img/common/detail-1.png'),
                count: 1,
            },
            
        }
    },

    methods:{
        //获取选择规格结果
        getResult(){
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            let propNames= [];
            this.resList.forEach(item =>{
                propNames.push(item.name)
            })
            this.$request.post({
                url: '/us/productSku/details',
                params: {
                    productId: this.productId,
                    propNames: JSON.stringify(propNames)
                },
                success: res =>{
                    if(res=='无货'){
                        this.sepcValue.stock= 0
                    }else{
                        this.sepcValue.price= res.price
                        this.sepcValue.stock= res.stock
                        this.sepcValue.id= res.id
                    }
                },
                finally: () => {
                    loading.clear();
                }
            })
        },

        //获取全部规格
        getParent(){
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/productGroup/list',
                params: {
                    productId: this.productId,
                },
                success: res =>{
                    res.forEach(item =>{
                        this.resList.push({
                            parentId: item.id,
                            parentName: item.groupName,
                            id: '',
                            name: '',
                            isSle: false
                        })
                    })
                    this.sepcList=res;
                },
                finally: () => {
                    loading.clear();
                }
            })
        },

        //点击规格时
        specChange(item2,item,index){
            let isSle;
            isSle= !this.resList[index].isSle
            if(item2.id != this.resList[index].id){    //子级不等   
                isSle= true
            }
            let obj= {
                parentId: item.id,
                parentName: item.groupName,
                id: item2.id,
                name: item2.itemName,
                isSle: isSle
            }
            this.resList.splice(index,1, obj)
            if(item2.img){
                if(isSle){
                    this.sepcValue.img = this.$common.getUrl()+ item2.img;
                }else{
                    this.sepcValue.img = this.$common.getUrl() + this.cover;
                }
            }
        },

        //获取加入购物车或结算数据
        getResultTo(type){
            let flag= this.resList.some(obj=>{
                return obj.isSle
            })
            if(!flag) {this.$toast('请先选择商品规格'); return}
            
            if(this.parentArr.length!=this.resList.length){
                this.$toast('请先选择商品规格')
                return
            }
            let obj= this.sepcValue;
            obj.type= type;
            obj.specName= this.parentArr.join('; ')
            this.$emit('getData',obj)
        },

        //加购或结算时不满足条件
        noSpec(){
            let flag= this.resList.every(obj =>{
                return obj.isSle
            })
            if(flag){
                this.$toast('库存不足');
            }else{
                this.$toast('请先选择商品规格');
            }
        },


        //购买个数改变时调用
        overlimit(){
            if(this.sepcValue.count==1){
                this.$toast('至少选择一件或库存不足')
            }else{
                this.$toast('库存不足')
            }
        },
        toClose(){
            this.$emit('func',false)
        },
        
    },

    mounted(){
        if(this.productId){
            this.getParent();
        }
        this.sepcValue.img = this.$common.getUrl() + this.cover
        if(this.initPrice) this.sepcValue.price = this.initPrice
        this.sepcValue.stock = this.initStock

    },

    watch: {
        resList: {
            handler(val, old){
                let flag= val.every(obj =>{
                    return obj.isSle
                })
                if(flag) this.getResult();
                this.parentArr=[];
                val.forEach(item =>{
                    if(!item.isSle) this.parentArr.push(item.parentName)
                })
                if(this.parentArr.length==0){
                    val.forEach(item =>{
                        this.parentArr.push(item.name)
                    })
                }
            }
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
/* ---------规格弹框css------- */
#spec{
    font-size: 1.33rem;
}
.d_head{
    display: flex;
    align-items: center;
    padding: 3vw;
    letter-spacing: 0;
    position: relative;
    &>div{
        width: 59vw;
        padding-left: 3vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 1.1rem;
    }
    img{
        width: 24vw;
        height: 24vw;
        border-radius: 0.5rem;
    }
    p{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        font-size: 1.2rem;
    }
    
    // span{
    //     display: inline-block;
    //     font-size: 1rem;
    //     padding: 0.15rem 0.4rem;
    //     border-radius: 0.2rem;
    // }
    // span:first-child{
    //     color: #E9AF84;
    //     background: #FEE7D7;
    // }
    // span:last-child{
    //     color: #7CACF1;
    //     background: #ECF4FF;
    // }
    .d_price{
        font-size: 2rem;
        color: $color;
        margin-top: 0.5rem;
        s{
            font-size: 1.2rem;
            color: #C0C8D3;
        }
    }
    .tosle{

    }
    .close{
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 2.5rem;
        color: $gary;
    }
}
.d_size{
    padding: 1rem 1rem 0 1rem;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    letter-spacing: 0;
    height: 60vw;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    p{
        margin-bottom: 1rem;
        color: #333;
    }
    .d_classify{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.8rem;
        span{
            background: #f5f5f5;
            color: #000105;
            font-size: 0.95rem;
            padding: 0.5rem 2rem;
            border-radius: 0.4rem;
            margin-right: 1rem;
            margin-bottom: 1rem;
        }
        .active{
            background: $color;
            color: #fff;
        }
        .disabled{
            background: #f5f5f5;
            color: #bbb;
        }
    }
}
.pop_foo{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    .d_count{
        color: #222;
        padding: 1rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .d_btn{
        display: flex;
        button{
            width: 50%;
            padding: 1.2rem 0;
            background: #FEE7D7;
            color: #EE8B42;
        }
        button:last-child{
            background: $color;
            color: #fff;
        }
    }
    .no_stock{
        display: flex;
        button{
            width: 50%;
            padding: 1.2rem 0;
            background: rgba(0,0,0, .3);
            color: #fff;
        }
        button:last-child{
            border-left: 1px solid #ddd;
        }
    }
    .no_shop{
        background: rgba(0,0,0, .4);
        color: #fff;
        text-align: center;
        padding: 1.2rem 0;
    }
}
</style>
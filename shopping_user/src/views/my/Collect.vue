<template>
    <div id="collet">
        <pageHeader/>
        <div class="skip" @click="show=!show">{{show?'取消':'管理'}}</div>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div class="big_card" v-for="(item,index) in list">
                <p v-if="show">
                    <van-checkbox icon-size="1.6rem" v-model="item.checked" @click="checkChange(item,index)"/>
                </p>
                <div class="card" @click="$router.push('/goods_detail?id='+item.productId)">
                    <div class="shop_img">
                        <van-image width="100%" height="100%" fit="cover" lazy-load :src="item.productInfo.productCover | fullPath" />
                    </div>
                    <div class="d_card" :style="{width:(show?'56vw': '63vw')}" @click="checkChange(item,index)">
                        <p>{{item.productInfo.productTitle}}</p>
                        <div class="d_count">
                            <span>销量{{item.productInfo.salesVolume}}</span>
                            <!-- <div class="label">
                                <span class="lab-1">{{item.productInfo.minBuyNum}}个起订</span>
                                <span :class="item.productInfo.surplusNum!=0? 'lab-2':'lab-1'">{{item.productInfo.surplusNum!=0? '库存充足':'库存不足'}}</span>
                            </div> -->
                        </div>
                        <div class="d_price">
                            ￥{{$store.state.all.exclusiveDiscount? (item.productInfo.originalPrice*$store.state.all.exclusiveDiscount/10).toFixed(2) : item.productInfo.originalPrice.toFixed(2)}}
                            <span>￥{{item.productInfo.price.toFixed(2)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
        
        <div class="d_footer" v-if="show">
            <div class="check_all" @click="checkAll">
                <van-checkbox icon-size="1.6rem" :value="allCheck"><span class="c_a">全选</span></van-checkbox>
            </div>
            <button @click="removeMore">删除</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: [
                
            ],
            show: false,
            allCheck: false,
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
        //多选删除
        removeMore(){
            var list = [];
            this.list.forEach(item =>{
                if(item.checked){
                    list.push(item.id);
                }
            })
            if(list.length==0){this.$toast.fail('请选择');return}
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/collect/delete',
                params:{
                	idArr: JSON.stringify(list)
                },
                success: result => {
                    this.$toast.success('删除成功');
                    this.clear();
                    this.getList();
                    this.allCheck=false
                },
                finally: () => {
                    loading.clear();
                }
            })
        },

        //获取列表
        getList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.page.sort = this.sort;
            this.$request.post({
                url: '/us/collect/list',
                params: this.page,
                success: res => {
                    if(this.page.type==1){
						this.num = res.list.length;
					}
					res.list.forEach(item => {
                        item.checked=false;
                        this.list.push(item);
                        
					});
					if(res.list.length==0){
						this.van.text = '暂无收藏记录';
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

        //重置数据
        clear(){
            this.loading=true
            this.finished=false
            this.error=false
            this.text='没有更多了'
            this.page.pageNo=0
            this.list=[];
        },

        // 选中单个触发
        checkChange(item,index){
            if(!this.show) return;
            if(item.checked){
                if(index==this.list.length-1) this.allCheck=true;
            }else{
                this.allCheck=false;
            }
        },

        // 选中全部或取消选中全部
        checkAll(){
            this.allCheck=!this.allCheck;
            if(this.allCheck){
                this.list.forEach((item, index) =>{
                    this.list[index].checked = true
                })
            }else{
                this.list.forEach((item, index) =>{
                    this.list[index].checked = false
                })
            }
        },

        
    },

    mounted(){
        this.getList();
    }
}
</script>

<style lang="scss">
@import '@/assets/css/public.scss';
#collet .van-checkbox__icon--checked .van-icon {
    color: #fff;
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#collet{
    padding: 3vw;
    padding-top: 4.6rem;
    padding-bottom: 5rem;
    font-size: 1.4rem;
    color: #222;
}
.skip{
    position: fixed;
    right: 1rem;
    top: 1.8rem;
    z-index: 199;
    font-size: 1.14rem;
}
.d_footer{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    background: #fff;
    font-size: 1.6rem;
    .check_all{
        display: flex;
        align-items: center;
        margin-left: 0.6rem;
        margin-right: 1rem;
        .c_a{
            font-size: 1.5rem;
            font-weight: 600;
        }
    }
    button{
        background: #DB4141;
        color: #fff;
        height: 4.4rem;
        width: 9rem;
    }
}
.big_card{
    display: flex;
    align-items: center;
    &>p{
        width: 7vw;
    }
}
.card{
    display: flex;
    align-items: center;
    background: #fff;
    margin-top: 0.9rem;
    padding-right: 0.9rem;
    border-radius: 0.6rem;
    overflow: hidden;
    letter-spacing: 0;
    .shop_img{
        width: 25vw;
        height: 25vw;
        img{
            height: 100%;
            width: 25vw;
        }
    }
    .d_card{
        height: 25vw;
        width: 63vw;
        margin-left: 0.9rem;
        font-size: 1.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0.3rem 0;
        box-sizing: border-box;
        &>p{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
    .d_count{
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
            font-size: 0.95rem;
            color: #C0C8D3;
        }
        .label{
            border-radius: 0.1rem;
            span{
                padding: 0 0.4rem;
                display: inline-block;
                height: 1.5rem;
                line-height: 1.55rem;
                font-size: 1rem;

            }
            .lab-1{
                background: #FEE7D7;
                color: #E9AF84;
                padding: 0.1rem 0.2rem;
                border-radius: 0.2rem;
                margin-right: 0.2rem;
            }
            .lab-2{
                background: #ECF4FF;
                color: #7CACF1;
                padding: 0.1rem 0.2rem;
                border-radius: 0.2rem;
            }
        }
    }
    .d_price{
        font-size: 1.33rem;
        font-weight: 600;
        color: $color;
        span{
            font-size: 0.95rem;
            color: #C0C8D3;
            text-decoration: line-through;
            font-weight: normal;
        }
    }
    
}

</style>
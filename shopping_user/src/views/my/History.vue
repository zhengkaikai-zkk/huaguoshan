<template>
    <div id="history">
        <pageHeader/>
        <div class="skip" @click="show=!show">{{show?'取消':'管理'}}</div>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div v-for="(item,index) in list">
                <div class="d_time" v-if="item.browseDate && calcTime(index)"><span>{{$common.getDay(item.browseDate)}}</span></div>
                <div class="big_card">
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
                                ￥{{item.productInfo.originalPrice.toFixed(2)}}
                                <span>￥{{item.productInfo.price.toFixed(2)}}</span>
                            </div>
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
                url: '/us/browse/delete',
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
                url: '/us/browse/list',
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
						this.van.text = '您没有留下足迹哦';
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
        	// item.checked = !item.checked;
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

        calcTime(index){
            if(index == 0){
                return true
            }else{
                let time = this.$common.getDay(this.list[index].browseDate)
                let ptime = this.$common.getDay(this.list[index-1].browseDate)
                if(time == ptime){
                    return false
                }else{
                    return true
                }
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
#history .van-checkbox__icon--checked .van-icon {
    color: #fff;
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#history{
    padding: 3vw;
    padding-top: 5.6rem;
    padding-bottom: 5rem;
    font-size: 1.33rem;
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
        height: 4.6rem;
        width: 9rem;
    }
}
.d_time{
    font-size: 1.2rem;
    letter-spacing: 0;
    color: #999;
    margin-bottom: 1rem;
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
    margin-bottom: 0.9rem;
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
            color: $gary;
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
        color: $color;
        font-weight: bold;
        span{
            font-size: 0.95rem;
            color: $gary;
            text-decoration: line-through;
            font-weight: normal;
        }
    }
    
}

</style>
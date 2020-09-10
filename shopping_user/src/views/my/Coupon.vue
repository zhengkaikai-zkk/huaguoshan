<template>
    <div id="coupon">
        <pageHeader/>
        <div class="skip" @click="show=!show">{{show?'取消':'管理'}}</div>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div class="big_card" v-for="(item,index) in list">
                <p v-if="show">
                    <van-checkbox :icon-size="16" v-model="item.checked" @click="checkChange(item,index)"/>
                </p>
                <div class="card" @click="$router.push('/goods_detail?id='+item.productId)">
                    <div class="shop_img">
                        <div><span>￥</span>{{item.productCoupon.money}}</div>
                        <span>{{item.productCoupon.condition}}</span>
                    </div>
                    <div class="d_card" :style="{width:(show?'62vw': '69vw')}" @click="checkChange(item,index)">
                        <p>{{item.productCoupon.name}}</p>
                        <!-- <div class="classify">适用类目：女装</div> -->
                        <div class="time">有效期：{{parseTime(item.productCoupon.effectiveTime)}}</div>
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
        <div class="tesu" v-else @click="$router.push('/coupon_history')">查看历史优惠券记录</div>
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
                status: 1,
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
                url: '/us/productCouponFlow/delete',
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
                url: '/us/productCouponFlow/list',
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
						this.van.text = '您没有领取过优惠券哦';
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
    		var price = (item.propertyId?item.propertyPrice:item.price)*item.num;
            if(item.checked){
                this.allPrice = this.allPrice + price;
                if(index==this.list.length-1) this.allCheck=true;
            }else{
                this.allPrice = this.allPrice - price;
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
                var orderCartPrice = sessionStorage.getItem('orderCartPrice');
                this.allPrice = parseFloat(orderCartPrice);
            }else{
                this.list.forEach((item, index) =>{
                    this.list[index].checked = false
                })
                this.allPrice = 0;
            }
        },

        //解析时间
        parseTime(timeStr){
            let startTime= JSON.parse(timeStr).startTime
            let endTime= JSON.parse(timeStr).endTime
            return this.$times.getDay(startTime, '/') + ' ~ ' + this.$times.getDay(endTime, '/')
        },

        
    },

    mounted(){
        this.getList();
    }
}
</script>

<style lang="scss">
@import '@/assets/css/public.scss';
#coupon .van-checkbox__icon .van-icon{
    border: 1px solid #cfcfcf;
}
#coupon .van-checkbox__icon--checked .van-icon {
    color: #fff;
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#coupon{
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
        border-top: 1px solid #f5f5f5;
        box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.03);
        .c_a{
            font-size: 1.4rem;
            font-weight: 600;
        }
    }
    button{
        background: #DB4141;
        color: #fff;
        height: 4.2rem;
        width: 9rem;
    }
}
.tesu{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    background: #fff;
    height: 4.2rem;
    line-height: 4.2rem;
    color: $color;
    border-top: 1px solid #f5f5f5;
    box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.03);

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
    margin-top: 0.9rem;
    border-radius: 0.6rem;
    overflow: hidden;
    letter-spacing: 0;
    .shop_img{
        width: 25vw;
        height: 25vw;
        background-image: url('../../assets/img/my/coupon.png');
        background-size: 100% auto;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div{
            font-size: 2.5rem;
            margin-bottom: 0.4rem;
            span{
                font-size: 1.4rem;
            }
        }
        &>span{
            font-size: 1rem;
            color: #eee;
        }
    }
    .d_card{
        height: 25vw;
        width: 69vw;
        font-size: 1.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 0.9rem;
        box-sizing: border-box;
        background: #fff;
        &>p{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-size: 1.7rem;
            margin-top: 1rem;
        }
        .classify{
            font-size: 1.2rem;
        }
        .time{
            font-size: 1rem;
            color: $gary;
            border-top: 1px solid #F6F6F6;
            padding: 0.8rem 0;
        }
    }
    
    
}

</style>
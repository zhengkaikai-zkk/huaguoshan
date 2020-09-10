<template>
    <div id="collet">
        <pageHeader/>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
        <div class="card" v-for="(item,index) in list">
            <div class="shop_img">
                <div><span>￥</span>{{item.productCoupon.money}}</div>
                <span>{{item.productCoupon.condition}}</span>
            </div>
            <div class="d_card">
                <p>{{item.productCoupon.name}}</p>
                <div class="time">有效期: {{parseTime(item.productCoupon.effectiveTime)}}</div>
            </div>
            <div v-if="item.receive" class="tesu_btn yesDraw"><div>已领取</div></div>
            <div v-else class="tesu_btn" @click="toDraw(item.productCoupon.id)"><div>领取</div></div>
        </div>
        </van-list>
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
        //获取列表
        getList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.page.sort = this.sort;
            this.$request.post({
                url: '/us/productCoupon/list',
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
						this.van.text = '暂无优惠券';
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

        //领取优惠券
        toDraw(id){
            this.$request.post({
                url: '/us/productCoupon/receive',
                params: {
                    id,
                },
                success: res =>{
                    this.clear();
                    this.getList();
                    this.$toast('领取成功')
                }
            })
        },

        //解析时间
        parseTime(timeStr){
            let startTime= JSON.parse(timeStr).startTime
            let endTime= JSON.parse(timeStr).endTime
            return this.$times.getDay(startTime, '/') + ' ~ ' + this.$times.getDay(endTime, '/')
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
    },

    mounted(){
        this.getList();
    }
}
</script>

<style>
#feedback .van-checkbox__icon .van-icon{
    border: 1px solid #cfcfcf;
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
        width: 53vw;
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
    .tesu_btn{
        height: 25vw;
        width: 16vw;
        background: #fff;
        font-size: 1.35rem;
        text-align: center;
        color: $color;
        box-sizing: border-box;
        padding: .5rem 0;
        div{
            border-left: 1px dashed $color;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            
        }
    }
    .yesDraw{
        color: #aaa;
        div{
            border-left: 1px dashed #aaa;
        }
    }
    .tesu_btn:hover{
        opacity: .6;
        font-weight: bold;
    }
    
    
}

</style>
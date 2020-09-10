<template>
    <div id="collet">
        <pageHeader/>
        <ul class="tabs">
            <li :class="page.status==2? 'active': ''" @click="page.status=2">已使用</li>
            <li :class="page.status==-1? 'active': ''" @click="page.status=-1">已失效</li>
        </ul>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div class="card" v-for="(item,index) in list">
                <div class="shop_img">
                    <div><span>￥</span>{{item.productCoupon.money}}</div>
                    <span>{{item.productCoupon.condition}}</span>
                </div>
                <div class="d_card">
                    <p>{{item.productCoupon.name}}</p>
                    <!-- <div class="classify">适用类目：女装</div> -->
                    <div class="time">有效期：{{parseTime(item.productCoupon.effectiveTime)}}</div>
                </div>
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
            allCheck: false,
            page:{
                status: 2,
	    		pageNo: 0,
				pageSize: 10,
	    	},
	    	van: {
        		loading: true,
				finished: false,
				error: false,
				text: '没有更多了',
        	},
            active: 1,
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
                url: '/us/collection/cancelCollectionMore',
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
						this.van.text = '暂无记录';
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
    },

    watch: {
        'page.status':{
            handler() {
                this.clear();
                this.getList()
            },
        }
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
#page_header{
    box-shadow: none;
    border-bottom: 1px solid #f5f5f5;
}
#collet{
    padding-top: 4.6rem;
    padding-bottom: 5rem;
    font-size: 1.4rem;
    color: #222;
}
.tabs{
    background: #fff;
    display: flex;
    text-align: center;
    color: $gary;
    padding: 0 3rem;
    li{
        width: 50%;
        height: 3.8rem;
        line-height: 3.8rem;
    }
    .active{
        color: $color;
        font-weight: bold;
        transition: all .6s;
    }
}
.card{
    display: flex;
    align-items: center;
    margin-top: 0.9rem;
    border-radius: 0.6rem;
    overflow: hidden;
    letter-spacing: 0;
    margin: 3vw;
    .shop_img{
        width: 25vw;
        height: 25vw;
        background-image: url('../../assets/img/my/coupon-un.png');
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
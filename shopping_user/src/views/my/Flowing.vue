<template>
    <div id="flowing">
        <pageHeader/>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div class="card" v-for="item in list">
                <div>
                    <span>{{item.remark}}</span>
                    <p>{{$common.getDate(item.createTime)}}</p>
                </div>
                <font v-if="item.type<5">-￥{{item.money}}</font>
                <font v-else class="to_add">+￥{{item.money}}</font>
            </div>
        </van-list>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: [],
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

    methods: {
        getList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.$request.post({
                url: '/us/flow/list',
                params: this.page,
                success: res => {
					res.list.forEach(item => {
						this.list.push(item);
					});
					if(res.list.length==0){
						this.van.text = '暂无流水记录';
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
        }
        
    },

    mounted(){
        this.getList();
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#flowing{
    padding: 0 0.9rem;
    padding-top: 5.6rem;
    font-size: 1.4rem;
    color: #222;
}
.card{
    background: #fff;
    border-radius: 0.5rem;
    padding: 1.1rem 0.9rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &>div{
        width: 80%;
    }
    p{
        color: #C0C8D3;
        letter-spacing: 0;
        font-size: 1.2rem;
        margin-top: 0.5rem;
    }
    font{
        letter-spacing: 0;
        width: 20%;
        text-align: right;
        color: $color;
        
    }
    .to_add{
        color: #5483D3;   
    }
}
</style>
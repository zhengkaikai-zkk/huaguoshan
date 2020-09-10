<template>
    <div id="withdraw_flowing">
        <pageHeader/>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
        <div class="card" v-for="item in list">
            <div>
                <span>{{item.usBankCard.bankName}}({{item.usBankCard.cardNum.substr(item.usBankCard.cardNum.length-4)}})</span>
                <span>提现￥{{item.money.toFixed(2)}}</span>
            </div>
            <div>
                <span>{{$common.getDate(item.createTime)}}</span>
                <font v-if="item.status==1">提现成功</font>
                <font v-if="item.status==0" color="#EE8B42">审核中</font>
                <font v-if="item.status==-1" color="#DB4141">提现失败</font>
            </div>
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
                url: '/us/withdrawal/list',
                params: this.page,
                success: res => {
                    if(this.page.type==1){
						this.num = res.list.length;
					}
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
#withdraw_flowing{
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
    div{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &>div:last-child{
        font-size: 1.2rem;
        color: #C0C8D3;
        margin-top: 0.5rem;
        letter-spacing: 0;
    }
    

}
</style>
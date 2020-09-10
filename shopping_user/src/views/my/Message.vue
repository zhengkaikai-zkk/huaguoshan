<template>
    <div id="feedback">
        <pageHeader/>
        <div class="skip" @click="wholeRead">一键已读</div>
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <div class="card" v-for="item in list" @click="$router.push('/message_detail?id='+item.id)">
                <p>{{item.title}}</p>
                <div>
                    <span>{{$common.getDate(item.createTime)}}</span>
                    <font v-if="item.isRead==0" color="#EE8B42">未读</font>
                    <font v-else>已读</font>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list:[],
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
        getList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.$request.post({
                url: '/us/sysMessage/list',
                params: this.page,
                success: res => {
                    if(this.page.type==1){
						this.num = res.list.length;
					}
					res.list.forEach(item => {
						this.list.push(item);
					});
					if(res.list.length==0){
						this.van.text = '暂无消息';
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

        //一键已读
        wholeRead(){
            this.$request.post({
                url: '/us/sysMessage/wholeRead',
                success: res => {
                    this.$toast(res);
                    this.clear();
                    this.getList();
                }
            })
        },

         //重置数据
        clear(){
            this.van.loading=true
            this.van.finished=false
            this.van.error=false
            this.van.text='没有更多了'
            this.page.pageNo=0
            this.list=[];
        },
    },

    mounted(){
        this.getList();
    }
}
</script>

<style lang="scss" scoped>
#feedback{
    padding: 0.9rem;
    padding-top: 5.6rem;
    font-size: 1.4rem;
    color: #222;
}
.card{
    background: #fff;
    border-radius: 0.5rem;
    padding: 1.1rem 0.9rem;
    margin-bottom: 0.6rem;
    p{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    div{
        letter-spacing: 0;
        font-size: 1.2rem;
        color: #C0C8D3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.5rem;
    }
}
.skip{
    position: fixed;
    right: 1rem;
    top: 1.8rem;
    z-index: 199;
    font-size: 1.14rem;
}


</style>
<template>
    <div id="feedback">
        <pageHeader/>
        <div class="card" v-for="item in list" @click="$router.push('/feedback_detail?id='+item.id)">
            <p>{{item.content}}</p>
            <span>{{$times.getDate(item.createTime)}}</span>
        </div>
        <div v-if="list.length==0" class="no_data">暂未添加反馈</div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: [],
        }
    },

    methods: {
        getList(){
            this.$request.post({
                url: '/us/sysAdvice/list',
                success: res => {
                    this.list=res;
                },
            });
        }
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
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
    }
    span{
        letter-spacing: 0;
        font-size: 1.2rem;
        color: #C0C8D3;
        display: inline-block;
        margin-top: 0.5rem;
    }
}


</style>
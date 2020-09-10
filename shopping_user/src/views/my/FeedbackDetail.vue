<template>
    <div id="feedback">
        <pageHeader/>
        <div class="d_con">
            <p>{{detail.content}}</p>
            <span>{{$times.getDate(detail.createTime)}}</span>
            <div class="reply" v-show="detail.replyContent">
                官方回复：
                <div>{{detail.replyContent}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            id: '',
            detail: '',
        }
    },

    methods: {
        getDetail(id){
            this.$request.post({
                url: '/us/sysAdvice/details',
                params: {
                    id,
                },
                success: res => {
                    this.detail=res;
                },
            });
        }
    },

    mounted(){
        this.id=this.$route.query.id;
        if(this.id){
            this.getDetail(this.id);
        }
    }
}
</script>

<style lang="scss" scoped>
#feedback{
    padding-top: 4rem;
    font-size: 1.4rem;
    color: #222;
    min-height: 100vh;
    background: #fff;
    box-sizing: border-box;
}
.d_con{
    border-top: 1px solid #f5f5f5;
    padding: 1.4rem 1.5rem;
    p{
        line-height: 2rem;
    }
    span{
        letter-spacing: 0;
        color: #C0C8D3;
        font-size: 1.2rem;
        margin-top: 0.5rem;
        display: inline-block;
    }
    .reply{
        color: #F05447;
        margin-top: 1.5rem;
        font-size: 1.3rem;
        line-height: 2rem;
        div{
            text-indent: 2em;
        }
    }
}



</style>
<template>
    <div id="feedback">
        <pageHeader/>
        <div class="d_con">
            <p>{{detail.title}}</p>
            <p>{{detail.content}}</p>
            <span>{{$common.getDate(detail.createTime)}}</span>
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

    methods:{
        getDetail(id){
            this.$request.post({
                url: '/us/sysMessage/details',
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
    padding-top: 4.6rem;
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
        white-space:normal; 
        word-break:break-all;

    }
    span{
        letter-spacing: 0;
        color: #C0C8D3;
        font-size: 1.2rem;
        margin-top: 0.5rem;
        display: inline-block;
    }
}



</style>
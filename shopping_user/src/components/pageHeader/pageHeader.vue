<template>
    <div id="page_header">
        <span @click="emitFn" class="iconfont back_img">&#xe618;</span>
        <p>{{title?title :$route.meta.title}}</p>
        <div>&nbsp;</div>
    </div>
</template>

<script>
export default {
    name: 'home',
    props: {
		isback: {
			type: Boolean,
			default: true
        },
        title: {
            type: String,
            default: ''
        },
	},
    data(){
        return{
        }
    },

    watch:{

    },

    created(){
    },

    methods:{
        emitFn(){
            this.$emit('change')
            if(this.isback){
                this.$router.go(-1)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
#page_header{
    position: fixed;
    width: 100%;
    height: 4.6rem;
    line-height: 4.6rem;
    top: 0;
    left: 0;
    background-color: #fff;
    color: #333;
    z-index: 100;
    // border-bottom: 1px solid #eeeeee;
    box-sizing: border-box;
    display: flex;
    align-items: center;
	justify-content: space-between;
	box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
    img{
        height: 1.8rem;
        display: block;
        margin-left: 1rem;
    }
    .back_img{
        font-size: 2.3rem;
        margin-left: 0.7rem;
    }
    p{
        margin-right: 2.2rem;
        font-size: 1.6rem;
    }

}
</style>
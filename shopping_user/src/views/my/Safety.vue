<template>
    <div id="safety">
        <pageHeader/>
        <div class="skip">
            <div @click="$router.push('/update_pwd')">
                <span>修改密码</span>
                <van-icon name="arrow" />
            </div>
            <div @click="$router.push('/update_phone')">
                <span>修改手机号</span>
                <van-icon name="arrow" />
            </div>
            <div @click="$router.push('/bank')">
                <span>绑定银行卡</span>
                <van-icon name="arrow" />
            </div>
            <div v-if="$store.state.all.isBindWechat!=1" @click="$router.push('/wechatAutho')">
                <span>绑定微信</span>
                <van-icon name="arrow" />
            </div>
            <div v-if="$store.state.all.isBindWechat==1">
                <span>已绑定微信 <span style="color:#0AC4FD;font-size:1.2rem;">( 昵称: {{$store.state.all.wechatNick}} )</span></span>
            </div>
        </div>
        <div class="btn" @click="$router.push('/login')">退出登录</div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    },

    methods:{
    },
    mounted(){
        this.$store.dispatch('all/setUser');
    }
}
</script>

<style lang="scss" scoped>
#safety{
    padding-top: 4.6rem;
    font-size: 1.4rem;
}
.skip{
    background: #fff;
    margin-top: 1rem;
    color: #222;
    &>div{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 4.1rem;
        padding: 0 0.9rem;
        border-bottom: 1px solid #f5f5f5;
    }
}
.btn{
    background: #fff;
    margin-top: 1rem;
    text-align: center;
    padding: 1rem 0;
}

</style>
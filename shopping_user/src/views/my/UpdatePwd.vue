<template>
    <div id="update_pwd">
        <pageHeader/>
        <div class="card">
            <span>旧密码</span>
            <input type="password" placeholder="请输入旧密码" v-model="oldPassword">
        </div>
        <div class="card">
            <span>新密码</span>
            <input type="password" placeholder="请输入新密码" v-model="newPassword">
        </div>
        <div class="card">
            <span>重复新密码</span>
            <input type="password" placeholder="请重新输入新密码" v-model="confirmPwd">
        </div>
        <div class="btn"><button @click="update">确认修改</button></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            oldPassword: '',
            newPassword: '',
            confirmPwd: '',
        }
    },

    methods:{
        //修改密码
        update(){
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            if(!this.oldPassword){
            	loading.clear();
                this.$toast.fail('旧密码不能为空');
                return; 
            }
            if(!this.newPassword){
            	loading.clear();
                this.$toast.fail('新密码不能为空');
                return; 
            }
            if(this.newPassword!=this.confirmPwd){
            	loading.clear();
                this.$toast.fail('2次输入的密码不一致');
                return; 
            }
            this.$request.post({
                url: '/us/autho/updatePassword',
                params: {
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword
                },
                success: res => {
                    this.$toast.success('修改密码成功');
                	this.$router.push('/login');
				},
				finally: () => {
                    loading.clear();
                }
            })
        },
        
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#update_pwd{
    padding-top: 5.6rem;
    font-size: 1.4rem;
}
.card{
    background: #fff;
    display: flex;
    align-items: center;
    padding: 1rem;
    color: #222;
    border-bottom: 1px solid #f5f5f5;
    span{
        width: 8rem;
    }
    input{
        border: none;
    }
}
.btn{
    text-align: center;
    margin-top: 2.5rem;
    padding: 0 5rem;
    button{
        color: #fff;
        font-size: 1.6rem;
        background: $color;
        width: 100%;
        height: 3.7rem;
        line-height: 3.55rem;
        border-radius: 3.8rem;
    }        
}
</style>
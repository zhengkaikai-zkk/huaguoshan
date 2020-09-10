<template>
    <div id="login" :style="{backgroundImage:('url('+bg+')')}">
        <div class="d_logo">
            <span></span>
            <a>LOGO</a>
        </div>
        <div class="d_login">
            <p>用户登录</p>
            <div class="d_input">
                <i class="iconfont">&#xe616;</i>
                <div><input type="text" placeholder="请输入手机号码" v-model="formData.account" maxlength="11"></div>
            </div>
            <div class="d_input">
                <i class="iconfont">&#xe613;</i>
                <div><input type="password" placeholder="请输入密码" v-model="formData.password"></div>
            </div>
            <div class="d_input d_code">
                <i class="iconfont">&#xe617;</i>
                <div>
                    <input type="text" placeholder="请输入验证码" v-model="formData.verifyCode">
                    <van-image width="6.2rem" height="2.9rem" fit="contain" :src="imgUrl" @click="refreshCode"/>
                    <!-- <img class="img_code" @click="refreshCode" :src="imgUrl" alt=""> -->
                </div>
            </div>
            <div class="forget"><span @click="$router.push('/forget')">忘记密码?</span></div>
            <div class="btn">
                <button @click="login">登录</button>
                <button @click="$router.push('/register')">注册</button>
            </div>
            <!-- <div class="wechat">
                <div>其他方式登录</div>
                <img @click="$router.push('/wechatAutho')" src="@/assets/img/login/wechat.png" alt="">
            </div> -->
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            bg: require('@/assets/img/login/bg.png'),
            imgUrl: '',
            formData: {
            	account:'',
            	password:'',
            	verifyCode:'',
                verifySign: '',
            },
        }
    },

    methods:{
        //-----------获取图片验证码------------
		refreshCode(){
			var _this = this;
		 	_this.$axios.get("/public/verifyCode",{responseType:'blob'}).then(function(res){
		 		_this.imgUrl = window.URL.createObjectURL(res.data);
		 		_this.formData.verifySign = res.headers.verifysign;
		 	}).catch(function(error){
		 		console.log(error);
             })
        },

        login(){
        	const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            if(!this.formData.account){
            	loading.clear();
                this.$toast.fail('手机号不能为空');
                return; 
            }
            if(!this.$common.isPhone(this.formData.account)){
            	loading.clear();
                this.$toast.fail('手机号格式不正确');
                return; 
            }
            if(!this.formData.password){
            	loading.clear();
                this.$toast.fail('密码不能为空');
                return;
            }
            if(!this.formData.verifyCode){
            	loading.clear();
                this.$toast.fail('验证码不能为空');
                return;
            }
            this.$request.post({
                url: '/us/autho/public/login',
                params:this.formData,
                success: result => {
                    this.$toast.success('登录成功');
                    localStorage.setItem(`userToken`,result.token);
                    this.$router.replace({
                        path: '/home'
                    })
                },
                error:result =>{
                	this.refreshCode();
                },
                finally: () => {
                    loading.clear();
                }
            })
        },
    },

    mounted(){
        this.refreshCode();
        localStorage.removeItem('userToken')
        localStorage.removeItem('usInfo')
        sessionStorage.removeItem('brandList')
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#login{
    background-color: #fff;
    background-size: 100% auto;
    background-repeat: no-repeat;
    height: 100vh;
}
.d_logo{
    text-align: center;
    padding-top: 3rem;
    padding-bottom: 1.4rem;
    color: #fff;
    img{
        width: 16rem;
    }
    span{
        height: 3.5rem;
        width: 3.5rem;
        background: #fff;
        border-radius: 50%;
        display: inline-block;
    }
    a{
        font-size: 2.5rem;
        position: relative;
        bottom: 0.7rem;
        margin-left: 1rem;
    }
}
.d_login{
    background: #fff;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 0 2.5rem;
    &>p{
        padding: 1.8rem 0 1.5rem 0;
        font-size: 2.3rem;
        color: $color;
    }
    .d_input{
        display: flex;
        align-items: center;
        i{
            font-size: 2.2rem;
            color: $color;
        }
        input{
            border: none;
            font-size: 1.4rem;
            width: 100%;
            margin: 1rem 0;
        }
        &>div{
            width: 100%;
            margin-left: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #C0C8D3;
        }
    }
    .d_code{
        input{
            width: 60%;
        }
        .img_code{
            width: 6.2rem;
        }
    }
    .wechat{
        position: fixed;
        bottom: 1.5rem;
        left: 0;
        right: 0;
        text-align: center;
        img{
            width: 3rem;
            margin-left: 1rem;
        }
        
    }
}
.forget{
    text-align: right;
    color: $color;
    margin-top: 1.4rem;
    font-size: 1.4rem;
}
.btn{
    text-align: center;
    margin-top: 1.6rem;
    button{
        color: #fff;
        font-size: 1.6rem;
        background: $color;
        border: 1px solid $color;
        width: 22rem;
        height: 3.65rem;
        line-height: 3.55rem;
        border-radius: 3.8rem;
        letter-spacing: 0.5rem;
    }
    &>button:last-child{
        background: #fff;
        color: $color;
        margin-top: 2rem;
    }  
}
</style>
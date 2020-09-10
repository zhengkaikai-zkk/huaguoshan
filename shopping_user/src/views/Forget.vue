<template>
    <div id="forget" :style="{backgroundImage:('url('+bg+')')}">
        <div class="d_logo">
            <span></span>
            <a>LOGO</a>
        </div>
        <div class="d_login">
            <p>重置密码</p>
            <div class="d_input">
                <i class="iconfont">&#xe616;</i>
                <div><input type="text" placeholder="请输入手机号码" v-model="formData.phone"></div>
            </div>
            <div class="d_input">
                <i class="iconfont">&#xe613;</i>
                <div><input type="password" placeholder="请设置密码" v-model="formData.password"></div>
            </div>
            <div class="d_input">
                <i class="iconfont">&#xe613;</i>
                <div><input type="password" placeholder="请重新输入密码" v-model="confirmPassword"></div>
            </div>
            <div class="d_input d_code">
                <i class="iconfont">&#xe617;</i>
                <div>
                    <input type="text" placeholder="请输入验证码" v-model="verifyCode">
                    <van-image width="6.2rem" height="2.9rem" fit="contain" :src="imgUrl" @click="refreshCode"/>
                    <!-- <img class="img_code" @click="refreshCode" :src="imgUrl" alt=""> -->
                </div>
            </div>
            <div class="d_input d_code">
                <i class="iconfont">&#xe611;</i>
                <div>
                    <input type="text" placeholder="请输入手机验证码" v-model="formData.phoneCode">
                    <span v-if="verificationShow" @click="countDown">获取验证码</span>
                    <span v-if="!verificationShow">{{getVerification}}</span>
                </div>
            </div>
            <div class="btn">
                <button @click="forget">确认</button>
                <button @click="$router.push('/login')">返回登录</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            bg: require('@/assets/img/login/bg.png'),
            imgUrl: '',
            verifySign:'',
            verifyCode:'',
            formData: {
                phone: '',
                password:'',
                phoneCode:'',
                phoneSign:'',
            },
            getVerification: '60s后重新获取',//获取验证码
			verificationShow: true,//获取验证码切换
			confirmPassword:'',
        }
    },

    methods:{
        forget(){
    		const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
			if(!this.$common.isPhone(this.formData.phone)){
				loading.clear();
                this.$toast.fail('手机号不能为空');
				return;
			};
			if(!this.verifyCode){
				loading.clear();
                this.$toast.fail('图片验证码不能为空');
				return;
			};
			if(!this.formData.phoneCode){
				loading.clear();
                this.$toast.fail('短信验证码不能为空');
				return;
			};
			if(!this.formData.password){
				loading.clear();
                this.$toast.fail('密码不能为空');
				return;
			};
			if(this.confirmPassword!=this.formData.password){
				loading.clear();
				this.$toast.fail('新密码与确认密码不一致');
				return;
			};
			this.$request.post({
                url: '/us/autho/public/forgetPassword',
                params: this.formData,
                success: result => {
                    this.$toast.success('修改成功');
					this.$router.push('/login');
				},
				error:result =>{
                	this.refreshCode();
                },
				finally: () => {
                    loading.clear();
                }
            })
		},
        //-----------获取手机验证码------------
		countDown(){
			if(!this.$common.isPhone(this.formData.phone)){
                this.$toast.fail('手机号格式错误');
				return;
			};
			if(!this.verifyCode){
                this.$toast.fail('图片验证码不能为空');
				return;
			}
			this.$request.post({
                url: '/sms/public/sendCode',
                params: {
                	type:1,
                    phone: this.formData.phone,
					verifyCode: this.verifyCode,
					verifySign:this.verifySign,
                },
                success: (data, res) => {
                    this.$toast.success('短信发送成功');
                    this.formData.phoneSign = res.headers.phonesign;
					var time = 60;
					this.verificationShow = false;
					this.getVerification = '60s后重新获取';
					var Time = setInterval(() => {
						if(time == 1){
							this.verificationShow = true;
							time = 60;
							clearTimeout(Time);
						}else{
							time -- ;
							this.getVerification = time + 's后重新获取';
						}
					},1000);
				},
				error: err => {
					this.refreshCode();
				}
            })
        },
        
        //-----------获取图片验证码------------
		refreshCode(){
			var _this = this;
		 	_this.$axios.get("/public/verifyCode",{responseType:'blob'}).then(function(res){
		 		_this.imgUrl = window.URL.createObjectURL(res.data);
		 		_this.verifySign = res.headers.verifysign;
		 	}).catch(function(error){
		 		console.log(error);
            })
        },
    },

    mounted(){
        this.refreshCode();
    }


}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#forget{
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
    color: $color;
    font-size: 1.4rem;
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
            color: #9099A8;
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
}
.btn{
    text-align: center;
    margin-top: 2.6rem;
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
        letter-spacing: 1px;
    }  
}
</style>
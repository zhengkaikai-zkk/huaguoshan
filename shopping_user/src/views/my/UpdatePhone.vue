<template>
    <div id="update_phone">
        <pageHeader/>
        <!-- 第一步 -->
        <div v-if="step==1">
            <div class="card">
                <div>
                    <span>旧手机号</span>
                    <span>{{$common.encryptPhone($store.state.all.user.phone)}}</span>
                </div>
            </div>
            <div class="card">
                <div>
                    <span>验证码</span>
                    <input type="text" placeholder="请输入验证码" v-model="oldData.verifyCode">
                </div>
                <img @click="refreshCode" :src="imgUrl" alt="">
            </div>
            <div class="card">
                <div>
                    <span>手机验证码</span>
                    <input type="text" v-model="oldData.phoneCode" placeholder="请输入手机验证码">
                </div>
                <li @click="getOldPhoneCode">{{oldData.codeText}}</li>
            </div>
            <div class="btn"><button @click="verifyOld">下一步</button></div>
        </div>
        <!-- 第二步 -->
        <div v-if="step==2">
            <div class="card">
                <div>
                    <span>新手机号</span>
                    <input type="text" maxlength="11" placeholder="请输入新手机号码" v-model="formData.newPhone">
                </div>
            </div>
            <div class="card">
                <div>
                    <span>验证码</span>
                    <input type="text" maxlength="4" placeholder="请输入验证码" v-model="newData.verifyCode">
                </div>
                <img @click="refreshCode" :src="newImgUrl" alt="">
            </div>
            <div class="card">
                <div>
                    <span>手机验证码</span>
                    <input type="text" placeholder="请输入手机验证码" v-model="formData.newPhoneCode">
                </div>
                <li @click="getNewPhoneCode">{{newData.codeText}}</li>
            </div>
            <div class="btn" @click="updatePhone"><button>确认修改</button></div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            step: 1,
            imgUrl: '',
            newImgUrl: '',
            formData:{
                phoneCode: '', // 旧手机验证码
                phoneSign: '',
                newPhone: '',
                newPhoneCode: '',
                newPhoneSign: '',
            },
            oldData: {
                phone: '',
                verifyCode: '',
                verifySign: '',
                phoneCode: '',
                phoneSign: '',
                time: 60,
                flag: true,
                codeText: '获取验证码',
                interval: '',
            },
            newData: {
                verifyCode: '',
                verifySign: '',
                time: 60,
                flag: true,
                codeText: '获取验证码',
                interval: '',
            }
        }
    },

    methods:{
        // 获取旧手机验证码
        getOldPhoneCode(){
            if(!this.oldData.flag){
                return;
            }
            this.oldData.phone = this.$store.state.all.user.phone;
            if(!this.oldData.phone) {
                this.$toast.fail('请输入手机号');
                return;
            }
            if(!this.$common.isPhone(this.oldData.phone)) {
                this.$toast.fail("请输入正确的手机号");
                return;
            }
            if(!this.oldData.verifyCode){
                this.$toast.fail("请输入图片验证码");
                return;
            }
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: 'sms/public/sendCode',
                params: {
                    phone: this.oldData.phone,
                    verifyCode: this.oldData.verifyCode,
                    verifySign: this.oldData.verifySign
                },
                success: (data, res) => {
                    this.$toast.success("短信验证码发送成功，请注意查收");
                    this.oldData.flag = false
                    this.oldData.time--
                    this.oldData.codeText = this.oldData.time + ' s后获取'
                    this.oldData.interval = setInterval(() => {
                        this.oldData.time--
                        this.oldData.codeText = this.oldData.time + ' s后获取'
                        if( this.oldData.time<=0){
                            this.oldData.codeText='获取验证码'
                            clearInterval(this.oldData.interval)
                            this.oldData.flag= true
                            this.oldData.time= 60
                        }
                    }, 1000)

                    this.oldData.phoneSign = res.headers.phonesign;
                },
                finally: () => {
                    loading.clear();
                }
            });
        },
        // 验证旧手机验证码
        verifyOld(){
            if(!this.oldData.verifyCode){
                this.$toast.fail("请输入图片验证码");
                return;
            }
            if(!this.oldData.phoneSign){
                this.$toast.fail("请先获取短信验证码");
                return;
            }
            if(!this.oldData.phoneCode){
                this.$toast.fail("请输入短信验证码");
                return;
            }
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/info/checkPhone',
                params: {
                    oldPhone: this.$store.state.all.user.phone,
                    phoneCode: this.oldData.phoneCode,
                    phoneSign: this.oldData.phoneSign
                },
                success: res => {
                    this.step = 2
                    this.refreshCode();
                },
                finally: () => {
                    loading.clear();
                }
            });
        },
        
        // 获取新手机验证码
        getNewPhoneCode(){
            if(!this.newData.flag){
                return;
            }
            this.newData.phone = this.$store.state.all.user.phone;
            if(!this.newData.phone) {
                this.$toast.fail("请输入手机号");
                return;
            }
            if(!this.$common.isPhone(this.newData.phone)) {
                this.$toast.fail("请输入正确的手机号");
                return;
            }
            if(!this.newData.verifyCode){
                this.$toast.fail("请输入图片验证码");
                return;
            }
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/autho/phoneOption',
                params: {
                    phone: this.formData.newPhone,
                    type: 'bind'
                },
                success: res => {
                    if(res == 1){
                        this.$toast.fail("手机号已被注册");
                        this.refreshCode();
                    }else{
                        this.$request.post({
                            url: 'sms/public/sendCode',
                            params: {
                                phone: this.formData.newPhone,
                                verifyCode: this.newData.verifyCode,
                                verifySign: this.newData.verifySign
                            },
                            success: (data, res) => {
                                this.$toast.success("短信验证码发送成功，请注意查收");
                                this.newData.flag = false
                                this.newData.time--
                                this.newData.codeText = this.newData.time + ' s后获取'
                                this.newData.interval = setInterval(() => {
                                    this.newData.time--
                                    this.newData.codeText = this.newData.time + ' s后获取'
                                    if( this.newData.time<=0){
                                        this.newData.codeText='获取验证码'
                                        clearInterval(this.newData.interval)
                                        this.newData.flag= true
                                        this.newData.time= 60
                                    }
                                }, 1000)

                                this.formData.newPhoneSign = res.headers.phonesign;
                            }
                        });
                    }
                },
                finally: () => {
                    loading.clear();
                }
            });
        },
        // 修改手机号
        updatePhone(){
            this.formData.phoneCode = this.oldData.phoneCode;
            this.formData.phoneSign = this.oldData.phoneSign;
            if(!this.formData.newPhone){
                this.$toast.fail("请输入新手机号");
                return;
            }
            if(!this.$common.isPhone(this.formData.newPhone)){
                this.$toast.fail("请输入正确的新手机号");
                return;
            }
            if(!this.newData.verifyCode){
                this.$toast.fail("请输入图片验证码");
                return;
            }
            if(!this.formData.newPhoneSign){
                this.$toast.fail("请先获取手机验证码");
                return;
            }
            if(!this.formData.newPhoneCode){
                this.$toast.fail("请输入手机验证码");
                return;
            }
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/info/updatePhone',
                params: this.formData,
                success: res => {
                    this.$toast.success("修改成功，请重新登录");
                    this.$router.push('/login');
                },
                finally: () => {
                    loading.clear();
                }
            });
        },


        //-----------获取图片验证码------------
		refreshCode(){
		 	this.$axios.get("/public/verifyCode",{responseType:'blob'}).then(res => {
		 		if(this.step == 1){
                    this.imgUrl = window.URL.createObjectURL(res.data);
                    this.oldData.verifySign = res.headers.verifysign;
                 }else {
                    this.newImgUrl = window.URL.createObjectURL(res.data);
		 		    this.newData.verifySign = res.headers.verifysign;
                 }
		 	}).catch(function(error){
		 		console.log(error);
		 	})
        },
    },

    mounted(){
        this.$store.dispatch('all/setUser');
        this.refreshCode();
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#update_phone{
    padding-top: 5.6rem;
    font-size: 1.4rem;
}
.card{
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.9rem;
    padding: 0 1rem;
    color: #222;
    border-bottom: 1px solid #f5f5f5;
    &>div{
        display: flex;
        align-items: center;
        span{
            width: 8rem;
        }
        &>span:nth-child(2){
            letter-spacing: 0;
        }
        input{
            border: none;
        }
    }
    img{
        width: 6rem;
    }
    li{
        color: #EE8B42;
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
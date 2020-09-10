<template>
    <div id="bank_add">
        <pageHeader/>
        <div class="card" @click="show=true">
            <div>
                <span>选择银行</span>
                <i>{{bank.value}}</i>
            </div>
            <van-icon color="#9099a8" name="arrow" />
        </div>
        <div class="card">
            <div>
                <span>银行卡号</span>
                <input type="text" class="d_wid" placeholder="请输入银行卡号" v-model="form.cardNum">
            </div>
        </div>
        <div class="card">
            <div>
                <span>持有人</span>
                <input type="text" class="d_wid" placeholder="请输入银行卡持有人姓名" v-model="form.realName">
            </div>
        </div>
        <div class="card">
            <div>
                <span>预留手机号</span>
                <input type="text" class="d_wid" placeholder="请输入银行卡预留手机号" v-model="form.phone">
            </div>
        </div>
        <div class="card">
            <div>
                <span>银行卡类型</span>
                <van-radio-group v-model="form.cardType">
                    <div style="display:flex;justify-content:space-between;width: 14rem">
                        <van-radio name="储蓄卡">储蓄卡</van-radio>&nbsp;&nbsp;&nbsp;&nbsp;
                        <van-radio name="信用卡">信用卡</van-radio>
                    </div>
                </van-radio-group>
            </div>
        </div>
        <div class="card">
            <div>
                <span>验证码</span>
                <input type="text" placeholder="请输入验证码" v-model="send.verifyCode">
            </div>
            <img @click="refreshCode" :src="imgUrl" alt="">
        </div>
        <div class="card">
            <div>
                <span>手机验证码</span>
                <input type="text" v-model="form.phoneCode" placeholder="请输入手机验证码">
            </div>
            <li v-if="verificationShow" @click="countDown">获取验证码</li>
            <li v-if="!verificationShow">{{getVerification}}</li>
        </div>
        <div class="btn"><button @click="bind">确认绑定</button></div>

        <!----------------- 弹框 -------------- -->
        <van-popup v-model="show" position="bottom">
            <van-picker show-toolbar title="请选择提现银行卡" :columns="columns" @confirm="confirm" @cancel="show=false"/>
        </van-popup>
    </div>
</template>

<script>
export default {
    data(){
        return{
            show: false,
            columns: [
                {text:'中国工商银行',id: '1'},
                {text:'中国建设银行',id: '2'},
                {text:'中国银行',id: '2'},
                {text:'中国邮政储蓄银行',id: '2'},
                {text:'广东发展银行',id: '2'},
                {text:'招商银行',id: '2'},
                {text:'平安银行',id: '2'},
                {text:'中信银行',id: '2'},
                {text:'交通银行',id: '2'},
                {text:'兴业银行',id: '2'},
                {text:'中国农业银行',id: '2'},
                {text:'中国民生银行',id: '2'},
                {text:'中国光大银行',id: '2'},
            ],
            bank: {
                id: '0',
                value: '请选择开户银行',
            },
            imgUrl: '',
            form:{
                cardType: '储蓄卡',
                cardNum: '',
                bankName: '',
                realName: '',
                phone: '',
                phoneCode: '',
                phoneSign: ''
            },
            send: {
                verifyCode: '',
                verifySign: '',
                codeText: '获取验证码',
            },
            getVerification: '60s后重新获取',//获取验证码
			verificationShow: true,//获取验证码切换
        }
    },

    methods:{
        bind(){
            if(!this.form.bankName){
                this.$toast.fail('请选择银行卡');
				return;
            };
            if(!this.form.cardNum){
                this.$toast.fail('请输入银行卡号');
				return;
            };
            if(!this.form.realName){
                this.$toast.fail('请输入持有人名字');
				return;
            };
			if(!this.$common.isPhone(this.form.phone)){
                this.$toast.fail('手机号格式不正确');
				return;
            };
            if(!this.form.phoneCode){
                this.$toast.fail('短信验证码不能为空');
				return;
			};
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
			this.$request.post({
                url: '/us/bankCard',
                params: this.form,
                success: result => {
                    this.$toast.success('绑定成功');
					this.$router.replace('/bank');
				},
				finally: () => {
                    loading.clear();
                }
            })
        },

        isUnionpay(){
            this.$request.post({
                url: '/public/tokenPay/openQuery',
                success: res => {
                    
				},
				finally: () => {
                }
            })
        },

        //-----------获取手机验证码------------
		countDown(){
			if(!this.$common.isPhone(this.form.phone)){
                this.$toast.fail('手机号格式错误');
				return;
			};
			if(!this.send.verifyCode){
                this.$toast.fail('图片验证码不能为空');
				return;
			}
			this.$request.post({
                url: '/sms/public/sendCode',
                params: {
                    phone: this.form.phone,
					verifyCode: this.send.verifyCode,
					verifySign:this.send.verifySign,
                },
                success: (data, res) => {
                    this.$toast.success('短信发送成功');
                    this.form.phoneSign = res.headers.phonesign;
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

        //选择器
        confirm(value, index) {
            this.show= false;
            this.form.bankName=value.text;
            this.bank= {
                id: value.id,
                value: value.text
            };
        },
        //-----------获取图片验证码------------
		refreshCode(){
			var _this = this;
		 	_this.$axios.get("/public/verifyCode",{responseType:'blob'}).then(function(res){
		 		_this.imgUrl = window.URL.createObjectURL(res.data);
		 		_this.send.verifySign = res.headers.verifysign;
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

<style lang="scss">
@import '@/assets/css/public.scss';
#bank_add .van-radio__icon--checked .van-icon {
    color: #fff;
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#bank_add{
    padding-top: 5.6rem;
    font-size: 1.4rem;
    color: #222;
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
            width: 28vw;
        }
        i{
            color: #C0C8D3;
        }
        &>span:nth-child(2){
            letter-spacing: 0;
        }
        input{
            border: none;
            width: 35vw;
        }
        .d_wid{
            width: 65vw;
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
    button{
        color: #fff;
        font-size: 1.6rem;
        background: $color;
        width: 21.2rem;
        height: 3.65rem;
        line-height: 3.55rem;
        border-radius: 3.8rem;
    }        
}
</style>
<template>
    <div id="pay">
        <pageHeader :isback="false" @change="$router.replace('order')"/>
        <div class="d_pay">
            <p>选择付款方式</p>
            <van-radio-group v-model="type" icon-size="13px">
                <div class="card">
                    <img src="@/assets/img/goods/pay-4.png" alt="">
                    <van-radio name="4" label-position="left" icon-size="15px">余额支付</van-radio>
                </div>
                <div class="card">
                    <img src="@/assets/img/goods/pay-1.png" alt="">
                    <van-radio name="1" label-position="left" icon-size="15px">微信支付</van-radio>
                </div>
                <div class="card">
                    <img src="@/assets/img/goods/pay-2.png" alt="">
                    <van-radio name="2" label-position="left" icon-size="15px">支付宝支付</van-radio>
                </div>
                <!-- <div class="card">
                    <img src="@/assets/img/goods/pay-3.png" alt="">
                    <van-radio name="3" label-position="left" icon-size="15px">银联支付</van-radio>
                </div> -->
            </van-radio-group>
        </div>

        <div class="get_code" v-show="type==4">
            <van-field v-model="password" type="password" label="验证密码" placeholder="请输入登录密码"/>
        </div>

        <div class="remark" v-if="$store.state.all.isBindWechat==0">
            您没有绑定微信，不能进行微信支付, <a @click="$router.push('/safety')">去绑定</a>
        </div>
        <div class="btn">
            <van-button round type="info" :loading="btnLoad" loading-text="提交中..." @click="payMoney" block>确认付款</van-button>
        </div>

        <!----------------- 弹框 -------------- -->
        <van-popup v-model="show" position="bottom">
            <van-picker show-toolbar title="请选择银行卡支付" :columns="columns" @confirm="confirm" @cancel="show=false"/>
        </van-popup>
    </div>
</template>

<script>
export default {
    data(){
        return{
            id: '',
            type: '1',
            show: false,
            isBank: true,
            columns: [
                // {text:'请选择提现银行卡',id: '0'},
                // {text:'中国银行(0568)',id: '1'},
                // {text:'建设银行(8100)',id: '2'},
            ],
            bank: '',
            send: {
                phoneNo: '',
                orderNo: '',
                txnAmt: '',
                token: ''
            },
            getVerification: '60s后重新获取',//获取验证码
            verificationShow: true,//获取验证码切换
            smsCode: '',
            loading: false,
            wechat: '',
            btnLoad: false,
            password: '',
            balance: 0,
            payPrice: 0,
            
        }
    },

    methods: {
        //支付
        payMoney(){
            if(this.type=='1'){
                this.wechatPay();
            }else if(this.type=='3'){
                this.unionpay();
            }else if(this.type=='2'){
                this.zfbPay();
            }else{
                this.balancePay();
            }
        },
        //支付宝支付
        zfbPay(){
            let ua=window.navigator.userAgent.toLowerCase();
            console.log(ua)
            // if(ua.match(/MicroMessenger/i) == "micromessenger"){}
            this.$axios.post('/aliPay/public/pay', this.$qs.stringify({
                id: this.id
            })).then(res => {
                if(!res.data){
                    this.$toast.fail("发生错误")
                    return;
                }
                var data = res.data
                if(data.message == "succ"){
                    console.log(data.result)
                    _AP.pay(data.result, this.id);
                }else{
                    this.$toast.fail(data.result);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        //余额支付 
        balancePay(){
            if(!this.password){this.$toast.fail('密码不能为空');return}
            if(this.balance<this.payPrice){
                this.$dialog.confirm({
                    message: '尊敬的用户，本次订单金额为'+ 
                        this.payPrice +'元，您的账户余额'+ this.balance +'元，不足以完成本次订单支付，请向您的账号内充值'+ (this.payPrice-this.balance) +'元。',
                    confirmButtonText: '确认充值'
                }).then(() => {
                    this.$router.push('/recharge?money='+(this.payPrice-this.balance))
                }).catch(() => {

                })
            }
            this.btnLoad=true;
            this.$request.post({
                url: '/us/wallet/balancePay',
                params: {
                    orderId: this.id,
                    password: this.password
                },
                success: res => {
                    this.$toast.success('支付成功')
                    this.$router.replace('/order?status=1')
                },
                finally: ()=>{
                    this.btnLoad=false
                }
            });
        },

        //银联支付
        unionpay(){
            if(!this.send.orderNo){this.$toast.fail('没有获取到订单信息');return}
            if(!this.send.token){this.$toast.fail('请选择银行卡');return}
            if(!this.smsCode){this.$toast.fail('请输入短信验证码');return}
            this.btnLoad=true;
            this.$request.post({
                url: '/public/tokenPay/consume',
                params: {
                    orderNo: this.send.orderNo,
                    txnAmt: this.send.txnAmt,
                    token: this.send.token,
                    smsCode: this.smsCode
                },
                success: res => {
                    this.$toast.success('支付成功')
                },
                finally: ()=>{
                    this.btnLoad=false
                }
            });
        },


         //微信支付
        wechatPay(){
            if(this.$store.state.all.isBindWechat==0){this.$toast.fail('未绑定微信'); return}
            this.show=false;
            this.btnLoad=true;
            this.$request.post({
                url: '/wechat/pay/user/weChatPay',
                params: {
                    orderId: this.id
                },
                success: res=>{
                    this.wechat= res;
                    var _this = this;
                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                        "appId" : _this.wechat.appid, //公众号名称，由商户传入     
                        "timeStamp" : _this.wechat.timeStamp, //时间戳，自1970年以来的秒数     
                        "nonceStr" : _this.wechat.nonceStr, //随机串     
                        "package" : _this.wechat.packageValue,
                        "signType" : "MD5", //微信签名方式：     
                        "paySign" : _this.wechat.sign //微信签名 
                    }, function(res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            alert('支付成功')
                            _this.$router.replace('/order')
                        } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                            alert('支付失败')
                        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            alert('支付取消')
                        } else {
                            alert(res.err_msg);
                        }
                    })
                    
                },
                finally: ()=>{
                    this.btnLoad=false
                }
            })
        },

        //发送验证码
        sendCode(){
            if(!this.send.token){this.$toast.fail('请选择银行卡');return}
            if(!this.send.orderNo){this.$toast.fail('没有获取到订单信息');return}
            this.loading=true
            this.$request.post({
                url: '/public/tokenPay/consumeSMS',
                params: this.send,
                success: res => {
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
                finally: () => {
                    this.loading = false;
                }
            });
        },


        //获取银行卡列表
        getList(){
            this.$request.post({
                url: '/us/bankCard/list',
                success: res => {
                    res.forEach(item=>{
                        if(item.bankToken){
                            var obj={
                                text: item.bankName+'('+item.cardNum.substr(item.cardNum.length-4)+')',
                                id: item
                            }
                            this.columns.push(obj)
                        }
                    })
                },
            });
        },

        //获取订单信息
        getDetail(){
            this.$request.post({
                url: '/us/orderInfo/details',
                params: {
                    id: this.id
                },
                success: res =>{
                    this.send.txnAmt=res.orderInfo.payAmount;
                    this.send.orderNo=res.orderInfo.orderNo;
                    this.payPrice= res.orderInfo.payAmount;
                    // this.detail=res.orderInfo;
                    if(res.orderInfo.status==1){
                        this.$toast.success('支付成功')
                        this.$router.replace('/order?status=1')
                    }else{
                        // this.getAlipayInfo();
                    }
                },
            })
        },

        //查询支付宝交易信息
        getAlipayInfo(){
            this.$request.post({
                url: '/aliPay/public/query',
                params: {
                    outTradeNo: this.id
                },
                success: res =>{
                },
            })
        },

        //获取钱包
        getWallet(){
            this.$request.post({
                url: '/us/wallet/details',
                success: res => {
                    // this.balance= res.usWallet.balance;
                },
            });
        },

        //选择器
        confirm(value, index) {
            this.show= false;
            if(this.columns.length==0) return
            this.bank= value.text;
            this.send.phoneNo= value.id.phone;
            this.send.token= value.id.bankToken;
            console.log(value)
        },
    },

    mounted(){
        this.$store.dispatch('all/setUser');
        this.id= this.$route.query.id;
        // this.getList();
        if(this.id){
            this.getDetail();
            this.getWallet();
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/css/public.scss';
#pay .van-button--info {
    color: #fff;
    background-color: $color;
    border: 1px solid $color;
}
#pay .van-radio__icon--checked .van-icon{
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
.get_code{
    margin: 1rem;
    background: #fff;
    border-radius: 0.5rem;
    overflow: hidden;
}
#pay{
    padding-top: 4.6rem;
    font-size: 1.4rem;
    color: #222;
}
.d_pay{
    margin: 1rem;
    background: #fff;
    border-radius: 0.5rem;
    &>p{
        padding: 0.9rem;
    }
    .card{
        border-top: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2.5rem;
        font-size: 1.2rem;
        img{
            width: 8rem;
        }
    }
}
.btn{
    text-align: center;
    margin-top: 2.5rem;
    padding: 0 5rem;
    button{
        font-size: 1.6rem;
        height: 3.7rem;
        line-height: 3.55rem;
        letter-spacing: 1px;
    }        
}
.remark{
    text-align: center;
    color: #999;
    font-size: 1.1rem;
    a{
        color: red;
    }
}
</style>
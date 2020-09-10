<template>
    <div id="bank">
        <pageHeader/>
        <div class="card" v-for="item in list">
            <div>
                <p>{{item.bankName}}&nbsp;&nbsp;({{item.realName}})</p>
                <span>{{$common.lockBankCard(item.cardNum)}}</span>
            </div>
            <div class="d_btn">
                <button @click="remove(item.id)">解绑</button>
                <!-- <button v-if="!item.bankToken" @click="IDCardShow=true;bankCard=item">开通银联</button> -->
            </div>
        </div>
        <div class="btn" @click="$router.push('/bank_add')"><button>添加银行卡</button></div>

        <van-popup v-model="IDCardShow" style="border-radius: 0.4rem;">
            <div class="d_confirm">
                <p>开通银联支付</p>
                <div class="input">
                    身份证号：
                    <input type="text" placeholder="请输入身份证" v-model="certifld">
                </div>
                <div class="con_btn">
                    <button @click="IDCardShow=false">取消</button>
                    <button @click="open">开通</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: [],
            IDCardShow: false,
            bankCard: {},
            certifld: '',
        }
    },

    methods: {
        getList(){
            this.$request.post({
                url: '/us/bankCard/list',
                success: res => {
                    this.list=res;
                },
            });
        },

        //开通银联
        open(){
            if(!this.certifld) return
            this.$request.post({
                url: '/public/tokenPay/openCardFront',
                params: {
                    certifld: this.certifld,
                    customerNm: this.bankCard.realName,
                    phoneNo: this.bankCard.phone,
                    cartNo: this.bankCard.cardNum,
                },
                success: res => {
                    this.IDCardShow=false;
                    localStorage.setItem('callbackHTML',res);
                    window.location.href = '/static/unionpay.html';
                },
            });
        },

        //解绑
        remove(id){
            this.$dialog.confirm({
                title: '提示',
                message: '确定要解除该银行卡的绑定吗？'
                }).then(() => {
                    this.$request.post({
                        url: '/us/bankCard/unBundling',
                        params: { id },
                        success: res => {
                            this.$toast.success('解绑成功');
                            this.getList();
                        },
                    });
                }).catch(() => {
                // on cancel
            });
        },
        
       
    },

    mounted(){
        this.getList();
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#bank{
    padding: 0 0.9rem;
    padding-top: 4.6rem;
    font-size: 1.4rem;
    color: #222;
}
.card{
    background: #fff;
    margin-top: 1rem;
    letter-spacing: 0;
    padding: 1.1rem 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    p{
        margin-bottom: 0.2rem;
    }
    .d_btn{
        button{
            background: $color;
            border: 1px solid $color;
            color: #fff;
            padding: 0 0.6rem;
            height: 2.4rem;
            font-size: 1.2rem;
        }
        &>button:first-child{
            background: #fff;
            color: $gary;
            margin-right: 0.5rem;
        }
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
.d_confirm{
    width: 90vw;
    border-radius: 1rem;
    text-align: center;
    p{
        margin-top: 2.5rem;
        color: #9099a8;
        font-size: 1.6rem;
    }
    .input{
        letter-spacing: 0;
        font-size: 1.2rem;
        margin-top: 1.5rem;
        margin-bottom: 2rem;
        input{
            border: none;
        }
    }
    .con_btn{
        border-top: 1px solid #f5f5f5;
        display: flex;
        color: $color;
        button{
            width: 50%;
            height: 4rem;
        }
        button:first-child{
            color: #333;
            border-right: 1px solid #f5f5f5;
        }
    }
    
}
</style>
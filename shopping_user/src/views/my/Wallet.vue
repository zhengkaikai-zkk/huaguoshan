<template>
    <div id="wallet">
        <pageHeader/>
        <div class="wallet">
            <li><img src="@/assets/img/my/money-bg.png" alt=""></li>
            <div class="d_wallet">
                <div>
                    <span>我的余额</span>
                    <p>￥{{wallet.balance}}</p>
                </div>
                <div>
                    <span>提现中</span>
                    <p>￥{{wallet.doWidthdrawal}}</p>
                </div>
                <div>
                    <span>已提现</span>
                    <p>￥{{wallet.withdrawal}}</p>
                </div>
                <div>
                    <span>银行卡</span>
                    <p>{{bankCarNum}}张</p>
                </div>
            </div>
        </div>
        <div class="skip">
            <div @click="$router.push('/withdraw')">
                <span>申请提现</span>
                <van-icon name="arrow" />
            </div>
            <div @click="$router.push('/bank')">
                <span>绑定银行卡</span>
                <van-icon name="arrow" />
            </div>
            <div @click="$router.push('/withdraw_flowing')">
                <span>提现记录</span>
                <van-icon name="arrow" />
            </div>
            <div @click="$router.push('/Flowing')">
                <span>账户流水</span>
                <van-icon name="arrow" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            wallet: {
                balance: '--',
                withdrawalOf: '--',
                withdrawalCount: '--'
            },
            bankCarNum: '--',
        }
    },

    methods:{
        getInfo(){
            this.$request.post({
                url: '/us/info/details',
                success: res => {
                    this.wallet= res.usWallet;
                    this.bankCarNum=res.usBankCards;
                },
            });
        }
    },

    mounted(){
        this.getInfo();
    }
}
</script>

<style lang="scss" scoped>
#wallet{
    padding-top: 4.6rem;
    font-size: 1.4rem;
}
.wallet{
    padding: 0.9rem;
    position: relative;
    li{
        position: absolute;
        left: 0.9rem;
        right: 0.9rem;
        z-index: -1;
        img{
            width: 100%;
        }
    }
    .d_wallet{
        color: #fff;
        padding: 2.4rem 2.4rem;
        letter-spacing: 0;
        display: flex;
        justify-content: space-between;
        p{
            margin-top: 0.5rem;
            text-align: center;
        }
    }
}
.skip{
    background: #fff;
    margin: 0 0.9rem;
    border-radius: 0.5rem;
    &>div{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 4.5rem;
        padding: 0 0.9rem;
        border-bottom: 1px solid #f5f5f5;
    }
}

</style>
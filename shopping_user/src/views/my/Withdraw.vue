<template>
    <div id="withdraw">
        <pageHeader/>
        <div class="money">
            <span>可提现金额</span>
            <p>￥{{balance.toFixed(2)}}</p>
        </div>
        <div class="sele" @click="show=true">
            <div>提现银行<span>{{bank.value}}</span></div>
            <van-icon color="#9099a8" name="arrow" />
        </div>
        <div class="input">
            <span>提现金额</span>
            <input type="text" placeholder="请输入提现金额(不少于20)" v-model="form.money" @blur="withdMoney">
        </div>
        <div class="input">
            <span>备注内容</span>
            <input type="text" placeholder="请输入备注信息" v-model="form.remark">
        </div>
        <div class="remark" v-if="columns.length==0">
            您没有绑定银行卡, <a @click="$router.push('/bank')">去开通</a>
        </div>
        <div class="btn"><button @click="withdraw">确认提现</button></div>

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
                // {text:'请选择提现银行卡',id: '0'},
                // {text:'中国银行(0568)',id: '1'},
                // {text:'建设银行(8100)',id: '2'},
            ],
            bank: {
                id: '',
                value: '请选择提现银行卡',
            },
            form: {
                id: '',
                money: '',
                remark: '',
            },
            balance: 0,
        }
    },

    methods:{
        //提现
        withdraw(){
            if(!this.form.id){this.$toast.fail('请选择银行卡');return}
            if(this.form.money>this.balance){this.$toast.fail('余额不足');return}
            if(this.form.money<20){
                this.$toast.fail('提现金额不能小于20元');
                return
            }
            this.$request.post({
                url: '/us/withdrawal/apply',
                params: this.form,
                success: res =>{
                    this.$toast.success('提现成功,请等待审核');
                    this.getWallet();
                    this.$router.go(-1)
                },
            })
        },

        //获取银行卡列表
        getList(){
            this.$request.post({
                url: '/us/bankCard/list',
                success: res => {
                    res.forEach(item=>{
                        var obj={
                            text: item.bankName,
                            id: item.id
                        }
                        this.columns.push(obj)
                    })
                },
            });
        },
        //获取余额
        getWallet(){
            this.$request.post({
                url: '/us/info/details',
                success: res => {
                    this.balance=res.usWallet.balance;
                },
            });
        },
        //------判断正数---------
		withdMoney(){
			var reg = /^\d+(\.{0,1}\d+){0,1}$/;
			if(!reg.test(Number(this.form.money))){
				this.form.money = '';
				return;
			}else if(this.form.money > this.$store.state.balance){
				this.form.money = this.$store.state.balance;
			}else{
				this.form.money = Number(this.form.money).toFixed(2);
			}
		},
        //选择器
        confirm(value, index) {
            this.show= false;
            this.bank= {
                id: value.id,
                value: value.text
            };
            this.form.id=value.id
        },
    },

    mounted(){
        this.getList();
        this.getWallet();
    }
}
</script>

<style>
/* #withdraw .van-picker__cancel, .van-picker__confirm{
    color: #294D7D;
} */
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#withdraw{
    padding-top: 4rem;
    font-size: 1.4rem;
    color: #222;
}
.money{
    margin-top: 1.8rem;
    background: #fff;
    text-align: center; 
    padding: 2rem 0;
    border: 1px solid #f5f5f5;
    p{
        font-size: 1.8rem;
        padding-top: 0.3rem;
    }
}
.sele{
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.9rem;
    span{
        margin-left: 2rem;
        color: #C0C8D3;
    }
}
.input{
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0.9rem;
    border-top: 1px solid #f5f5f5;
    input{
        border: none;
        margin-left: 2rem;
        width: 65vw;
    }
}
.btn{
    text-align: center;
    margin-top: 2.5rem;
    button{
        color: #fff;
        font-size: 1.6rem;
        background: $color;
        width: 21rem;
        height: 3.7rem;
        line-height: 3.55rem;
        border-radius: 3.8rem;
    }        
}
.remark{
    text-align: center;
    color: #999;
    font-size: 1.1rem;
    margin-top: 1rem;
    a{
        color: red;
    }
}
</style>
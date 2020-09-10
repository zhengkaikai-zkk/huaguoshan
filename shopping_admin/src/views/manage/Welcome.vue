<template>
		<div>
				<!-- 订单信息 -->
    		<div class="card">
            <p><b>待处理的事件</b></p>
						<div>
								<span>待回复意见：<b class="error">{{this.adviceNum}}</b><p @click="$router.push('/manage/sys_advice')" style="cursor:pointer; float:right"><img src="@/assets/img/back.svg" /></p></span>
						</div>
						<div>
								<span>库存不足的商品：<b class="error">{{this.stockNum}}</b><p @click="$router.push('/manage/goods_list')" style="cursor:pointer; float:right"><img src="@/assets/img/back.svg" /></p></span>
						</div>
						<div>
								<span>等待发货的订单：<b class="error">{{this.deliveryNum}}</b><p @click="$router.push('/manage/order_list')" style="cursor:pointer; float:right"><img src="@/assets/img/back.svg" /></p></span>
						</div>
						<div>
								<span>待处理的退款申请：<b class="error">{{this.refundNum}}</b><p @click="$router.push('/manage/refund_list')" style="cursor:pointer; float:right"><img src="@/assets/img/back.svg" /></p></span>
						</div>
						<div style="padding-bottom: 20px">
								<span>待处理的提现申请：<b class="error">{{this.withdrawalNum}}</b><p @click="$router.push('/manage/withdrawal_list')" style="cursor:pointer; float:right"><img src="@/assets/img/back.svg" /></p></span>
						</div>
        </div>
	</div>
</template>

<script>
		export default {
				data() {
						return {
								// 待回复意见
								adviceNum: 0,
								// 库存不足
								stockNum: 0,
								// 待发货
								deliveryNum: 0,
								// 申请退款
								refundNum: 0,
								// 申请提现
								withdrawalNum: 0,
						};
				},
		
				methods:{
						// 获取待处理的事件数量
						getNum(){
								this.$request.post({
                    url: '/ad/info/getNum',
                    params: {},
                    success: res =>{
												this.adviceNum = res.adviceNum;
												this.stockNum = res.goodsNum;
												this.deliveryNum = res.orderNum;
												this.refundNum = res.refundNum;
												this.withdrawalNum = res.withdrawalNum;
                    },
                    finally: () => {
                    }
                })
						},
				},

				created(){
						this.getNum();
				}
		}
</script>

<style>

</style>

<style lang="scss" scoped>
		.card{
				width: 30%;
        border: 1px solid #e9e9e9;
        border-radius: 4px;
        color: #606266;
        margin-bottom: 30px;
        margin-top: 10px;
        &>p{
            background: #f8f8f8;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            b{
                padding-left: 10px;
                display: inline-block;
                border-left: 5px solid #409eff;
            }
        }
        &>div{
            padding-top: 20px;
						padding-left: 20px;
            display: flex;
            flex-wrap: wrap;
						&>span{
								width: 100%;
								margin-right: 30px;
						}
        }
    }
</style>
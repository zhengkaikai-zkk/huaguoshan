<!-- 退款订单详情 -->
<template>
    <div>
        <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
        <!-- 退款申请 -->
        <div class="card">
            <p><b>退款申请</b></p>
            <div>
                <div class="d_item">
                    <span>操作人</span>
                    {{user.nick}}
                </div>
                <div class="d_item">
                    <span>联系电话</span>
                    {{user.phone}}
                </div>
                <div class="d_item">
                    <span>退款原因</span>
                    <p style="color:red;">{{refund.reason}}</p>
                </div>
                <div class="d_item">
                    <span>当前状态</span>
                    <p v-for="i in statusList" v-if="refund.status==i.type" :class="i.class">{{i.name}}</p>
                </div>
                <div class="d_item">
                    <span>处理时间</span>
                    {{$common.getDate(refund.handleRefundTime)}}
                </div>
                <div class="d_item" >
                    <span>处理原因</span>
                    <p style="color:red;">{{refund.disRefundReason}}</p>
                </div>
                <div class="d_item" style="width:100%" v-show="refund.proofPics">
                    <span>退款凭证</span>
                    <template v-for="(item, index) in JSON.parse(refund.proofPics)">
                        <el-image style="margin-right:20px" class="d_img" fit="cover" :src="item | fullPath" :preview-src-list="[$common.getUrl() + item]"></el-image>
                    </template>
                </div>
            </div>
        </div>

        <!-- 订单信息 -->
        <div class="card">
            <p><b>订单信息</b><span v-for="i in statusList" v-if="order.status==i.type" :class="i.class">{{i.name}}</span></p>
            <div>
                <!-- 订单基本信息 -->
                <div class="d_descr">
                    <h3>订单基本信息</h3>
                </div>
                <div class="d_item">
                    <span>订单ID</span>
                    {{order.id}}
                </div>
                <div class="d_item">
                    <span>订单编号</span>
                    {{order.orderNo}}
                </div>
                <div class="d_item">
                    <span>订单总金额</span>
                    <p class="error">￥{{order.totalPrice}}元</p>
                </div>
                <div class="d_item">
                    <span>实付金额</span>
                    <p class="error">￥{{order.payPrice}}元</p>
                </div>
                <div class="d_item">
                    <span>订单总数量</span>
                    {{tableList.length}}
                </div>
                <div class="d_item">
                    <span>运费总金额</span>
                    <p class="error">￥{{order.deliveryTotalMoney}}元</p>
                </div>
                <div class="d_item">
                    <span>会员折扣</span>
                    {{order.orderNotes}}
                </div>
                <div class="d_item">
                    <span>支付方式</span>
                    <p class="error">
                        <template v-if="order.payType == 1">
                            余额支付
                        </template>
                        <template v-else-if="order.payType == 2">
                            微信支付
                        </template>
                        <template v-else-if="order.payType == 3">
                            支付宝支付
                        </template>
                    </p>
                </div>
                <div class="d_item">
                    <span>物流单号</span>
                    {{order.expressNumber}}
                </div>
                <div class="d_item">
                    <span>物流公司</span>
                    {{order.expressCompany}}
                </div>
                <div class="d_item" style="width:100%">
                    <span>订单备注</span>
                    {{order.orderNotes}}
                </div>
            </div>
            <div>
                <div class="d_descr">
                    <h3>买家信息</h3>
                </div>
                <div class="d_item" style="width:100%">
                    <span>买家ID</span>
                    {{order.usId}}
                </div>
                <div class="d_item">
                    <span>买家姓名</span>
                    {{order.receiveName}}
                </div>
                <div class="d_item">
                    <span>联系方式</span>
                    {{order.receivePhone}}
                </div>
                <div class="d_item">
                    <span>买家地址</span>
                    {{order.receiveAddress}}
                </div>
                <div class="d_item">
                    <span>下单时间</span>
                    {{$common.getDate(order.createTime)}}
                </div>
                <div class="d_item">
                    <span>付款时间</span>
                    {{$common.getDate(order.payTime)}}
                </div>
                <div class="d_item">
                    <span>收货时间</span>
                    {{$common.getDate(order.receiveTime)}}
                </div>
            </div>
            <div>
                <el-table :data='tableList' stripe style="width:100%; padding:0px; padding-top:20px">
                    <el-table-column
                        align="center"
                        width="90"
                        prop="id"
                        label="商品ID">
                    </el-table-column>

                    <el-table-column
                        align="center"
                        show-overflow-tooltip
                        label="商品封面">
                        <template slot-scope="scope">
                            <el-image class="d_img" fit="cover" :src="scope.row.images | fullPath" :preview-src-list="[$common.getUrl() + scope.row.images]">
                            </el-image>
                        </template>
                    </el-table-column>

                    <el-table-column
                        align="center"
                        prop="productTitle"
                        show-overflow-tooltip
                        label="商品名称">
                    </el-table-column>

                    <el-table-column
                        align="center"
                        label="单价">
                        <template slot-scope="scope">
                            ￥{{scope.row.price}}
                        </template>
                    </el-table-column>

                    <el-table-column
                        align="center"
                        prop="skuSpecs"
                        label="规格">
                    </el-table-column>

                    <el-table-column
                        align="center"
                        prop="productNum"
                        label="数量">
                    </el-table-column>

                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" @click="doDeliveryShow(scope.row.id)" size="small" v-if="scope.row.status == 1">查看优惠券信息</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                // 退款订单
                refund: {},
                // 用户
                user: {},
                // 订单
                order: {},
                // 订单商品
                tableList: [],
                // 退款订单状态
                statusList: [
                    {type:-1, class: 'error', name: '取消退款退货'},
                    {type:1, class: 'warning', name: '退款申请中'},
                    {type:2, class: 'success', name: '退款成功'},
                    {type:3, class: 'error', name: '退款失败'},
                ],
            };
        },
        methods:{
            // 详情
            getDetail(){
                this.$request.post({
                    url: '/ad/orderRefund/details',
                    params: {
                        id: this.id
                    },
                    success: res =>{
                        this.refund = res.orderRefund;
                        this.user = res.usInfo;
                        this.order = res.orderInfo;
                        res.orderProduct.forEach((item)=>{
                            this.tableList.push(item)
                        });
                    },
                })
            }
        },
        created(){
            this.id=this.$route.query.id;
            this.getDetail();
        },
    }
</script>

<style>

</style>

<style lang="scss" scoped>
    .card{
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
            padding: 40px;
            padding-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
        }
        .d_descr{
            font-size: 15px;
            padding: 10px 0;
            display: flex;
            width: 100%;
            span{
                width: 150px;
            }
        }
        .d_item{
            background-color: #f8f8f8;
            font-size: 15px;
            padding: 10px 0;
            display: flex;
            width: 50%;
            span{
                width: 120px;
                padding-right: 30px;
                text-align: right;
            }
        }
        .d_img{
            width: 80px;
            height: 80px;
        }
    }
</style>

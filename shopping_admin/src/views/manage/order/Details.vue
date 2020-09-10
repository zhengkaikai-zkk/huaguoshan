<!-- 订单详情 -->
<template>
	<div>
        <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
        <!-- 退款申请 -->
        <!-- <div class="card" v-show="orderRefund != null">
            <p><b>退款申请</b></p>
            <div>
                <div class="d_item">
                    <span>退款原因</span>
                </div>
                <div class="d_item"></div>
                <div class="d_item" style="width:100%" v-show="JSON.parse(refund.proofPics).length > 0">
                    <span>退款凭证</span>
                    <template v-for="(item, index) in JSON.parse(refund.proofPics)">
                        <el-image style="margin-right:20px" class="d_img" fit="cover" :src="item | fullPath" :preview-src-list="[$common.getUrl() + item]"></el-image>
                    </template>
                </div>
                <div class="d_item"></div>
                <div class="d_item">
                    <span>申请时间</span>
                </div>
            </div>
        </div> -->

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
                    <span>应付金额</span>
                    <p class="error">
                        ￥{{order.payPrice}}元&nbsp;
                         <el-popover
                            placement="top-start"
                            title="金额说明"
                            width="320"
                            trigger="hover"
                            content="应付金额 = 总金额 * 会员优惠 - 优惠券抵扣 + 运费">
                            <i slot="reference"><img src="@/assets/img/careful.svg" /></i>
                        </el-popover>
                    </p>
                </div>
                <div class="d_item">
                    <span>运费总金额</span>
                    <p class="error">￥{{order.deliveryTotalMoney}}元</p>
                </div>
                <div class="d_item">
                    <span>会员折扣</span>
                    {{order.exclusiveDiscount}}折
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
                    <span>优惠券抵扣</span>
                    <p class="error">￥{{order.couponTotalMoney}}元</p>
                </div>
                <template v-if="order.cancelTime != null">
                    <div class="d_item">
                        <span>取消原因</span>
                        <p class="error">{{order.cancelReason}}</p>
                    </div>
                    <div class="d_item">
                        <span>取消时间</span>
                        {{$common.getDate(order.cancelTime)}}
                    </div>
                </template>
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
                        prop="skuSpecs"
                        label="规格">
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
                        prop="productNum"
                        label="数量">
                    </el-table-column>

                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" @click="onCouponShow(scope.row.couponId, scope.row.productId)" size="small" v-if="scope.row.couponId != null">查看优惠券信息</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
        <!-- 订单操作记录 -->
        <div class="card">
            <p><b>订单操作记录</b></p>
            <div>
                <el-timeline>
                    <el-timeline-item :timestamp="$common.getDate(item.createTime)" placement="top" v-for="item in handleList">
                        <el-card>
                            <h4>操作人：{{item.operator}}</h4>
                            <p>订单说明：{{item.remark}}</p>
                            <p>操作前订单状态：
                                <span v-for="i in statusList" v-if="item.oldStatus==i.type" :class="i.class">{{i.name}}</span>
                            </p>
                            <p>操作后订单状态：
                                <span v-for="i in statusList" v-if="item.currentStatus==i.type" :class="i.class">{{i.name}}</span>
                            </p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>

        <!-- 优惠券信息 -->
        <el-dialog
            title="优惠券信息"
            :visible.sync="couponShow"
            width="50%"
            center
            @close="closeDialog">
            <div class="d_column">
                    <el-table :data="this.coupon"  stripe style="width:100%; padding:0px; padding-top:20px">
                        <el-table-column
                            align="center"
                            prop="productCoupon.name"
                            label="优惠券名称">
                        </el-table-column>

                        <el-table-column
                            align="center"
                            label="可抵扣金额">
                            <template slot-scope="scope">
                                {{scope.row.productCoupon.money}}
                            </template>
                        </el-table-column>

                        <el-table-column
                            align="center"
                            show-overflow-tooltip
                            prop="productCoupon.condition"
                            label="使用条件">
                        </el-table-column>

                        <el-table-column
                            align="center"
                            label="使用时间">
                            <template slot-scope="scope">
                                {{$common.getDate(scope.row.createTime)}}
                            </template>
                        </el-table-column>

                        <el-table-column
                            align="center"
                            show-overflow-tooltip
                            label="使用状态">
                            <template slot-scope="scope">
                                <p class="error" v-if="scope.row.status == 2">已使用</p>
                                <p class="error" v-if="scope.row.status != 2">已失效</p>
                            </template>
                        </el-table-column>
                    </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="couponShow = false">关 闭</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
		    return {
                // 订单
                order: {},
                // 订单商品
                tableList: [],
                couponShow: false,
                coupon: [],
                couponFlow: {},
                // 订单操作记录
                handleList: [],
                statusList: [
                    {type:-2, class: 'error', name: '交易关闭'},
                    {type:-1, class: 'warning', name: '申请退款中'},
                    {type:0, class: 'warning', name: '等待用户付款'},
                    {type:1, class: 'warning', name: '待发货'},
                    {type:2, class: 'warning',name: '待收货'},
                    {type:3, class: 'warning', name: '待评价'},
                    {type:4, class: 'success', name: '交易完成'}
                ],
			};
		},
        created(){
        },
        methods:{
            // 详情
            getDetail(){
                this.$request.post({
                    url: '/ad/orderInfo/details',
                    params: {
                        id: this.id
                    },
                    success: res =>{
                        this.order=res.order;
                        res.orderProduct.forEach((item)=>{
                            this.tableList.push(item)
                        });
                        this.handleList=res.orderOperationRecord
                    },
                })
            },

            // 优惠券弹框
            onCouponShow(id, productId){
                this.coupon = [];
                this.$request.post({
                    url: '/ad/productCouponFlow/details',
                    params: {
                        usId: this.order.usId,
                        couponId: id,
                        productId: productId,
                    },
                    success: res =>{
                        this.coupon.push(res);
                    },
                })
                this.couponShow = true;
            },

            // 菜单回调
            closeDialog() {
                // this.son.name='';
                // this.son.imgUrl='';
                // this.$refs.specUpload.clearFiles();
            },
        },
        mounted(){
            this.id=this.$route.query.id;
            this.getDetail();
        }
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
                width: 94px;
                padding-right: 30px;
                text-align: right;
            }
        }
        .d_img{
            width: 80px;
            height: 80px;
        }
    }
    // 查看优惠券信息
    .d_column{
        border: 1px solid #eee;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        .d_s_column_l{
            text-align: left;
            padding-bottom: 10px;
            display: inline-block;
            &>div{
                padding-right: 20px;
                display: inline-block;
                div{
                    margin-top: 10px;
                }
            }
        }
    }
</style>

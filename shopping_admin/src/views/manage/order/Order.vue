<!-- 订单 -->
<template>
    <div id="goods_list">
        <!-- -----------------------------------筛选------------------------------------ -->
        <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
            <el-form-item>
                <el-input oninput = "value=value.replace(/[^\d]/g,'')" v-model="requestParam.orderNo" placeholder="订单编号" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-input oninput = "value=value.replace(/[^\d]/g,'')" v-model="requestParam.expressNumber" placeholder="物流单号" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-select v-model="requestParam.status" placeholder="根据订单状态查询" style="width: 100%;" clearable>
                    <el-option v-for="(item, index) in orderStatus" :label="item.name" :value="item.id.toString()"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>      
                <el-date-picker
                clearable
                v-model="date"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getList(1)"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getList(1)">搜索</el-button>
            </el-form-item>
        </el-form>

        <!-- -----------------------------------列表------------------------------------ -->
        <el-table :data="list" stripe style="width: 100%" v-loading="load">
            <el-table-column prop="id" label="ID" align="center"></el-table-column>

            <el-table-column prop="orderNo" label="订单编号" width="200" align="center"></el-table-column>

            <el-table-column prop="usInfo.nick" label="买家昵称" align="center"></el-table-column>

            <el-table-column prop="usInfo.phone" label="买家联系方式" align="center"></el-table-column>

            <el-table-column prop="totalPrice" label="订单总价" align="center"></el-table-column>

            <el-table-column prop="totalPrice" label="订单实付金额" align="center"></el-table-column>

            <el-table-column 
            prop="expressNumber" label="物流单号" 
            width="200" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.expressNumber">{{scope.row.expressNumber}}</template>
                    <template v-if="!scope.row.expressNumber">---</template>
                </template>
            </el-table-column>

            <el-table-column prop="status" label="订单状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == -2" class="error">交易关闭</span>
                    <span v-if="scope.row.status == -1" class="warning">申请退款中</span>
                    <span v-if="scope.row.status == 0" class="warning">等待用户付款</span>
                    <span v-if="scope.row.status == 1" class="warning">待发货</span>
                    <span v-if="scope.row.status == 2" class="warning">待收货</span>
                    <span v-if="scope.row.status == 3" class="success">已收货，待评价</span>
                    <span v-if="scope.row.status == 4" class="success">交易完成</span>
                </template>
            </el-table-column>

            <el-table-column  label="创建时间" align="center">
                <template slot-scope="scope">
                  <span>{{$moment(scope.row.createTime).format('Y-MM-DD HH:mm')}}</span>
                </template>
            </el-table-column>

            <el-table-column  label="操作" align="left">
                <template slot-scope="scope">
                    <el-button type="primary" @click="doClick(scope.row.id)" size="small" v-if="scope.row.status != 10">详情</el-button>
                    <el-button type="success" @click="doDeliveryShow(scope.row.id)" size="small" v-if="scope.row.status == 1">发货</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
        background
        class="align-center"
        layout="total, prev, pager, next"
        :page-size="requestParam.pageSize"
        :total="total"
        @current-change="getList">
        </el-pagination>

        <el-dialog
            title="发货"
            :visible.sync="deliveryShow"
            width="520px"
            center
            @close="closeDialog">
            <el-form :model="deliveryData" :rules="deliveryRules" ref="deliveryData" label-width="120px">
                <el-form-item label="物流公司名称" prop="expressCompany">
                    <el-input placeholder="请输入物流公司名称" v-model="deliveryData.expressCompany"></el-input>
                </el-form-item>

                <el-form-item label="物流单号" prop="expressNumber">
                    <el-input placeholder="请输入物流单号" v-model="deliveryData.expressNumber"></el-input>
                </el-form-item>

                <el-form-item label="快递编码" prop="expressCompanyCode">
                    <el-input placeholder="请输入快递编码（选填）" v-model="deliveryData.expressCompanyCode"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deliveryShow = false">取 消</el-button>
                <el-button type="primary" @click="doDelivery()">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	  export default {
        data() {
            return {
                list: [],
                // 搜索参数
                requestParam:{
                    usId: '',
                    startTime: '',
                    endTime: '',
                    pageSize: 10,
                },
                // 订单状态
                orderStatus: [
                    {
                        id: '-2',
                        name: '交易关闭'
                    }, 
                    {
                        id: '-1',
                        name: '申请退款中'
                    }, 
                    {
                        id: '0',
                        name: '等待用户付款'
                    }, 
                    {
                        id: '1',
                        name: '待发货'
                    },
                    {
                        id: '2',
                        name: '待收货'
                    },
                    {
                        id: '3',
                        name: '已收货'
                    },
                    {
                        id: '4',
                        name: '交易完成'
                    },
                ],
                // 订单发货
                deliveryData:{
                    expressCompany: '',
                    expressNumber: '',
                    expressCompanyCode: '',
                },
                deliveryRules:{
                    expressCompany: {
                        message: '请输入物流公司名称', required: true, tirgger: 'blur'
                    },
                    expressNumber: {
                        message: '请输入物流单号', required: true, tirgger: 'blur'
                    },
                },
                total: 0,
                load: false,
                date: [],
                dialogVisible: false,
                deliveryShow: false, // 发货弹框
            };
        },

        created(){
            this.getList(1)
        },

	      methods:{
            // 获取列表
            getList(pageNo){
                if(this.date && this.date.length){
                    this.requestParam.startTime = this.$moment(this.date[0]).format('Y-MM-DD HH:mm:ss')
                    this.requestParam.endTime = this.$moment(this.date[1]).format('Y-MM-DD HH:mm:ss')
                }else{
                    this.date = [];
                    this.requestParam.startTime = ''
                    this.requestParam.endTime = ''
                }
                this.load = true
                this.requestParam.pageNo = pageNo
                this.$request.post({
                    url: 'ad/orderInfo/list',
                    params: this.requestParam,
                    success: result=>{
                        this.list = result.list
                        this.total = result.total
                    },
                    finally: ()=>{
                        this.load = false
                    }
                })
            },

            // 跳转到订单详情页面
            doClick(id){
                this.$router.push({
                    path:'/manage/order_details', 
                    query:{
                        id
                    }
                })
            },

            // 发货弹框
            doDeliveryShow(id){ 
                if(!id){
                    this.$message.warning("请选择");
                    return;
                }
                this.deliveryData.id = id;
                this.deliveryShow = true;
            },

            // 发货操作
            doDelivery(){ 
                this.$refs['deliveryData'].validate((valid) => {
                    if (valid) {
                        if(this.loading){
                            return;
                        }
                        this.loading = true;
                        this.$request.post({
                            url: '/ad/orderInfo/delivery',
                            params: this.deliveryData,
                            success: res =>{
                                this.$message.success('订单发货成功');
                                this.getList(1);
                                this.deliveryShow = false;
                            },
                            finally: ()=>{
                                this.loading = false
                            }
                        })
                    }
                })
            },

            // 菜单回调
            closeDialog() {
                // this.son.name='';
                // this.son.imgUrl='';
                // this.$refs.specUpload.clearFiles();
            },
		}
    }
</script>

<style>

</style>

<style scoped>

</style>

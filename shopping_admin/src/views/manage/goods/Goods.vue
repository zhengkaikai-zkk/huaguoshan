<!-- 商品列表 -->
<template>
	    <div id="goods_list">
            <!-- -----------------------------------筛选------------------------------------ -->
            <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
                <el-form-item>
                    <el-input v-model="requestParam.id" placeholder="商品ID" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="requestParam.productTitle" placeholder="商品标题" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="requestParam.status" placeholder="根据商品状态查询" style="width: 100%;" clearable>
                        <el-option v-for="(item, index) in productStatus" :label="item.name" :value="item.id.toString()"></el-option>
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

                <el-form-item>
                    <el-button type="success" icon="el-icon-edit" @click="$router.push('/manage/goods_add')">添加商品</el-button>
                </el-form-item>
            </el-form>

            <!-- -----------------------------------列表------------------------------------ -->
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column 
                prop="id" label="id" align="center">
                </el-table-column>

                <el-table-column prop="productTitle" label="商品标题" align="center"></el-table-column>

                <el-table-column
                align="center"
                prop="cover"
                min-width="200px"
                label="商品封面">
                    <template slot-scope="scope">
                        <el-image style="width: 80px; height: 80px" fit="cover" :src="scope.row.productCover | fullPath" :preview-src-list="[$common.getUrl() + scope.row.productCover]"> -->
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column 
                prop="price" label="价格" align="center">
                </el-table-column>

                <el-table-column 
                prop="stock" label="剩余库存"  
                align="center">
                </el-table-column>

                <el-table-column prop="status" label="库存状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stockStatus == 0" class="error"><b>无货</b></span>
                        <span v-if="scope.row.stockStatus == 1" class="success"><b>库存充足</b></span>
                        <span v-if="scope.row.stockStatus == 3" class="error"><b>库存不足</b></span>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="商品状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" class="error"><b>信息不完整</b></span>
                        <span v-if="scope.row.status == 1" class="warning"><b>待上架</b></span>
                        <span v-if="scope.row.status == 2" class="success"><b>已上架</b></span>
                    </template>
                </el-table-column>

                <el-table-column  label="创建时间" min-width="200px" align="center">
                    <template slot-scope="scope">
                        <span>{{$moment(scope.row.createTime).format('Y-MM-DD HH:mm')}}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="操作" min-width="300px" align="left">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" v-if="scope.row.status == 1" @click="doLock(scope.row.id,1)">上架</el-button>
                        <el-button type="info" size="small" v-if="scope.row.status == 2" @click="doLock(scope.row.id,2)">下架</el-button>
                        <el-button type="warning" size="small" @click="doStockShow(scope.row.id, scope.row.stock, scope.row.lowStock)">补充库存</el-button>
                        <el-button type="primary" size="small" @click="doClick (scope.row.id, scope.row.status)">详情</el-button>
                        <el-button type="danger" size="small" @click="doDel(scope.row.id)" v-if="scope.row.status == 0 || scope.row.status == 1">删除该商品</el-button>
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

            <!-- 补充库存 -->
            <el-dialog
                title="补充库存"
                :visible.sync="stockShow"
                width="60%"
                center
                @close="closeDialog">
                <div class="info_stock">
                    <span><b>当前总库存：</b>{{this.stockNum}}</span>
                    <span><b>预警值：</b>{{this.lowStock}}</span>
                </div>
                <div class="d_sku_one">
                    <div class="sku_specs">
                        <el-table :data="tableData" height="500px" width="100%">
                            <!-- 动态循环渲染表头列 -->
                            <el-table-column align="center" :label="item.groupName" v-for="(item, index) in tableHead">
                                <!-- 动态循环渲染表格列 -->
                                <template slot-scope="scope">
                                    <template v-if="scope.row.name[index] != null">
                                        {{JSON.parse(scope.row.name)[index]}}
                                    </template>
                                    <template v-else>
                                        --
                                    </template>
                                </template>
                            </el-table-column>

                            <!-- 固定写死的列 -->
                            <el-table-column align="center" label="库存">
                                <template slot-scope="scope">
                                    <el-input size="mini" oninput = "value=value.replace(/[^\d]/g,'')" v-if="!scope.row.id" v-model="scope.row.stock" style="width:50%"></el-input>
                                    <template v-else>{{scope.row.stock}}</template>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="价格">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-if="!scope.row.id" v-model="scope.row.price" style="width:50%"></el-input>
                                    <template v-else>{{scope.row.price}}</template>
                                </template>
                            </el-table-column>

                            <el-table-column width="200px" align="center" label="操作" prop="option">
                                <template slot-scope="scope">
                                    <el-button @click="addSku(scope.row)" v-if="!scope.row.id" size="mini" type="primary">提交</el-button>
                                    <el-button @click="doUpdateStock(scope.row)" v-if="scope.row.id" size="mini" type="warning">更新库存</el-button>
                                    <el-button @click="deleteSku(scope.row )" v-if="scope.row.id" size="mini" type="danger">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="closeStockShow()">关 闭</el-button>
                </span>
            </el-dialog>

            <!-- 重置 -->
            <el-dialog
                title="重置库存与单价"
                :visible.sync="editStockShow"
                width="30%"
                center
                @close="closeDialog">
                <div class="d_column">
                    <!-- 新的值 -->
                    <div class="d_s_column_l">
                        <div>
                            <div>新的库存</div>
                            <el-input oninput = "value=value.replace(/[^\d]/g,'')" v-model="skuData.stock" size="small"/>
                        </div>
                        <div>
                            <div>新的单价</div>
                            <el-input v-model="skuData.price" size="small"/>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="info" @click="editStockShow = false">关 闭</el-button>
                    <el-button type="primary" @click="updateStock()">提 交</el-button>
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
            productStatus: [
                {
                    id: '0',
                    name: '信息不完整'
                }, 
                {
                    id: '1',
                    name: '待上架'
                },
                {
                    id: '2',
                    name: '已上架'
                },
                {
                    id: '3',
                    name: '库存不足'
                }
            ],
            // SKU表单参数
            skuData: {
                stock: '',
                oldStock: '',
                price: '',
            },
            id: '',
            total: 0,
            load: false,
            date: [],
            dialogVisible: false,
            stockShow: false,
            stockNum: '',
            lowStock: '',
            // SKU-表头数据
            tableHead:[],
            // SKU-表格数据
            tableData:[],
            // 重置弹框
            editStockShow: false,
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
                url: 'ad/productInfo/list',
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

        // 删除商品
        doDel(id){
            this.$confirm('商品删除后不可恢复，是否继续?', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.post({
                    url: '/ad/productInfo/delete',
                    params: {
                        id
                    },
                    success: res =>{
                        this.$message.success('删除成功');
                        this.getList(1);
                    },
                })
            })
        },
        
        // 上架或者下架
        doLock(id,type){
            if(type==1){
                this.$confirm('确认上架吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.lock(id);
                })
                
            }else{
                this.$prompt('请输入下架原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S+/,
                    inputErrorMessage: '请输入原因',
                    center: true
                }).then(({ value }) => {
                    this.unlock(id, value);
                });
            }
        },

        // 上架
        lock(id){
            this.$request.post({
                url: '/ad/productInfo/doLock',
                params: {
                    id,
                    type: 'lock'
                },
                success: res =>{
                    this.getList(1);
                    this.$message.success('上架成功')
                }
                
            })
        },
        
        // 下架
        unlock(id, reason){
            this.$request.post({
                url: '/ad/productInfo/doLock',
                params: {
                    id,
                    reason,
                    type: 'unLock'
                },
                success: res =>{
                    this.getList(1);
                    this.$message.success('下架成功')
                }
                
            })
        },
        
        // 补充库存弹框
        doStockShow(id, stockNum, lowStockNum){
            if(!id){
                this.$message.warning("请选择");
            }
            this.calcSKU(id, stockNum, lowStockNum);
            this.id = id;
            this.stockShow = true;
        },

        // 笛卡尔乘积运算
        calcSKU(id, stockNum, lowStockNum){
            this.stockNum = stockNum;
            this.lowStock = lowStockNum;
            this.$request.post({
                url: '/ad/productSku/list',
                params: {
                    productId: id,
                },
                success: res =>{
                    if(res.listGroup.length > 0){
                        // 表头
                        this.tableHead = res.listGroup;
                        // 表格
                        this.tableData = res.skuList;
                    }else{
                        this.tableHead = [];
                    }
                },
            })
        },

        // 提交SKU
        addSku(data){
            if(!data.stock || data.stock <= 0 || isNaN(data.stock)){
                this.$message.warning("请输入库存且必需是大于0的数字");
                return;
            }
            if(!data.price || data.price <= 0 || isNaN(data.price)){
                this.$message.warning("请输入金额且必需是大于0的数字");
                return;
            }
            this.$request.post({
                url: '/ad/productSku/add',
                params: {
                    productId: this.id,
                    name: data.name,
                    stock: data.stock,
                    price: data.price,
                },
                success: res =>{
                    this.$message.success('添加成功');
                    var stockNum = this.stockNum;
                    var stock = data.stock;
                    var stocks = parseInt(stockNum)+parseInt(stock);
                    this.calcSKU(this.id,stocks , this.lowStock);
                },
            })
        },

        // 更新SKU
        doUpdateStock(data){
            if(!data.id){
                this.$message.warning("请选择");
                return;
            }
            this.editStockShow = true;
            this.skuData.id = data.id;
            this.skuData.oldStock = data.stock;
        },
        updateStock(){
            if(!this.skuData.stock || this.skuData.stock <= 0){
                this.$message.warning("库存且必须是大于0的数");
                return;
            }
            if(isNaN(this.skuData.price)){
                this.$message.warning("金额必须是大于0的数");
                return;
            }
            this.$request.post({
                url: '/ad/productSku/update',
                params: {
                    id: this.skuData.id,
                    name: this.skuData.name,
                    stock: this.skuData.stock,
                    price: this.skuData.price,
                },
                success: res =>{
                    this.$message.success('更新成功');
                    this.editStockShow = false;
                    var stocks = (parseInt(this.stockNum)-parseInt(this.skuData.oldStock))+parseInt(this.skuData.stock);
                    this.calcSKU(this.id, stocks , this.lowStock);
                    this.skuData = {};
                },
            })
        },
        
        /// 删除SKU
        deleteSku(data){
            var id = data.id;
            if(!id){
                this.$message.warning('请选择'); 
                return;
            }
            this.$confirm('删除后用户端将不再显示，请谨慎操作!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.post({
                    url: '/ad/productSku/delete',
                    params: {
                        id
                    },
                    success: res =>{
                        this.$message.success('删除成功');
                        var stocks = parseInt(this.stockNum)-parseInt(data.stock);
                        this.calcSKU(this.id,stocks , this.lowStock);
                    },
                })
            })
        },

        // 关闭补充库粗弹框
        closeStockShow(){
            this.stockShow = false;
            this.getList(1);
        },

        // 跳转到编辑商品页面
        doClick(id, status){
            this.$router.push({
                path:'/manage/goods_update', 
                query:{
                    id
                }
            })
        },

        // 关闭菜单窗口回调
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

<style lang="scss" scoped>
    .info_stock{
        border-radius: 5px;
        background-color:whitesmoke;
        margin: 10px;
        margin-left: 0px;
        margin-right: 0px;
        padding: 10px;
        text-align: center;
        &>span{
           margin: 50px;
        }
    }
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

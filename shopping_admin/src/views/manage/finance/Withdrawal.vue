<template>
    <div id="userList">
        <!-- -----------------------------------筛选------------------------------------ -->
        <el-form :inline="true" size="medium">
            <el-form-item>
                <el-input placeholder="可根据用户ID搜索" v-model="screenData.usId" />
            </el-form-item>

            <el-form-item>
                <el-select v-model="screenData.status" placeholder="请选择状态" style="width: 100%;" clearable>
                    <el-option v-for="(item, index) in statusList" :label="item.name" :value="item.id.toString()"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>

        <!-- -----------------------------------列表------------------------------------ -->
        <el-table
        :data='list'
        stripe
        v-loading='loading'
        style="width:100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <template v-if="props.row.status == 1">
                        <h3 style="color:#67C23A">提现已成功</h3>
                    </template>
                    <template v-if="props.row.status == -1">
                        <h3>提现被拒绝，原因是：<span style="color:red">{{props.row.refuseReason }}</span></h3>
                    </template>
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            width="100"
            prop="id"
            label="ID">
            </el-table-column>

            <el-table-column
            align="center"
            width="100"
            prop="usId"
            label="用户ID">
            </el-table-column>
            
            <el-table-column
            align="center"
            prop="realName"
            label="持卡人">
                <template slot-scope="scope">
                    {{scope.row.usBankCard.realName}}
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            prop="bankName"
            label="所属银行">
                <template slot-scope="scope">
                    {{scope.row.usBankCard.bankName}}
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            prop="cardNum"
            label="银行卡号">
                <template slot-scope="scope">
                    {{scope.row.usBankCard.cardNum}}
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            width="140"
            label="金额">
                <template slot-scope="scope">
                    ￥{{scope.row.money.toFixed(2)}}
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            width="120"
            label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == -1" class="error">提现不通过</span>
                    <span v-if="scope.row.status == 0" class="warning">等待审核</span>
                    <span v-if="scope.row.status == 1" class="success">提现成功</span>
                </template>
            </el-table-column>

            <el-table-column
                align="center"
                width="110"
                label="申请日期">
                <template slot-scope="scope">
                    <p>{{$common.getDate(scope.row.createTime)}}</p>
                </template>
            </el-table-column>

            <el-table-column align="center" width="160" label="操作">
                <template slot-scope="scope" v-if="scope.row.status==0">
                    <el-button type="danger" size="small" @click="doLock(scope.row.id,2)">拒绝</el-button>
                    <el-button type="success" size="small" @click="doLock(scope.row.id,1)">通过</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页功能 -->
        <el-pagination
        class="align-center"
        background
        @current-change="pageChange"
        :current-page.sync="screenData.pageNo"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="itemTotal">
        </el-pagination>
    </div>
</template>

<script>
export default{
    data(){
        return{
            list: [],
            loading: false,
            screenData: {                //筛选参数
                status: '0',
                usId: '',
                pageNo: 1,
                pageSize: 10
            },
            itemTotal: 0,
            timeArr: [],                //筛选时间
            statusList: [
                {
                    id: '0',
                    name: '等待审核'
                }, 
                {
                    id: '1',
                    name: '提现成功'
                },
                {
                    id: '-1',
                    name: '提现不通过'
                },
            ],
        }
    },

    watch: {

    },
    methods: {
         //--------------获取列表----------------------
        getList(){
            this.loading = true
            this.$request.post({
                url: '/ad/usWithdrawal/list',
                params: this.screenData,
                success: res =>{
                    this.list = res.list
                    this.itemTotal = res.total
                },
                finally: () => {
                    this.loading = false;
                }
            })
        },

        //------------------------------冻结，解冻-------------------------------------------
        doLock(id,type){
            if(type==1){
                this.$confirm('确认通过该提现申请吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.lock(id);
                })
                
            }else{
                 this.$prompt('请输入拒绝理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S+/,
                    inputErrorMessage: '请输入理由',
                    center: true
                }).then(({ value }) => {
                    this.unlock(id, value);
                });
            }
        },
        lock(id){
            this.$request.post({
                url: '/ad/usWithdrawal/pass',
                params: {
                    id,
                    type: 'lock'
                },
                success: res =>{
                    this.getList();
                    this.$message.success('通过提现申请成功')
                }
                
            })
        },
        unlock(id, reason){
            this.$request.post({
                url: '/ad/usWithdrawal/disPass',
                params: {
                    id,
                    reason,
                    type: 'unLock'
                },
                success: res =>{
                    this.getList();
                    this.$message.success('拒绝提现申请成功')
                }
                
            })
        },
         //页面改变
        pageChange(current){
            if(current) {
                this.screenData.pageNo = current
                this.getList()
            }
        },
    },
    created(){
        this.getList()
    }
  }
</script>

<style lang="scss" scoped>

</style>

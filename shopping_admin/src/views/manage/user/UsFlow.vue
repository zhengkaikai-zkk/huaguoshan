<template>
<div id="userFlow">

    <!-- -----------------------------------筛选------------------------------------ -->
    <el-form :inline="true" size="medium">
        <el-form-item>
            <el-input placeholder="请输入用户ID" v-model="screenData.usId" clearable/>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入流水单号" v-model="screenData.flowNo" clearable/>
        </el-form-item>
        <el-form-item>
            <el-date-picker
                v-model="timeArr"
                @change="timeChange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
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

        <el-table-column
            align="center"
            prop="flowNo"
            width="200"
            label="流水单号">
        </el-table-column>

        <el-table-column
            align="center"
            prop="usId"
            min-width="100"
            label="用户ID">
        </el-table-column>
        
        <el-table-column
            align="center"
            prop="remark"
            min-width="200"
            label="交易说明">
        </el-table-column>

        <el-table-column
            align="center"
            width="200"
            prop="type"
            label="交易类型">
            <template slot-scope="scope">
                <span v-if="scope.row.type == 1" class="error">余额支出</span>
                <span v-if="scope.row.type == 2" class="gray">微信支出</span>
                <span v-if="scope.row.type == 3" class="gray">支付宝支出</span>
                <span v-if="scope.row.type == 4" class="error">提现支出</span>
                <span v-if="scope.row.type == 5" class="error">推广收入</span>
                <span v-if="scope.row.type == 6" class="error">退款收入</span>
                <span v-if="scope.row.type == 7" class="error">提现失败收入</span>
                <span v-if="scope.row.type == 8" class="error">其他</span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="100"
            prop="money"
            label="交易金额">
        </el-table-column>

        <el-table-column
            align="center"
            width="200"
            label="交易日期">
            <template slot-scope="scope">
                <p>{{$common.getDate(scope.row.createTime)}}</p>
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
                startTime: '',
                endTime: '',
                usId: '',
                flowNo: '',
                pageNo: 1,
                pageSize: 10
            },
            itemTotal: 0,
            timeArr: [],                //筛选时间
        }
    },

    watch: {

    },
    methods: {
         //--------------获取列表----------------------
        getList(){
            this.loading = true
            this.$request.post({
                url: '/ad/usFlow/list',
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

        //页面改变
        pageChange(current){
            if(current) {
                this.screenData.pageNo = current
                this.getList()
            }
        },

        //-------日期改变-----------
        timeChange(val) {
            if (val) {
                this.screenData.startTime = this.$common.getDate(val[0]);
                this.screenData.endTime = this.$common.getDate(val[1]);
            } else {
                this.screenData.startTime = '';
                this.screenData.endTime = '';
            }
        },
    },

    created(){
        this.getList()
    }
  }
</script>

<style lang="scss" scoped>
#userList{}
</style>

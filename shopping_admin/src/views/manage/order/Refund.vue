<!-- 退款订单 -->
<template>
    <div>
        <!-- -----------------------------------筛选------------------------------------ -->
        <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
            <el-form-item>
                <el-input v-model="requestParam.id" placeholder="订单编号" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="requestParam.status" placeholder="根据退款状态查询" style="width: 100%;" clearable>
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
        </el-form>
        <!-- -----------------------------------列表------------------------------------ -->
        <el-table :data="list" stripe style="width: 100%" v-loading="load">
            <el-table-column prop="id" label="ID" align="center"></el-table-column>

            <el-table-column prop="orderInfo.orderNo" label="订单编号" align="center"></el-table-column>

            <el-table-column prop="orderInfo.payPrice" width="100px" label="已付金额" align="center"></el-table-column>

            <el-table-column prop="usInfo.id" width="100px" label="用户ID" align="center"></el-table-column>

            <el-table-column prop="usInfo.nick" label="买家昵称" align="center"></el-table-column>

            <el-table-column prop="usInfo.phone" label="买家联系方式" align="center"></el-table-column>

            <el-table-column prop="status" label="退款进度" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == -1" class="error"><b>退款已取消</b></span>
                    <span v-if="scope.row.status == 1" class="warning"><b>申请退款中</b></span>
                    <span v-if="scope.row.status == 2" class="success"><b>退款成功</b></span>
                    <span v-if="scope.row.status == 3" class="error"><b>退款失败</b></span>
                </template>
            </el-table-column>

            <el-table-column  label="创建时间" align="center">
                <template slot-scope="scope">
                    <span>{{$moment(scope.row.createTime).format('Y-MM-DD HH:mm')}}</span>
                </template>
            </el-table-column>

            <el-table-column  label="操作" align="left">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="doDeal(scope.row.id, 1)" v-if="scope.row.status == 1">同意</el-button>
                    <el-button type="danger" size="small" @click="doDeal(scope.row.id, 2)" v-if="scope.row.status == 1">拒绝</el-button>
                    <el-button type="primary" size="small" @click="doClick(scope.row.id)" v-if="scope.row.status != 10">详情</el-button>
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
          @current-change="getList"
        >
        </el-pagination>
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
                // 搜索时下拉框参数
                productStatus: [
                    {
                        id: '1',
                        name: '退款申请中'
                    }, 
                    {
                        id: '2',
                        name: '退款成功'
                    },
                    {
                        id: '3',
                        name: '退款失败'
                    }, 
                    {
                        id: '-1',
                        name: '退款已取消'
                    }, 
                ],
                total: 0,
                load: false,
                date: [],
                dialogVisible: false
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
                    url: 'ad/orderRefund/list',
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
            // 弹框操作
            doDeal(id, type){
              console.log(id, type)
              if(type==1){
                  this.$confirm('确认同意该退款申请吗?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      console.log("aa");
                      this.deal(id);
                  })
              }else{
                  this.$prompt('请输入拒绝理由', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      inputPattern: /\S+/,
                      inputErrorMessage: '请输入拒绝理由',
                      center: true
                  }).then(({ value }) => {
                      console.log("bb");
                      this.disDeal(id, value);
                  });
              }
            },
            // 同意
            deal(id){
                this.$request.post({
                    url: '/ad/orderRefund/deal',
                    params: {
                        id,
                        type: 'lock'
                    },
                    success: res =>{
                        this.getList(1);
                        this.$message.success('操作成功')
                    }
                })
            },
            // 拒绝
            disDeal(id, reason){
                this.$request.post({
                    url: '/ad/orderRefund/deal',
                    params: {
                        id,
                        reason,
                        type: 'unLock'
                    },
                    success: res =>{
                        this.getList(1);
                        this.$message.success('操作成功')
                    }
                })
            },
            // 跳转到退款订单详情页面
            doClick(id){
                this.$router.push({
                    path:'/manage/refund_details', 
                    query:{
                        id
                    }
                })
            }
		    }
	  }
</script>

<style>

</style>

<style scoped>

</style>

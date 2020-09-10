<template>
<div id="userInvite">

    <!-- -----------------------------------筛选------------------------------------ -->
    <el-form :inline="true" size="medium">
        <el-form-item>
            <el-input placeholder="请输入邀请人ID" v-model="screenData.parentId" clearable/>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入被邀请人ID" v-model="screenData.childrenId" clearable/>
        </el-form-item>
        <el-form-item>
            <el-date-picker
                v-model="timeArr"
                @change="timeChange"
                type="daterange"
                clearable
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
            prop="id"
            label="ID">
        </el-table-column>

        <el-table-column
            align="center"
            prop="parentId"
            label="邀请人ID">
        </el-table-column>
        
        <el-table-column
            align="center"
            prop="usInfo.id"
            label="被邀请人ID">
        </el-table-column>

        <el-table-column
            align="center"
            prop="usInfo.nick"
            label="被邀请人昵称">
        </el-table-column>


        <el-table-column
            align="center"
            prop="avatar"
            min-width="100"
            label="被邀请人头像">
            <template slot-scope="scope">
                <el-image style="width: 80px; height: 80px" fit="cover" :src="scope.row.usInfo.avatar | fullPath" :preview-src-list="[$common.getUrl() + scope.row.usInfo.avatar]"> -->
                </el-image>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            prop="status"
            label="当前状态">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 1" class="success">成功</span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            prop="money"
            label="推广所得金额">
        </el-table-column>

        <el-table-column
            align="center"
            label="邀请日期">
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
                parentId: '',
                childrenId: '',
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
                url: '/ad/usInvite/list',
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

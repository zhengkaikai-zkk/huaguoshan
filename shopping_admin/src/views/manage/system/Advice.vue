<template>
<div id="feedback">
    <!-- -----------------------------------筛选------------------------------------ -->
    <el-form :model="screenData" :inline="true" size="medium">
        <el-form-item>
            <el-input placeholder="请输入反馈人ID" v-model="screenData.usId" clearable/>
        </el-form-item>
        <el-form-item>
            <el-select v-model="screenData.isReply" placeholder="请选择回复状态" style="width: 100%;" clearable>
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
        <el-table-column
            align="center"
            width="120"
            prop="id"
            label="ID">
        </el-table-column>

        <el-table-column
            align="center"
            width="120"
            prop="usId"
            label="反馈人ID">
        </el-table-column>

        <el-table-column
            align="center"
            prop="content"
            label="建议">
        </el-table-column>

        <el-table-column
            align="reply_content"
            label="回复内容">
            <template slot-scope="scope">
                {{scope.row.replyContent? scope.row.replyContent: '--'}}
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="120"
            label="当前状态">
            <template slot-scope="scope">
                <span v-if="scope.row.isReply == 0" class="warning">等待回复</span>
                <span v-if="scope.row.isReply == 1" class="gray">已回复</span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="160"
            label="反馈日期">
            <template slot-scope="scope">
                <p>{{$common.getDate(scope.row.createTime)}}</p>
            </template>
        </el-table-column>

        <el-table-column align="center" width="250" label="操作">
            <template slot-scope="scope">
                <el-button v-if="scope.row.isReply == 0" type="success" size="small" @click="shoWReply=true,formData.id=scope.row.id">回复</el-button>
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

    <!-- 弹框-回复 -->
    <el-dialog
        title="回复"
        :visible.sync="shoWReply"
        width="600px"
        center
        @close="closeDialog">   
        <el-form :model="formData" :rules="rules" ref="refContent" label-width="94px">
            <el-form-item label="回复内容" prop="content">
                <el-input type="textarea" :rows="4" v-model="formData.content" placeholder="请输入回复内容"></el-input>
            </el-form-item>
        </el-form>    
        <span slot="footer" class="dialog-footer">
            <el-button @click="shoWReply = false">取 消</el-button>
            <el-button type="primary" @click="doReply" :loading="loadBtn">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default{
    data(){
        return{
            list: [],
            loading: false,
            itemTotal: 0,
            shoWReply: false,
            loadBtn: false,
            // 弹框回复
            formData:{
                id:'',
                content: ''
            },
            // 非空验证
            rules: {
                content: {
                    message: '请输入回复内容', required: true, trigger: 'blur'
                },
            },
            // 状态筛选下拉框
            statusList: [
                {
                    id: '0',
                    name: '待回复'
                }, 
                {
                    id: '1',
                    name: '已回复'
                }
            ],
            // 筛选参数
            screenData: {
                usId: '',
                isReply: '',
                pageNo: 1,
                pageSize: 10
            },
        }
    },

    watch: {

    },
    methods: {
        //--------------获取列表----------------------
        getList(){
            this.loading = true;
            this.$request.post({
                url: '/ad/sysAdvice/list',
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

        // 回复
        doReply(){
            this.$refs['refContent'].validate((valid) => {
                if (valid) {
                    if(this.loadBtn){
                        return;
                    }
                    this.loadBtn = true
                    this.$request.post({
                        url: '/ad/sysAdvice/reply',
                        params: this.formData,
                        success: res => {
                            this.$message.success('提交成功');
                            this.content='';
                            this.getList();
                        },
                        finally: () => {
                            this.loadBtn = false;
                            this.shoWReply=false;
                        }
                    })
                }
            });
        },

        //页面改变
        pageChange(current){
            if(current) {
                this.screenData.pageNo = current
                this.getList()
            }
        },

        // 关闭菜单窗口回调
        closeDialog() {
            this.$refs['refContent'].resetFields();
        },
    },
    created(){
        this.getList()
    }
  }
</script>

<style lang="scss" scoped>
#userList{
}
</style>

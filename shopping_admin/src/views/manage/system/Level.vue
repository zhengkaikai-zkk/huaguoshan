<template>
<div id="params">
    <el-table
    :data='levelList'
    stripe
    v-loading='loading'
    style="width:100%">
        <el-table-column
            align="center"
            prop="name"
            label="会员名称">
        </el-table-column>

        <el-table-column
            align="center"
            prop="exclusiveDiscount"
            label="专属折扣">
        </el-table-column>

        <el-table-column
            align="center"
            prop="inviteCode"
            label="专属邀请码">
        </el-table-column>

        <el-table-column
            align="center"
            prop="remark"
            label="升级说明">
        </el-table-column>

        <el-table-column align="center" width="200" label="操作">
            <template slot-scope="scope">
                <el-button type="success" size="small" @click="editLevel(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 编辑 -->
    <el-dialog
        title="编辑会员信息"
        :visible.sync="levelShow"
        width="500px"
        center
        @close="closeDialog">
        <el-form :model="levelData" label-width="94px" ref="levelData">
            <el-form-item label="会员名称">
                <el-input v-model="levelData.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="专属折扣">
                <el-input v-model="levelData.exclusiveDiscount" clearable></el-input>
            </el-form-item>
            <el-form-item label="专属邀请码">
                <el-input v-model="levelData.inviteCode" clearable></el-input>
            </el-form-item>
            <el-form-item label="升级说明">
                <el-input v-model="levelData.remark" clearable></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="levelShow = false">取 消</el-button>
            <el-button type="primary" @click="submitEdit()">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import imgUtil from '@/utils/imgUtils.js'

export default{
    data(){
        return{
            levelList: [],
            loading: false,
            levelShow: false,
            levelData: {
                id: '',
                name: '',
                inviteCode: '',
                exclusiveDiscount: '',
                remark: '',
            },
        }
    },

    watch: {

    },
    methods: {
        // 列表
        getList(){
            this.loading = true
            this.$request.post({
                url: '/ad/usLevel/list',
                success: res =>{
                    this.levelList = res;
                },
                finally: () => {
                    this.loading = false;
                }
            })
        },

        // 打开编辑的弹框
        editLevel(data){
            if(!data){
                this.$message.warning('请选择');
            }
            this.levelShow = true;
            this.levelData.id = data.id;
            this.levelData.name = data.name;
            this.levelData.exclusiveDiscount = data.exclusiveDiscount;
            this.levelData.inviteCode = data.inviteCode;
            this.levelData.remark = data.remark;
        },

        //编辑
        submitEdit(){
            if(isNaN(this.levelData.exclusiveDiscount) || this.levelData.exclusiveDiscount <= 0){
                this.$message.warning("专属折扣只能为大于0的数字");
                return;
            }
            if(!this.levelData.inviteCode){
                this.$message.warning("请设置专属邀请码");
                return;
            }
            if(!this.levelData.remark){
                this.$$message.warning("请填写升级说明");
                return;
            }
            this.$refs['levelData'].validate((valid) => {
                    if (valid) {
                        if(this.loading){
                            return;
                        }
                        this.loading = true;
                        this.$request.post({
                            url: '/ad/usLevel/update',
                            params: this.levelData,
                            success: res =>{
                                this.$message.success('编辑成功');
                                this.getList();
                                this.levelShow = false;
                            },
                            finally: ()=>{
                                this.loading = false
                            }
                        })
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
        // 关闭菜单窗口回调
        closeDialog() {
            // 重置表单验证
            this.$refs['levelData'].resetFields();
        },
    },
    created(){
        this.getList()
    }
  }
</script>

<style lang="scss" scoped>
#params{
    .up_img{
        width: 148px;
        height: 148px;
        border-radius: 6px;
        overflow: hidden;
        color: #606266;
        margin-right: 10px;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        i{
            color: #333;
            font-size: 24px;
            position: absolute;
            top: 0;
            right: 0;
        }
    }
}
</style>

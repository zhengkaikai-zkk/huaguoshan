<template>
<div id="userList">

    <!-- -----------------------------------筛选------------------------------------ -->
    <el-form :inline="true" size="medium">
        <el-form-item>
            <el-input placeholder="请输入ID" v-model="screenData.usId"/>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入呢称" v-model="screenData.nick" clearable/>
        </el-form-item>
        <el-form-item>
            <el-select v-model="screenData.status" placeholder="请选择账号状态" style="width: 100%;" clearable>
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
            prop="id"
            width="90"
            label="ID">
        </el-table-column>
        
        <el-table-column
            align="center"
            prop="avatar"
            min-width="100"
            label="头像">
            <template slot-scope="scope">
                <el-image style="width: 80px; height: 80px" fit="cover" :src="scope.row.avatar | fullPath" :preview-src-list="[$common.getUrl() + scope.row.avatar]"> -->
                </el-image>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            prop="nick"
            label="昵称">
        </el-table-column>

        <el-table-column
            align="center"
            width="120"
            prop="phone"
            label="联系方式">
        </el-table-column>
        
        <el-table-column
            align="center"
            prop="inviteCode"
            label="专属推广码">
        </el-table-column>

        <el-table-column
            align="center"
            prop="inviteCode"
            label="会员等级">
            <template slot-scope="scope">
                <span v-if="scope.row.level == 1" class="error">黄金会员</span>
                <span v-if="scope.row.level == 2" class="error">白金会员</span>
                <span v-if="scope.row.level == 3" class="error">钻石会员</span>
                <span v-if="scope.row.level == 4" class="error">超级VIP</span>
                <span v-if="scope.row.level == 5" class="error">非会员</span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="100"
            label="注册类型">
            <template slot-scope="scope">
                <span v-if="scope.row.registerType == 1">受邀请用户</span>
                <span v-if="scope.row.registerType == 0">普通注册</span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="100"
            prop="parentId"
            label="邀请人ID">
            <template slot-scope="scope">
                {{scope.row.parentId==-1? '--': scope.row.parentId}}
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="120"
            label="账号状态">
            <template slot-scope="scope">
                <span class="success" v-if="scope.row.status == 1">正常</span>
                <span class="error" v-if="scope.row.status == -1">已冻结</span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="110"
            label="注册日期">
            <template slot-scope="scope">
                <p>{{$common.getDate(scope.row.createTime)}}</p>
            </template>
        </el-table-column>
        
        <el-table-column align="left" width="220" label="操作">
            <template slot-scope="scope">
                <el-button type="primary" size="small" @click="doLevelShow(scope.row)">设置会员等级</el-button>
                <el-button type="danger" size="small" v-if="scope.row.status == 1" @click="doLock(scope.row.id,2)">冻结</el-button>
                <el-button type="success" size="small" v-if="scope.row.status == -1" @click="doLock(scope.row.id,1)">解冻</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 设置会员等级 -->
    <el-dialog
        title="设置会员等级"
        :visible.sync="levelShow"
        width="600px"
        center
        @close="closeDialog">
        <div class="d_column" style="text-algin:center">
            <div class="d_s_column_l">
                <div>
                    <div>当前会员等级：<span class="error">{{this.oldLevel}}</span></div>
                </div>
                <div>
                    <div>
                        选择会员等级：
                        <el-select v-model="levelStatus" placeholder="请选择会员等级" clearable>
                            <el-option label="非会员" :value="5"></el-option>
                            <el-option v-for="(item, index) in levelList" :label="item.name" :value="item.id.toString()"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="levelShow = false; levelStatus = ''">取 消</el-button>
            <el-button type="primary" @click="setLevel()">确 定</el-button>
        </span>
    </el-dialog>

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
            levelList: [],
            levelStatus: '',
            levelId: '',
            levelShow: false,
            oldLevel: '',
            loading: false,
            screenData: {                //筛选参数
                usId: '',
                nick: '',
                status: '',
                pageNo: 1,
                pageSize: 10
            },
            itemTotal: 0,
            statusList: [
                {
                    id: '-1',
                    name: '冻结'
                }, 
                {
                    id: '1',
                    name: '正常'
                }
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
                url: '/ad/usInfo/list',
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

        // 会员等级
        getLevelList(){
            this.loading = true
            this.$request.post({
                url: '/ad/usLevel/list',
                params: this.screenData,
                success: res =>{
                    this.levelList = res;
                    this.itemTotal = res.total
                },
                finally: () => {
                    this.loading = false;
                }
            })
        },

        // 设置会员等级弹框
        doLevelShow(data){
            this.levelShow = true;
            this.levelId = data.id;
            switch(data.level){
                case 1:
                    this.oldLevel = '黄金会员';
                    break;
                case 2:
                    this.oldLevel = '白金会员';
                    break;
                case 3:
                    this.oldLevel = '钻石会员';
                    break;
                case 4:
                    this.oldLevel = '超级VIP';
                    break;
                default:
                    this.oldLevel = '非会员';
            }
        },

        // 设置会员等级
        setLevel(){
            if(!this.levelStatus){
                this.$message.warning("会员等级不可为空");
                return;
            }
            this.$request.post({
                url: '/ad/usInfo/setLevel',
                params: {
                    id: this.levelId,
                    level: this.levelStatus,
                },
                success: res =>{
                    this.$message.success("设置成功");
                    this.levelShow = false;
                    this.getList();
                    this.levelStatus = '';
                },
                finally: () => {
                    this.loading = false;
                }
            })
        },

        //------------------------------冻结，解冻-------------------------------------------
        doLock(usId,type){
            if(type==1){
                this.$confirm('确认解冻该用户吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.unlock(usId);
                })
                
            }else{
                this.$prompt('请输入冻结原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S+/,
                    inputErrorMessage: '请输入原因',
                    center: true
                }).then(({ value }) => {
                    this.lock(usId, value);
                });
            }
        },
        lock(usId, reason){
            this.$request.post({
                url: '/ad/usInfo/update',
                params: {
                    usId,
                    reason,
                    type: 'lock'
                },
                success: res =>{
                    this.getList();
                    this.$message.success('冻结成功')
                }
            })
        },
        unlock(usId){
            this.$request.post({
                url: '/ad/usInfo/update',
                params: {
                    usId,
                    type: 'unLock'
                },
                success: res =>{
                    this.getList();
                    this.$message.success('解冻成功')
                }
                
            })
        },

        //页面改变
        pageChange(current){
            if(current) {
                this.screenData.pageNo = current
                this.getList();
                this.getLevelList();
            }
        },

        // 菜单回调
        closeDialog() {
            // this.son.name='';
            // this.son.imgUrl='';
            // this.$refs.specUpload.clearFiles();
        },
    },
    created(){
        this.getList();
        this.getLevelList();
    }
  }
</script>

<style lang="scss" scoped>
#userList{}
    .d_column{
        border: 1px solid #eee;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        .d_s_column_l{
            text-align: left;
            padding-bottom: 10px;
            &>div{
                padding: 20px;
            }
        }
    }
</style>

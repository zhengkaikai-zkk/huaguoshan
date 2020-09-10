<template>
	<div id="authority_account">
    <!-- 筛选 -->
    <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
      <el-form-item>
        <el-select v-model="requestParam.status" placeholder="状态" @change="getList(1)">
          <el-option value="" label="全部"></el-option>
          <el-option value="1" label="正常"></el-option>
          <el-option value="2" label="已冻结"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="openAddForm" type="success">添加账号</el-button>
      </el-form-item>
    </el-form>
		<!-- 表格 -->
		<el-table :data="list" stripe style="width: 100%" v-loading="load">
		  <el-table-column prop="id" label="id" align="center"></el-table-column>
		  <el-table-column prop="account" label="账号" width="120" align="center"></el-table-column>
		  <el-table-column prop="roleName" label="账号"  align="center"></el-table-column>
		  <el-table-column prop="remark" label="备注"  align="center"></el-table-column>
      <el-table-column prop="status" label="状态"  align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">正常</span>
          <span v-if="scope.row.status == -1" class="error">冻结</span>
        </template>
      </el-table-column>
      <el-table-column  label="最近登录时间" align="center">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.loginTime).format('Y-MM-DD HH:mm')}}</span>
        </template>
      </el-table-column>
		  <el-table-column  label="创建时间" align="center">
		    <template slot-scope="scope">
		      <span>{{$moment(scope.row.createTime).format('Y-MM-DD HH:mm')}}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="操作" align="center" width="310" class-name="operation">
		    <template slot-scope="scope">
		      <div v-if="scope.row.id != 1">
            <el-button type="primary" size="small" @click="setupdateForm(scope.row)">修改</el-button>
            <el-button type="warning" size="small" @click="freeze(scope.row.id)" v-if="scope.row.status == 1">冻结</el-button>
            <el-button  size="small" @click="thaw(scope.row.id)" v-if="scope.row.status == -1">解冻</el-button>
            <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
          </div>
		    </template>
		  </el-table-column>
		</el-table>

    <el-pagination
      background
      layout="total, prev, pager, next"
      :page-size="requestParam.pageSize"
      :total="total"
      @current-change="getList"
    >
    </el-pagination>

    <!-- 添加账号弹框 -->
    <el-dialog
      center
      title="添加账号"
      :visible.sync="addVisible"
      :close-on-click-modal="false"
      width="420px"
      >
      <el-form ref="form" :model="addForm" label-width="80px" :rules="rules" label-position="left">
        <el-form-item label="角色" prop="roleId" >
          <el-select v-model="addForm.roleId" v-infinite-scroll="getRoleList" placeholder="请选择角色">
            <el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="addForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input v-model="addForm.rePassword" type="password"  placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" placeholder="可在此处填写备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改账号弹框 -->
    <el-dialog
      center
      title="修改账号"
      :visible.sync="updateVisible"
      :close-on-click-modal="false"
      width="500px"
      >
      <el-form ref="form" :model="updateForm" label-width="100px" :rules="rules">
        <el-form-item label="角色" prop="roleId" >
          <el-select v-model="updateForm.roleId" v-infinite-scroll="getRoleList" placeholder="请选择角色">
            <el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="updateForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="修改密码?" prop="account">
          <el-radio v-model="isUpdPwd" label="1">不修改</el-radio>
          <el-radio v-model="isUpdPwd" label="2">修改</el-radio>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-show="isUpdPwd == 2">
          <el-input v-model="updateForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword" v-show="isUpdPwd == 2">
          <el-input v-model="updateForm.rePassword" type="password"  placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="updateForm.remark" placeholder="可在此处填写备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
        load: false,
        requestParam: {
          pageSize: 10,
          pageNo: 1,
          status: ''
        },
        total: 0,
        roleParam: {
          pageNo: 0,
          pageSize: 10
        },
        roleTotal: 0,
        roleList: [],
        addVisible: false,
        updateVisible: false,
        // 是否修改密码
        isUpdPwd: '1',
        // 账号表单信息
        updateForm: {
          id: -1,
          roleId: '',
          account: '',
          password: '',
          rePassword: '',
          remark: ''
        },
        addForm: {
          id: -1,
          roleId: '',
          account: '',
          password: '',
          rePassword: '',
          remark: ''
        },
        rules: {
          roleId: {
            message: '请选择角色', required: true
          },
          account: {
            message: '请输入账号', required: true, trigger: 'blur'
          },
          password: {
            required: true, trigger: 'blur', validator: (rule, value, callback)=>{
              if ((this.updateVisible && this.isUpdPwd == '2' && !value) || (this.addVisible && !value)) {
                callback(new Error('请输入密码'));
              } else if ((this.updateVisible && this.isUpdPwd == '2' && value && (value.length < 6 || value.length > 20)) ||
                          this.addVisible && value && (value.length < 6 || value.length > 20) ) {
                callback(new Error('密码长度必须是6-20位'));
              } else {
                callback();
              }
            }
          },
          rePassword: {
            required: true, trigger: 'blur', validator: (rule, value, callback)=>{
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (this.addVisible && value !== this.addForm.password){
                callback(new Error('两次输入密码不一致!'));
              }else if (this.updateVisible && value !== this.updateForm.password) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            }
          },
        }
			};
		},

    mounted() {
      this.getList(1)
      this.getRoleList();
    },

		methods:{
      // 获取账号列表
      getList(pageNo){
        this.load = true
        this.requestParam.pageNo = pageNo
        this.$request.post({
          url: 'ad/info/list',
          params: this.requestParam,
          success: result =>{
            this.list = result.list
            this.total = result.total
          },
          finally: ()=>{
            this.load = false
          }
        })
      },

      // 获取角色列表
      getRoleList(){
        console.log((this.roleParam.pageNo * this.roleParam.pageSize >= this.roleTotal) && this.roleTotal > 0)
        if((this.roleParam.pageNo * this.roleParam.pageSize >= this.roleTotal) && this.roleTotal > 0){
          return;
        }
        this.roleParam.pageNo ++
        this.$request.post({
          url: 'ad/role/list',
          params: this.roleParam,
          success: result =>{
            this.roleList = result.list
            this.roleTotal = result.total
          },
          finally: ()=>{
            this.load = false
          }
        })
      },

      // 添加
      add(){
        if(this.load){
          return;
        }
        this.$refs['form'].validate((valid) => {
          if(valid){
            this.load = true;
            this.addVisible = false
            this.$request.post({
              url: 'ad/info/add',
              params: this.addForm,
              success: result=>{
                this.$message.success('添加成功')
                this.getList(1)
              },
              finally: ()=>{
                this.load = false
              }
            })
          }
        })
      },

      // 打开添加窗口
      openAddForm(){
        this.reset()
        this.addVisible = true
      },

      // 重置表单信息
      reset(){
        this.updateForm.roleId = ''
        this.updateForm.id = ''
        this.updateForm.account = ''
        this.updateForm.password = ''
        this.updateForm.rePassword = ''
        this.updateForm.remark = ''
        var setint = setInterval(()=>{
          if(this.$refs.form){
            this.$refs.form.resetFields()
            this.$refs.form.clearValidate()
            clearInterval(setint)
          }
        }, 100)
      },

      // 设置角色表单信息
      setupdateForm(data){
        this.updateForm = {
          id: data.id,
          roleId: data.roleId,
          account: data.account,
          remark: data.remark
        }
        this.updateVisible = true
      },

      // 修改
      update(){
        this.$refs['form'].validate((valid) => {
          if(!valid){
            return;
          }
          if(this.load){
            return;
          }
          this.updateVisible = false
          this.load = true
          this.$request.post({
            url: 'ad/info/update',
            params: this.updateForm,
            success: result=>{
              this.$message.success('修改成功')
              this.reset();
              this.getList(this.requestParam.pageNo)
            },
            finally: ()=>{
              this.load = false
            }
          })
        })
      },

      // 删除
      del(id){
        if(this.load){
          return;
        }
        this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.load = true
          this.$request.post({
            url: 'ad/info/delete',
            params: {
              id
            },
            success: result=>{
              this.$message.success('删除成功')
              this.getList(this.requestParam.pageNo)
            },
            finally: ()=>{
              this.load = false
            }
          })
        })
      },

      // 冻结
      freeze(id){
        if(this.load){
          return;
        }
        this.$confirm('是否冻结该账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.load = true
          this.$request.post({
            url: 'ad/info/freezeOrThaw',
            params: {
              id,
              status: -1
            },
            success: result=>{
              this.$message.success('冻结成功')
              this.getList(this.requestParam.pageNo)
            },
            finally: ()=>{
              this.load = false
            }
          })
        })
      },

      // 解冻
      thaw(id){
        if(this.load){
          return;
        }
        this.$confirm('是否解冻该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.load = true
          this.$request.post({
            url: 'ad/info/freezeOrThaw',
            params: {
              id,
              status: 1
            },
            success: result=>{
              this.$message.success('解冻成功')
              this.getList(this.requestParam.pageNo)
            },
            finally: ()=>{
              this.load = false
            }
          })
        })
      }


		}

	}
</script>

<style>

</style>

<style scoped>

</style>

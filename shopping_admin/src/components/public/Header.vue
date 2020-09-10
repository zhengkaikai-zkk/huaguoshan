<!--
	时间：2018-08-28
	描述：网页头部
-->
<template>
	<div id="header">
		<el-header>
			<el-container class="inner-header">
				<el-row class="header-logo">
					<el-col :span="11" class="logo"><img :src="logo" style="max-width: 100px;" /></el-col>
					<el-col :span="13" class="title">后台管理中心</el-col>
				</el-row>
				<el-row>
					<el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
						<el-menu-item index="">
							<el-dropdown trigger="click" @command="handleCommand">
								<span class="el-dropdown-link">
				        		{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
				      		</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="udpate">修改密码</el-dropdown-item>
									<el-dropdown-item command="quit">退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</el-menu-item>
					</el-menu>
				</el-row>
			</el-container>
		</el-header>
		<el-dialog title="修改密码" :visible.sync="showForm" width="450px" center :append-to-body="true" :modal="true" :close-on-click-modal="false" custom-class="updatePwd">
			<el-form v-loading='upLoading' :model="admin" status-icon :rules="rules" ref="updatePwd" label-width="100px">
				<el-form-item label="原密码" prop="oldPassword">
					<el-input type="password" placeholder="请输入原密码" v-model="admin.oldPassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPassword">
					<el-input type="password" placeholder="请输入密码" v-model="admin.newPassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="verifyCode">
					<el-input placeholder="请输入验证码" v-model="admin.verifyCode">
						<template slot="append">
              <ImgCode :sign.sync="admin.verifySign" ref="imgCode"/>
            </template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm">取 消</el-button>
				<el-button type="primary" @click="update">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import ImgCode from '@/components/utils/ImgCode'

	export default {
    components: {
      ImgCode
    },

		data() {
			return {
				logo: require('@/assets/img/logo.png'),
				activeIndex: '1',
				defaultIndex: '/',
				username: '',
				showForm: false,
				admin: {
					oldPassword: '',
					newPassword: '',
					verifyCode: '',
					verifySign: ''
				},
				rules: {
					oldPassword: [{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					}],
					newPassword: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					}],
					verifyCode: [
            {
            	required: true,
            	message: '请输入验证码',
            	trigger: 'blur'
            },
            {
              message: '请输入四位数的验证码',
              min: 4,
              max: 4,
              trigger: 'blur'
            }
          ]
				},
				verifyCode: {
					codeUrl: '',
					sign: '',
					code: '',
				},
				upLoading: false,
			}
		},

		created() {
			this.activeIndex = this.$route.fullPath
		},

		mounted() {
			this.username = localStorage.getItem('userName');
		},

		methods: {
			handleSelect(index) {
				this.defaultIndex = index
			},
			handleCommand(command) {
				if(command == 'quit') {
					this.quit();
				} else if(command == 'udpate') {
					this.showForm = true;
				}
			},
			// 退出登录
			quit() {
				this.$confirm('此操作将会退出登录, 是否退出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					center: true
				}).then(() => {
					this.$router.push('/login')
				})
			},
			// 修改密码
			update() {
        if(this.upLoading) return;
				this.$refs['updatePwd'].validate((valid) => {
					if(valid) {
						this.upLoading = true;
						this.$request.post({
							url: 'ad/info/updatePassword',
							params: this.admin,
							success: (res) => {
								this.$message.success('修改成功');
								this.$router.replace('/login');
							},
              allError: (e) => {
                this.$refs.imgCode.getImgCode();
              },
							finally: () => {
								this.upLoading = false;
							}
						});
					}
				});
			},
			resetForm() {
				this.showForm = false;
				this.$refs['updatePwd'].resetFields();
			},
		},
	}
</script>

<style>
	#header{
		position: fixed;
		width: 100%;
		top: 0px;
		z-index: 1000;
		box-shadow: 0px 1px 3px #F1F1F1;
	}

	.el-header {
		background: white !important;
		z-index: 9;
	}

	#header .title {
		font-size: 18px !important;
	}

	#header .logo {}

	#header .inner-header {
		width: 100%;
		padding: 0 30px;
		margin: 0px auto;
		display: flex;
		justify-content: space-between;
	}

	#header .header-logo {
		display: flex;
		align-items: center;
		text-align: center;
		width: 300px;
		cursor: pointer;
		-moz-user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;
	}

	#header .header-logo>div:not(:first-child) {
		border-left: 1px solid #DDD;
	}

	#header .phone {
		color: #10CECF;
	}

	#header .el-menu-item.is-disabled {
		opacity: 1 !important;
		cursor: pointer !important;
	}

	#header .el-menu-demo {
		border-bottom: 0px !important;
	}

	#header .el-menu-demo .el-menu-item {
		font-size: 16px;
		border-bottom: 0px solid #E6E6E6;
		border-bottom-color: transparent;
		color: #282828 !important;
		margin-bottom: 0px !important;
	}

	.el-menu--horizontal>.el-menu-item {
		height: 59px !important;
		line-height: 59px !important;
	}

	#header .el-menu-demo .el-menu-item:focus {
		bottom: 0px !important;
	}

	#header .el-menu-demo .phone {
		padding-right: 0px !important;
	}

	#header .el-menu-item.is-active {
		border-bottom: 0px !important;
		color: #10CECF !important;
	}

	#header .el-menu-demo .phone_icon {
		position: relative;
		border-radius: 50%;
	}

	#header .quit {
		line-height: 59px;
		margin-left: 24px;
		font-size: 16px;
		cursor: pointer;
		outline: none;
	}

	.updatePwd .el-input-group__append {
		padding: 0;
	}
	.updatePwd{
		margin-top: 25vh;
		width: 25%;
	}
</style>

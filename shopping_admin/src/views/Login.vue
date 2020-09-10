<template>
	<div class="login">
		<div class="back">

		</div>
		<div class="loginForm">
			<div class="logo" style="text-align: center;">
				<img :src="logo"/>
			</div>
			<el-form :model="params" status-icon :rules="rules" ref="login" label-width="56px">
				<el-form-item label="用户名" prop="phone">
					<el-input type="text" placeholder="请输入账号" @keyup.enter.native="submitForm" v-model="params.phone" autocomplete="on"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" placeholder="请输入密码" @keyup.enter.native="submitForm" v-model="params.password" autocomplete="on"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="code">
					<el-input placeholder="请输入验证码" @keyup.enter.native="submitForm" v-model="params.code">
						<template slot="append">
							<ImgCode :sign.sync="params.verifySign" ref="imgCode"/>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button :loading='loading' type="primary" style='width: 50%;' size='medium' @click="submitForm()">登录</el-button>
					<el-button style='width: 40%;' size='medium' @click="resetForm()">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import ImgCode from '@/components/utils/imgCode'

	export default {
		components:{
			ImgCode
		},

		data() {
			return {
				logo: require('@/assets/img/logo.png'),
				params: {
					phone: '',
					password: '',
					code: '',
					verifySign: '',
				},
				rules: {
					phone: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				},
				verifyCode: {
					codeUrl: '',
					sign: '',
					code: '',
				},
				loading: false,
			}
		},

		mounted(){

		},

		methods: {
			submitForm() {
				this.$refs['login'].validate((valid) => {
					if (valid) {
						this.loading = true;
						this.$request.post({
							url: 'ad/info/public/authority',
							params: {
								account: this.params.phone,
								password: this.params.password,
								verifyCode: this.params.code,
								verifySign: this.params.verifySign
							},
							success: (res) => {
								sessionStorage.setItem('adminToken', res.token);
								localStorage.setItem('userName', this.params.phone)

                // this.$store.dispatch('router/setMenuList', res.menuList)
                sessionStorage.setItem('menuList', res.menuList);
								this.$message.success('登录成功');
								this.$router.push('/manage/welcome')
							},
							allError: (e) => {
                this.$refs.imgCode.getImgCode();
							},
							finally: () => {
								this.loading = false;
							}
						});
					} else {
						return false;
					}
				});
			},

			resetForm() {
				this.$refs['login'].resetFields();
			},


			getMenus() {
				this.loading = true;
				this.$request.post({
					url: 'admin/roleMenu/getMenuUrl',
					success: (res) => {
						sessionStorage.setItem("menuList", res);
						let redirect = decodeURIComponent(this.$route.query.redirect || '/');
						if (redirect.indexOf('/') != -1 || redirect.indexOf('login') != -1) {
							redirect = '/manage/welcome';
						}
						this.$router.replace(redirect);
					},
					finally: () => {
						this.loading = false;
					}
				});
			},
		},

		mounted() {
			sessionStorage.removeItem('adminToken');
			sessionStorage.removeItem("menuList");
			document.oncontextmenu = function() {
				return false;
			}
			document.onselectstart = function() {
				return false;
			}
		},
	}

</script>

<style>
	.login {
		/*background: url('http://d.5857.com/gqzm_160621/005.jpg') no-repeat;*/
		width: 100%;
		height: 100%;
		position: fixed;
	}

	.login .loginForm {
		width: 400px;
		position: fixed;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		margin: auto;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.login .el-form-item__label {
		color: black;
	}

	.login .logo {
		position: relative;
		margin: 20px 0;
	}

  .login .logo img{
    width: 57%;
  }

	.login .el-input-group__append {
		padding: 0;
	}

	.el-form-item.is-required .el-form-item__label:before {
		display: none;
	}

	.el-input-group__append img {
		cursor: pointer;
		position: relative;
	}
</style>

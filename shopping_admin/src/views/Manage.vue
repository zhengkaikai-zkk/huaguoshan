<template>
	<el-container>
		<el-container>
			<Header v-if="isShowHeader" />
			<el-container class="conter">
				<Left />
				<Main />
			</el-container>
			<el-footer v-show="isShowFooter">
				<Footer />
			</el-footer>
		</el-container>
	</el-container>
</template>

<script>
	import Header from '../components/public/Header'
	import Footer from '../components/public/Footer'
	import Left from '../components/public/Left'
	import Main from '../components/public/Main'
	import favicon from '@/assets/img/favicon.png'
	// import ws from '@/utils/websocket'

	export default {
		components: {
			Header,
			Footer,
			Left,
			Main,
		},

		data() {
			return {
				favicon,
				isShowHeader: true,
				isShowFooter: true,
				time: 3600,
				timer: null,
				//	client: Stomp.client(this.$store.state.ws.url)
				socket: null,
				stompClient: null
			}
		},

		mounted() {
			var body = document.querySelector('html');
			body.addEventListener("click", this.clearTime);
			body.addEventListener("keydown", this.clearTime);
			body.addEventListener("mousemove", this.clearTime);
			body.addEventListener("mousewheel", this.clearTime);
			this.countdown();
			// 判断当前浏览器是否支持notification
			if(window.Notification) {
				// 获得权限
				Notification.requestPermission();
			}
			// this.websubscribe();
		},

		methods: {
			clearTime() {
				clearInterval(this.timer);
				this.timer = null;
				this.time = 3600;
				this.countdown();
			},

			countdown() {
				if(this.timer == null) {
					this.timer = setInterval(() => {
						this.time--;
						if(this.time == 0) {
							sessionStorage.removeItem('adminToken');
              sessionStorage.removeItem('menu_list');
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000);
				}
			},

			websubscribe() {
				ws.subscribe(
					{
						destination: '/queue/message/admin',
						result: msg => {
							var message = JSON.parse(msg.body)
							this.$notify.TRNotification({
								title: message.title,
								msg: message.content
							})
							// 判断当前浏览器是否支持notification
							if(window.Notification) {
								// 获得权限
								Notification.requestPermission();
								var notification = new Notification(message.title, {
									body: message.content,
									icon: favicon,
									tag: "1",
									renotify: true,
									requireInteraction: true
								});
								// 点击事件
								notification.onclick = function() {
									//可直接打开通知notification相关联的tab窗口
									window.focus();
								}
							}
							PubSub.publish('getNums')
						}
					},
					{
						destination: '/queue/unlinkCount',
						result: msg=>{
							this.$store.dispatch('all/setUnLinkCount', msg.body)
						}
					}
				)
			}
		},

		beforeDestroy() {

		},
	}
</script>,

<style>
	.el-message-box {
		width: auto;
		min-width: 400px;
	}

	.el-message-box__message p img {
		width: 100%;
		max-height: 100%;
	}

	.bigimg {
		max-height: 85% !important;
		overflow: hidden !important;
	}
	/*------分页器-------*/
	.el-pagination {
		text-align: right;
		margin-top: 30px;
	}

	.el-pagination.is-background .el-pager li:not(.disabled).active {
		background-color: #3a87ad !important;
	}
</style>

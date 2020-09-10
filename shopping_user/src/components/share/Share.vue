<template>
	<div id="share" @click="flag = false" >
		<img :src="share_arrow" alt="" class="share_arrow" height="100px" v-if="flag">
		<img :src="share_icon" width="65%" class="share_icon" v-if="flag">
		<div class="mask" v-if="flag" >
		</div>
	</div>
</template>


<script>
	import wx from 'weixin-js-sdk'

	export default {
		data(){
			return{
				share_icon: require('@/assets/img/share_icon.png'),
				share_arrow: require('@/assets/img/share_arrow.png'),
				flag: false,
			}
		},
		
		methods:{
			tuneUp(url, callback, flag) {
				//--------微信自定义分享链接------------
				const ua = window.navigator.userAgent.toLowerCase()
				// 如果不在微信浏览器内，微信分享也没意义了对吧？这里判断一下
				if (ua.indexOf('micromessenger') < 0 && flag) {
					this.$toast('微信分享只能在微信浏览器内完成')
					return false
				}
				var qs = require('qs')
				var postData = qs.stringify({
					pageUrl: window.location.href
				});
				// if(flag){
				// 	this.$loading.show({text: '生成分享中'});
				// }
				this.$axios.post('/wechat/public/ticket', postData).then((res) => {
					if(res.data.message == 'error' && flag){
						this.$toast.fail('操作失败')
						return;
					}
					var data = res.data.result;
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: data.appid, // 必填，公众号的唯一标识
						timestamp: data.timestamp, // 必填，生成签名的时间戳
						nonceStr: data.noncestr, // 必填，生成签名的随机串
						signature: data.signature, // 必填，签名，见附录1
						jsApiList: [
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'onMenuShareQZone',
							'updateAppMessageShareData',
							'updateTimelineShareData'
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					var shareData = {
						title: '省省建材商城', // 分享标题
						desc: '省省建材商城，为你节省钱包！', // 分享描述
						link: url, // 分享链接
						imgUrl: 'http://www.ssjiancai.com/files/usInfo/default_img.png', // 分享图标
						type: 'link',
						success: () => {
							if(callback) callback();
						},
						cancel: () => {
							this.$toast.fail('已取消分享')
							if(callback) callback();
						}
					}
					wx.ready(() => { //需在用户可能点击分享按钮前就先调用
						console.log('请求成功');
						wx.checkJsApi({
							jsApiList: [
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'onMenuShareQZone',
							'updateAppMessageShareData',
							'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
							success: function(res) {
								// 以键值对的形式返回，可用的api值true，不可用为false
								// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
								var result = res.checkResult;
								if(result['menu:share:QZone']){
									wx.onMenuShareQZone(shareData);
								}
								if(result['menu:share:appmessage']){
									/*分享给朋友*/
									wx.onMenuShareAppMessage(shareData);
								}
								if(result['menu:share:qq']){
									wx.onMenuShareQQ(shareData);
								}
								if(result['menu:share:timeline']){
									/*分享到朋友圈*/
									wx.onMenuShareTimeline(shareData);
								}
								if(result['menu:share:weiboApp']){
									wx.onMenuShareWeibo(shareData);
								}
								if(result['updateAppMessageShareData']){
									wx.updateAppMessageShareData(shareData);
								}
								if(result['updateTimelineShareData']){
									wx.updateTimelineShareData(shareData);
								}
							}
						});
					})
					if(flag){
						this.flag = true;
						// this.$loading.hidden();
					}
				}).catch(e=>{
					console.log(e)
					// this.$loading.hidden();
				})
			}
		}
	}
	
</script>

<style scoped>
	.mask{
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		background: #000000;
		opacity: 0.5;
		z-index: 1000;
	}
	
	.share_icon{
		position: fixed;
		top: 115px;
		left: 0px;
		right: 0px;
		margin: auto;
		z-index: 1001;
		
	}
	.share_arrow{
		position: fixed;
		z-index: 1001;
		top: 15px;
		right: 15px;
	}
	
</style>

<!--
	时间：2018-11-16
	描述：图片放大
-->
<template>
	<div class="bigImg">
		<el-dialog title="查看大图" :visible.sync="open" :before-close="close" center  >
			<div class="big_img_mode flex flex-justify-content-center flex-align-items-center" ref="big_img_mode"  >
				<img :src="src" :style="styleVal" ref="img"/>
				<div class="bigImg_oper" :class="{isHover : 'active'}">
					<span @click="rotate(-90)">
						<i class="el-icon-refresh anti-clock" title="逆时针旋转" ></i>
					</span>
					<span style="transform: rotateY(180deg);">
						<i class="el-icon-refresh clockwise"  title="顺时针旋转" @click="rotate(90)"></i>
					</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: ['src', 'open'],

		data() {
			return {
				isHover: false,
				rotateVal: 0,
				styleVal: '',
				modelStyle: '',
				width: '',
				height: ''
			}
		},

		watch: {
			open(val) {
				if(val) {
					// 弹窗打开后关闭body的滚动条
					document.body.style['overflow-y'] = 'hidden'
				} else {
					document.body.style['overflow-y'] = 'auto'
					setTimeout(()=>{
						this.styleVal = ""
						this.rotateVal = 0
					},200)
				}
			},
		},

		mounted() {

		},

		methods: {
			close() {
				this.$emit('update:open', false); //触发关闭事件，并传入新值
			},
			
			// 图片旋转
			rotate(deg){
				this.rotateVal += deg
				this.styleVal = 'transform: rotate('+this.rotateVal+'deg);'
				var a = this.rotateVal / 90
				var img = this.$refs.img;
				if( a % 4 == 1 || a % 4 == 3){
					this.modelStyle = `width: ${img.offsetHeight}; height:${img.offsetWidth};`
					this.width = img.offsetHeight
				}else{
					this.modelStyle = `width: ${img.offsetWidth}; height:${img.offsetHeight};`
					this.width = img.offsetWidth
				}
				var dom = document.getElementsByClassName("bigImg")[0].getElementsByClassName("el-dialog")[0]
				dom.setAttribute("style", this.modelStyle)
				console.log()
			}
		}
	}
</script>

<style>
	.bigImg .el-dialog--center .el-dialog__body{
		padding:7px !important;
	}
	.bigImg .el-dialog {
		max-width: 100% !important;
		border-radius: 6px !important;
		margin: 15vh auto !important;
	}
</style>

<style>
	.bigImg .el-dialog {}
	
	.bigImg .el-dialog:hover .bigImg_oper{
		opacity: 0.6 !important;
	}
	.bigImg .big_img_mode{
		text-align: center;
	}
	.bigImg .big_img_mode img {
		width: 100%;
		transition: all 0.2s ease-out 0.1s;
	}
	
	.binImg .el-dialog--center .el-dialog__body {
		position: relative;
	}
	
	.bigImg .bigImg_oper {
		position: absolute;
		width: 100%;
		height: 45px;
		bottom: 0px;
		left: 0px;
		background: black;
		opacity: 0;
		transition: all 0.3s ease-out 0.1s;
	}
	
	.bigImg .bigImg_oper.active {
		opacity: 0.6 !important;
	}
	.bigImg_oper i{
		color: white;
		font-size: 30px;
		cursor: pointer;
		margin: 0px 10px;
	}
	.bigImg .bigImg_oper{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bigImg .anti-clock:hover{
		transform: rotate(-360deg);
		transition: all 3s ease-out 0.2s;
	}
	.bigImg .clockwise:hover{
		transform: rotate(-360deg);
		transition: all 3s ease-out 0.2s;
	}
</style>
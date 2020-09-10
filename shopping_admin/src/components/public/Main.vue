<!--
	时间：2018-08-28
	描述：主体部分
-->
<template>
	<el-main>
		<el-scrollbar style="height: 100%; width: 100%;">
			<div class="main-model">
				<Breadcrumb />
				<div class="main_inner" v-loading="$store.state.common.routerLoad" element-loading-text="请稍后">
					<router-view></router-view>
				</div>
			</div>
		</el-scrollbar>
	</el-main>
</template>

<script>
	import Breadcrumb from './Breadcrumb'

	export default {
		components: {
			Breadcrumb
		},

		data() {
			return {
				bread: []
			}
		}
	}
</script>

<style>
	.el-main {
		min-width: 1200px;
		width: 100%;
		padding-top: 60px !important;
		padding-bottom: 0px !important;
		/* position: fixed; */
		/* left: 230px; */
		height: 100%;
		overflow: hidden !important;
		overflow-x: hidden !important;
		margin-left: 210px;
	}
	.el-main .el-scrollbar__bar.is-vertical{
		position: fixed;
		right: 1px;
		width: 8px;
		top: 60px;
	}
	.main_inner {
		background: white;
		width: 100%;
		min-height: 780px;
		top: 0px;
		padding: 20px 20px;
		overflow: auto;
		box-sizing: border-box;
    margin-bottom: 20px;
	}
	.main-model{
		/* padding-right: 18%;
		margin-bottom: 30px; */
	}
	.el-scrollbar__wrap {
		overflow-x: hidden !important;
	}

</style>

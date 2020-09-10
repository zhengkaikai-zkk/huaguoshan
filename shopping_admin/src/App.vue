<template>
	<div id="main" v-loading="loading" customClass="max-loading" element-loading-background="rgba(0, 0, 0, 0.6)">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false
			}
		},

	}
</script>

<style>
	/*---------- 引入公共样式  ----------*/
	@import url("./assets/css/public.css");
	
	.el-footer {
		height: auto !important;
	}
	
	.el-container.conter {
		width: 100%;
		padding: 0px;
		margin: 0px auto;
		height: 100vh;
    	overflow: hidden;
	}
	 
	* {
		margin: 0px;
		padding: 0px;
	}
	
	li {
		list-style: none;
	}
	
	a {
		text-decoration: none;
		color: #4D4D4D;
	}
	
	
	body>.el-container {
		margin: 40px 0px 40px 0px;
	}
	
	input::-webkit-input-placeholder {
		color: #CCCCCC;
	}
	
	.el-pagination {
		text-align: right;
		margin-top: 20px;
	}
	.el-table th{
		background: #F6F6F6;
	}
	.el-select-dropdown__wrap.el-scrollbar__wrap{
		margin-bottom: 0px !important;
	}
	input:focus,textarea{outline:none;}
</style>

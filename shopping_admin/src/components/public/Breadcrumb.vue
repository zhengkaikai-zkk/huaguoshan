<!--
	时间：2018-08-28
	描述：面包屑导航栏
-->
<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
	  	<el-breadcrumb-item  v-for="(data, index) in breadcrumb" :key="index" :to="data.path">{{data.name}}</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
	export default{
		data(){
			return {
				// 自动获取路由标题
				breadcrumb:[{name: this.$route.meta.title}]
			}
		},
		
		mounted(){
			// 如需自定义使用
			PubSub.subscribe('breadcrumb', (msg, val)=>{
				// PubSub.publish('breadcrumb', [{path:'/manage/user', name: '用户列表'}, {path:'/manage/detail', name: '用户详情'}])
				this.breadcrumb = val
			})
		},
		
		watch:{
			newRoute(val){
				this.breadcrumb = [{name: val}]
			}
		},
		
		computed:{
			newRoute(){
				return this.$route.meta.title
			}
		}
		
	}
</script>

<style>
	.el-breadcrumb{
		font-size: 16px !important;
		margin-top: 20px;
		margin-bottom: 5px;
		background: white;
		padding: 20px;
	}
	.el-breadcrumb__item:not(:first-child) span{
		font-size: 14px;
	}
	/*.el-breadcrumb{
		display: flex;
		align-items: center;
		margin-top: 2px;
	}
	.el-breadcrumb:not(:first-child) .el-breadcrumb__inner{
		font-size: 16px !important;
	}
	.el-breadcrumb>span:first-child{
		color: #282828 !important;
		font-size: 18px;
		font-weight: 500;
	} 
	.el-breadcrumb>span:not(:first-child){
		font-size: 16px;	
	} 
	.el-breadcrumb>span:not(:first-child){
		margin-top: 3px;
	}*/
</style>

<!--
	时间：2018-08-28
	描述：侧边导航栏
-->
<template>
  <el-aside width="230px">
    <el-scrollbar style="height: 100%; width: 100%;">
      <el-menu v-loading="loading" class="el-menu-vertical-demo" router :default-openeds="openeds" :default-active="defaultActiveIndex"
        background-color="#F8F8F8">
        <div v-for="(item, index) in menuList" :key="index">
          <el-menu-item class="publish-mode" :index="item.requestUrl" v-if="!item.children">
            <span class="icon-span" v-html="item.menuIcon"></span>
          	<span class="title">{{item.label}}</span>
          </el-menu-item>
          <el-submenu :index='index.toString()' v-if="item.children">
            <template slot="title">
              <span class="icon-span" v-html="item.menuIcon"></span>
              <span slot="title" class="title">{{item.label}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item2.requestUrl" v-for="(item2, index) in item.children" :key="index">
                <div class="item-model">
                  {{item2.label}}
                </div>
              </el-menu-item>
              <div class="item-hr"></div>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>
export default {
  data () {
    return {
      openeds: [],
      defaultActiveIndex: '/',
      menuList: [],
      loading: false
    }
  },

  created () {
    this.defaultActiveIndex = this.$route.fullPath

    var item = JSON.parse(sessionStorage.getItem('menuList'));
    // 获取所有根节点
    var parents = [];
    item.filter(item =>{ return item.parentId == -1 }).forEach(item=>{
      parents.push({
        id: item.id,
        label: item.menuName,
        requestUrl: item.requestUrl,
        menuIcon: item.menuIcon
      })
    })
    // 获取所有子节点
    var childrens = [];
    item.filter(item =>{return item.parentId != -1 && item.flag == 1}).forEach(item =>{
        childrens.push({
          id: item.id,
          label: item.menuName,
          parentId: item.parentId,
          requestUrl: item.requestUrl,
          menuIcon: item.menuIcon
        })
    })

    // 生成菜单树
    this.menuList = this.$common.translator(parents, childrens, current =>{
      // 定义树的数据结构
      return {
        id: current.id,
        label: current.label,
        parentId: current.parentId,
        requestUrl: current.requestUrl,
        menuIcon: current.menuIcon
      }
    });

  },

  watch: {
    newRouterPath (val) {
      this.defaultActiveIndex = val
    }
  },

  computed: {
    newRouterPath () {
      return this.$route.fullPath
    }
  },

  mounted () {
    setTimeout(() => {
      this.openeds.push('0', '1', '2', '3', '4', '5')
    }, 200)

    PubSub.subscribe('getNums', msg => {
      this.getNums()
    })
  },

  methods: {
    handleClose (key, keyPath) {
      this.openeds.push(key)
    },

    setIcon(name, icon){
      var index = this.menuList.findIndex((item, index, objs)=>{
        return item.label == name
      })
      if(this.menuList[index]){
        this.menuList[index].icon = icon
      }
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color: #333333;
  }

  .el-aside {
    background-color: #F8F8F8;
    color: #333;
    text-align: center;
    line-height: 100px;
    overflow-y: hidden;
    position: fixed;
    height: 100%;
    top: 0px;
    padding-top: 60px;
    padding-left: 15px;
    z-index: 999;
  }

  .el-aside .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }

  .el-aside .el-menu-vertical-demo.el-menu {
    border: 0px;
  }

  .el-aside .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-aside .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-aside .el-menu {
    text-align: left;
  }

  .el-aside .el-menu .el-submenu__title {
    border-left: 0px;
  }

  .el-aside .el-menu-item-group .el-menu-item {
    padding-left: 38px !important;
  }

  .el-aside.el-aside .el-menu>.el-menu-item,
  .el-aside .el-submenu__title {
    padding-left: 5px !important;
    font-size: 15px !important;
    line-height: 40px !important;
    height: 40px !important;
  }

  .el-aside .item-model {
    text-align: left;
  }

  .el-aside .el-menu-vertical-demo .el-menu-item {
    font-size: 13px;
  }

  .el-aside .el-submenu .el-menu-item {
    padding-left: 0px;
    height: 33px !important;
    line-height: 33px !important;
  }

  .el-aside .el-menu-item-group .el-menu-item-group__title {
    height: 0px;
    padding: 0px;
  }

  .el-aside .el-badge__content {
    top: 16px !important;
    right: -7px !important;
    padding: 0 5px !important;
    height: 16px !important;
    line-height: 16px !important;
    border: 0px !important;
  }

  .el-aside .el-menu-item.is-active {}

  .el-aside .item-hr {
    height: 1px;
    border-bottom: 1px solid #ddd;
    margin: 5px 45px 5px 37px;
  }

  .el-aside .el-submenu__title img {
    margin-right: 7px;
  }

  .el-aside .el-submenu__title:hover {
    background: rgb(0, 0, 0, 0) !important;
  }

  .el-aside .el-menu-vertical-demo.el-menu {
    padding: 28px 0px;
    padding-right: 13px;
  }

 .el-aside .el-submenu__title i:first-child{
    position: relative;
    bottom: 1px;
  }
  .el-aside .el-scrollbar__thumb{
    background-color: rgba(210, 210, 210, 0.3) !important;
  }
  .publish-mode{
    padding-left: 5px !important;
    font-size: 15px !important;
    line-height: 40px !important;
    height: 40px !important;
  }
  .el-aside .title{
    margin-left: 35px;
  }
  .icon-span{
    position: absolute;
    bottom: 2px;
  }
  .icon-span img{
    height: 18px;
    margin: 0 2px;
    position: relative;
    left: 1px;
  }
</style>

<template>
<div id="feedback">
    <!-- -----------------------------------筛选------------------------------------ -->
    <el-form :inline="true" size="medium">
        <el-form-item>
            <el-select v-model="screenData.type" placeholder="请选择类型" style="width: 100%;" clearable>
                <el-option v-for="(item, index) in typeList" :label="item.name" :value="item.id.toString()"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-select v-model="screenData.flag" placeholder="请选择状态" style="width: 100%;" clearable>
                <el-option v-for="(item, index) in statusList" :label="item.name" :value="item.id.toString()"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
            <el-button type="success" icon="el-icon-edit" @click="$router.push('/manage/advert_opera')">新增</el-button>
        </el-form-item>
    </el-form>

    <!-- -----------------------------------列表------------------------------------ -->
    <el-table
    :data='list'
    stripe
    v-loading='loading'
    style="width:100%">

        <el-table-column
            align="center"
            width="150"
            prop="name"
            label="名称">
        </el-table-column>

        <el-table-column
            align="center"
            prop="cover"
            label="图片">
            <template slot-scope="scope">
                <el-image style="height: 90px;" fit="contain" :src="scope.row.cover | fullPath" :preview-src-list="[$common.getUrl() + scope.row.cover]">
                </el-image>
            </template>
        </el-table-column>

         <el-table-column
            align="center"
            width="120"
            prop="categoryId"
            label="商品分类ID">
        </el-table-column>


        <el-table-column
            align="center"
            label="类型"
            width="120"
            >
            <template slot-scope="scope">
                <span v-if="scope.row.type == 1" class="warning">首页滚动</span>
                <span v-if="scope.row.type == 2" class="gray">首页导航</span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="120"
            label="是否启用">
            <template slot-scope="scope" @click="id=scope.row.id">
                <el-switch v-model="scope.row.flag" active-color="#13ce66" @change="change(scope.row)" >
                    <div @click="id=scope.row.id"></div>
                </el-switch>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            prop="sort"
            width="120"
            label="排序">
        </el-table-column>

        <el-table-column align="center" width="250" label="操作">
            <template slot-scope="scope">
                <el-button type="success" size="small" @click="$router.push('/manage/advert_opera?id='+scope.row.id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="remove(scope.row.id)" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页功能 -->
    <el-pagination
        class="align-center"
        background
        @current-change="pageChange"
        :current-page.sync="screenData.pageNo"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="itemTotal">
    </el-pagination>
</div>
</template>

<script>
export default{
    data(){
        return{
            list: [],
            loading: false,
            screenData: {                //筛选参数
                type: '',
                flag: '',
                pageNo: 1,
                pageSize: 10
            },
            itemTotal: 0,
            typeList: [
                {
                    id: '1',
                    name: '首页滚动'
                }, 
                {
                    id: '2',
                    name: '首页导航'
                }
            ],
            statusList: [
                {
                    id: '1',
                    name: '启用'
                }, 
                {
                    id: '0',
                    name: '禁用'
                }
            ],
        }
    },

    watch: {

    },
    methods: {
        //--------------获取列表----------------------
        getList(){
            this.loading = true
            this.$request.post({
                url: '/ad/sysAdvert/list',
                params: this.screenData,
                success: res =>{
                    this.list = res.list
                    this.list.forEach(item => {
                        item.flag=item.flag==1? true:false
                    });
                    this.itemTotal = res.total
                },
                finally: () => {
                    this.loading = false;
                }
            })
        },

        //启用或禁用
        change(data){
            console.log(data.flag)
            console.log(data.id)
            this.$request.post({
                url: '/ad/sysAdvert/unFlag',
                params: {
                    flag: data.flag,
                    id: data.id
                },
                success: res =>{
                    this.$message.success('操作成功')
                    this.getList()
                },
            })
        },

        //删除
        remove(id){
            this.$request.post({
                url: '/ad/sysAdvert/delete',
                params: {
                    id
                },
                success: res =>{
                    this.$message.success('删除成功')
                    this.getList()
                },
            })
        },

        //页面改变
        pageChange(current){
            if(current) {
                this.screenData.pageNo = current
                this.getList()
            }
        },

    },
    created(){
        this.getList()
    }
  }
</script>

<style lang="scss" scoped>
#userList{
}

</style>

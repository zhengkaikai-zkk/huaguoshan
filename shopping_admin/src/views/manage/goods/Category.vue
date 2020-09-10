<template>
    <div id="classificationManagement">
        <div class="top">
            <el-button size="small" type="primary"  @click="showDialog(0,1,null)">新增主类</el-button>
            <el-button size="small" type="primary"  @click="showDialog(1,1,null)">新增二级分类</el-button>
            <el-button size="small" type="primary"  @click="showDialog(2,1,null)">新增三级分类</el-button>
        </div>
        <div v-loading="loading">
            <el-tree 
                :data="tree" 
                :props="defaultProps" 
                :expand-on-click-node="false"
                @node-click="handleNodeClick">
            </el-tree>
        </div>
        <el-dialog
            :visible.sync="centerDialogVisible"
            :title="title"
            :close-on-click-modal="false"
            @close="closeDialog"
            width="30%"
            center>
            <div class="province" v-if="select > 0">
                <label for="" class="mu_lu">所属主类：</label>
                <el-select v-model="form.mainClass" placeholder="请选择主类" @change="changeMainClass">
                    <el-option
                        v-for="(item,index) in mainClass"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                </el-select>
            </div>
            <div class="province" v-if="select > 1">
                <label for="" class="mu_lu">所属二级主类：</label>
                <el-select v-model="form.secondClass" placeholder="请选择主类" @change="">
                    <el-option
                        v-for="(item,index) in secondClass"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                </el-select>
            </div>
            <div class="province">
                <label for="" class="mu_lu">名称：</label>
                <el-input v-model="form.name"></el-input>
            </div>
            <!-- <div class="province">
                <label for="" class="mu_lu">次序：</label>
                <el-input v-model="form.orderSq"></el-input>
            </div> -->
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog()">取 消</el-button>
                <el-button size="small" type="danger" @click="deleteData()" v-if="form.tab!=1">删 除</el-button>
                <el-button size="small" type="primary" @click="addOrUpdate">确 定</el-button>
            </span>
            <!-- <div class="province">
                <label for="" class="mu_lu">是否显示目录：</label>
                <el-select v-model="form.flag" placeholder="请选择是否显示目录">
                    <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                </el-select>
            </div> -->
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            loading:true,
            updateLoad:false,
            title:'',
            centerDialogVisible:false,
            tree:[],
            select:0,
            directory:0,
            mainClass:[],
            secondClass:[],
            options:[{
                label:'不显示',
                value:0
            },{
                label:'显示',
                value:1
            }],
            form:{
                id:null,
                name:'',
                mainClass:'',
                secondClass:'',
                orderSq:'',
                flag:0,
                tab:0,
                parentId:0,
            },
            defaultProps:{
                label:'name'
            },
        }
    },
    methods:{
        //改变父类状态时
        changeMainClass(id){
            this.tree.forEach(res => {
                if(res.id == id){
                    this.secondClass = res.children
                    this.form.secondClass = undefined
                    return
                }
            })
        },
        //删除数据
        deleteData(){
            this.$confirm('确定删除此条分类', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.post({
                    url:'/ad/productCategory/delete',
                    params:{
                        id:this.form.id
                    },
                    success:res => {
                        this.getList()
                        this.$message.success('操作成功')
                    },
                    finally:res => {
                        this.centerDialogVisible = false
                    }
                })
            }).catch(() => {
                this.centerDialogVisible = false
                this.closeDialog()
                this.$message.defaultMsg('已取消操作')   
            });
        },
        //点击节点时触发的方法
        handleNodeClick(data,node,childrenNode){
            if(node.level == 1){
                this.select = 0
                this.title = '修改主类'
            }else if(node.level == 2){
                this.select = 1
                this.parentId = node.parent.data.id
                this.form.mainClass = node.parent.data.id
                this.title = '修改二级分类'
            }else{
                this.select = 2
                this.parentId = node.parent.data.id
                this.form.mainClass = node.parent.parent.data.id
                this.title = '修改三级分类'
                this.tree.forEach(res => {
                    if(res.id == node.parent.parent.data.id){
                        this.secondClass = res.children
                        this.form.secondClass = node.parent.data.id
                        return
                    }
                })
            }
            this.getDetail(data.id)
            this.form.id = data.id
            this.form.tab = 2
            this.form.name = node.data.name
            this.centerDialogVisible = true
        },
        getList(){
            this.loading = true
            this.$request.post({
                url:'/ad/productCategory/list',
                params:{

                },
                success:res => {
                    this.tree = res
                    this.loading = false
                    this.mainClass=[];
                    res.forEach(res => {
                        this.mainClass.push({id:res.id,name:res.name})
                    });
                }
            })
        },
        getDetail(id){
            this.$request.post({
                url:'/ad/productCategory/details',
                params:{
                    id
                },
                success:res => {
                    this.form.orderSq = res.orderSq
                    this.form.flag = res.flag
                }
            })
        },
        showDialog(select,tab,id){//tab 1为新增 2为修改
            this.centerDialogVisible = true
            this.form.tab = tab
            this.select = select
            if(tab == 1){
                if(select == 0) this.title = '新增主类'
                if(select == 1) this.title = '新增二级分类'
                if(select == 2) this.title = '新增三级分类'                
            }else{
                if(select == 0) this.title = '修改主类'
                if(select == 1) this.title = '修改二级分类'
                if(select == 2) this.title = '修改三级分类'
            }
        },
        closeDialog(){
            this.centerDialogVisible = false
            this.form = {
                id:null,
                name:'',
                mainClass:'',
                secondClass:'',
                orderSq:'',
                flag:0,
                tab:0,
            }
        },
        addOrUpdate(){
            let tips,parentId
            if(this.form.tab == 1){
                this.form.id = undefined
                if(this.select == 1){
                    tips = '确定新增二级分类？'
                    parentId = this.form.mainClass
                }else if(this.select == 2){
                    tips = '确定新增三级分类？'
                    parentId = this.form.secondClass
                }else{
                    tips = '确定新增主分类？'
                    parentId = undefined
                }
            }else{
                if(this.select == 1){
                    tips = '确定修改二级分类？'
                    parentId = this.form.mainClass
                }else if(this.select == 2){
                    tips = '确定修改三级分类？'
                    parentId = this.form.secondClass
                }else{
                    tips = '确定修改主分类？'
                }
            }
            this.$confirm(tips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.updateLoad){
                    return
                }
                this.updateLoad = true
                this.$request.post({
                    url:'/ad/productCategory/addOrUpdate',
                    params:{
                        parentId,
                        categoryName:this.form.name,
                        orderSq:this.form.orderSq,
                        flag:this.form.flag,
                        orType:this.form.tab,
                        id:this.form.id,
                        type:this.select
                    },
                    success:res => {
                        this.getList()
                        this.$message.success('操作成功')
                    },
                    finally:res => {
                        this.updateLoad = false
                        this.centerDialogVisible = false
                    }
                })
            }).catch(() => {
                this.centerDialogVisible = false
                this.closeDialog()
                this.$message.defaultMsg('已取消操作')   
            });
        },
    },
    created(){
        this.$loaging = true 
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
#classificationManagement{
    .top{
        margin-bottom: 10px;
    }
    .el-dialog__body .province {
        display: flex;
        align-items: center;
        &+.province{
            margin-top: 20px;
        }
        .el-select{
            width: 70%;
        }
        label{
            width: 50px;
        }
        .mu_lu{
            width: 105px;
            text-align: right;
            padding-right: 5px; 
        }
        .el-input{
            width: 70%;
        }
    }
}
</style>
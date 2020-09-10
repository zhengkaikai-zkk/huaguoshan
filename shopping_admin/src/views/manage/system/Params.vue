<template>
<div id="params">
    <el-table
    :data='list'
    stripe
    v-loading='loading'
    style="width:100%">

        <el-table-column
            align="center"
            prop="name"
            label="参数名">
        </el-table-column>

        <el-table-column
            show-overflow-tooltip
            min-width="200"
            label="参数值">
            <template slot-scope="scope">
                <div v-if="scope.row.status==1">
                    <p v-for="(item,index) in scope.row.value.split('#')">
                        {{index+1}}. {{item}}
                    </p>
                </div>
                <div v-if="scope.row.status==2">
                    <el-image style="width: 80px; height: 80px;margin:5px;" fit="cover" :src="scope.row.value | fullPath" :preview-src-list="[$common.getUrl() + scope.row.value]">
                    </el-image>
                </div>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            label="创建时间">
            <template slot-scope="scope">
                <p>{{$common.getDate(scope.row.createTime)}}</p>
            </template>
        </el-table-column>

        <el-table-column align="center" width="200" label="操作">
            <template slot-scope="scope">
                <el-button type="success" size="small" @click="doParamsShow(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 弹框 -->
    <el-dialog
    title="编辑系统参数"
    :visible.sync="paramsShow"
    width="450px"
    center
    @close="closeDialog">
        <!-- 用户邀请规则 -->
        <template v-if="this.paramsType == 1">
            <el-form :model="inviteForm" ref="refInvite" label-width="94px">
                <el-form-item 
                    v-for="(item, index) in inviteForm.list"
                    :label="'规则' + (index+1)" 
                    :key="item.key"
                    :prop="'list.' + index + '.value'"
                    :rules="{ required: true, message: '内容不能为空', trigger: 'blur'}">
                    <div style="display:flex;">
                        <el-input placeholder="请输入内容" v-model="item.value"></el-input>
                        <el-button @click.prevent="removeInvite(item)">删除</el-button>
                    </div>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="paramsShow = false">取 消</el-button>
                <el-button @click="addInvite()">新增规则</el-button>
                <el-button type="primary" @click="edit(1)" :loading="loadBtn">确 定</el-button>
            </span>
        </template>
        <!-- 联系微信客服 -->
        <template v-if="this.paramsType == 2">
            <el-form label-width="120px">
                <el-form-item label="客服联系方式" prop="wechatImg">
                    <upload ref="wechatImg" :limit_size="1" :isCompress="true"></upload>
                    <input v-model="wechatImg" type="hidden" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="paramsShow = false">取 消</el-button>
                <el-button type="primary" @click="edit(2)" :loading="loadBtn">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</div>
</template>

<script>
import imgUtil from '@/utils/imgUtils.js'
import upload from '@/components/utils/Upload'

export default{
    components: {
        'upload': upload,
    },
    data(){
        return{
            list: [],
            loading: false,
            id: '',
            loadBtn: false,
            // 用户邀请规则
            inviteForm: {
                list: [],
            },
            // 客服
            wechatImg: '',
            // 弹框
            paramsType: '',
            paramsShow: false,
        }
    },

    watch: {

    },
    methods: {
        //--------------获取列表----------------------
        getList(){
            this.loading = true
            this.$request.post({
                url: '/ad/sysParams/list',
                success: res =>{
                    this.list = res
                    let arr=[];
                    res.forEach(item=>{
                        if(item.status == 1){
                            arr=item.value.split('#')
                        }
                    })
                    arr.forEach(item=>{
                        let obj={value: item}
                        this.inviteForm.list.push(obj)
                    })
                },
                finally: () => {
                    this.loading = false;
                }
            })
        },

        doParamsShow(data){
            this.paramsShow = true;
            this.id = data.id;
            if(data.status == 1){
                this.paramsType = 1;
            }else if(data.status == 2){
                this.paramsType = 2;
                setTimeout(() => {
                    this.$refs.wechatImg.addPathList(data.value);
                }, 100);
            }
        },

        //编辑参数
        edit(type){
            let value;
            // 用户邀请规则
            if(type == 1){
                let arr=[];
                this.inviteForm.list.forEach(item=>{
                    arr.push(item.value)
                })
                value=arr.join('#');
            }
            // 客服联系方式
            if(type == 2){
                if(this.$refs.wechatImg.getPaths().length <= 0){
                    this.$message.warning("请上传客服联系方式");
                    return;
                }
                // 商品封面图
                if(this.$refs.wechatImg.getPaths().search(";base64") != -1){
                    value = this.$refs.wechatImg.getPaths();
                }
            }
            this.$request.post({
                url: '/ad/sysParams/update',
                params: {
                    id: this.id,
                    value
                },
                success: res =>{
                    this.$message.success('编辑成功')
                    this.getList();
                    this.inviteForm.list = [];
                },
                finally: ()=>{
                    this.paramsShow = false
                }
            })
        },
    
        //新增规则
        addInvite(){
            this.inviteForm.list.push({
                value: '',
                key: Date.now()
            });
        },
        // 删除规则
        removeInvite(item){
            if(this.inviteForm.list.length==1) return
            var index = this.inviteForm.list.indexOf(item)
            if (index !== -1) {
                this.inviteForm.list.splice(index, 1)
            }
        },

        //页面改变
        pageChange(current){
            if(current) {
                this.screenData.pageNo = current
                this.getList()
            }
        },
        // 关闭菜单窗口回调
        closeDialog() {
            
        },
    },
    created(){
        this.getList()
    }
  }
</script>

<style lang="scss" scoped>
#params{
    .up_img{
        width: 148px;
        height: 148px;
        border-radius: 6px;
        overflow: hidden;
        color: #606266;
        margin-right: 10px;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        i{
            color: #333;
            font-size: 24px;
            position: absolute;
            top: 0;
            right: 0;
        }
    }
}
</style>

<template>
    <div id="advert_edit">
        <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" style="width: 450px;">
            <el-form-item label="类型" prop="type" :disabled="!formData.id">
                <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%;">
                    <el-option v-for="(item, index) in statusList" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId" v-if="formData.type==2">
                <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%;">
                    <el-option v-for="(item, index) in tree" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            </el-form-item>
            <el-form-item label="图片" prop="cover">
                <div style="display:flex;">
                    <upload ref="cover" :limit_size="1" :isCompress="true"></upload>
                    <input v-model="formData.cover" type="hidden" />
                </div>
            </el-form-item>
            <el-form-item label="名称" prop="name" v-if="formData.type==2">
                <el-input placeholder="请输入名称" v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input placeholder="请输入排序" v-model="formData.sort"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="sort" v-if="formData.type==1">
                <el-input placeholder="请输入链接" v-model="formData.forwardUrl" @blur="urlBlur"></el-input>
            </el-form-item>
            <el-form-item label="启用" prop="flag">
                <el-switch v-model="formData.flag" active-color="#13ce66" >
                </el-switch>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="submit" :loading="loading">提 交</el-button>
                <el-button  @click="$router.go(-1)">返 回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import imgUtil from '@/utils/imgUtils.js'
import upload from '@/components/utils/Upload'

export default {
    components: {
        'upload': upload,
    },
    data(){
        return{
            formData: {
                id: '',
                type: '',
                cover: '',
                name: '',
                sort: '',
                forwardUrl: '',
                flag: true,
                categoryId: '',
                oneCategoryId: '',
                twoCategoryId: '',
            },
            tree: [],
            statusList: [
                {
                    id: 1,
                    name: '首页滚动'
                }, 
                {
                    id: 2,
                    name: '首页导航'
                }
            ],
            rules: {
                categoryId: {
                    message: '请选择分类', required: true,
                },
                type: {
                    message: '请选择类型', required: true,
                },
                cover: {
                    message: '请上传图片', required: true
                },
                name: {
                    message: '请输入名称', required: true, tirgger: 'blur'
                },
                sort: {
                    message: '请输入排序', required: true
                }
            },
            fileList: [],
            dialogImageUrl: '',
            loading: false,
        }
    },

    methods: {
        //提交数据
        submit(){
            if(this.$refs.cover.getPaths().length <= 0){
                this.$message.warning("请上传首页轮播图");
                return;
            }
            // 首页轮播图
            if(this.$refs.cover.getPaths().search(";base64") != -1){
                this.formData.cover = this.$refs.cover.getPaths();
            }
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    if(this.loading){
                        return;
                    }
                    this.loading = true
                    this.$request.post({
                        url: '/ad/sysAdvert/addOrUpdate',
                        params: this.formData,
                        success: res =>{
                            this.$message.success('提交成功')
                            this.$router.push('/manage/advert_list')
                        },
                        finally: ()=>{
                            this.loading = false
                        }
                    })
                }
            })        
        },

        // 获取详情
        getDetail(){
            this.$request.post({
                url: '/ad/sysAdvert/details',
                params: {
                    id: this.formData.id,
                },
                success: res =>{
                    this.formData = res;
                    this.formData.flag = res.flag==1?true: false;
                    setTimeout(() => {
                        this.$refs.cover.addPathList(res.cover);
                    }, 100);
                },
                
            })
        },

        urlBlur(){
            if(this.formData.forwardUrl){
                if(this.formData.forwardUrl.search('https://') || this.formData.forwardUrl.search('http://')){
                    this.formData.forwardUrl= 'http://'+this.formData.forwardUrl
                }
            }
        },

        //--------分类-------
        /* 获取分类列表 */
        getShopCategory(){
            this.$request.post({
                url:'/ad/productCategory/list',
                success:res => {
                    this.tree = res
                }
            })
        },
    },

    mounted(){
        this.getShopCategory();
        var id=this.$route.query.id;
        if(id){
            this.formData.id=id;
            this.getDetail();
        }
    }
}
</script>

<style lang="scss" scoped>
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
</style>
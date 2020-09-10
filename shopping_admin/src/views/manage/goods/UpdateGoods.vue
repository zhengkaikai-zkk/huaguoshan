<!-- 编辑商品 -->
<template>
    <div id="add_goods">
        <!-- 进度显示 -->
        <div class="d_step">
            <el-steps :space="450" :active="active" finish-status="success" align-center>
                <el-step title="商品基本信息"></el-step>
                <el-step title="商品附加信息"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </div>

        <!-- 1.商品基本属性 -->
        <div v-if="this.active == 0">
            <h3>商品基本属性</h3>
            <el-form :model="formData" :rules="rules" ref="formData" label-position="right" label-width="100px">
                <el-form-item label="商品封面图" prop="productCover">
                    <upload ref="productCover" :limit_size="1" :isCompress="true"></upload>
                    <input v-model="formData.productCover" type="hidden" />
                </el-form-item>

                <el-form-item label="详情轮播图" prop="albumPics">
                    <upload ref="albumPics" :limit_size="5" :isCompress="true"></upload>
                    <input v-model="formData.albumPics" type="hidden" />
                </el-form-item>

                <div class="d_list">
                    <el-form-item label="商品标题" prop="productTitle">
                        <el-input v-model="formData.productTitle" class="formDataClass" placeholder="请输入商品标题"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="原价" prop="price">
                        <el-input placeholder="请输入商品原价" class="formDataClass" v-model="formData.price">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </div>

                <div class="d_list">
                    <el-form-item label="品牌" prop="brand">
                        <el-input placeholder="请输入品牌" class="formDataClass" v-model="formData.brand"></el-input>
                    </el-form-item>

                    <el-form-item label="市场价" prop="originalPrice">
                        <el-input placeholder="请输入商品市场价" class="formDataClass" v-model="formData.originalPrice">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </div>

                <div class="d_list">
                    <el-form-item label="库存预警值" prop="lowStock">
                        <el-input placeholder="请输入库存预警值" oninput = "value=value.replace(/[^\d]/g,'')" class="formDataClass" v-model="formData.lowStock"></el-input>
                    </el-form-item>

                    <el-form-item label="当前剩余库存">
                        <el-input v-model="formData.stock" disabled>
                            <template slot="append">件</template>
                        </el-input>
                    </el-form-item>
                </div>

                <div class="d_list">
                    <el-form-item label="商品分类" prop="categoryOneId">
                        <el-col :span="30">
                            <el-select size="middle" v-model="formData.categoryOneId" clearable @change="mainClassChange">
                                <el-option 
                                    v-for="item in tree" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select  size="middle" v-model="formData.categoryTwoId" clearable @change="secondClassChange">
                                <el-option
                                    v-for="item in secondClassList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select size="middle" clearable v-model="formData.categoryTreeId" @change="categoryChange">
                                <el-option
                                    v-for="item in thirdClassList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="运费" prop="freightPrice">
                        <el-input placeholder="请输入运费" v-model="formData.freightPrice">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </div>

                <div class="d_list">
                    <el-form-item label="人气商品" prop="popularity">
                        <el-switch v-model="formData.popularity"></el-switch>
                    </el-form-item>
                </div>

                <div class="d_list">
                    <el-form-item label="商品描述" prop="details">
                        <vue-ueditor-wrap 
                            ref="vueUeditor"
                            v-model="formData.details"
                            :config="ueditorConfig" 
                            :destroy="true"
                            @ready="ready" 
                            @beforeInit="addCustomUI" 
                        />
                    </el-form-item>
                </div>

                <el-form-item label="" >
                    <el-button @click="$router.go(-1)">返回</el-button>
                    <el-button @click="doUpdateProduct()" type="primary">下一步</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 2.商品附加属性（规格表格并未生成） -->
        <div v-if="this.active == 1">
            <h3>商品附加属性 <span style="font-size:14px; color:red">&nbsp;规格信息填写完成请及时点击保存</span></h3>
            <!-- 2.1 商品优惠券 -->
            <div class="d_coupon">
                <div class="add_coupon">
                    <el-button @click="addCouponShow()" size="small" plain type="warning">新增优惠券</el-button>
                </div>
                <el-table :data="couponData" width="100%">
                    <el-table-column width="150px" align="center" prop="stock" label="优惠券名称">
                        <template slot-scope="scope">
                            {{scope.row.name}}
                        </template>
                    </el-table-column>
                    <el-table-column width="200px" align="center" prop="stock" label="使用条件">
                        <template slot-scope="scope">
                            {{scope.row.conditionValue}}
                        </template>
                    </el-table-column>
                    <el-table-column width="100px" align="center" prop="price" label="可抵扣金额">
                        <template slot-scope="scope">
                            ￥{{scope.row.money}}
                        </template>
                    </el-table-column>
                    <el-table-column width="300px" align="center" prop="stock" label="说明">
                        <template slot-scope="scope">
                            {{scope.row.condition}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="price" label="有效时间">
                        <template slot-scope="scope">
                            <p>生效时间：{{JSON.parse(scope.row.effectiveTime).startTime}}</p>
                            <p>失效时间：{{JSON.parse(scope.row.effectiveTime).endTime}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="200px" align="center" label="操作" prop="option">
                        <template slot-scope="scope">
                            <el-button @click="delCounpon(scope.row.id)" size="mini" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 2.2 商品规格SKU -->
            <div class="d_sku_one">
                <div class="sku_group">
                    <el-button type="warning" plain @click="addGroupShow()" size="small">添加规格组</el-button>
                </div>
                <div class="sku_items" v-if="tableData != null">
                    <ul>
                        <li v-for="specs in groupData">
                            {{specs.groupName}}
                            <el-button type="danger" icon="el-icon-delete" @click="delGroup(specs.id)" circle size="mini"></el-button>
                            <ul style="margin-top: 5px; margin-bottom: 5px;">
                                <li v-for="items in specs.productItems" style="display: inline-block; padding-right:10px; padding-bottom:5px;">
                                    <el-tag type="info" closable @close="delItem(items.id)">
                                        {{items.itemName}}
                                    </el-tag>
                                </li>
                                <el-button type="primary" plain @click="addItemShow(specs.id, specs.isUploadImg)" size="small">添加规格项</el-button>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="sku_specs">
                    <el-table :data="tableData" width="100%">
                        <!-- 动态循环渲染表头列 -->
                         <el-table-column align="center" :label="item.groupName" v-for="(item, index) in tableHead">
                             <!-- 动态循环渲染表格列 -->
                            <template slot-scope="scope">
                                <template v-if="scope.row.name[index] != null">
                                    {{JSON.parse(scope.row.name)[index]}}
                                </template>
                                <template v-else>
                                    --
                                </template>
                            </template>
                        </el-table-column>

                        <!-- 固定写死的列 -->
                        <el-table-column align="center" label="库存">
                            <template slot-scope="scope">
                                <el-input size="mini" oninput = "value=value.replace(/[^\d]/g,'')" v-if="!scope.row.id" v-model="scope.row.stock" style="width:50%"></el-input>
                                <template v-else>{{scope.row.stock}}</template>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="价格">
                            <template slot-scope="scope">
                                <el-input size="mini" v-if="!scope.row.id" v-model="scope.row.price" style="width:50%"></el-input>
                                <template v-else>{{scope.row.price}}</template>
                            </template>
                        </el-table-column>

                        <el-table-column width="200px" align="center" label="操作" prop="option">
                            <template slot-scope="scope">
                                <el-button @click="addSku(scope.row)" v-if="!scope.row.id" size="mini" type="primary">提交</el-button>
                                <el-button @click="doUpdateStock(scope.row.id)" v-if="scope.row.id" size="mini" type="warning">更新库存</el-button>
                                <el-button @click="deleteSku(scope.row.id)" v-if="scope.row.id" size="mini" type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="sku_btn">
                    <el-button @click="doSubmit()" type="primary">提交</el-button>
                </div>
            </div>
        </div>

        <!-- 查看图片 -->
        <el-dialog
            title="查看图片"
            :visible.sync="visible"
            width="700px"
            center
            >
            <img :src="dialogImageUrl" width="100%"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="visible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 规格组弹框 -->
        <el-dialog
            title="添加规格组"
            :visible.sync="groupShow"
            width="500px"
            center
            @close="closeDialog">
            <el-form label-width="100px" ref="refContent">
                <el-form-item label="规格组名称">
                    <el-input placeholder="请输入规格组名称" v-model="groupName"></el-input>
                </el-form-item>
                <el-form-item label="图片是否必传">
                    <el-switch v-model="groupIsUpload"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupShow = false">取 消</el-button>
                <el-button type="primary" @click="addGroup()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 规格项弹框 -->
        <el-dialog
            title="编辑规格项"
            :visible.sync="itemShow"
            width="500px"
            center
            @close="closeDialog">
            <el-form label-width="94px" ref="refContent">
                <el-form-item label="规格项名称">
                    <el-input placeholder="请输入规格项名称" v-model="itemName"></el-input>
                </el-form-item>
                <el-form-item label="商品缩略图" v-show="this.isUploadImg == 1">
                    <upload ref="itemImg" :limit_size="1" :isCompress="true"></upload>
                    <input v-model="itemImg" type="hidden" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="itemShow = false">取 消</el-button>
                <el-button type="primary" @click="addItem()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 优惠券弹框 -->
        <el-dialog
            title="新增优惠券"
            :visible.sync="couponShow"
            width="550px"
            center
            @close="closeDialog">
            <el-form :model="couponFormData" :rules="couponRules" ref="couponFormData" label-width="94px">
                <el-form-item label="优惠券名称" prop="couponName">
                    <el-input placeholder="请输入优惠券名称" v-model="couponFormData.couponName"></el-input>
                </el-form-item>
                <el-form-item label="使用条件" prop="couponConditionValue">
                    <el-input placeholder="满___多少可用？" v-model="couponFormData.couponConditionValue"></el-input>
                </el-form-item>
                <el-form-item label="可抵扣金额" prop="couponMoney">
                    <el-input placeholder="请输入金额" v-model="couponFormData.couponMoney"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="couponCondition">
                    <el-input placeholder="选填" v-model="couponFormData.couponCondition"></el-input>
                </el-form-item>
                <el-form-item label="有效时间" prop="effectiveTime">
                     <el-date-picker
                    v-model="couponFormData.effectiveTime"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="couponShow = false">取 消</el-button>
                <el-button type="primary" @click="addCoupon()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 重置 -->
        <el-dialog
            title="重置库存与单价"
            :visible.sync="stockShow"
            width="30%"
            center
            @close="closeDialog">
            <div class="d_column">
                <!-- 新的值 -->
                <div class="d_s_column_l">
                    <div>
                        <div>新的库存</div>
                        <el-input oninput = "value=value.replace(/[^\d]/g,'')" v-model="skuData.stock" size="small"/>
                    </div>
                    <div>
                        <div>新的单价</div>
                        <el-input v-model="skuData.price" size="small"/>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="stockShow = false">关 闭</el-button>
                <el-button type="primary" @click="updateStock()">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import imgUtil from '@/utils/imgUtils.js'
    import VueUeditorWrap from 'vue-ueditor-wrap'
    import ueditorConfig from '@/utils/ueditorConfig'
    import upload from '@/components/utils/Upload'

    export default {
        components: {
            'vue-ueditor-wrap': VueUeditorWrap,
            'upload': upload,
        },
        data(){
            return{
                stockShow: false,
                // 优惠券数据
                couponData:[],
                // SKU-表头数据
                tableHead:[],
                // SKU-表格数据
                tableData:[],
                // 规格显示数据
                groupData:[],
                // 步骤条显示，0：商品基本信息，1：商品SKU
                active: 0,
                // **************************商品
                // 商品表单信息
                formData: {
                    id: '',
                    productCover: '',
                    albumPics: [],
                    albumPicsList: [],
                    productTitle: '',
                    price: '',
                    lowStock: '',
                    originalPrice: '',
                    brand: '',
                    freightPrice: '',
                    categoryOneId: '',
                    categoryTwoId: '',
                    categoryTreeId: '',
                    popularity: false,
                    details: '',
                    status: '',
                },
                // 商品表单验证
                rules: {
                    productTitle: {
                        message: '请输入商品标题', required: true, tirgger: 'blur'
                    },
                    price: {
                        message: '请输入商品原价', required: true,
                    },
                    originalPrice: {
                        message: '请输入商品市场价格', required: true,
                    },
                    freightPrice: {
                        message: '请输入商品运费且运费必须为数字', required: true,
                    },
                    lowStock: {
                        message: '请选择库存预警值', required: true,
                    },
                    brand: {
                        message: '请输入品牌', required: true,
                    },
                    categoryOneId: {
                        message: '请选择商品分类', required: true,
                    },
                    productCover: {
                        message: '请上传封面图', required: true,
                    },
                    albumPics: {
                        message: '请上传轮播图，最多5张', required: true,
                    }
                },
                productStatus: '',
                // **************************商品附加信息
                // 规格组弹框参数
                groupName: '',
                groupIsUpload: false,
                // 规格项弹框参数
                groupId: '',
                itemName: '',
                itemImg: '',
                isUploadImg: 0,
                // SKU表单参数
                skuData: {
                    stock: '',
                    price: '',
                },
                // 优惠券
                couponShow: false,
                couponFormData: {
                    productId: '',
                    couponName: '',
                    couponMoney: '',
                    couponCondition: '',
                    couponConditionValue: '',
                    effectiveTime: [],
                },
                couponRules: {
                    couponName: {
                        message: '请输入优惠券名称', required: true, tirgger: 'blur'
                    },
                    couponConditionValue: {
                        message: '请输入使用条件', required: true, tirgger: 'blur'
                    },
                    couponMoney: {
                        message: '请输入可抵扣金额', required: true, tirgger: 'blur'
                    },
                },
                // **************************商品分类
                tree: [],
                secondClassList: [],
                thirdClassList: [],
                // **************************其他
                ueditorConfig: ueditorConfig.myConfig,// 富文本编辑器
                fileList: [],
                dialogImageUrl: '',
                visible: false,//查看图片
                loading: false,
                groupShow: false,// 是否显示规格组的弹框
                itemShow: false,// 是否显示规格项的弹框
            }
        },
        methods:{
            // ********************************************************配置富文本编辑器********************************************************、】
            ready(editorInstance) {
                // 编辑器实例
                this.editor_obj = editorInstance;
                var ue = window.UE.getEditor(editorInstance.key);
                // 粘贴过滤
                ue.addListener('afterinserthtml', function (html) {
                    //操作, 查找 img a    ,将之删除操作
                    html=html.replace(/<img[^>]*>/i,'');
                    html=html.replace(/<a[^>]*>/i,'');
                    html=html.replace(/<\/a>/i,'');
                    // 更新编辑器内容, 把html 写进去, 替换原来的
                });
            },
            // 编辑器二次开发
            addCustomUI(editorId, editorConfig) {
            },
            
            // ********************************************************1.商品信息********************************************************
            // 编辑商品基本信息
            doUpdateProduct(){
                if(this.formData.status == 2){
                    this.$confirm('商品已上架，如果提交修改，需要重新上架该商品，是否前往？', '提示', {
                        confirmButtonText: '前往',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.updateProduct();
                    });
                }else{
                    this.updateProduct();
                }
            },
            updateProduct(){
                if(this.$refs.productCover.getPaths().length <= 0){
                    this.$message.warning("请上传商品封面图");
                    return;
                }
                // 商品封面图
                if(this.$refs.productCover.getPaths().search(";base64") != -1){
                    this.formData.productCover = this.$refs.productCover.getPaths();
                }
                // 商品详情图
                let arrayList = [];
                let albumPicsArray = this.$refs.albumPics.getPaths();
                if(Array.isArray(albumPicsArray)){
                    albumPicsArray.forEach(item=>{
                        if(item.indexOf("/files")){
                            arrayList.push(item.substring(item.indexOf('/files')));
                        }else{
                            arrayList.push(item);
                        }
                    });
                }else{
                    if(albumPicsArray.length >= 1){
                        if(albumPicsArray.indexOf("/files")){
                            arrayList.push(albumPicsArray.substring(albumPicsArray.indexOf('/files')));
                        }else{
                            arrayList.push(albumPicsArray);
                        }
                    }
                }
                if(arrayList.length <= 0){
                    this.$message.warning("请上传轮播图，最多5张");
                    return;
                }
                this.formData.albumPics = JSON.stringify(arrayList);
                this.formData.id = localStorage.getItem("goodsId");
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        if(this.loading){
                            return;
                        }
                        this.loading = true;
                        this.$request.post({
                            url: '/ad/productInfo/addOrUpdate',
                            params: this.formData,
                            success: res =>{
                                this.active=1;
                                localStorage.setItem("goodsId", res);
                                this.getCoupon();
                                this.getProductSpecs();
                                this.calcSKU();
                            },
                            finally: ()=>{
                                this.loading = false
                            }
                        })
                    }
                })
            },
            // 查询商品基本信息
            getDetails(){
                if(!this.formData.id){
                    return;
                }
                this.$request.post({
                    url: '/ad/productInfo/details',
                    params: {
                        id: this.formData.id
                    },
                    success: res =>{
                        var productInfo = res.productInfo;

                        this.formData.productTitle = productInfo.productTitle;
                        this.formData.freightPrice = productInfo.freightPrice;
                        this.formData.price = productInfo.price;

                        this.formData.stock = productInfo.stock;
                        this.formData.lowStock = productInfo.lowStock;
                        this.formData.originalPrice = productInfo.originalPrice;

                        this.formData.categoryOneId = productInfo.categoryOneId;
                        this.formData.categoryTwoId = productInfo.categoryTwoId;
                        this.formData.categoryTreeId = productInfo.categoryTreeId;
                        this.formData.popularity = productInfo.popularity==1?true:false;

                        this.formData.brand = productInfo.brand;
                        this.formData.details = productInfo.details;
                        this.formData.status = productInfo.status;
                        this.formData.productCover = productInfo.productCover;
                        this.formData.albumPics = JSON.stringify(productInfo.albumPics);

                        // 商品封面图
                        setTimeout(() => {
                            this.$refs.productCover.addPathList(productInfo.productCover);
                        }, 100);
                        // 商品轮播图
                        let albumPicsArr = JSON.parse(productInfo.albumPics);
                        setTimeout(() => {
                            this.$refs.albumPics.addPathList(albumPicsArr.join(','));
                        });
                    },
                })
            },

            // ********************************************************1-1.商品分类********************************************************
            getShopCategory(){
                this.$request.post({
                    url:'/ad/productCategory/list',
                    success:res => {
                        this.tree = res
                        //如果getDetail请求先返回 就从这里取值
                        if(this.formData.categoryOneId){
                            this.tree.forEach(res => {
                                if(res.id == this.formData.categoryOneId){
                                    this.secondClassList = res.children
                                }
                            })
                            this.secondClassList.forEach(res => {
                                if(res.id == this.formData.categoryTwoId){
                                    this.thirdClassList = res.children
                                    return
                                }
                            })
                        }
                    }
                })
            },
            mainClassChange(id){
                this.tree.forEach(res => {
                    if(res.id == id){
                        this.secondClassList = res.children
                        this.formData.twoCategoryId = undefined
                        this.formData.categoryId = undefined
                        return
                    }
                })
            },
            secondClassChange(id){
                this.secondClassList.forEach(res => {
                    if(res.id == id){
                        this.thirdClassList = res.children
                        this.formData.categoryId = undefined
                        return
                    }
                })
            },
            categoryChange(e){
                this.$refs.formData.validateField('categoryId')
                // this.getCategorySpec(e)
            },

            // ********************************************************2.编辑规格信息********************************************************
            // 查询规格信息
            getProductSpecs(){
                this.$request.post({
                    url: '/ad/productGroup/list',
                    params: {
                        productId: this.formData.id,
                    },
                    success: res =>{
                        this.groupData=res;
                    },
                })
            },

            // 显示规格组弹框
            addGroupShow(){
                this.groupShow=true;
            },

            // 提交规格组
            addGroup(){
                if(!this.groupName){
                    this.$message.warning('请输入'); 
                    return;
                }
                this.$request.post({
                    url: '/ad/productGroup/add',
                    params: {
                        productId: this.formData.id,
                        name: this.groupName,
                        isUploadImg: this.groupIsUpload,
                    },
                    success: res =>{
                        this.$message.success('添加成功')
                        this.groupName = '';
                        this.getProductSpecs();
                        this.calcSKU();
                        this.groupShow = false;
                        this.groupIsUpload = false;
                    },
                })
            },

            // 删除规格组
            delGroup(id){
                if(!id){
                    this.$message.warning('请选择'); 
                    return;
                }
                this.$confirm('删除规格组会同步删除下面的所有规格项哦，是否继续?', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.post({
                        url: '/ad/productGroup/delete',
                        params: {
                            id
                        },
                        success: res =>{
                            this.$message.success('删除成功');
                            this.getProductSpecs();
                            this.calcSKU();
                        },
                    })
                })
            },
            
            // 显示规格项弹框
            addItemShow(id, type){
                if(!id){
                    this.$message.warning("未知错误");
                    return;
                }
                this.groupId = id;
                this.itemShow=true;
                this.isUploadImg = type;
            },

            // 提交规格项
            addItem(){
                if(this.$refs.itemImg.getPaths().length <= 0 && this.isUploadImg == 1){
                    this.$message.warning("请上传图片");
                    return;
                }
                // 商品缩略图
                if(this.$refs.itemImg.getPaths().search(";base64") != -1){
                    this.itemImg = this.$refs.itemImg.getPaths();
                }
                // 验证规格项名称是否为空。
                if(!this.itemName){
                    this.$message.warning("请输入");
                    return;
                }
                this.$request.post({
                    url: '/ad/productItem/add',
                    params: {
                        groupId: this.groupId,
                        name: this.itemName,
                        img: this.itemImg,
                    },
                    success: res =>{
                        this.$message.success('添加成功')
                        this.itemShow=false;
                        this.itemName='';
                        this.itemImg='';
                        this.$refs.itemImg.clearImgs();
                        this.getProductSpecs();
                        this.calcSKU();
                    },
                    finally: () => {
                    }
                })
            },

            // 删除规格项
            delItem(id){
                if(!id){
                    this.$message.warning('请选择'); 
                    return;
                }
                this.$request.post({
                    url: '/ad/productItem/delete',
                    params: {
                        id
                    },
                    success: res =>{
                        this.$message.success('删除成功');
                        this.getProductSpecs();
                        this.calcSKU();
                    },
                })
            },

            // 提交SKU
            addSku(data){
                data.productId = this.formData.id;
                if(!data.stock || data.stock <= 0 || isNaN(data.stock)){
                    this.$message.warning("请输入库存且必需是大于0的数字");
                    return;
                }
                if(!data.price || data.price <= 0 || isNaN(data.price)){
                    this.$message.warning("请输入金额且必需是大于0的数字");
                    return;
                }
                this.$request.post({
                    url: '/ad/productSku/add',
                    params: {
                        productId: data.productId,
                        name: data.name,
                        stock: data.stock,
                        price: data.price,
                    },
                    success: res =>{
                        this.$message.success('添加成功');
                        this.calcSKU();
                    },
                })
            },

            // 更新SKU
            doUpdateStock(id){
                if(!id){
                    this.$message.warning("请选择");
                    return;
                }
                this.stockShow = true;
                this.skuData.id = id;
            },
            updateStock(){
                if(!this.skuData.stock || this.skuData.stock <= 0){
                    this.$message.warning("请输入库存且必需是大于0的数字");
                    return;
                }
                if(!this.skuData.price || this.skuData.price <= 0 || isNaN(this.skuData.price)){
                    this.$message.warning("请输入金额且必需是大于0的数字");
                    return;
                }
                this.$request.post({
                    url: '/ad/productSku/update',
                    params: {
                        id: this.skuData.id,
                        name: this.skuData.name,
                        stock: this.skuData.stock,
                        price: this.skuData.price,
                    },
                    success: res =>{
                        this.$message.success('更新成功');
                        this.skuData = {};
                        this.stockShow = false;
                        this.calcSKU();
                    },
                })
            },

            // 删除SKU
            deleteSku(id){
                if(!id){
                    this.$message.warning('请选择'); 
                    return;
                }
                this.$confirm('删除后用户端将不再显示，请谨慎操作!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.post({
                        url: '/ad/productSku/delete',
                        params: {
                            id
                        },
                        success: res =>{
                            this.$message.success('删除成功');
                            this.getProductSpecs();
                            this.calcSKU();
                        },
                    })
                })
            },

            // 笛卡尔乘积计算商品SKU
            calcSKU(){
                this.$request.post({
                    url: '/ad/productSku/list',
                    params: {
                        productId: this.formData.id,
                    },
                    success: res =>{
                        if(res.listGroup.length > 0){
                            // 表头
                            this.tableHead = res.listGroup;
                            // 表格
                            this.tableData = res.skuList;
                        }else{
                            this.tableHead = [];
                        }
                    },
                })
            },

            // ********************************************************3.其他********************************************************
            // 显示新增优惠券弹框
            addCouponShow(){
                var id = this.formData.id;
                if(!id){
                    this.$message.warning("请输入");
                    return;
                }
                this.couponShow=true;
            },

            // 新增优惠券
            addCoupon(){
                 this.$refs['couponFormData'].validate((valid) => {
                    let timeData;
                    if (valid) {
                        if(isNaN(this.couponFormData.couponConditionValue)){
                            this.$message.warning("使用条件必须为数字");
                            return;
                        }
                        if(isNaN(this.couponFormData.couponMoney)){
                            this.$message.warning("可抵扣金额必须为数字");
                            return;
                        }
                        if(this.couponFormData.effectiveTime && this.couponFormData.effectiveTime.length){
                            var startTime = this.$moment(this.couponFormData.effectiveTime[0]).format('Y-MM-DD HH:mm:ss')
                            var endTime = this.$moment(this.couponFormData.effectiveTime[1]).format('Y-MM-DD HH:mm:ss')
                            timeData = {"startTime": startTime, "endTime": endTime};
                        }else{
                            this.$message.warning("请输入优惠券的有效时间");
                            return;
                        }
                        if(this.loading){
                            return;
                        }
                        this.loading = true;
                        this.couponFormData.effectiveTime = JSON.stringify(timeData);
                        this.couponFormData.productId = this.formData.id;
                        this.$request.post({
                            url: '/ad/productCoupon/add',
                            params: this.couponFormData,
                            success: res =>{
                                this.$message.success('新增成功');
                                this.couponShow = false;
                                this.getCoupon();
                            },
                            finally: ()=>{
                                this.loading = false
                            }
                        })
                    }
                })
            },

            // 获取优惠券
            getCoupon(){
                this.$request.post({
                    url: '/ad/productCoupon/list',
                    params: {
                        productId: this.formData.id,
                    },
                    success: res =>{
                        this.couponData=res;
                    },
                })
            },

            // 删除优惠券
            delCounpon(id){
                if(!id){
                    this.$message.warning('请选择'); 
                    return;
                }
                this.$confirm('是否删除该优惠券？注意：已被领取的优惠券不受影响，任可以使用！', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.post({
                        url: '/ad/productCoupon/delete',
                        params: {
                            id
                        },
                        success: res =>{
                            this.$message.success('删除成功');
                            this.getCoupon();
                        },
                    })
                })
            },

            // ********************************************************4.其他********************************************************
            // 商品缩略图
            specChange(){
                imgUtil.toBase64(this.$refs.specUpload.uploadFiles[0].raw, (result, data)=>{
                    imgUtil.canvasDataURL(result, {}, baseCode=>{
                        this.itemImg = baseCode
                    })
                })
            },
            specBeforeRemove(){
                this.itemImg = ''
            },

            // 提交
            doSubmit(){
                this.$message.success("商品编辑成功");
                this.$router.push({
                    path:'/manage/goods_list', 
                })
            },

            // 菜单回调
            closeDialog() {
                // this.son.name='';
                // this.son.imgUrl='';
                // this.$refs.specUpload.clearFiles();
            },
        },
        // 该方法下的函数会在网页重新加载时被执行。
        mounted(){
            this.formData.id = this.$route.query.id;
            localStorage.setItem("goodsId", this.$route.query.id);
            if(this.active == 0){
                this.getDetails();
                this.getShopCategory();
            }
            if(this.active == 1){
                this.getCoupon();
                this.getProductSpecs();
                this.calcSKU();
            }
        },

        // 页面的每一次操作都会执行。
        beforeUpdate(){
            this.formData.id = localStorage.getItem("goodsId");;
        },

        // 将在退出该页面时调起该接口。
        destroyed(){
            localStorage.removeItem('goodsId')
        }
    }
</script>

<style>
    .hide .el-upload--picture-card {
        display: none;
    }
</style>
/* scoped：加上该属性，即指<style></style>中的样式仅在当前页面有效 */
<style lang="scss" scoped>
    @import '@/assets/css/goods.scss';
    // 商品优惠券
    .d_coupon{
        border: 1px solid #eee;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 10px;
        .add_coupon{
            padding-top: 20px;
            padding-bottom: 10px;
            padding-left: 20px;;
            display: inline-block;
        }
        .coupon{
            border: 1px solid #eee;
            padding-top: 10px;
            padding-bottom: 10px;
            .coupon_num{
                margin-top: 10px;;
                margin-bottom: 15px;
                width: 30%;
            }
        }
    }
    // 商品规格
    .d_sku_one{
        border: 1px solid #eee;
        border-radius: 4px;
        font-size: 14px;
        .sku_group{
            padding-top: 20px;
            padding-bottom: 10px;
            padding-left: 20px;;
            display: inline-block;
        }
        .sku_items{
            border: 1px solid #eee;
            padding-top: 8px;
            padding-bottom: 8px;;
            padding-left: 20px;
        }
        .sku_btn{
            text-align: center;
            padding-top: 20px;
            padding-bottom: 20px;
        }
    }
    // 更新SKU库存
    .d_column{
        border: 1px solid #eee;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        .d_s_column_l{
            text-align: left;
            padding-bottom: 10px;
            display: inline-block;
            &>div{
                padding-right: 20px;
                display: inline-block;
                div{
                    margin-top: 10px;
                }
            }
        }
    }
</style>
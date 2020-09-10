<template>
    <div id="classify">
        <div class="d_search">
            <van-search placeholder="输入商品名称搜索" v-model="name" @search="search" @focus="openSelect"/>
        </div>
        <div class="side">
            <ul class="d_list">
                <li
                    :class="classIndex == index?'active':''"
                    v-for="(item,index) in classification"
                    @click="getSonList(item,index)"
                >{{item.name}}</li>
            </ul>
            <div class="right">
                <div v-for="(item,index) in sonList">
                    <p class="title">{{item.name}}</p><!-- filtrate.name.indexOf(i.name)!=-1 -->
                    <span 
                        class="label" 
                        v-for="i in item.children" 
                        :class="arrayInit.some((item)=>{return item.name==i.name}) ? 'lab_active':''" 
                        @click="$router.push('/search')"
                    >
                        {{i.name}}
                    </span>
                </div>
            </div>    
        </div>

        <!-- 弹框 -->
        <van-overlay :show="showHistory" z-index="101">
            <div class="d_over">
                <van-search placeholder="输入关键词搜索" v-model="name" show-action @search="search" @cancel="closeSelect" @focus="openSelect"/>
                <div class="sera_card" v-for="item in historyList" @click="$router.push('/search?name='+item)">
                    <div>
                        <van-icon name="search" size="1.5rem"/>
                        <span>{{item}}</span>
                    </div>
                    <van-icon name="home-o" size="1.5rem"/>
                </div>
                <div class="clear_all" @click="clearSelect">清空输入历史</div>
            </div>
        </van-overlay>
    </div>
</template>

<script>
export default {
    data(){
        return{
            name: '',
            classification: [
                // {name: '磨具/磨料系列',children:[{name: '开关面板'},{name: '其他开关'}]},
                // {name: '电子/电工/辅料'},
                // {name: '联塑系列'},
                // {name: '卫浴洁具'},
                // {name: '水暖器材/阀门'},
                // {name: '手动工具'},
                // {name: '电动工具/模具'},
                // {name: '锁具/门锁配件'},
                // {name: '五金配件'},
            ],
            sonList:[
                // {name: '开关面板'},
                // {name: '其他开关'},
                // {name: '灯头'},
            ],
            classIndex: 0,
            showHistory: false,
            historyList: [],
            filtrate: {
                id: '',
                name: ''
            },
            arrayInit: [],
        }
    },

    methods:{
        //获取全部类目
        getList(){
            this.$request.post({
                url: '/us/productCategory/list',
                success: result => {
                    this.classification= result;
                    if(result.length>0){
                        this.sonList= result[0].children;
                        this.filtrate.id=result[0].id;
                    }
                }
            })
        },


        //获取子类目
        getSonList(item,index){
            this.classIndex=index;
            this.sonList=item.children;
            this.filtrate.id=item.id;
            this.arrayInit=[];
        },

        //打开搜索记录
        openSelect(){
            if(this.historyList){
                this.showHistory=true
            }
        },
        //关闭搜索记录
        closeSelect(){
            this.showHistory=false
        },
        //清空搜索记录
        clearSelect(){
            localStorage.removeItem('historyList')
            this.historyList=[];
        },

        //搜索
        search(){
            if(!this.name){
    			this.$toast.fail('你还未填入搜索内容哦');
                return; 
            }
            let historyList=[];
            let arr=JSON.parse(localStorage.getItem('historyList'));
            historyList= arr? arr.slice(-9): historyList;
            historyList.push(this.name);
            localStorage.setItem('historyList',JSON.stringify(historyList))
            this.$router.push({
                path:'/search', 
                query:{'name':this.name}
            });
        },

    },

    mounted(){
        this.getList();
        this.historyList=JSON.parse(localStorage.getItem('historyList'));
        localStorage.removeItem('filtrate')
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
.side {
    position: fixed;
    display: flex;
    height: 80%;
    width: 100%;
    font-size: 1.14rem;
    .d_list{
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        background: #fff;
        height: 100%;
        width: 32%;
        padding-bottom: 10rem;
        // padding-bottom: 11rem;
        &::-webkit-scrollbar{
            display: none;
        }
    }
    .active {
        background: #f5f5f5;
        color: $color;
    }
    li {
        font-size: 1.33rem;
        padding: 1rem 1rem;
    }
    .right {
        flex: 1;
        padding-left: 0.9rem;
        padding-right: 0.9rem;
        padding-bottom: 2rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar{
            display: none;
        }
        .title {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            color: $color;
            font-size: 1.14rem;
            height: 3.5rem;
            background: #fff;
            margin-top: 1rem;
            border-radius: 0.5rem;
            &::before {
                content: "";
                height: 1px;
                width: 1.2rem;
                background: $color;
                // transform: scaleY(0.3);
                margin-right: 10px;
            }
            &::after {
                content: "";
                height: 1px;
                width: 1.2rem;
                background: $color;
                // transform: scaleY(0.3);
                margin-left: 10px;
            }
            
        }
        .label{
            background: #fff;
            display: inline-block;
            padding: 0.3rem 0.6rem;
            font-size: 1.14rem;
            margin-right: 1.2rem;
            margin-top: 1.2rem;
            border-radius: 0.3rem;
            // &:hover{
            //     background: $color;
            //     color: #fff;
            // }
        }
        .lab_active{
            background: $color;
            color: #fff;
        }
        .btn{
            color: $color;
            border:1px solid #b3d8ff;
            background: #eef4fa;
            text-align: center;
            margin-top: 1.5rem;
            padding: 0.5rem 0;
            border-radius: 0.4rem;
        }
        
    }
}
/* 搜索历史记录弹框css */
.d_over{
    background: #fff;
    width: 100%;
    height: 100%;
    .sera_card{
        display: flex;
        justify-content: space-between;
        padding: 1.5rem 1rem;
        border-bottom: 1px solid #f1f1f1;
        &>div{
            display: flex;
            align-items: center;
        }
    }
    .clear_all{
        text-align: center;
        margin-top: 1.5rem;
    }
}
</style>
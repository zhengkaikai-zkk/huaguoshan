<template>
    <div id="search">
        <pageHeader style="height: 55px;line-height: 55px;" title="商品列表" v-if="page.categoryId"/>
        <div class="d_header" v-else>
            <div>
                <img @click="$router.go(-1)" src="@/assets/img/back.png" alt="返回">
                <div class="d_search"><van-search placeholder="输入商品名称" v-model="page.productTitle" /></div>
            </div>
            <button @click="search">搜索</button>
        </div>
        <div class="tabs">
            <div :class="sort==1 || sort==-1?'active':''" @click="sortChange(sort==1?-1:1)">
                <span>综合</span>
                <van-icon v-if="sort==1" name="arrow-down" />
                <van-icon v-if="sort==-1" name="arrow-up" />
            </div>
            <div :class="sort==2 || sort==-2?'active':''" @click="sortChange(sort==2?-2:2)">
                <span>销量</span>
                <van-icon v-if="sort==2" name="arrow-down" />
                <van-icon v-if="sort==-2" name="arrow-up" />
            </div>
            <div :class="sort==3 || sort==-3?'active':''" @click="sortChange(sort==3?-3:3)">
                <span>价格</span>
                <van-icon v-if="sort==3" name="arrow-down" />
                <van-icon v-if="sort==-3" name="arrow-up" />
            </div>
            <div>
                <img v-if="isRow" src="@/assets/img/goods/icon-1.png" @click="isRow=false" alt="">
                <img v-if="!isRow" src="@/assets/img/goods/icon-2.png" @click="isRow=true" alt="">
            </div>
        </div>

        
        <van-list v-model="van.loading" :finished-text="van.text" :finished="van.finished" @load="getList()" :error.sync="van.error" error-text="请求失败，点击重新加载">
            <!-- 格子布局 -->
            <div class="shop_list" v-if="isRow">
                <div class="shop_card" v-for="item in list" @click="$router.push('/goods_detail?id='+ item.id)">
                    <li>
                        <van-image width="100%" height="100%" fit="cover" lazy-load :src="item.productCover | fullPath" />
                    </li>
                    <div class="d_card">
                        <p>{{item.productTitle}}</p>
                        <div class="sales">销量{{item.salesVolume}}</div>
                        <div class="d_price">
                            <div v-if="isLogin">
                                <span>￥{{(item.price).toFixed(2)}}</span>&nbsp;
                                <s>￥{{item.originalPrice.toFixed(2)}}</s>
                            </div>
                            <div v-else style="color:#F05447">登录可见</div>
                            <img src="@/assets/img/home/cart.png" alt="">
                            
                        </div>
                    </div>
                </div>
            </div>
        
            <!-- 列表布局 -->
            <div class="d_list" v-if="!isRow">
                <div class="card" v-for="(item,index) in list" @click="$router.push('/goods_detail?id='+item.id)">
                    <div class="shop_img">
                        <van-image width="100%" height="100%" fit="cover" lazy-load :src="item.productCover | fullPath" />
                    </div>
                    <div class="d_card">
                        <p>{{item.productTitle}}</p>
                        <div class="sales">销量{{item.salesVolume}}</div>
                        <div class="d_price">
                            <div v-if="isLogin">
                                <span>￥{{item.price.toFixed(2)}}</span>&nbsp;
                                <s>￥{{item.originalPrice.toFixed(2)}}</s>
                            </div>
                            <div v-else style="color:#F05447">登录可见</div>
                        </div>
                    </div>
                    <div class="cart_img"><img src="@/assets/img/home/cart.png" alt=""></div>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
export default {
    data(){
        return{
            sort: 1,
            isRow: true,   //默认格子布局
            list: [],
            page:{
                keyWord: '',
                productTitle: '',
                oneCategoryId: '',
                categoryId: '',
                sort: 1,
	    		pageNo: 0,
				pageSize: 10,
	    	},
	    	van: {
        		loading: true,
				finished: false,
				error: false,
				text: '没有更多了',
        	},
            isLogin: false,
        }
    },

    methods:{
        //获取列表
        getList(){
            this.page.pageNo ++;
            this.van.loading = true;
            this.page.sort = this.sort;
            this.$request.post({
                url: '/us/productInfo/public/list',
                params: this.page,
                success: res => {
                    if(this.page.type==1){
						this.num = res.list.length;
					}
					res.list.forEach(item => {
						this.list.push(item);
					});
					if(res.list.length==0){
						this.van.text = '暂无商品';
					}
					if(this.page.pageNo >= res.pages){
						this.van.finished = true;
						this.van.loading = false;
					}
                },
                allError: ()=>{
		        	this.page.pageNo --;
					this.van.error = true;
				},
				finally: ()=>{
					this.van.loading = false;
				}
            });
        },

        search(){
            this.sort = 1;
            this.clear();
            this.getList();
        },

        //排序改变时
        sortChange(sort){
            this.sort=sort;
            this.clear();
            this.getList();
        },

        //重置数据
        clear(){
            this.page.pageNo=0;
            this.van.loading = true;
            this.van.finished = false;
            this.van.error = false;
            this.van.text= '没有更多了';
            this.list=[];
        },

        
    },

    mounted(){
        this.isLogin=localStorage.getItem('userToken')? true: false
        this.page.productTitle= this.$route.query.name;
        this.page.keyWord= localStorage.getItem('filtrate');
        localStorage.removeItem('filtrate')
        
        this.page.oneCategoryId= this.$route.query.oneCategoryId;
        this.page.categoryId= this.$route.query.categoryId;
        this.getList();
    }
}
</script>
<style>
#search .return{
    top: 15px!important;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
.d_header{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 0 1rem;
    img{
        height: 1.9rem;
        display: block;
    }
    &>div{
        display: flex;
        align-items: center;
        width: 80%;
    }
    button{
        color: #fff;
        background: $color;
        height: 34px;
        width: 65px;
        border-radius: 4px;
        font-size: 15px;
    }
    .d_search{
        width: 100%;
    }
}
#search{
    padding-top: calc(3.6rem + 55px);
    font-size: 1.4rem;
    color: #9099A8;
}
.tabs{
    position: fixed;
    top: 54px;
    left: 0;
    right: 0;
    z-index: 100;
    background: #fff;
    border-top: 1px solid #f5f5f5;
    padding: 0 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 3.6rem;
    font-size: 1.4rem;
    &>div{
        display: flex;
        align-items: center;
        span{
            margin-right: 0.2rem;
        }
    }
    img{
        width: 1.4rem;
    }
}
.active{
    color: $color;
}
/* --------格子布局-------- */
.shop_list{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 3vw;
    padding-bottom: 2rem;

    &>div:nth-child(2n){
        margin-right: 0;
    }
}
.shop_card{
    width: 45.5vw;
    margin-right: 3vw;
    margin-top: 1rem;
    background: #fff;
    border-radius: 0.6rem;
    overflow: hidden;
    box-sizing: border-box;
    &>li{
        width: 100%;
        height: 45vw;
    }
    .d_card{
        padding: 0 0.5rem;
        p{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            color: #222;
            font-size: 1.33rem;
            margin: 0.6rem 0;
        }
        .sales{
            font-size: 0.95rem;
            letter-spacing: 0;
        }
    }
    .d_price{
        margin-top: 0.3rem;
        margin-bottom: 0.9rem;
        letter-spacing: 0;
        font-size: 0.95rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        & span:first-child{
            font-size: 1.33rem;
            color: $color;
        }
        img{
            width: 2.3rem;
        }
    }
}
/* --------列表布局-------- */
.d_list{
    padding: 0 3vw;
}
.card{
    display: flex;
    align-items: center;
    background: #fff;
    margin-top: 0.9rem;
    padding-right: 3.5vw;
    border-radius: 0.6rem;
    overflow: hidden;
    letter-spacing: 0;
    .shop_img{
        width: 25vw;
        height: 25vw;
        img{
            height: 100%;
            width: 100%;
        }
    }
    .d_card{
        width: 58vw;
        height: 25vw;
        font-size: 1.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0.3rem 0;
        padding-left: 3.5vw;
        box-sizing: border-box;
        &>p{
            color: #222;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp:1;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
        }
        .sales{
            font-size: 0.95rem;
            letter-spacing: 0;
        }
    }
    .d_price{
        letter-spacing: 0;
        font-size: 0.95rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        & span:first-child{
            font-size: 1.33rem;
            color: $color;
        }
    }
    .cart_img{
        img{
            width: 7.5vw;
            display: block;
        }
    }
    
}
</style>
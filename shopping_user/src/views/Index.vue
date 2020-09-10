<template>
    <div id="index">
        <router-view/>
        <footer>
            <ul>
                <router-link to="/home" tag="li" :class="active==0? 'active': ''" @click.native="active = 0">
                    <i class="iconfont">&#xe601;</i>
                    <p>首页</p>
                </router-link>
                <router-link to="/classify" tag="li" :class="active==1? 'active': ''" @click.native="active = 1">
                    <i class="iconfont">&#xe608;</i>
                    <p>分类</p>
                </router-link>
                <router-link to="/cart" tag="li"  :class="active==2? 'active': ''" @click.native="active = 2">
                    <i class="iconfont">&#xe609;</i>
                    <p>购物车</p>
                    <!-- <span v-if="$store.state.orderCartNum>0">{{$store.state.orderCartNum}}</span> -->
                </router-link>
                <router-link to="/my" tag="li" :class="active==3? 'active': ''" @click.native="active = 3">
                    <i class="iconfont">&#xe612;</i>
                    <p>我的</p>
                </router-link>
            </ul>
        </footer>
    </div>
</template>

<script>
export default{
    data(){
        return{
            active: 0,
        }
    },
    methods:{
    	
    },
    mounted() {
	    if(this.$route.path=='/home'){
			this.active=0
		}else if(this.$route.path=='/classify'){
			this.active=1
		}else if(this.$route.path=='/cart'){
			this.active=2
        }else if(this.$route.path=='/my'){
			this.active=3
        }
        var token = localStorage.getItem("userToken");
        if(token){
        	if(!this.$store.state.all.user.id){
                // this.$store.commit('info');
                this.$store.dispatch('all/setUser');
        	}
        }
	},
    watch:{
    	$route(to, from){
    		if(to.path=='/home'){
    			this.active=0
    		}else if(to.path=='/classify'){
    			this.active=1
    		}else if(to.path=='/cart'){
    			this.active=2
    		}else if(to.path=='/my'){
    			this.active=3
    		}
    	},
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';

#index{
    padding-bottom: 5.1rem;
    footer{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        font-size: 1rem;
        border-top: 1px solid #e5e5e5;
        z-index: 99;
        padding: 0 1.2rem;
        ul{
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 5rem;
            padding-top: 0.3rem;
            padding-bottom: 0.2rem;
            li{
                position: relative;
                text-align: center;
                color: #C0C8D3;
                width: 100%;
                i{
                    font-size: calc(1.7rem + 15px);
                }
                p{
                    // margin-top: 0.1rem;
                }
            }
        }
    }
    .label{
        position: relative;
        span{
            position: absolute;
            top: -0.5rem;
            right: 1.2rem;
            display: inline-block;
            background: #fda807;
            border-radius: 50%;
            height: 1.5rem;
            width: 1.5rem;
            line-height: 1.5rem;
            font-size: 1rem;
            // padding: 0.1rem 0.1rem;
            text-align: center;
        }
    }
    .active{
        color: $color;
    }
}
</style>

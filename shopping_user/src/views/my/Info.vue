<template>
    <div id="info">
        <pageHeader/>
        <div class="avatar" @click="openCropper">
            <div>
                <van-image width="100%" height="100%" fit="cover" v-if="avatar" :src="avatar | fullPath" />
            </div>
            <span>请选择头像<van-icon name="arrow" /></span>
            <input id="fileInput" @change="change($event)" type="file" accept="image/*;capture=camera" style="display: none"/>
        </div>
        <div class="d_nick">
            <span>昵称</span>
            <input type="text" v-model="nick" maxlength="10" placeholder="请输入昵称 (10字符以内)">
        </div>
        <div class="btn">
            <van-button round type="info" :loading="btnLoad" loading-text="提交中..." @click="update" block>确认修改</van-button>
        </div>

        <image-cropper 
			ref="imageCropper"
			:cropperConfig="{
			 	width: 1,
			    height: 1,
			    quality: 0.6,
			    maxWidth: 2000
			}" 
			:callback="loadImage">
		</image-cropper>
    </div>
</template>

<script>
import ImageCropper from '@/components/image_cropper/ImageCropper'

export default {
    components:{
        ImageCropper
    },
        
    data(){
        return{
            avatar: '',
            nick: '李木子',
            btnLoad: false,
        }
    },

    methods:{
        // 裁剪回调
        loadImage(baseCode){
            this.avatar = baseCode;
        },
        openCropper(){
            this.$refs.imageCropper.checkPhoto()
        },

        //修改个人信息
        update(){
            if(!this.avatar){ this.$toast.fail('头像不能为空'); return;  }
            if(!this.nick){ this.$toast.fail('昵称不能为空'); return;  }
            this.btnLoad=true;
            this.$request.post({
                url: '/us/info/update',
                params: {
                    avatar: this.avatar,
                    nick: this.nick
                },
                success: res => {
                    this.$toast.success('修改成功');
                	sessionStorage.removeItem('userInfo');
                	this.$router.push('/my');
				},
				finally: () => {
                    this.btnLoad=false
                }
            })
        },

        detail(){
        	this.$request.post({
                url: '/us/info/details',
                params: {},
                success: res => {
                    this.nick=res.usInfo.nick;
                    this.avatar=res.usInfo.avatar;
				},
				finally: () => {
                }
            })
        },
    },

    mounted(){
        this.detail();
    }
}
</script>

<style lang="scss">
@import '@/assets/css/public.scss';
#info .van-radio__icon--checked .van-icon{
    background-color: $color;
    border-color: $color;
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#info{
    padding-top: 4.6rem;
    font-size: 1.4rem;
}
.avatar{
    background: #fff;
    margin-top: 0.9rem;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #F6F6F6;
    span{
        color: #C0C8D3;
        display: flex;
        align-items: center;
    }
    &>div{
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 50%;
        overflow: hidden;
    }   
}
.d_nick{
    background: #fff;
    padding: 1rem;
    color: #333;
    &>span{
        letter-spacing: 1.5rem;
        margin-right: 1rem;
    }
    input{
        border: none;
        width: 22rem;
    }
}
.btn{
    text-align: center;
    margin-top: 2.5rem;
    padding: 0 5rem;
    button{
        font-size: 1.6rem;
        height: 3.8rem;
        background-color: $color;
        border: 1px solid $color;
    }        
}
</style>
<template>
    <div v-show="show" id="cropper_img">
        <div class="cropper_box">
            <img id="image" :src="imgUrl?imgUrl:sampleImg">
        </div>
        <div class="btns">
            <input @click="reelect" class="btn_border" type="button" value="重选">
            <input @click="crop" class="btn_background" type="button" value="裁剪">
        </div>
    </div>
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import sampleImg from '@/assets/img/leave.jpg'
export default {
    name:'cropperImg',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        imgUrl: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            cropper: {},
            returnImg: '',
            sampleImg,
        }
    },
    methods:{
        init(){
            const image = document.getElementById('image');
            this.cropper = new Cropper(image, {
            aspectRatio: 1 / 1,
            viewMode: 3,
            dragMode: 'move',
            cropBoxMovable: false,
            cropBoxResizable: false,
            minCropBoxWidth: 10000,
            minCropBoxHeight: 10000,
            });
        },
        crop(){
            //base64
            this.returnImg = this.cropper.getCroppedCanvas({
                minWidth: 250,
                minHeigth: 250,
                maxWidth: 2048,
                maxHeight: 2048,
                fillColor: '#fff',
                imageSmoothingEnabled: false,
                imageSmoothingQuality: 'high'}).toDataURL('image/jpeg');
            this.$emit('returnImg',this.returnImg);
            //Blob
            this.cropper.getCroppedCanvas().toBlob((blob) => {
                console.log(blob);
            });
            // 解除滚动条锁定
			// document.body.classList.remove('modal-open');
			// document.scrollingElement.scrollTop = this.scrollTop;
        },
        // 重选图片
        reelect(){
            this.$emit('reelect');
        },
        afterOpen() {
			this.scrollTop = document.scrollingElement.scrollTop;
			document.body.classList.add('modal-open');
			document.body.style.top = -this.scrollTop + 'px';
		},
    },
    watch:{
        // cropperShow(newVal,oldVal){
		// 	if(newVal == true){
		// 		this.afterOpen();
		// 	}
		// },
        imgUrl(newVal){
            this.cropper.replace(newVal);
        }
    },
    created(){},
    mounted(){
        this.init();
    }
}
</script>

<style scoped>
#cropper_img{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.7);
    overflow: hidden;
    z-index: 1000;
}
.cropper_box{
    width: 80vw;
    height: 80vw;
    margin: 0 auto;
    margin-top: 10vw;
}
.btns{
    display: flex;
    justify-content: center;
    margin-top: 10vw;
}
.btns input{
    width: 8rem;
    height: 3rem;
    font-size: 1.4rem;
    letter-spacing: 0.5rem;
    padding-left: 0.5rem;
}
.btns input:first-child{
    margin-right: 2rem;
}
</style>
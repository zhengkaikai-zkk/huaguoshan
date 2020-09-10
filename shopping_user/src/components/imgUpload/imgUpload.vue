<template>
	<div :id="id" class="imgUploadBox">
		<div @click="toChange" v-if="imgList.length < maxlength && upload" class="imgUpload">
			<div class="see">
				<img src="./img/imgupload.png"/>
			</div>
			<input @click="fileClick($event)" id="fileInput" @change="change($event)" :multiple="multiple" type="file" accept="image/*" />
		</div>
		<div v-for="(item,index) in imgList" v-if="imgList.length > 0" :key="index" class="imgItem">
			<div class="see">
				<img src="./img/imgupload.png"/>
			</div>
			<van-image
			width="100%"
			height="100%"
			fit="cover"
			lazy-load
			:src="item"
			/>
			<div @click.stop="remove(index)" class="remove">
				<img src="./img/remove.png" alt="删除">
				<span>删除</span>
			</div>
		</div>
	</div>
</template>

<script>
import imgUtils from '@/utils/img_utils.js'
import lrz from 'lrz';
export default{
	name: 'imgUpload',
	props:{
		imgList: {
			type: Array,
		},
		maxlength: {
			type: Number,
			default: 3
		},
		needOriginal: {
			type: Boolean,
			default: false
		},
		upload: {
			type: Boolean,
			default: true
		}
	},
	data(){
		return{
			inputShow: true,
			multiple: false,
			urlList: [],
			id: ''
		}
	},
	mounted(){
		this.id = 'up' + this._uid;
	},
	methods:{
		toChange(){
			// if(window.android != undefined){
			// 	window.android.usePhoto(this.maxlength);
			// }else{
				document.querySelector('#' + this.id + ' #fileInput').click();
			// }
			// $('#' + this.id + ' #fileInput').trigger('click');
		},
		fileClick(e){
			if(window.android != undefined){
				window.android.usePhoto(this.maxlength);
			}
		},
		change(e){
			var _this = this;
			var files = e.target.files || e.dataTransfer.files
	        if (!files.length) return
	        if(_this.multiple){
	        	if(_this.imgList.length + files.length > _this.maxlength){
					this.$toast.fail('最多上传' + _this.maxlength + '张图片');
	        		return;
	        	}
	        	if(_this.imgList.length + files.length == _this.maxlength){
	        		_this.inputShow = false;
				}
				// 压缩
	        	for(let item of files){
					if(this.needOriginal && item.size > 15*1024*1024){
						this.$toast('上传图片不得大于15M');
						return;
					}
	        		lrz(item,{
						quality: 0.5,
					})
			        .then(function (rst) {
			            // 处理成功会执行
						_this.$emit('change',rst.base64);
			        })
			        .catch(function (err) {
			            // 处理失败会执行
			        })
			        .always(function () {
			            // 不管是成功失败，都会执行
			        });
				};
				//原图
				if(!this.needOriginal) return;
				for(let item of files){
					imgUtils.toBase64(item,(result) => {
						_this.$emit('original',result);
					})
				}
	        }else{
				if(this.needOriginal && files[0].size > 15*1024*1024){
					this.$toast('上传图片不得大于15M');
					return;
				}
				// 压缩
	        	lrz(files[0],{
						quality: 0.5,
					})
		        .then(function (rst) {
		            // 处理成功会执行
		            _this.$emit('change',rst.base64);
		        })
		        .catch(function (err) {
		            // 处理失败会执行
		        })
		        .always(function () {
		            // 不管是成功失败，都会执行
		        });
				if(!this.needOriginal) return;
				//原图
				imgUtils.toBase64(files[0],(result) => {
					_this.$emit('original',result);
				})
	        }
		},
		remove(index){
			this.$emit('remove',index);
			if(this.imgList.length < this.maxlength){
				this.inputShow = true;
			}
		}
	},
	watch:{
		// imgList(newVal,oldVal){
		// 	if(newVal.length >= this.maxlength){
		// 		this.inputShow = false;
		// 	}
		// }
	},
	created(){
		var u = navigator.userAgent;
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if(window.android || isiOS){
			this.multiple = true;
		}else{
			this.multiple = false;
		}
	}
}
</script>

<style scoped>
.imgUploadBox{
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}
.imgUpload{
	position: relative;
	border-radius: 3px;
	box-sizing: border-box;
	width: 23%;
	margin-right: 2.6%;
	border-radius: 5px;
	background: #fff;
}
.imgUpload:nth-child(3n){
	margin-right: 0;
}
.imgUpload .see img{
	pointer-events: none;
}
.see{
	width: 100%;
}
.see img{
	width: 100%;
	display: block;
}
.imgUpload .show{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.imgUpload .show img{
	width: 100%;
	height: 100%;
	display: block;
}
.imgUpload input{
	display: none;
}
.imgItem{
	width: 23%;
	margin-right: 2.6%;
	margin-top: 1rem;
	position: relative;
	border-radius: 5px;
	overflow: hidden;
}
.imgItem:nth-child(4n){
	margin-right: 0;
}
.imgItem:nth-child(1),
.imgItem:nth-child(2),
.imgItem:nth-child(3),
.imgItem:nth-child(4){
	margin-top: 0;
}
.imgItem .van-image{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 3px;
}
.imgItem .remove {
	width: 100%;
	position: absolute;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 1rem;
	padding: 0.3rem 0;
}
.imgItem .remove img {
	height: 1rem;
	display: block;
	margin-right: 2px;
}
</style>
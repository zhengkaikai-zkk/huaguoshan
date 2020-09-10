<template>
	<span>{{time}}</span>
</template>

<script>
export default{
	name: 'countTime',
	props: {
		startTime: {
			default: ''
		},
		dayNum: {
			type: Number,
			default: '1'
		}
	},
	data(){
		return{
			timeId: '',
			time: '',
		}
	},
	methods: {
		outTime(publishTime,dayNum){
			var _this = this;
			if(typeof(publishTime) == 'string'){
				publishTime = publishTime.replace(/-/g, '/');
				if(new Date(publishTime).getTime() + 86400000 * dayNum <= new Date().getTime()){
					_this.time = '';
				}else{
					// console.log(window.time1)
					if(window.time1) {
						clearInterval(window.time1)
						window.time1 = this.setInterval1(publishTime,dayNum);
					} else {
						window.time1 = this.setInterval1(publishTime,dayNum);
					}
				}
			}else if(typeof(publishTime) == 'number'){
				if(publishTime + 86400000 * dayNum <= new Date().getTime()){
					_this.time = '';
				}else{
					if(window.time1) {
						clearInterval(window.time1)
						window.time1 = this.setInterval2(publishTime,dayNum);
					} else {
						window.time1 = this.setInterval2(publishTime,dayNum);
					}
				}
			}
		},
		setInterval1(publishTime,dayNum){
			return setInterval(() => {
				var threeDays = 86400000 * dayNum;
				var remainTime = new Date(publishTime).getTime() + threeDays - new Date().getTime();
				if(remainTime <= 0){
					this.time = "0天 00:00:00";
				}else{
					var day = parseInt(remainTime/1000/3600/24);
					var hours = this.$common.getzf(parseInt(remainTime/1000/3600%24));
					var mine = this.$common.getzf(parseInt(remainTime/1000/60%60));
					var srend = this.$common.getzf(parseInt(remainTime/1000%60));
					this.time = day + '天 ' + hours + ':' + mine + ':' + srend;
				}
			},1000);
		},
		setInterval2(publishTime,dayNum) {
			return setInterval(() => {
				var threeDays = 86400000 * dayNum;
				var remainTime = publishTime + threeDays - new Date().getTime();
				if(remainTime <= 0) {
					this.time = "0天 00:00:00";
				} else {
					var day = parseInt(remainTime/1000/3600/24);
					var hours = this.$common.getzf(parseInt(remainTime/1000/3600%24));
					var mine = this.$common.getzf(parseInt(remainTime/1000/60%60));
					var srend = this.$common.getzf(parseInt(remainTime/1000%60));
					this.time = day + '天 ' + hours + ':' + mine + ':' + srend;
				}
			},1000);
		}
	},
	watch: {
		startTime(newVal,oldVal){
			this.outTime(this.startTime,this.dayNum);
		}
	},
	created(){
		this.timeId = 'time_' + this._uid;
		this.outTime(this.startTime,this.dayNum);
	}
}
</script>

<style scoped>

</style>
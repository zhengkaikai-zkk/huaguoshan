import Vue from 'vue'
import vuex from 'vuex'
import axios from '../http.js'
import all from '@/store/all/modules'

Vue.use(vuex);

export default new vuex.Store({
	modules:{
		all
	}
    // state:{
    // 	balance: 0,//余额
    // },
    // mutations: {
    // 	//this.$store.commit('wallet');
    // 	wallet(state){
    // 		console.log(this)
	// 		axios.post('/agent/wallet/show').then(function(res){
	// 			var data = res.data;
	// 			if(res.data.message == 'succ'){
	// 				state.balance = data.result.balance;
	// 			}
	// 		}).catch(function(error){
	// 			console.log(error)
	// 		})
    // 	}
    // }
})
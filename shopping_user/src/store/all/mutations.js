//包含多个更新state 函数的对象
import request from '../../utils/request'
import { Toast } from 'vant'

export default{
	// 更新状态
	SETLOADING(state, loading){
		state.loading = loading
	},
	
	SETLOADTEXT(state, loadText){
		state.loadText = loadText
	},
	
	SETUSER(state){
		if(!localStorage.getItem('userToken')){
			return
		}
		request.post({
			url: '/us/info/details',
			success: res => {
				state.user = res.usInfo;
				state.wallet = res.usWallet;
				state.isRead= res.messages;
				// state.wechatNick=res.wechatNick;
				// state.isBindWechat=res.isBindWechat;
				state.exclusiveDiscount= res.exclusiveDiscount;
				localStorage.setItem('usInfo', JSON.stringify(res.usInfo))
				localStorage.setItem('vip', res.exclusiveDiscount)
			},
			error: err => {
				if(err=='拒绝访问'){
					localStorage.removeItem('userToken')
				}
			},
			
		});
	},

	// SETNUMS(state){
	// 	request.post({
	// 		url: 'admin/index/data',
	// 		success: res => {
	// 			state.nums = res;
	// 		},
	// 		error: err => {
	// 			message.error(err);
	// 		}
	// 	});
	// },
	
	
	
}
 
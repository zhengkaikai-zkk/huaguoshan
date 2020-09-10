import axios from '@/http'
import { Toast } from 'vant';
// import notify from '@/components/utils/notification/index.js'

/**
 * 常规 axios 操作封装
 */
export default{
	/** 
	 * @url: 路径
	 * @params: 参数
	 * @headers: 请求头
	 * @success: 成功的回调
	 * @error: 失败的回调
	 * @then: 请求成功的回调
	 * @catch: 请求失败的回调
	 * @finally: 请求成功或者失败的回调
	 */
	post(data){
		Toast.allowMultiple();
		let qs = require('qs')
		let params = data.type == "array"? qs.stringify(data.params, {arrayFormat: 'repeat'}) : (Object.prototype.toString.call(data.params) == '[object FormData]' ? data.params : qs.stringify(data.params) );
		let headers = data.headers == "form-data" ? {headers: {"Content-Type": "multipart/form-data"}} : data.headers;
		
		var r = axios.post(data.url, params, headers)
		
		r.then(response=>{
			if(response.data.message == "succ"){
				if(data.success) data.success(response.data.result, response);
			}else if(response.data.message == "error"){
				if(!data.closeErrInfo) Toast(response.data.result)
				if(data.error) data.error(response.data.result, response);
				if(data.allError) data.allError(response);
			}else if(response.data.message == "info"){
				if(!data.closeInfo) Toast(response.data.result)
				if(data.info) data.info(response.data.result, response);
			}else if(response.data.message == "warning"){
				if(!data.closeWarningInfo) Toast(response.data.result)
				if(data.warning) data.warning(response.data.result, response);
			}
			
			// 请求成功的回调
			if(data.then) data.then(response);
			
			if(data.finally) data.finally();
		})
		
		r.catch(error=>{
			console.log(error)
			if(data.finally) data.finally();
			// 请求失败的回调函数
			if(data.catch) data.catch(error);
			if(data.allError) data.allError(error);
			
			if(!data.closeCodeInfo){	
				if(error.response && error.response.status){
					// 状态码处理
					switch(error.response.status){
						case 401:
							break;
						case 404:
							Toast('请求错误')
							break;
						case 403:
							Toast('无权访问')
							break;
						case 413:
							Toast('请求实体内容过大, statusCode:'+error.response.status)
							break;
						case 500:
							Toast('系统异常')
							break;
						case 504:
							Toast('无法连接服务器')
							break;
						default:
							Toast('发生错误, statusCode:'+error.response.status)
							break;
					}
				}else if(error.code){
					switch(error.code){
						case "ECONNABORTED":
							Toast("请求超时, 网络不给力哦")
							break;	
						default: 
							Toast('发生错误, errorCode:'+error.code)
							break;
					}
				}
			}
		})
	}
}

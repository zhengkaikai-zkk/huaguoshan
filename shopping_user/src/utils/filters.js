import common from '@/utils/common.js'

/**
 * 过滤图片路径
 * @return 绝对路径
 */
const fullPath = function(value){
	if(value && value.search('/files/') != -1){
		var result = common.getUrl() + value
		return result;
	}
	return value;
}

/**
 * 图片懒加载过滤器
 * @return 绝对路径
 */
const lazyLoad = function(value){
	var host = document.location.host;
	var result = "";
	if(value.src && (value.src.search('upload/') != -1||value.src.search('resources/') != -1)){
		if(host.search('www.') != -1||host.search('backend.') != -1 ){
			result = document.location.protocol + "//" + host + '/' + value
		}else{
			host = '192.168.0.22:8083/'
			result = document.location.protocol + "//" + host + value.src
		}
	}else if(value.src && value.src.search('upload/') == -1&&value.src.search('resources/') == -1){
		result = value.src;
	}
	value.src = result
}


export {
	fullPath,
	lazyLoad
};

import proxyConfig from './proxyConfig.js'
import common from '../utils/common.js';

/**
 * 过滤图片路径
 * @return 绝对路径
 */
const fullPath = function(value){
	var result = common.getUrl() + value;
	return result;
}

/**
 * 图片懒加载过滤器
 * @return 绝对路径
 */
const lazyLoad = function(value){
	value.src = proxyConfig.serviceUrl + value
}


export {
	fullPath,
	lazyLoad
};

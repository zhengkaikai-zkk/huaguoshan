/**
 * 封装一些提示框
 */
import { Notification } from 'element-ui'

export default {
	
	/** 
	 * 默认消息
	 * @title 标题, 默认 '提示'
	 * @msg 显示的消息内容
	 * @time 显示时间, 默认0 不会自动关闭
	 * @position 弹出位置, 默认右上角
	 * @offset 元素偏移, 默认20
	 */
	TRNotification(opertions) {
		Notification({
			title: opertions.title ? opertions.title : '提示',
			message: opertions.msg,
			duration: opertions.time ? opertions.time : 0,
			position: opertions.position ? opertions.position : 'bottom-right',
			offset: opertions.offset ? opertions.offset : 20
		})
	},
	
	/**
	 * 成功
	 * @title 标题, 默认 '成功'
	 * @msg 显示的消息内容
	 * @type 消息类型
	 * @time 显示时间, 默认0 不会自动关闭
	 * @position 弹出位置, 默认右上角
	 * @offset 元素偏移, 默认20
	 */
	success(opertions){
		Notification({
			title: opertions.title ? opertions.title : '成功',
			message: opertions.msg,
			type: 'success',
			duration: opertions.time ? opertions.time : 0,
			position: opertions.position ? opertions.position : 'bottom-right',
			offset: opertions.offset ? opertions.offset : 20
		})
	},
	
	/**
	 * 失败
	 * @title 标题, 默认 '失败'
	 * @msg 显示的消息内容
	 * @type 消息类型
	 * @time 显示时间, 默认0 不会自动关闭
	 * @position 弹出位置, 默认右上角
	 * @offset 元素偏移, 默认20
	 */
	error(opertions){
		Notification({
			title: opertions.title ? opertions.title : '失败',
			message: opertions.msg,
			type: 'error',
			duration: opertions.time ? opertions.time : 0,
			position: opertions.position ? opertions.position : 'top-right',
			offset: opertions.offset ? opertions.offset : 20
		})
	},
	
	/**
	 * 警告
	 * @title 标题, 默认 '警告'
	 * @msg 显示的消息内容
	 * @type 消息类型
	 * @time 显示时间, 默认0 不会自动关闭
	 * @position 弹出位置, 默认右上角
	 * @offset 元素偏移, 默认20
	 */
	warning(opertions){
		Notification({
			title: opertions.title ? opertions.title : '警告',
			message: opertions.msg,
			type: 'warning',
			duration: opertions.time ? opertions.time : 0,
			position: opertions.position ? opertions.position : 'top-right',
			offset: opertions.offset ? opertions.offset : 20
		})
	},
	
	/**
	 * 带html代码片段
	 * @title 标题, 默认 '成功'
	 * @dangerouslyUseHTMLString: true 传入html 片段
	 * @msg 显示的消息体
	 * @type 消息类型, 默认为 'success'
	 * @time 显示时间, 默认0 不会自动关闭
	 * @position 弹出位置, 默认右上角
	 * @offset 元素偏移, 默认20
	 */
	messageHtml(opertions){
		Notification({
			title: opertions.title ? opertions.title : '成功',
			dangerouslyUseHTMLString: true,
			message: opertions.msg,
			type: opertions.type ? opertions.type : 'success',
			duration: opertions.time ? opertions.time : 0,
			position: opertions.position ? opertions.position : 'top-right',
			offset: opertions.offset ? opertions.offset : 20
		})
	}
	
}
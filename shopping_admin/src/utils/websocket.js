import Vue from 'vue'
import stomp from 'stompjs'
import SockJS from "sockjs-client";

var single = (function() {
	var socket, timer, stompClient
	// var url = 'http://localhost:8081/mdj_service/ws/webSocketServer';
	var url = 'https://www.madoujiang.com/ws'
	
	var unique = {
		isConnection: false,	// 判断是否连接成功
		
		init() {
			this.connection();
		},

		// 断线重连机制
		initWebSocket() {
			this.connection();
			// 断开重连机制,尝试发送消息,捕获异常发生时重连
			this.timer = setInterval(() => {
				try {
					// this.stompClient.send("/queue/test");
				} catch(err) {
					console.log("断线了: " + err);
					this.connection();
				}
			}, 20000);
		},

		removeTab(targetName) {
			console.log(targetName)
		},

		connection(data) {
			if(!socket){
				// 建立连接对象  
				//	this.socket = new SockJS(' ( ip:端口号  或  域名 ) / 项目名 /ws/webSocketServer'); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
				socket = new SockJS(url)	
				// 获取STOMP子协议的客户端对象
				stompClient = Stomp.over(socket);
				this.isConnection = true
				var interval = setInterval(()=>{
					if(stompClient.ws.onclose){
						clearInterval(interval)
// 						stompClient.ws.onclose(()=>{
// 							console.log('连接断开了')
// 							this.connection()
// 						})
					}
				}, 1000)
// 				stompClient.ws.onclose(()=>{
// 					setTimeout(()=>{
// 						this.connection();
// 					}, 2000)
// 				})
			}
		},
		
		// 订阅消息
		subscribe(...data){
			// 定义客户端的认证信息,按需求配置
			var headers = {
				// additional header
				username: 'admin',
				password: 'admin',
				'client-id': 'my-client-id'
			};
			// 向服务器发起websocket连接
			stompClient.connect({}, ()=>{
				data.forEach(item=>{
					stompClient.subscribe(item.destination, (msg)=>{
						item.result(msg)
					})
				})
			}, e => {
				console.log(e)
			});
		},
		
		// 发送消息
		send(msgName, content){
			if(!socket){
				// 建立连接对象  
				//	this.socket = new SockJS(' ( ip:端口号  或  域名 ) / 项目名 /ws/webSocketServer'); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
				socket = new SockJS(url);
				// 获取STOMP子协议的客户端对象
				stompClient = Stomp.over(socket);
				stompClient.send(msgName, {}, content);
			}else{
				stompClient.send(msgName, {}, content);
			}
		},
		
		disconnect() {
			if(stompClient != null) {
				stompClient.disconnect();
				console.log("Disconnected");
			}
		},

		beforeDestroy() {
			// 页面离开时断开连接,清除定时器
			disconnect();
			clearInterval(timer);
		}
	}
	unique.init();
	
	return unique;
	
})();

export default single;

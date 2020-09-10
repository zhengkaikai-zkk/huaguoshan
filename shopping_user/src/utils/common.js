import { Toast } from 'vant';
export default {
	
	timer:null,

	/**
	 *********
	 *********
	 * 表单验证方法
	 *********
	 *********
	 */


	// 验证手机号
	isPhone(phone){
		var reg=/^1[3-9]\d{9}$/;
		if(reg.test(phone)){
			return true;
		}else{
			return false;
		}
	},

	/**
	 *********
	 *********
	 * 操作cookie方法
	 *********
	 *********
	 */

	//删除a数组中与b数组中相同的元素，并返回剩余元素
	contrast(arrA,arrB){
		let arrReturn = arrA.filter(e => {
			return arrB.indexOf(e) < 0; 
		});
		return arrReturn;
	},

	// 设置cookie
	setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		console.info(cname + "=" + cvalue + "; " + expires);
		document.cookie = cname + "=" + cvalue + "; " + expires;
		console.info(document.cookie);
	},
	// 获取cookie
	getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while(c.charAt(0) == ' ') c = c.substring(1);
			if(c.indexOf(name) != -1) return c.substring(name.length, c.length);
		}
		return "";
	},
	// 删除cookie方法
	deleteCookie(key){ 
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime()-10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" +date.toGMTString();//设置cookie
    },

	/**
	 *********
	 *********
	 * 其他方法
	 *********
	 *********
	 */

	// 手机号加密
	encryptPhone(phone){
		return phone.substring(0,3) + '****' + phone.substring(7,11);
	},

	// 获取链接中的参数
	getQueryVariable(url,variable){
		var num=url.indexOf("?")
		var query = url.substr(num+1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if(pair[0] == variable){return pair[1];}
		}
		return(false);
	},

	//---------点击复制---------------
	copy(val){
		var input = document.createElement("input");
		input.value = val;
		document.body.appendChild(input);
		input.select();
		input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
		document.body.removeChild(input);
		window.scrollTo(0,0);
		Toast.success('复制成功');
		// return true;
	},

	// html解码
	htmlDecodeByRegExp(str){  
		var s = "";
		if(str.length == 0) return "";
		s = str.replace(/&amp;/g,"&");
		s = s.replace(/&lt;/g,"<");
		s = s.replace(/&gt;/g,">");
		s = s.replace(/&nbsp;/g," ");
		s = s.replace(/&#39;/g,"\'");
		s = s.replace(/&quot;/g,"\"");
		return s;  
	},

	// 判断数据原型类型
	prototype(obj, type){
		if(Object.prototype.toString.call(obj) == '[object '+type+']'){
			return true;
		}else{
			return false;
		}
	},

	//数字格式化
	//若没超过1万每隔三位小数加逗号
	//超过1万保留一位小数 *.*w
	arrangeNum(num) {
		if((num + '').length > 4){
			var newNum = (num/10000).toFixed(1) + 'w+';
			return newNum;
		}else{
			var num = (num || 0).toString();
			var result = '';
			while (num.length > 3) {
				result = ',' + num.slice(-3) + result;
				num = num.slice(0, num.length - 3);
			}
			if (num) { result = num + result; }
			return result;
		}
	},
	
	// 防抖
	debounce(callback, delay){
		var th = this;
        var args = arguments;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(function () {
            this.timer = null;
            callback();
        }, delay);
	},
	
	// 根据经纬度计算两点之间的距离
	getFlatternDistance(lat1,lng1,lat2,lng2){
		var f = getRad((lat1 + lat2)/2);
		var g = getRad((lat1 - lat2)/2);
		var l = getRad((lng1 - lng2)/2);
		var sg = Math.sin(g);
		var sl = Math.sin(l);
		var sf = Math.sin(f);
		var s,c,w,r,d,h1,h2;
		var a = EARTH_RADIUS;
		var fl = 1/298.257;
		sg = sg*sg;
		sl = sl*sl;
		sf = sf*sf;
		s = sg*(1-sl) + (1-sf)*sl;
		c = (1-sg)*(1-sl) + sf*sl;
		w = Math.atan(Math.sqrt(s/c));
		r = Math.sqrt(s*c)/w;
		d = 2*w*a;
		h1 = (3*r -1)/2/c;
		h2 = (3*r +1)/2/s;
		return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
	},

	//获取html中的第一张图片
	filterImg(html) {
		var imgReg = /<img.*?(?:>|\/>)/gi;
		var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
		var arr = html.toString().match(imgReg);
		return arr && arr[0] ? arr[0].match(srcReg)[1].replace(this.getUrl(), '') : '';
	},

	getUrl(){
		var host = document.location.host;
		var result = "";
		if(host.search('www.') != -1 ){
			result = document.location.protocol + "//" + host
		}else{
			host = '192.168.0.150:8090'
			result = document.location.protocol + "//" + host
		}
		return result;
	},

	//--------日期转换-----------
	//xxxx-xx-xx xx:xx:xx
	getDate(str) {
		if(str == "" || str == null) {
			return "";
		}
		if(typeof(str) == 'string'){
			str = str.replace(/-/g, '/');
		}
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen); //最后拼接时间  
		return oTime;
	},

	//xxxx-xx-xx
	getDay(str) {
		if(str == "" || str == null) {
			return "";
		}
		if(typeof(str) == 'string'){
			str = str.replace(/-/g, '/');
		}
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay); //最后拼接时间  
		return oTime;
	},

	//补0操作  
	getzf(num) {
		if(parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	},

	//格式化银行卡
	formatBankCard(str){
		var arr=[];  
		for(var i=0;i<str.length;i++){
			arr.push(str.charAt(i))  
		}
		var str1='';
		arr.forEach((item,index) => {
			if(index%4==0){
				str1=str1+' '+item
			}else{
				str1=str1+item
			}
			
		});
		return str1
	},
	//银行卡加密
	lockBankCard(str){
		if(!str) return
		let str1=str.substr(-4);
		return '**** **** **** **** '+str1
	}
	
}
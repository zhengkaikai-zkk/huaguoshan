export default {

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
     *  验证手机号中国(严谨), 根据工信部2019年最新公布的手机号段
     * @param { string } value
     */
    isPhoneStrict(phone){
		var reg=/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g;
		if(reg.test(phone)){
			return true;
		}else{
			return false;
		}
    },

	// 数字和字母
	numandenglish(str){
		var reg=/^[A-Za-z0-9]+$/;
		if(reg.test(str)){
			return str;
		}else{
			return str.replace(/[^\w\.\/]/ig,'')
		}
	},
	// 验证邮箱
	isEmail(email){
		var reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if(reg.test(email)){
			return true;
		}else{
			return false;
		}
	},

	// 验证非中文
	noChinese(text){
		var reg=/^[\u4e00-\u9fa5]{0,}$/;
		if(reg.test(text)){
			return '';
		}else{
			return text;
		}
	},

	//验证正整数(不含零)
	isInteger(num){
		var reg=/^[1-9]\d*$/;
		if(reg.test(num)){
			return num;
		}else{
			return num.replace(/[^\d]/g,'');
		}
	},

	// 验证正数(不含零)
	// 可在keyup方法中使用
	// num 需要验证的数字
	// min 需要限制的最小值
	// max 需要限制的最大值
	isPositive(num,min,max){
		var reg=/^\d+(\.\d+)?$/;
		// 小数点出现次数
		var n = (num.split('.')).length-1;
		// 小数点不止出现一次
		if (n > 1) {
			
			return num.substr(0, num.length - 1);

		}
		// 判断最后一位为小数点
		if (num.indexOf(".") != -1 && num.indexOf(".") == (num.length - 1)) {
			
			if (num.length > 1) {
				return num;
			} else {
				return ''
			}

		} 
		// 最后一位不是小数点，判断是否为数字,判断小数位数
		else if(reg.test(num)){

			if(min && Number(num)< min) return min;
			if(max && Number(num)> max) return max;
			// 小数点后位数大于2,返回两位小数
			if (num.indexOf(".") != -1 && num.split('.')[1].length > 2) {
				return Number(num).toFixed(2);
			}
			if(Number(num)>= 0) return num;
			return '';

		}
		// 不纯为数字,清空并返回空
		else{

			return num.replace(/[^\d(\.\d)?$]/g,'');

		}
	},

	// 验证链接
	isLink(link){
		if(link.indexOf('https://') == -1 && link.indexOf('http://') == -1){
			return false;
		}else{
			return true;
		}
    },

    /**
     *  验证银行卡号（10到30位, 覆盖对公/私账户, 参考微信支付）
     * @param { string } value
     */
    isBanktNumber(value){
        if (/^[1-9]\d{9,29}$/g.test(value)) {
            return value;
        } else {
            return '';
        }
    },

    /**
     *  验证座机电话(国内),如: 0341-86091234
     * @param { string } value
     */
    isLandlineTelephone(value){
        if (/\d{3}-\d{8}|\d{4}-\d{7}/g.test(value)) {
            return value;
        } else {
            return '';
        }
    },

    /**
     *  身份证号, 支持1/2代(15位/18位数字)
     * @param { string } value
     */
    isIDCard(value){
        if (/(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/g.test(value)) {
            return value;
        } else {
            return '';
        }
    },

    /**
     *  验证护照（包含香港、澳门）
     * @param { string } value
     */
    isPassport(value){
        if (/(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/g.test(value)) {
            return value;
        } else {
            return '';
        }
    },

}
export default {
    // 根据生日算年龄
    getAge(str){
        if(str == "" || str == null) {
            return "";
        }
        if(typeof(str) == 'string'){
            str = str.replace(/-/g, '/');
        }
        var birthday = new Date(str);
        var today = new Date(); 
        var age = today.getFullYear()-birthday.getFullYear()-((today.getMonth()<birthday.getMonth()|| today.getMonth()==birthday.getMonth() && today.getDate()<birthday.getDate())?1:0);
        return age;
    },


    // --------日期转换-----------
    // xxxx-xx-xx xx:xx:xx   
    // str 日期
    // separator  日期分隔符，默认为 -
    getDate(str, separator = '-') {
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
            oTime = oYear + separator + this.getzf(oMonth) + separator + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen); //最后拼接时间  
        return oTime;
    },

    // xxxx-xx-xx
    // str 日期
    // separator  日期分隔符，默认为 -
    getDay(str, separator = '-') {
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
            oTime = oYear + separator + this.getzf(oMonth) + separator + this.getzf(oDay); //最后拼接时间  
        return oTime;
    },

    // 星期几
    // str 日期
    getWeek(str) {
        if(str == "" || str == null) {
            return "";
        }
        if(typeof(str) == 'string'){
            str = str.replace(/-/g, '/');
        }
        let now_day = new Date(str).getDay();
        var weekDay;
        switch (now_day) {
            case 0: {
                weekDay = "星期日"
            }
                break;
            case 1: {
                weekDay = "星期一"
            }
                break;
            case 2: {
                weekDay = "星期二"
            }
                break;
            case 3: {
                weekDay = "星期三"
            }
                break;
            case 4: {
                weekDay = "星期四"
            }
                break;
            case 5: {
                weekDay = "星期五"
            }
                break;
            case 6: {
                weekDay = "星期六"
            }
                break;
            case 7: {
                weekDay = "星期日"
            }
                break;
        }
        return weekDay;
    },

    // 补0操作  
    getzf(num) {
        if(parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    },
}
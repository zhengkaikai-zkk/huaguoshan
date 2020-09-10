import wx from 'weixin-js-sdk'
import request from './request'
import Common from './common'

export default {
    // 微信初始化
    // api 获取签名的后台接口
    // url 需要进行微信初始化的路径
    config(api,url) {
        if(!Common.pcOrPhone || navigator.userAgent.indexOf('MicroMessenger') == -1) return;
		request.post({
            url: api,
            params: {
                pageUrl: url,
            },
            success: result => {
                var appId = result.appid;
                var timeStamp = result.timestamp;
                var nonceStr = result.noncestr;
                var Sign = result.signature;
                //--------初始化----------
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timeStamp, // 必填，生成签名的时间戳
                    nonceStr: nonceStr, // 必填，生成签名的随机串
                    signature: Sign,// 必填，签名
                    jsApiList: [
                        'onMenuShareAppMessage',//分享给朋友
                        'onMenuShareTimeline',//分享到朋友圈
                        'onMenuShareQQ',//分享给QQ好友
                        'onMenuShareQZone',//分享到QQ空间
                        'updateTimelineShareData',
                        'chooseImage',
                        'uploadImage',
                        'downloadImage',
                        'getLocalImgData'
                    ] // 必填，需要使用的JS接口列表
                });
            }
        })
    },
    
    // 触发微信选择图片
    // type  'original'原图   'compressed'压缩图
    // count  用户可选择多少张照片，最大值为9，默认为9
    wxChange(callBack,type='compressed',count=9) {
        var typeList = [];
        typeList.push(type);
        wx.chooseImage({
            count: count, // 默认9
            sizeType: typeList, // 可以指定是原图还是压缩图，默认二者都有'compressed'
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
                var localIds = res.localIds;
                if (!window.__wxjs_is_wkwebview) {
                    for (var item of localIds) {
                        wx.uploadImage({
                            localId: item, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: res => {
                                var serverId = res.serverId; // 返回图片的服务器端ID
                                callBack(item,serverId);
                            }
                        });
                    }
                } else {
                    this.readImg(0,localIds,callBack);
                }
            }
        });
    },
    // wkwebview下读取base64图片
    readImg(index,localIds,callBack) {
        wx.getLocalImgData({
            localId: localIds[index],
            success: res => {
                let localData = res.localData;
                localData = localData.replace('jgp', 'jpeg');
                callBack(localData,localData)
                if(index < localIds.length - 1) {
                    this.readImg(index + 1,localIds,callBack)
                }
            },
            fail: err => {
                Toast('选择图片失败');
            }
        })
    },

    // 微信分享
    // data: {
    //     title: '',// 分享标题
    //     desc: '',// 分享描述
    //     link: '',// 分享链接   需传入任务id和邀请码，下同
    //     imgUrl: ''// 分享图标,图片地址必须为完整地址
    // }
    wxShare(data) {
        wx.ready(function(){  //需在用户可能点击分享按钮前就先调用
            /*分享给朋友*/
            wx.onMenuShareAppMessage({
                title: data.title, 
                desc: data.desc, 
                link: data.link, 
                imgUrl: data.imgUrl, 
                success: function(){ 
                    
                },
                cancel: function(){ 
                    
                }
            });
            /*分享到朋友圈*/
            wx.onMenuShareTimeline({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接   需传入任务id和邀请码，下同
                imgUrl: data.imgUrl, // 分享图标,图片地址必须为完整地址
                success: function(){ 
                },
                cancel: function(){ 
                }
            });
            //分享给朋友和QQ
            wx.updateAppMessageShareData({ 
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接   需传入任务id和邀请码，下同
                imgUrl: data.imgUrl, // 分享图标,图片地址必须为完整地址
            }, function(res){ 
            //这里是回调函数 
            }); 
            //分享到朋友圈和QQ空间
            wx.updateTimelineShareData({ 
                title: data.title, // 分享标题
                link: data.link, // 分享链接   需传入任务id和邀请码，下同
                imgUrl: data.imgUrl, // 分享图标,图片地址必须为完整地址
            }, function(res){ 
            //这里是回调函数 
            }); 
        })
    },
    // 微信公众号支付
    // data: {
    //     appid: '',//公众号名称，由商户传入     
    //     timeStamp: '',//时间戳，自1970年以来的秒数
    //     nonceStr: '',//随机串     
    //     packageValue: '',//微信签名方式：  
    //     sign: ''//微信签名 
    // }
    payOfficialAccount(data) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId" : data.appid, 
            "timeStamp" : data.timeStamp,      
            "nonceStr" : data.nonceStr, 
            "package" : data.packageValue,
            "signType" : "MD5",    
            "paySign" : data.sign 
        }, res => {
            // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                Toast.success("支付成功");
            } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                Toast.fail('支付失败');
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                Toast.fail('支付取消');
            } else {
                Toast.fail(res.err_msg);
            }
        });
    }
}
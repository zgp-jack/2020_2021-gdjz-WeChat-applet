App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    refId:"",
    fixedGetIntegral: "http://yupao.oss-cn-beijing.aliyuncs.com/miniprogram/images/fixed-getintegral.png",
    fixedDownApp:"https://newyupaomini.54xiaoshuo.com/statics/images/fixed-downloadapp.png",
    fixedPublishImg:"https://newyupaomini.54xiaoshuo.com/statics/images/fixed-publishrecruit.png",
    commonShareImg: "https://newyupaomini.54xiaoshuo.com/statics/images/minishare.png",
    commonDownloadApp: "https://newyupaomini.54xiaoshuo.com/statics/images/download.png",
    apiRequestUrl: "https://newyupaomini.54xiaoshuo.com/",
    // apiRequestUrl: "http://miniapi.qsyupao.com/",
    apiUploadImg:"https://newyupaomini.54xiaoshuo.com/index/upload/",
    apiImgUrl:"http://yupao.oss-cn-beijing.aliyuncs.com/miniprogram/images/"
  },
    stopThisAction:function(){
        return false;
    },
    initSystemInfo:function(callback){
      wx.getSystemInfo({
          success: function(res) {
              callback(res);
          },
          fail: function(res) {
              callback(false);
          }
      })
  },
  doRequestAction:function(_options){
      if (_options.hasOwnProperty("params")){
          _options.params.wechat_token = "jizhao";
      }else{
          _options.params = {
              wechat_token: "jizhao"
          }
      }
      
      let _this = this;
      wx.request({
          method: _options.hasOwnProperty("way") ? _options.way : 'GET',
          url: _options.hasOwnProperty("url") ? (_this.globalData.apiRequestUrl + _options.url) : _this.globalData.apiRequestUrl,
          data: _options.hasOwnProperty("params") ? _options.params : {} ,
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
              _options.hasOwnProperty("success") ? _options.success(res) : "";
          },
          fail(err){
              _options.hasOwnProperty("fail") ? _options.fail(err) : "";
          }
      })
  },

    appRequestAction: function (_options) {
        wx.showLoading({
            title: _options.hasOwnProperty("title") ? _options.title : '数据加载中',
            mask: _options.hasOwnProperty("mask") ? _options.mask : false
        })
        if (_options.hasOwnProperty("params")) {
            _options.params.wechat_token = "jizhao";
        } else {
            _options.params = {
                wechat_token: "jizhao"
            }
        }

        let _this = this;
        wx.request({
            method: _options.hasOwnProperty("way") ? _options.way : 'GET',
            url: _options.hasOwnProperty("url") ? (_this.globalData.apiRequestUrl + _options.url) : _this.globalData.apiRequestUrl,
            data: _options.hasOwnProperty("params") ? _options.params : {},
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
                wx.hideLoading();
                _options.hasOwnProperty("success") ? _options.success(res) : "";
            },
            fail(err) {
                wx.hideLoading();
                if (_options.hasOwnProperty("fail")){
                    _options.fail(err)
                }else{
                    wx.showToast({
                        title: _options.hasOwnProperty("failTitle") ? _options.failTitle : '网络错误，数据加载失败！',
                        icon:"none",
                        duration:2000
                    })
                }
            }
        })
    },

    bindGetUserInfo: function (e, callback) {
        //如果选择授权 则含有用户信息 
        var that = this
        if (e.detail.userInfo) {
            wx.showToast({
                title: '正在授权',
                icon: 'loading',
                duration: 5000
            });
            that.globalData.userInfo = e.detail.userInfo; //设置用户信息 
            // 登录 获取在我们这里user_id
            wx.login({
                success: function (res) {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: that.globalData.apiRequestUrl + '/user/user-info/',
                            data: {
                                code: res.code,
                                wechat_token: "jizhao"
                            },
                            success: function (resdata) {
                                //获取到session_key 解密 
                                var session_key = resdata.data.session_key
                                callback(session_key)
                                //that.mini_user(session_key)
                            },
                            fail: function (error) {
                                console.log(error);
                            }
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        } else {
            console.log('拒绝授权')
        }
    },
    mini_user: function (session_key, callback) {
        var that = this
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        fail: () => {
                            wx.openSetting({})
                        },
                        success: (res) => {
                            /**获取encryptdata **/
                            callback(session_key)
                            //that.api_user(session_key);
                        }
                    })
                } else {
                    /**获取encryptdata **/
                    callback(session_key)
                    //that.api_user(session_key)
                }
            }
        })
    },
    api_user(session_key, callback) {
        let that = this;
        wx.getUserInfo({
            success: (res) => {
                let encryptedData = res.encryptedData
                let iv = res.iv
                var params = new Object()
                params.session_key = session_key
                params.encryptedData = encryptedData
                params.iv = iv
                params.refid = this.globalData.refId
                params.wechat_token = "jizhao"
                //发起请求  
                wx.request({
                    url: that.globalData.apiRequestUrl + '/user/make-user/',
                    data: params,
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        callback(res)
                        // 授权用户执行操作
                        wx.hideToast();
                    }
                })

            }
        })
    },
    callThisPhone:function(e){
        let phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    showMyTips:function(_msg){
        
        wx.showToast({
            title: _msg,
            icon: 'none',
            duration: 2000,
            success:function(){}
        })
    },
    userUploadImg:function(callback){
        let _this = this;
        wx.showLoading({ title: '正在上传图片' });
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                let imgRes = res;
                wx.uploadFile({
                    url: _this.globalData.apiUploadImg,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    success(res) {
                        
                        let mydata = JSON.parse(res.data);
                        
                        if (mydata.errcode == "ok") {
                            callback ? callback(imgRes, mydata) : "";
                        }else{
                            wx.hideLoading();
                            wx.showToast({
                                title: mydata.errmsg,
                                icon: "none",
                                duration: 2000
                            })
                        }
                    },
                    fail: function () {
                        wx.hideLoading();
                        wx.showToast({
                            title: "网络错误，上传失败！",
                            icon: "none",
                            duration: 2000
                        })
                    }
                })

            },
            fail: function () {
                wx.hideLoading();
            }
        })
    },
    arrDeepCopy: function (source){
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.arrDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    },
    returnPrevPage: function (_msg){
        wx.showModal({
            title: '温馨提示',
            content: _msg,
            showCancel:false,
            success:function(){
                wx.navigateBack({ delta:1 })
            }
        })
    },
    jumpThisLink:function(e){
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let _page = "/" + currentPage.route
        let _url = e.currentTarget.dataset.url;
        if (_url == _page) return false;

        let _type = e.currentTarget.dataset.type;
        (_type == "1") ? wx.reLaunch({ url:_url }) : wx.navigateTo({ url: _url });
    }
})
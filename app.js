App({
  onLaunch: function () {

  },
  globalData: {
    requestToken:"jizhao",
    serverPhone:"400-833-1578",
    userInfo: null,
    refId:"",
    fixedGetIntegral: "http://cdn.yupao.com/miniprogram/images/fixed-getintegral.png?t=" + new Date().getTime(),
    fixedDownApp: "http://cdn.yupao.com/miniprogram/images/fixed-downloadapp.png?t=" + new Date().getTime(),
    fixedPublishImg: "http://cdn.yupao.com/miniprogram/images/fixed-publishrecruit.png?t=" + new Date().getTime(),
    commonShareImg: "http://cdn.yupao.com/miniprogram/images/minishare.png?t=" + new Date().getTime(),
    commonDownloadApp: "http://cdn.yupao.com/miniprogram/images/download.png?t=" + new Date().getTime(),
    //apiRequestUrl: "https://newyupaomini.54xiaoshuo.com/",
    apiRequestUrl: "http://miniapi.qsyupao.com/",
    apiUploadImg:"https://newyupaomini.54xiaoshuo.com/index/upload/",
    apiImgUrl:"http://cdn.yupao.com/miniprogram/images/",
    commonShareTips:"全国建筑工地招工平台",
    isFirstLoading: true,
    inviteSource: "712790d9629c6dcea00e3f5bff60132b",
    allTypes: false,
    userTimes:1,
    userShareData:{
        today:"",
        tomorrow:""
    },
    appNetTime: parseInt(new Date().getTime() / 1000),
    userGapTime:0
  },
    getUserShareJson: function () {
        let userInfo = wx.getStorageSync("userInfo");
        let _path = userInfo ? '/pages/index/index?refid=' + userInfo.userId + "&source=" + this.globalData.inviteSource : '/pages/index/index';
        let _json = {
            title: this.globalData.commonShareTips,
            path: _path,
            imageUrl: this.globalData.commonShareImg,
        }
        return _json;
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
          _options.params.wechat_token = this.globalData.requestToken;
      }else{
          _options.params = {
              wechat_token: this.globalData.requestToken
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

        if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
            wx.showLoading({
                title: _options.hasOwnProperty("title") ? _options.title : '数据加载中',
                mask: _options.hasOwnProperty("mask") ? _options.mask : false
            })
        }

        if (_options.hasOwnProperty("params")) {
            _options.params.wechat_token = this.globalData.requestToken;
        } else {
            _options.params = {
                wechat_token: this.globalData.requestToken
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
                if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
                    wx.hideLoading();
                }
                _options.hasOwnProperty("success") ? _options.success(res) : "";
            },
            fail(err) {
                if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
                    wx.hideLoading();
                }
                if (_options.hasOwnProperty("fail")) {
                    _options.fail(err)
                } else {
                    let _title = _options.hasOwnProperty("failTitle") ? _options.failTitle : '网络错误，数据加载失败！';
                    _this.showMyTips(_title);
                }
            },
            complete: function () {
                if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
                    wx.hideLoading();
                }
                _options.hasOwnProperty("complete") ? _options.complete() : "";
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
                            url: that.globalData.apiRequestUrl + 'user/user-info/',
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
                let _source = wx.getStorageSync("_source");
                params.session_key = session_key
                params.encryptedData = encryptedData
                params.iv = iv
                params.refid = this.globalData.refId
                params.source = _source ? _source : "";
                params.wechat_token = "jizhao"
                //发起请求  
                wx.request({
                    url: that.globalData.apiRequestUrl + 'user/make-user/',
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
        setTimeout(function(){
            wx.showToast({
                title: _msg,
                icon: 'none',
                duration: 2000,
                success: function () { }
            })
        },1)
        
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
    },
    getListsAllType: function (_callback) {
        let _this = this;
        this.appRequestAction({
            url: "index/top-search-tree/",
            way: "POST",
            hideLoading: true,
            failTitle: "数据加载失败，请重新进入小程序",
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.globalData.allTypes = mydata.data;
                    _callback(mydata.data);
                } else {
                    _this.showMyTips(mydata.errmsg);
                }
            }
        })
    },
    valiDateIsToday:function(){
        let myDate = new Date();
        let _y = myDate.getFullYear();
        let _m = parseInt((myDate.getMonth() + 1)) < 10 ? "0" + parseInt((myDate.getMonth() + 1)) : parseInt((myDate.getMonth() + 1))  ;
        let _d = parseInt(myDate.getDate()) < 10 ? "0" + myDate.getDate() : myDate.getDate();
        let _ymd = _y + "-" + _m + "-" + _d;
        return _ymd;
    },
    initUserShareTimes: function () {
        let _this = this;
        let userinfo = wx.getStorageSync("userInfo");
        this.appRequestAction({
            url: "integral/init-share/",
            way: "POST",
            title: "正在初始化数据",
            hideLoading:true,
            params: userinfo,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.globalData.userTimes = parseInt(mydata.lessNumber);
                }
            }
        })
    },
    userShareAction:function(callback){
        let userInfo = wx.getStorageSync("userInfo");
        if (!userInfo) return false;
        this.userShareTotal();
        let _this = this;
        let _time = 1000;
        if(this.globalData.userTimes == 0){
            let _td = this.valiDateIsToday(); //today
            let _t = wx.getStorageSync("_st"); //shareTime
            if(_t  != _td){
                wx.setStorageSync("_st", _td);
                setTimeout(function(){
                    callback('share');
                }, _time)
            }
            return false;
        }
        if(!userInfo) return false;
        this.appRequestAction({
            url: "integral/share-integral/",
            way: "POST",
            params: userInfo,
            hideLoading:true,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.globalData.userTimes = parseInt(_this.globalData.userTimes) - 1;
                    let timestamp = Date.parse(new Date());
                    let date = new Date(timestamp);
                    let year = date.getFullYear();
                    let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                    let hours = (date.getHours()) < 10 ? "0" + (date.getHours()) : (date.getHours());
                    let min = ((date.getMinutes()) < 10 ? "0" + (date.getMinutes()) : (date.getMinutes()));
                    let _data = new Date();
                    _data.setTime(_data.getTime() + 24 * 60 * 60 * 1000);
                    let tomorrow = _data.getFullYear() + "-" + ((_data.getMonth() + 1 < 10 ? '0' + (_data.getMonth() + 1) : _datagetMonth() + 1)) + "-" + ((_data.getDate()) < 10 ? "0" + (_data.getDate()) : _data.getDate()) + " 00:00";
                    let today = year + "-" + month + "-" + day + " " + hours + ":" + min;
                    _this.globalData.userShareData.today = today;
                    _this.globalData.userShareData.tomorrow = tomorrow;
                    setTimeout(function(){
                        callback(mydata);
                    }, _time)
                }
            }
        })
    },
    pageInitSystemInfo: function (_this) {
        
        this.initSystemInfo(function (res) {
            if (res) {
                let _ww = res.screenWidth;
                let _wh = res.screenHeight;
                let _bg = _ww * 0.9;
                let _btnh = _bg / 4.695;
                let wordsw = _ww * 0.5;
                let _wordsh = wordsw / 4.21;
                let _shadew = _ww * 0.8;
                let _winw = _ww * 0.9;
                let _winh = _winw / 0.9247;
                let _tipsw = _ww * 0.96;
                _this.setData({
                    bgHeight: _bg,
                    btnWidth: _btnh,
                    wordsHeight: _wordsh,
                    wordsWidth: wordsw,
                    shadeWidth: _shadew,
                    winWidth: _winw,
                    winHeight: _winh,
                    notimesW: _tipsw
                })
            }
        })
    },
    userShareTotal: function () {
        let userInfo = wx.getStorageSync("userInfo");
        this.doRequestAction({
            url: "user/list-share/",
            way: "POST",
            params: userInfo
        })
    },
    initAdminTime: function (callback) {
        let _this = this;
        this.appRequestAction({
            url: "index/get-init-time/",
            hideLoading: true,
            success: function (res) {
                _this.globalData.appNetTime = res.data.time;
                _this.globalData.userGapTime = _this.globalData.appNetTime - parseInt(new Date().getTime() / 1000);
                callback ? callback() : ""
            },
            fail: function () { }
        })
    },
})
// pages/info/info.js share share showThisMapInfo showThisMapInfo
const app = getApp();
Page({

    /**
     * 页面的初始数据 getInfoTel
     */
    data: {
        infoId:"",
        userInfo:false,
        notice: {
            autoplay: true,
            indicatorDots: false,
            circular: true,
            vertical: true,
            interval: 5000,
            duration: 1000,
            lists: []
        },
        info:{},
        phone: "",
        wechat: "",
        isShare: false,
        shareMsg: "",
        shareFlag: false,
        showComplain: false,
        complainInfo: "",
        appLinkImg: app.globalData.commonDownloadApp,
        fixedGetIntegral: app.globalData.fixedGetIntegral,
        userShareData: {
            showApp: false,
            showWin: false,
            integral: "1"
        },
        userShareTime: {},
        collectFalse: app.globalData.apiImgUrl + "collect-false.png",
        collectTrue: app.globalData.apiImgUrl + "collect-true.png",
        collectMark:false,
       locationicon: app.globalData.apiImgUrl +"detail-info-map.png",

      mapimg: app.globalData.apiImgUrl + "newdetail-info-map.png",
      collectImg: app.globalData.apiImgUrl + "job-collect-normal.png",
      collectedImg: app.globalData.apiImgUrl + "job-collect-active.png",
      complainImg: app.globalData.apiImgUrl + "newjobinfo-complain.png",
      sharebtnImg: app.globalData.apiImgUrl + "newjobinfo-share.png",
      homebtnImg: app.globalData.apiImgUrl + "newdetailinfo-home.png",
      showHomeImg:false,
      showcomplain: false,
      usepang: 8,
      isEnd:""
    },
  detailToHome:function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  showThisMapInfo:function(){
    let loc = this.data.info.location;
    let locArr = loc.split(",");
    console.log(this.data.info.map_address_name)
    wx.openLocation({
      latitude: parseFloat(locArr[1]),
      longitude: parseFloat(locArr[0]),
      name: this.data.info.map_address_name,
      address: this.data.info.map_street_name, 
      scale: 18
    })
  },
  userTapConcern:function(){
    wx.navigateTo({
      url: '/pages/static/notice?id=32',
    })
  },

  showThisMap:function(){
    let _this = this;
    let location = this.data.info.location
    if(!location) return false;
    let arr = location.split(",")
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: parseFloat(arr[1]),//要去的纬度-地址
      longitude: parseFloat(arr[0]),//要去的经度-地址
      name: _this.data.info.show_full_address
    })
  },
    userCollectAction:function(){
      let _this = this;
      let userInfo = this.data.userInfo;
      if (!userInfo) {
        app.gotoUserauth();
        return false;
      }
      let id = this.data.infoId;
      let data = {
        userId:userInfo.userId,
        token:userInfo.token,
        tokenTime:userInfo.tokenTime,
        id:id
      };

      app.appRequestAction({
        url: "job/collect/",
        way: "POST",
        params: data,
        title: "操作中",
        failTitle: "网络错误，操作失败！",
        success: function (res) {
          let mydata = res.data;
          app.showMyTips(mydata.errmsg);
          if (mydata.errcode == "ok"){
            _this.setData({ collectMark: (mydata.action == "add") ? true : false })
          }
        }
      })

    },
    previewImage: function (e) {
        let src = e.currentTarget.dataset.src;
        let _this = this;
        wx.previewImage({
            current: src,
            urls: _this.data.info.view_images
        })
    },
    callThisPhone: function (e) {
        app.callThisPhone(e);
    },
    clipboardWechat:function(e){
        let wechat = e.currentTarget.dataset.wechat;
        wx.setClipboardData({
            data: wechat,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    title: '恭喜您',
                    content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
                    showCancel: false,
                    success: function () { }
                })
            }
        })
    },
    showThisNotice: function (e) {
        let _id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/static/notice?type=1&id=' + _id,
        })
    },
    initNeedData: function () {
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = wx.getStorageSync("userInfo");
        userInfo = userInfo ? userInfo : {userId : 0}
        let _time = Date.parse(new Date());
        if (_wx && _wx.expirTime) {
            if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        app.doRequestAction({
            url: "index/search-data/",
            params: {
                type: "job",
                userId: _mark ? userInfo.userId : "",
            },
            success: function (res) {
                let mydata = res.data;
                _this.setData({
                    fillterArea: mydata.areaTree,
                    fillterType: mydata.classifyTree,
                    "notice.lists": mydata.notice,
                    phone: mydata.phone,
                    wechat: _mark ? mydata.wechat.number : _wx.wechat
                })
                if (_mark) {
                    let extime = _time + (mydata.wechat.outTime * 1000);
                    wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime });
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '数据加载失败！',
                    icon: "none",
                    duration: 3000
                })
            }
        })
    },
    initJobInfo: function (id){
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        let url = userInfo ? "job/job-info/" : "/job/no-user-info/";
        let infoId = id;
        this.setData({ userInfo:userInfo ? userInfo : false,infoId:infoId });
        userInfo = userInfo ? userInfo : {userId:0}
        userInfo.infoId = infoId;
        userInfo.type = "job";
        app.appRequestAction({
            url: url,
            way: "POST",
            params: userInfo,
            success: function (res) {  
              console.log(res.data)
                let mydata = res.data;
              _this.setData({ info: mydata.result })
                if (mydata.errcode != "fail") {
                
                    let t = mydata.result.title;
                    wx.setNavigationBarTitle({ title: t })
                  _this.setData({ collectMark: mydata.result.is_collect ? true : false})
                  let userInfo = wx.getStorageSync("userInfo");
                  if (userInfo){
                    if (userInfo.userId == mydata.result.user_id){
                      _this.setData({
                        showcomplain:true
                      })
                    }
                  }
                  _this.setData({
                    usepang: mydata.result.hasOwnProperty("isLook") ? mydata.result.isLook:8,
                    isEnd: mydata.result.hasOwnProperty("is_end") ? mydata.result.is_end : ""
                  })
                  
                }
                _this.doDetailAction(mydata, {
                    success:function(){},
                    share: function () {
                        _this.setData({
                            shareFlag: true,
                            isShare: true,
                            shareMsg: mydata.errmsg
                        })
                    }
                });
            },
            fail: function () {
                wx.showModal({
                    title: '温馨提示',
                    content: '网络错误，加载失败！',
                    showCancel: false,
                    success(res) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        })
    },
    doDetailAction: function (mydata, _obj) {
        if ((mydata.errcode == "ok") || (mydata.errcode == "end") || (mydata.errcode == "ajax")) { //获取成功、已找到
            _obj.success();
        } else if (mydata.errcode == "auth_not_pass") {  //实名未通过、（进入实名）
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                showCancel: false,
                success(res) {
                    wx.navigateTo({
                        url: '/pages/realname/realname',
                    })
                }
            })
        } else if (mydata.errcode == "to_auth") { //是否进入实名 （取消=>返回、确定=>实名）
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                cancelText:"返回列表",
                confirmText:"实名认证",
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/realname/realname',
                        })
                    } else if (res.cancel) {
                        wx.navigateBack({ delta: 1 })
                    }

                }
            })
        } else if (mydata.errcode == "none_tel") { //绑定手机
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                cancelText: "返回列表",
                confirmText: "绑定手机",
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/userinfo/edit/edit',
                        })
                    } else if (res.cancel) {
                        wx.navigateBack({ delta: 1 })
                    }

                }
            })
        } else if (mydata.errcode == "to_share") { //分享
            _obj.share();
        } else if (mydata.errcode == "get_integral") { //积分不足 是否前往获取积分
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                cancelText: "返回列表",
                confirmText: "获取积分",
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/getintegral/getintegral',
                        })
                    } else if (res.cancel) {
                        wx.navigateBack({ delta: 1 })
                    }

                }
            })
        } else {  //用户异常、用户验证失败
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                showCancel: false,
                confirmText: "我知道了",
                success(res) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        }
    },
    getInfoTel: function () {
        let _this = this; 
        let userInfo = this.data.userInfo;
        if(!userInfo){
          app.gotoUserauth();
          return false;
        }
        let infoId = this.data.infoId;
        userInfo.infoId = infoId;
        userInfo.type = "job";
        app.appRequestAction({
            url: "job/get-tel/",
            way: "POST",
            params: userInfo,
            success: function (res) {
                let mydata = res.data;
                _this.doDetailAction(mydata, {
                    success: function () {
                        if (mydata.errcode == "end"){
                            app.showMyTips(mydata.errmsg);
                            return false;
                        }
                        _this.setData({
                            "info.tel_str": mydata.tel,
                            "info.show_ajax_btn": false,
                             usepang:1,
                             "info.show_complaint.show_complaint":1
                        })
                        console.log(123)
                    },
                    share: function () {
                        _this.setData({
                            "info.tel_str": mydata.tel,
                            "info.show_ajax_btn": false,
                            shareFlag: true,
                            isShare: true,
                            shareMsg: mydata.errmsg,
                            usepang: 1,
                          "info.show_complaint.show_complaint": 1
                        })
                    }
                });
            }
        })
    },
    userEnterComplain: function (e) {
        this.setData({ complainInfo: e.detail.value })
    },
    userTapComplain: function () {
      let userInfo = this.data.userInfo;
      if (!userInfo) {
        app.gotoUserauth();
        return false;
      }
    if (this.data.info.show_ajax_btn && this.data.isEnd != 2 || this.data.usepang == 0&&this.data.isEnd != 2 ){
            app.showMyTips("请查看完整的手机号码后再操作！");
            return false; 
        }
      if (!this.data.info.show_complaint.show_complaint || this.data.usepang == 0 &&this.data.isEnd == 2){
        wx.showModal({
          title: '提示',
          content: this.data.info.show_complaint.tips_message,
          showCancel:false,
          confirmText:'知道了'
        })
        return false;
      }
      this.setData({
        showComplain: true
    })
    },
    
    subscribeToNews: function() {
        app.subscribeToNews("complain",function(){
            wx.showModal({
                title: '提示',
                content: mydata.errmsg,
                showCancel:false,
                confirmText: '确定'
              })
              
        })
    },
    userCancleComplain: function () {
      this.setData({ showComplain: false, complainInfo:"" })
    },
    userComplaintAction: function () {
        let _this = this; 
        let userInfo = this.data.userInfo;
        let infoId = this.data.infoId;
        let info = this.data.complainInfo; 
        info = info.replace(/^\s+|\s+$/g, '');
        if (info == "") {
            app.showMyTips("请输入您的投诉内容");
            return false;
        }
        app.appRequestAction({
            url: "publish/complain/",
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                infoId: infoId,
                type: "job",
                content: info
            },
            title: "正在提交投诉",
            failTitle: "网络错误，投诉失败！",
            success: function (res) {
                let mydata = res.data;
              if (mydata.errcode == "ok"){
                _this.setData({ 
                  showComplain: false,
                  complainInfo: "",
                  "info.show_complaint.show_complaint": 0,
                  "info.show_complaint.tips_message": "您已投诉该信息，请勿重复操作！"
                });
                _this.subscribeToNews(mydata)
              }else{
                wx.showModal({
                    title: '提示',
                    content: mydata.errmsg,
                    showCancel:false,
                    confirmText: mydata.errcode == 'pass_complaint' ? '知道了' : '确定'
                  })
              }
                
                
            }
        })
    },
    userShareAddIntegral: function () {
        let userInfo = wx.getStorageSync("userInfo");
        app.appRequestAction({
            url: "user/user-share/",
            way: "POST",
            params: userInfo,
            success: function () { },
            fail: function () { }
        })
    },
    jumpThisLink: function (e) {
        app.jumpThisLink(e);
    },
    initUserShareTimes: function () {
        app.pageInitSystemInfo(this);
    },
    userShareAction: function () {
        let _this = this;
        app.userShareAction(function (_str) {
            if (_str == "share") {
                _this.setData({
                    "userShareData.showApp": true
                })
            } else {
                _this.setData({
                    "userShareData.showWin": true,
                    userShareTime: app.globalData.userShareData,
                    "userShareData.integral": _str.integral
                })
            }
        })
    },
    userTapLink: function (e) {
        this.setData({ "userShareData.showApp": false, "userShareData.showWin": false })
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
        })
    },
    closeWinbox: function (e) {
        let type = e.currentTarget.dataset.type;
        if (type == "app") {
            this.setData({ "userShareData.showApp": false })
        } else {
            this.setData({ "userShareData.showWin": false })
        }
    },
  isShowHomeBtn: function (options) {
    if (options.hasOwnProperty("home") && options.home == "1") this.setData({ showHomeImg:true })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    
    onLoad: function (options) {
      this.isShowHomeBtn(options);
        //this.initUserShareTimes();
        let infoId = options.id;
        this.setData({ infoId:infoId })
        this.initNeedData();
        //this.initJobInfo(infoId);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let userInfo = wx.getStorageSync("userInfo");
      let infoId = this.data.infoId;
      if (userInfo) {
        this.setData({ userInfo: userInfo })
      }
      this.initJobInfo(infoId);
      
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        //this.userShareAction();
      let tel = this.data.info.tel_str;
      
        if (this.data.shareFlag) this.userShareAddIntegral();
        let userId = this.data.userInfo.userId
        let _this = this;
        setTimeout(function () {
            _this.setData({ isShare: false })
        }, 500);
      let commonShareImg = app.globalData.commonShareImg;
      return {
        title: this.data.info.title,
        imageUrl: commonShareImg,
        path: "/pages/detail/info/info?home=1&id=" + this.data.infoId
      };
    }
})
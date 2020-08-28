// pages/info/info.js share share showThisMapInfo showThisMapInfo
let v = require("../../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据 getInfoTel
     */
    data: {
      unitad:app.globalData.unitad,
      shownewtips:false, //查看完整号码后弹窗
        complaincontent: app.globalData.complaincontent,
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
       checkimg: app.globalData.apiImgUrl+"published-info.png",
      mapimg: app.globalData.apiImgUrl + "newdetail-info-map.png",
      collectImg: app.globalData.apiImgUrl + "job-collect-normal.png",
      collectedImg: app.globalData.apiImgUrl + "job-collect-active.png",
      complainImg: app.globalData.apiImgUrl + "newjobinfo-complain.png",
      sharebtnImg: app.globalData.apiImgUrl + "newjobinfo-share.png",
      homebtnImg: app.globalData.apiImgUrl + "newdetailinfo-home.png",
      tipsimg:app.globalData.apiImgUrl + 'recruitinfo/recruit-tips.png',
      showHomeImg:false,
      showcomplain: false,
      usepang: 8,
      isEnd:"",
      joingroup: [],
      recommendlist: [],
      more: 0,  // 是否取反推荐列表
      aid: '', // 地区
      cid: '', // 工种
      child: 0, // 是否是子列表
      showFollow: false
    },
    showdownappaction:function(){
      wx.navigateTo({
        url: '/packageOther/pages/download/download-app',
      })
      //this.selectComponent("#downapptips").showaction()
    },
    userFollowAccount:function(){
      this.setData({
        showFollow: true
      })
    },
    userCloseFollowBox:function(){
      this.setData({
        showFollow: false
      })
    },
    userChangeRecruitStatus:function(){
      let that = this
      let userInfo = this.data.userInfo
      let id = this.data.infoId
      wx.showLoading({
        title: '正在修改状态'
      })
      app.doRequestAction({
        way: "POST",
        url: "job/job-end-status/",
        params: {
          userId: userInfo.userId,
          token: userInfo.token,
          tokenTime: userInfo.tokenTime,
          infoId: id,
          end_status: that.data.info.is_end
        },
        success: function (res) {
          wx.hideLoading();
          let mydata = res.data;
          if (mydata.errcode == "ok") {
            that.setData({
              "info.is_end":mydata.data.is_end,
              "info.is_check":mydata.data.is_check,

            })
            if(that.data.info.has_top&&that.data.info.top_info.is_top == '1'){
              that.setData({
                'info.top_info.is_top' : mydata.data.top.is_top
              })
            }
            
            wx.showToast({
              title: mydata.errmsg,
              icon: "none",
              duration: 1500
            })
          } else if (mydata.errcode == "auth_forbid") {
            wx.showModal({
              title: '温馨提示',
              content: res.data.errmsg,
              cancelText: '取消',
              confirmText: '去实名',
              success(res) {
                if (res.confirm) {
                  let backtwo = "backtwo"
                  wx.redirectTo({
                    url: `/pages/realname/realname?backtwo=${backtwo}`
                  })
                }
              }
            })
            return
          } else if (mydata.errcode == "member_forbid") {
            wx.showModal({
              title: '温馨提示',
              content: mydata.errmsg,
              cancelText: "取消",
              confirmText: "联系客服",
              success(res) {
                if (res.confirm) {
                  let tel = app.globalData.serverPhone
                  wx.makePhoneCall({
                    phoneNumber: tel,
                  })
                }
              }
            })
          } else if (mydata.errcode == "to_auth") {
            wx.showModal({
              title: '温馨提示',
              content: res.data.errmsg,
              cancelText: '取消',
              confirmText: '去实名',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: `/pages/realname/realname`
                  })
                }
              }
            })
            return
          }else {
            wx.showToast({
              title: mydata.errmsg,
              icon: "none",
              duration: 1500
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: "网络不太好，操作失败！",
            icon: "none",
            duration: 3000
          })
        }
      })
    },
    editThisInfo:function(){
      let id = this.data.infoId
      wx.navigateTo({
        url: '/pages/issue/index/index?id='+id,
      })
    },
    userSetTopAction:function(e){
      let id = this.data.infoId
      let _this = this
      let info = this.data.info
      let userInfo = this.data.userInfo
      let top = info.has_top
      if(top){
        let endtime = parseInt(info.top_info.end_time)
        let timestr = new Date().getTime() / 1000
        if(timestr < endtime){
          wx.showLoading({
            title: '正在执行操作'
          })
          app.doRequestAction({
            url: 'job/update-top-status/',
            way: "POST",
            params: {
              userId: userInfo.userId,
              token: userInfo.token,
              tokenTime: userInfo.tokenTime,
              infoId: id
            },
            success: function (res) {
              wx.hideLoading();
              let mydata = res.data;
              console.log(mydata)
              if (mydata.errcode == "ok") {
                _this.setData({
                  "info.top_info.is_top": mydata.data.top.is_top
                })
              }
              if (mydata.errcode == "auth_forbid") {
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.errmsg,
                  cancelText: '取消',
                  confirmText: '去实名',
                  success(res) {
                    if (res.confirm) {
                      let backtwo = "backtwo"
                      wx.navigateTo({
                        url: `/pages/realname/realname?backtwo=${backtwo}`
                      })
                    }
                  }
                })
                return
              } else if (mydata.errcode == "member_forbid") {
                  wx.showModal({
                    title: '温馨提示',
                    content: mydata.errmsg,
                    cancelText: "取消",
                    confirmText: "联系客服",
                    success(res) {
                      if (res.confirm) {
                        let tel = app.globalData.serverPhone
                        wx.makePhoneCall({
                          phoneNumber: tel,
                        })
                      }
                    }
                  })
              } else {
                  wx.showToast({
                    title: mydata.errmsg,
                    icon: "none",
                    duration: 1500
                  })
                }
              },
              fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                  title: "网络不太好，操作失败！",
                  icon: "none",
                  duration: 3000
                })
              }
            })
          return false
        }
      }
      
      wx.navigateTo({
        url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=undefined`,
      })
    },
    userSetTop:function(e){
      let id = this.data.infoId;
      wx.navigateTo({
        url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=${id}`,
      })
    },
    closeNewPhoneFc:function(){
      this.setData({shownewtips: false}) 
    },
    returnAction:function(){
      return false
    },
    recentlynottips:function(){
      this.setData({shownewtips: false})
      let time = new Date().getTime()
      wx.setStorageSync('recruitHideTipsTime', time)
      wx.makePhoneCall({
        phoneNumber: this.data.info.tel_str,
      })
    },
    callthisphonehide:function(){
      this.setData({shownewtips: false})
      wx.makePhoneCall({
        phoneNumber: this.data.info.tel_str,
      })
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
  wantFastIssue: function () {
    if (!this.data.userInfo) {
      app.gotoUserauth();
      return false;
    }
    wx.navigateTo({
      url: '/pages/published/recruit/list',
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
      let joingroup = app.globalData.joingroup;
      if(joingroup){
        this.setData({
          joingroup: joingroup,
          wechat: app.globalData.copywechat,
          phone: app.globalData.callphone
        })
        return false;
      }
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = wx.getStorageSync("userInfo");
        userInfo = userInfo ? userInfo : {userId : 0}
        let _time = Date.parse(new Date());
        if (_wx && _wx.expirTime) {
            if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        app.getNoticeInfo(userInfo,function(mydata){
          _this.setData({
            "notice.lists": mydata.notice,
            member_less_info: mydata.member_less_info,
            phone: mydata.phone,
            wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number),
            joingroup: mydata.join_group_config
          })
          if (_mark) {
            let extime = _time + (mydata.wechat.outTime * 1000);
            wx.setStorageSync("resume_wx", { wechat: mydata.wechat.number, expirTime: extime });
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
                let mydata = res.data;
                if(mydata.errcode == "fail"){
                  wx.showModal({
                    title: '温馨提示',
                    content: mydata.errmsg,
                    showCancel: false,
                    success:()=>{
                      wx.navigateBack()
                    }
                  })
                  return
                }
                
                _this.setData({ info: mydata.result })
                //_this.getRecommendList()
                let cityid = mydata.result.hasOwnProperty('city_id') ? parseInt(mydata.result.city_id) : 0
                let provinceid = mydata.result.hasOwnProperty('province_id') ? parseInt(mydata.result.province_id) : 0
                if (mydata.errcode != "fail") {
                  let aid =  cityid || provinceid;
                  let cid = mydata.result.occupations.join(',')
                  console.log(aid,cid)
                    let t = mydata.result.title;
                    wx.setNavigationBarTitle({ title: t })
                  _this.setData({ collectMark: mydata.result.is_collect ? true : false, aid: aid, cid: cid})
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
                success(res) {
                    if(res.confirm){
                      wx.navigateTo({
                        url: '/pages/realname/realname',
                      })
                    }else{
                      wx.navigateBack()
                    }
                    
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
        }else {  //用户异常、用户验证失败
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
                        if(mydata.errcode == "ok"){
                          let rtime = wx.getStorageSync('recruitHideTipsTime')
                          if(rtime){
                            let t = 15 * 60 * 60 * 24 * 1000
                            let tt = new Date().getTime()
                            if(tt - rtime >= t){
                              _this.setData({shownewtips:true})
                            }
                          }else{
                            _this.setData({shownewtips:true})
                          }
                        }else if(mydata.errcode == "end"){
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
    userTapComplain: function (e) {
      console.log(e)
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
    
    subscribeToNews: function(mydata) {
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
      let complaincontent = this.data.complaincontent
      let vertifyNum = v.v.new()
        info = info.replace(/^\s+|\s+$/g, '');
      if (info == "" || info.length < 5 || info.length > 100 || !vertifyNum.isChinese(info)) {
        app.showMyTips(complaincontent);
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
                  "info.show_complaint.tips_message": "您已经投诉过这条信息，请勿重复投诉!"
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
  getPhonCons(){
    this.setData({
      joingroup: app.globalData.joingroup
    })
  },
    onLoad: function (options) {

      if(options.hasOwnProperty('more')){
        this.setData({
          more: parseInt(options.more)
        })
      }
      if(options.hasOwnProperty('child')){
        this.setData({
          child: parseInt(options.child)
        })
      }
      this.isShowHomeBtn(options);
        //this.initUserShareTimes();
        let infoId = options.id;
        this.setData({ infoId:infoId })
        this.initNeedData();
        //this.initJobInfo(infoId);
        //this.getPhonCons()
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
      
        if (this.data.shareFlag) this.userShareAddIntegral();
        let _this = this;
        setTimeout(function () {
            _this.setData({ isShare: false })
        }, 500);
      let commonShareImg = app.globalData.commonShareImg;
      let is_check = this.data.info.is_check;
      let path = is_check == '2' ? "/pages/detail/info/info?home=1&id=" + this.data.infoId : '/pages/index/index'
      return {
        title: this.data.info.title,
        imageUrl: commonShareImg,
        path: path
      };
    },
    onShareTimeline:function () {
      let commonShareTips = app.globalData.commonShareTips;
      let commonShareImg = app.globalData.commonShareImg;
      return {
        title: commonShareTips,
        imageUrl: commonShareImg
      }
    }
})
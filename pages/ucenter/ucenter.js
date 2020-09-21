const app = getApp();
let footerjs = require("../../utils/footer.js");
Page({

  /**
   * 页面的初始数据 valiUserUrl releaselive
   */
  data: {
    showRecharge: false,
    footerActive: "member",
    nouser: app.globalData.apiImgUrl + "userauth-userinfo-null.png",
    feedbackimg: app.globalData.apiImgUrl + "feedbackmsg-img.png",
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    msgIcon: app.globalData.apiImgUrl + "ucenter/ucenter-msg-icon.png",
    realName: app.globalData.apiImgUrl + "ucenter/ucenter-realname.png",
    callServicePhone: '',
    uCenterMenus: [
      {
        title: '信息管理',
        menus: [
          {
            key: 'recruit',
            name: '我的招工',
            dataUrl: '../published/recruit/list',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-recruit.png",
          },
          {
            key: 'findwork',
            name: '我的找活',
            dataUrl: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-findwork.png",
          },
          {
            key: 'trade',
            name: '二手交易',
            dataUrl: '../published/used/list',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-trade.png",
          },
          {
            key: 'collect',
            name: '我的收藏',
            dataUrl: '../collect/info/info',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-collect.png",
          },
          {
            key: 'bookkeeping',
            name: '记工记账',
            dataUrl: '',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-account.png",
            newIcon: app.globalData.apiImgUrl + "ucenter/ucenter-new.png"
          },
          {
            key: 'mymessage',
            name: '我的消息',
            dataUrl: '/pages/information/mymessage/mymessage',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-message.png",
          },
          {
            key: 'gift',
            name: '免费领好礼',
            dataUrl: '',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-gift.png",
          },
        ]
      },
      {
        title: '积分管理',
        menus: [
          {
            key: 'getintegral',
            name: '获取积分',
            dataUrl: '../getintegral/getintegral',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-integral.png",
          },
          {
            key: 'record',
            name: '积分记录',
            dataUrl: '../integral/source/source',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-integral-record.png",
          },
          {
            key: 'invite',
            name: '邀请工友',
            dataUrl: '../static/invite',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-invite.png",
          },
        ]
      },
      {
        title: '系统设置',
        menus: [
          {
            key: 'auth',
            name: '实名认证',
            dataUrl: '../realname/realname',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-auth.png",
          },
          {
            key: 'findexport',
            name: '实名查询',
            dataUrl: '',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-find-export.png",
          },
          {
            key: 'help',
            name: '帮助与反馈',
            dataUrl: '/packageOther/pages/helpCenter/helpCenter',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-help-center.png",
          },
          {
            key: 'service',
            name: '联系客服',
            dataUrl: '',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-customer-server.png",
          },
          {
            key: 'setting',
            name: '系统设置',
            dataUrl: '',
            icon: app.globalData.apiImgUrl + "ucenter/ucenter-seting.png",
          },
        ]
      }
    ],
    userInfo: false,
    member: {},
    showReturnIntegral: false,
    // showFastIssue: {
    //     show: 0,
    //     request: false
    // },
    showAuthor: false,
    resumeText: "",
    advertising: false,//广告轮播图
  },
  //获取广告数据
  getAdvertising: function () {
    let _this = this
    app.doRequestAction({
      url: "/member/member-ad/",
      way: "get",
      success: function (res) {
        const data = res.data.data
        if (data.length) {
          _this.setData({
            advertising: data
          })
        }
      },
      fail: function (err) {
      }
    })
  },

  //联系客服拨打电话
  callThisPhone: function (e) {
    app.callThisPhone(e);
  },
  // 根据发布方式不同发布招工：未登录或者“fast_add_job”是快速发布，“ordinary_add_job”是普通发布。
  publishJob: function () {
    app.initJobView()
  },
  initUserInfo: function (callback) {
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      // this.setData({ showFastIssue: false })
      callback ? callback() : ""
      return false
    }
    ;
    // if (!app.globalData.showFastIssue.request) app.isShowFastIssue(this);
    // else this.setData({ showFastIssue: app.globalData.showFastIssue })
    this.setData({userInfo: userInfo})
    let _this = this;
    wx.showLoading({title: '正在初始化用户数据',})
    app.appRequestAction({
      url: "user/personal/",
      way: "POST",
      params: userInfo,
      success: function (res) {
        setTimeout(() => {
          wx.hideLoading();
        }, 300)
        callback ? callback() : ""
        let mydata = res.data;
        _this.setData({
          showAuthor: mydata.show_auth == 1 ? true : false
        })
        if (mydata.errcode == "ok") {
          _this.setData({
            member: mydata.member,
            is_checking: mydata.is_checking,
            hasNoticeMsg: mydata.member.has_notice_msg.hasNoticeMsg,
            showReturnIntegral: (parseInt(mydata.member.return_integral) == 0) ? false : true
          })
          app.globalData.publish.userPhone = mydata.tel
        } else {
          wx.showToast({
            title: mydata.errmsg,
            icon: "none",
            duration: 5000
          })
        }
      },
      fail: function (err) {
        callback ? callback() : ""
        wx.hideLoading();
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none",
          duration: 5000
        })
      }
    })
  },
  valiUserUrl: function (e) {
    app.globalData.showdetail = true
    app.valiUserUrl(e, this.data.userInfo)
  },
  suggestUserUrl: function (e) {
    app.globalData.showdetail = true
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  gotoUserauth: function () {
    app.gotoUserauth();
  },
  downappfun: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({url: url})
  },
  // 共用footer
  jumpThisLink: function (e) {
    app.jumpThisLink(e);
  },
  initFooterData: function () {
    this.setData({
      footerImgs: footerjs.footerImgs,
      publishActive: footerjs.publishActive,
      showPublishBox: footerjs.showPublishBox
    })
  },
  doPublishAction: function () {
    footerjs.doPublishAction(this);
  },
  closePublishAction: function () {
    footerjs.closePublishAction(this);
  },
  valiUserCard: function () {
    let userInfo = this.data.userInfo;
    footerjs.valiUserCard(this, app, userInfo);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initFooterData();
    this.initGetIntegralList();
    this.getAdvertising();
    //初始化联系客服电话号码
    this.setData({
      callServicePhone: app.globalData.joingroup.slice(5, 6)[0].text
    })
  },
  initGetIntegralList: function () {
    let _this = this;
    app.initSystemInfo(function (res) {
      if (res && res.platform != "ios") {
        _this.setData({
          showRecharge: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initUserInfo();
    footerjs.initMsgNum(this);
    app.initResume(this)
  },
  releaselive() {
    app.globalData.showdetail = true
    wx.navigateTo({
      url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
    })
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
    wx.showNavigationBarLoading()
    //wx.startPullDownRefresh()
    footerjs.initMsgNum(this);
    this.initUserInfo(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();
    })
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
    return app.getUserShareJson();
  },
  onShareTimeline: function () {
    let commonShareTips = app.globalData.commonShareTips;
    let commonShareImg = app.globalData.commonShareImg;
    return {
      title: commonShareTips,
      imageUrl: commonShareImg
    }
  }
})
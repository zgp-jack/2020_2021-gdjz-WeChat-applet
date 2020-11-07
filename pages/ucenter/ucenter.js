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
    userInfo: false,
    member: {},
    showReturnIntegral: false,
    showAuthor: false,
    resumeText: "",
    advertising: false,//广告轮播图
    bannerImg: app.globalData.apiImgUrl + 'ws/jgjzbanner2.png',
    eidticon: app.globalData.apiImgUrl + 'ws/eidticon.png',
    serviceicon: app.globalData.apiImgUrl + 'ws/serviceicon.png',
    msgicon: app.globalData.apiImgUrl + 'ws/msgicon.png',
    myzg: app.globalData.apiImgUrl + 'ws/myzg.png',
    seenme: app.globalData.apiImgUrl + 'ws/seenme.png',
    myzh: app.globalData.apiImgUrl + 'ws/myzh.png',
    seenmezh: app.globalData.apiImgUrl + 'ws/seenmezh.png',
    Recharge: app.globalData.apiImgUrl + 'ws/Recharge.png',
    obtain: app.globalData.apiImgUrl + 'ws/obtain.png',
    record: app.globalData.apiImgUrl + 'ws/record.png',
    invitation: app.globalData.apiImgUrl + 'ws/invitation.png',
    Bookkeeping: app.globalData.apiImgUrl + 'ws/Bookkeeping.png',
    secondhand: app.globalData.apiImgUrl + 'ws/second-hand.png',
    gamecenter: app.globalData.apiImgUrl + 'ws/gamecenter.png',
    mymsg: app.globalData.apiImgUrl + 'ws/mymsg.png',
    Verified: app.globalData.apiImgUrl + 'ws/Verified.png',
    verifiedquery: app.globalData.apiImgUrl + 'ws/verifiedquery.png',
    help: app.globalData.apiImgUrl + 'ws/help.png',
    setup: app.globalData.apiImgUrl + 'ws/setup.png',
    bannerbg: app.globalData.apiImgUrl + 'ws/bannerbg.png',
    bannerqz: app.globalData.apiImgUrl + 'ws/bannerqz.png',
    bannerws: app.globalData.apiImgUrl + 'ws/bannerws.png',
    bannerzg: app.globalData.apiImgUrl + 'ws/bannerzg.png',
    defaultavater: app.globalData.apiImgUrl + 'ws/defaultavater.png',
    Serviceicon2: app.globalData.apiImgUrl+'ws/Serviceicon2.png',
    toCollectUrl:'',
    findWorkRecord: [],//找活浏览记录
    ucenterAuth: app.globalData.apiImgUrl + "new-list-realname-icon.png?t=1",
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
  // 去查看找活浏览记录
  findWorkRecord: function () {
    
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
    let userUuid = wx.getStorageSync('userUuid');
    if (userUuid && userInfo) {
      userInfo.userUuid = userUuid;
    }
    if (!userInfo) {
      // this.setData({ showFastIssue: fkeyalse })
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
          //点击收藏跳转地址 有招工跳转招工 有找活没招工跳转找活  都没有跳转招工
          if(mydata.member.resume_collect_count > 0 && mydata.member.job_collect_count == 0){
            _this.setData({
              toCollectUrl:'/pages/collect/resume/resume'
            })
          }else {
            _this.setData({
              toCollectUrl:'/pages/collect/info/info'
            })
          }
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
  // 发送验证是否有找活名片及找活浏览记录请求
  reqRecordData: function () {
    // 用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) return;
    let mid = userInfo.userId;
    // 请求页数
    let page = 1;
    // 请求参数
    let params = { mid, page }
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: 'focus-me/zh-view-list/',
      way: 'POST',
      params: params,
      success: function (res) {
        wx.hideLoading();
        if (res.data.errcode == "success") {
          // 浏览记录数据
          let recordInfo = JSON.stringify(res.data.data);
          wx.navigateTo({
            url: `/pages/findwork-browsing-record/recordlist/index?recordInfo=${recordInfo}`,
          })
        }else if(res.data.errcode == "have_not_zh"){
          // 没有找活名片提示框去发布找活名片
          wx.showModal({
            title: '',
            content: res.data.errmsg,
            confirmText: "去发布",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
                })
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel:false,
            success: function (res) {
            }
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none"
        })
      }
    })
  },
  // 发送验证是否有招工信息及浏览记录请求
  getRecruitLists: function () {
    // 用户uid
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) return
    let mid = userInfo.userId;
    // 请求页数
    let page = 1;
    // 请求参数
    let params = { page, mid }
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: 'focus-me/zg-my-list/',
      way: 'POST',
      params: params,
      success: function (res) {
        if (res.data.errcode == "success") {
          wx.hideLoading();
          // 浏览记录数据
          let recordInfo = JSON.stringify(res.data.data);
          wx.navigateTo({
            url: `/pages/recruitworker-browsing-record/recruit-worker-lists/index?recordInfo=${recordInfo}`,
          })
        }else if (res.data.errcode == "have_not_zg_ing") {
          // 有招工信息，没有正在招的跳转到招工信息列表
          wx.showModal({
            title: '',
            content: res.data.errmsg,
            confirmText: "去修改",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/published/recruit/list',
                })
              }
            }
          })
        }else if (res.data.errcode == "have_not_zg") {
          // 没有招工信息，跳转到发布招工界面
          wx.showModal({
            title: '',
            content: res.data.errmsg,
            confirmText: "去发布",
            success: function (res) {
              if (res.confirm) {
                app.initJobView()
              }
            }
          })
        }else {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel:false,
            success: function (res) {
            }
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none"
        })
      }
    })
  },
  valiUserUrl: function (e) {
    let url = e.currentTarget.dataset.url;
    // 用户信息
    let userInfo = this.data.userInfo;
    // 如果有用户信息判断点击的是否是招工找活的“谁看过我”
    if (userInfo) {
      // 点击“我的找活—谁看过我”
      if (url === '/pages/findwork-browsing-record/recordlist/index') {
        // 没有找活名片给出去发布找活名片提示信息,有找活名片前往浏览记录
        this.reqRecordData()
      }else if(url === '/pages/recruitworker-browsing-record/recruit-worker-lists/index'){
        this.getRecruitLists()
      }else{
        app.globalData.showdetail = true
        app.valiUserUrl(e, this.data.userInfo)
      }
    }else{
      app.globalData.showdetail = true
      app.valiUserUrl(e, this.data.userInfo)
    }
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
      callServicePhone: app.globalData.serverPhone
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
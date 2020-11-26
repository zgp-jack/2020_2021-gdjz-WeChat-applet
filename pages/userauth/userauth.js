// pages/userauth/userauth.js bindGetUserInfo
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: app.globalData.apiImgUrl + "userauth-topicon.png"
  },
  returnPrevPage:function(){
    wx.navigateBack({ delta: 1 })
  },
  bindGetUserInfo :function(e){
    let that = this;
    app.bindGetUserInfo(e, function (res) {
      app.mini_user(res, function (res) {
        app.api_user(res, function (res) {
          let uinfo = res.data;
          if (uinfo.errcode == "ok") {
            let userInfo = {
              userId: uinfo.data.id,
              token: uinfo.data.sign.token,
              tokenTime: uinfo.data.sign.time,
            }
            let userUuid = uinfo.data.uuid;
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            wx.setStorageSync('userUuid', userUuid)
            let pages = getCurrentPages();
            let r = "/" + pages[0].route;
            let prevPage = pages[pages.length - 2];
            prevPage.setData({ userInfo:userInfo,userUuid:userUuid });
            wx.navigateBack({ delta: 1 })
            app.activeRefresh()
          } else if (uinfo.errcode == "member_shielding") {
            wx.showModal({
              content: uinfo.errmsg,
              cancelText: "知道了",
              confirmText: "联系客服",
              success: function (res) {
                if (res.confirm) {
                  wx.makePhoneCall({
                    phoneNumber: uinfo.service_tel,
                  })
                }
              }
            })
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
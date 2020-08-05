// pages/fast/tips/tips.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    userInfo: false,
    icon: app.globalData.apiImgUrl + 'mini-fast-success-icon.png'
  },
  goToResumeList:function(){
    wx.reLaunch({
      url: '/pages/findingworkinglist/findingworkinglist',
    })
  },
  manageRecuit:function(){
    wx.reLaunch({
      url: '/pages/published/recruit/list',
    })
  },
  //登录状态下打开招工信息列表
  manageRecruit:function () {
    wx.reLaunch({
      url: '/pages/published/recruit/list',
    })
  },
  bindGetUserInfo:function(e){
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
            that.setData({
              userInfo: userInfo
            })
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            app.appRequestAction({
              title: "发布中",
              mask: true,
              failTitle: "网络错误，保存失败！",
              url: "fast-issue/to-job/",
              way: "POST",
              params: { 
                token: that.data.token,
              },
              success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                  wx.reLaunch({
                    url: '/pages/published/recruit/list',
                  })
                }else{
                  app.showMyTips(mydata.errmsg);
                  }}
            })
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  initUserinfo:function(){
    let u = wx.getStorageSync('userInfo')
    if(u){
      this.setData({
        userInfo: u
      })
    }
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: options.token
    })
    this.initUserinfo()
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
    console.log("tips",this.data.token)
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

  }
})
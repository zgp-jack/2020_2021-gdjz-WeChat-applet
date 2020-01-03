// pages/clients-looking-for-work/finding-top/findingtop.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    point:0,
    daynumber:1,
    imgDetelte: '../../../images/delete.png',
    areaTextcrum:[]
  },
  jumpstickyrule(){
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/the-sticky-rule/stickyrule",
    })
  },
  jumpdetail(){
    let that = this;
    let all = JSON.stringify(that.data.areaTextcrum);
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/the-sticky-rule/stickyrule?area= ${all}`,
    })
  },
  bindGetUserInfo: function (e) {
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
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            that.setData({ userInfo: userInfo });
            // that.getdetail();
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  returnPrevPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  authrasution() {
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    if (!userInfo) {
      this.setData({
        userInfo: false
      })
      return false;
    }
  
  },
  deletelable(e) {
    let that = this;
    let number = e.currentTarget.dataset.index;
    that.data.areaTextcrum.splice(number, 1)
    that.setData({
      areaTextcrum: that.data.areaTextcrum
    })
  },
  getproviem(){
    console.log(this.data.areaTextcrum)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.authrasution()
   
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
    this.getproviem()
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
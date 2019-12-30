// pages/information/complain/complain.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    page: 1,
    newmessage:{
      type3:'/pages/clients-looking-for-work/finding-name-card/findingnamecard',// 3 名片列表
      type4:'/pages/realname/realname',// 4 证书信息
      type5:'/pages/integral/source/source',// 5 项目信息
    }

  },

  getMymessage: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    this.setData({ userInfo: userInfo })
    wx.showLoading({ title: '数据加载中' })
    app.doRequestAction({
      url: "member/message-of-type/",
      way: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        mid: userInfo.userId,
        token: userInfo.token,
        time: userInfo.tokenTime,
        uuid: userUuid,
      },
      params: {
        type:_this.data.type,
        page: _this.data.page,
    },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;
        _this.setData({
          lists: mydata.data.lists,
        })
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败，请稍后重试！',
          icon: "none",
          duration: 5000
        })
      }
    })
  },
  valiUserUrl:function(){
    let type = this.data.type
    let jtype = "type" + type
    wx.navigateTo({
      url: this.data.newmessage[jtype]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type =options.type
    this.setData({
      type: type
    })
    this.getMymessage()
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

  }
})
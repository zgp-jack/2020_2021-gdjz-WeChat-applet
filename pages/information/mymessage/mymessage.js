// pages/information/mymessage/mymessage.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    newmessage:{
      type1:'/pages/information/system/system',// 1 系统消息
      type2:'/pages/information/wanted/wanted',// 2 招工信息
      type3:'/pages/information/recruit/recruit',// 3 名片信息
      type7:'/pages/information/leaveword/leaveword',// 7 留言信息
      type6:'/pages/information/complain/complain'// 6 投诉信息
    }
  },
  // {
  //   "1": "系统信息",
  //   "2": "招工信息",
  //   "3": "名片信息",
  //   "4": "证书信息",
  //   "5": "项目信息",
  //   "7": "留言信息",
  //   "6": "投诉招工信息",
  //   "10": "投诉找活信息",
  //   "8": "积分管理",
  //   "9": "实名认证"
  //  }
  valiUserUrl: function (e) {
    let type = e.currentTarget.dataset.type
    let jtype = "type" + type
    wx.navigateTo({
      url: this.data.newmessage[jtype] + "?type="+type
    })
  },
  getMymessage: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    this.setData({ userInfo: userInfo })
    wx.showLoading({ title: '数据加载中' })
    app.doRequestAction({
      url: "member/user-messages/",
      way: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        mid: userInfo.userId,
        token: userInfo.token,
        time: userInfo.tokenTime,
        uuid: userUuid,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
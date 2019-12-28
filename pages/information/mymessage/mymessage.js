// pages/information/mymessage/mymessage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
  },
  valiUserUrl: function (e) {
    let type = e.currentTarget.dataset.type
    // console.log(type, "1")
    switch (type) {
      case 1:
        wx.navigateTo({
          url: '/pages/information/system/system?type=' + type
        })
        break
      case 2:
        wx.navigateTo({
          url: '/pages/information/wanted/wanted?type=' + type
        })
        break
      case 3:
        wx.navigateTo({
          url: '/pages/information/recruit/recruit?type=' + type
        })
        break
      case 7:
        wx.navigateTo({
          url: '/pages/information/leaveword/leaveword?type=' + type
        })
        break
      case 6:
        wx.navigateTo({
          url: '/pages/information/complain/complain?type=' + type
        })
        break
      default:
        console.log(e, "没有状态")

        break
    }
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
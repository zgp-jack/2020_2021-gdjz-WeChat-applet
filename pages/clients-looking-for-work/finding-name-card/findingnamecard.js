// pages/Finding a name card.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    userimg:''
  },
  toperfect(){
    wx.navigateTo({
      url: '/pages/clients-looking-for-work/essential-information/esinformation',
    })
  },
  namerequest() {
    let _this = this;
    let userId = '';
    let token = '';
    let tokenTime = '';
    let message = wx.getStorageSync("userInfo")
    console.log(message)

    let usermessage = {
      userId: message.userId,
      token: message.token,
      tokenTime: message.tokenTime
    }

    app.doRequestAction({
      url: 'resumes/resume-list/',
      way: 'POST',
      params: usermessage,
      success(res) {
        console.log(res)
        _this.setData({
          username: res.data.info.username,
          userimg: res.data.info.headerimg
        })
      }
    })
    
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.namerequest();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
     
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
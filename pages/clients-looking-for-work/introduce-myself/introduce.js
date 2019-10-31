// pages/introduce-myself/ introduce.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    digital: 0,
    showModal: false,
    num: 1,
    numone: true,
    numtwo: false
  },
  changenumone() {
    this.setData({
      num: 1,
      numone: true,
      numtwo: false
    })
  },
  changenumtwo() {
    this.setData({
      num: 2,
      numtwo: true,
      numone: false
    })
  },
  TextAreaBlur(e) {
    this.setData({
      digital: e.detail.value.length
    })
  },
  btn: function () {
    this.setData({
      showModal: true
    })
  },
  obtn() {
    this.setData({
      showModal: false
    })
  },
  preventTouchMove: function () {
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

  }
})
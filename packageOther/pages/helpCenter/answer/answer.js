// packageOther/pages/helpCenter/answer/answer.js
const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前手机平台信息ios或者Android
    system: '',
    // 后台返回的html字符串
    answer:"",
    // 问题标题
    title:"",
    // 问题id
    id:""
  },
  // 获取当前设备平台信息ios或者android
  initGetIntegralList:function(){
    let _this = this;
    app.initSystemInfo(function(res){
        if (res && res.platform == "ios"){
          _this.setData({
            system: 'ios'
          })
        }else if( res && res.platform != "ios"){
          _this.setData({
            system: 'android'
          })
        }
    })
  },
  // 点击解决或者未解决发送给后台
  questionStaus: function (e) {
    let val = parseInt(e.currentTarget.dataset.val);
    let id = parseInt(this.data.id)
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: "others/feedback-effective/",
      way: "GET",
      params: { id, val },
      success: function(res) {
        wx.hideLoading();
        let mydata = res.data
        if(mydata.errcode == "ok"){
          wx.showToast({
            title: mydata.errmsg,
            icon: 'none',
            duration: 5000
          })
          if (val == 2) {
            wx.navigateTo({
              url: '/packageOther/pages/others/message/publish/publish',
            })
          }
        }else{
          wx.showToast({
            title: mydata.errmsg,
            icon: 'none',
            duration: 5000
          })
        }
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showToast({
            title: '加载失败，请稍后重试！',
            icon: 'none',
            duration: 5000
        })
      }
    })
  },
  // 初始化options数据
  initOptions:function(options){
    if (options.hasOwnProperty("id")) {
      this.setData({
        id: options.id
      })
    }
  },
  // 初始化问题回答数据
  initAnswer: function (options) {
    let _this = this;
    let id = options.id
    wx.showLoading({ title: '数据加载中' })
    // 获取手机设备的平台信息ios或者Android
    _this.initGetIntegralList()
    let system = _this.data.system
    app.appRequestAction({
      url: "others/feedback-detail/",
      way: "GET",
      params: { id, system },
      success: function(res) {
        wx.hideLoading();
        let mydata = res.data
        console.log("mydata",mydata)
        if(mydata.errcode == "ok"){
          _this.setData({
            answer: mydata.data.answer,
            title: mydata.data.question
          })
          WxParse.wxParse('answer', 'html', mydata.data.answer,_this,5);
        }else{
          wx.showToast({
            title: mydata.errmsg,
            icon: 'none',
            duration: 5000
          })
        }
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showToast({
            title: '加载失败，请稍后重试！',
            icon: 'none',
            duration: 5000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initOptions(options)
    this.initAnswer(options)
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
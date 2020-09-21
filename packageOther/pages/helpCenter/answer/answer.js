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
    id:"",
    // 反馈按钮的可点击状态
    clickStatus: true,
    // 视频连接
    video: "",
    // 可点击状态
    effective: true
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
    let that = this;
    // 获取点击按钮的val
    let val = parseInt(e.currentTarget.dataset.val);
    let id = parseInt(this.data.id);
    wx.showLoading({ title: '数据加载中' })
    // 发送反馈状态请求
    app.appRequestAction({
      url: "others/feedback-effective/",
      way: "POST",
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
          that.setData({ effective: false })
          // 点击是未解决条状到问题反馈界面
          if (val == 2) {
            wx.redirectTo({
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
    // 判断是否有id，有存入data
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
            title: mydata.data.question,
            video: mydata.data.video,
            //有效性统计 为‘’可以点击，'1'上次点击有用，‘2‘上次点击没用
            effective: (mydata.data.effective == '' || mydata.data.effective == 2) ? true:false
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
  // 初始化按钮的可点击状态
  initButtonStatus: function () {
    // 问题id
    let id = this.data.id;
    // 获取点击按钮时间
    let questionList = wx.getStorageSync('questionList')
    for (const value of questionList) {
      if (value.id == id) {
        if (value.clickTime) {
          // 点击时间
          let clickTime = value.clickTime;
          // 获取当前进入页面时间
          let nowTime = new Date().getTime()
          // 计算时间差
          let spaceTime = (nowTime - clickTime)/1000/3600
          // 超过1小时按钮变成可点击否则不可点击
          if (spaceTime > 1) {
            this.setData({clickStatus:true})
          }else{
            this.setData({clickStatus:false})
          }
        }else{
          this.setData({clickStatus:true})
        }
      }
    }
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
    this.initButtonStatus()
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
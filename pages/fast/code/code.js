// pages/publish/code/code.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendrefresh: 60,
    token: '',
    phone: '',
    timer: null,
    code: '',
    imageUrl: app.globalData.apiImgUrl +"new-publish-title-t-icon.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: options.token,
      phone: options.tel
    })
    this.initCodeTime()
  },
  enterCode:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  initCodeTime: function () {
    let _this = this;
    let codeTime = this.data.sendrefresh;
    _this.data.timer = setInterval(function () {
        codeTime--;
        _this.setData({ sendrefresh: codeTime })
        if (codeTime == 0) {
            clearInterval(_this.data.timer);
            return false;
        }
    }, 1000)
  },
  reGetPhoneCode:function(){
    
    let _this = this;
    let phone = this.data.phone;

    app.appRequestAction({
        title: "正在获取验证码",
        mask: true,
        failTitle: "网络错误，验证码获取失败！",
        url: "fast-issue/get-code/",
        way: "POST",
        params: { phone: phone},
        success: function (res) {
            let mydata = res.data;
            app.showMyTips(mydata.errmsg);
            //console.log(mydata);
            if (mydata.errcode == "ok") {
                _this.setData({ sendrefresh: 60 });
                _this.initCodeTime();
            }
        }
    })
  },
  // 设置缓存保留已填写信息
  setEnterInfo: function (name, data) {
    let regx = /1[3-9]\d{9}/g
    let key = 'jiSuData'
    let jiSuData = wx.getStorageSync(key)
    if (name === "phone") {
      if (regx.test(data)) {
        if (jiSuData) {
          jiSuData[name] = data
        } else {
          jiSuData = {}
          jiSuData[name] = data
        }
      } else {
        if (jiSuData) {
          jiSuData[name] = ""
        }
      }
    } else {
      if (jiSuData) {
        jiSuData[name] = data
      } else {
        jiSuData = {}
        jiSuData[name] = data
      }
    }
    wx.setStorageSync(key, jiSuData)
  },
  surePublishAction:function(){
    let that = this
    let { phone, code, token } = this.data;
    app.appRequestAction({
        title: "发布中",
        mask: true,
        failTitle: "网络错误，发布失败！",
        url: "fast-issue/check-code/",
        way: "POST",
        params: { 
          phone: phone,
          code: code,
          token: token
        },
        success: function (res) {
            let mydata = res.data;
            if (mydata.errcode == "ok") {
                wx.redirectTo({
                  url: '/pages/fast/area/area?token=' + token
                })
            }else{
              app.showMyTips(mydata.errmsg);
            }
        }
    })
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
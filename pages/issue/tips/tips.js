// pages/fast/tips/tips.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: false,
    icon: app.globalData.apiImgUrl + 'mini-fast-success-icon.png'
  },
  goToResumeList:function(){
    wx.reLaunch({
      url: '/pages/findingworkinglist/findingworkinglist',
    })
  },
  manageRecruit:function(){
    wx.reLaunch({
      url: '/pages/published/recruit/list',
    })
  },
  bindGetUserInfo: function (e) {
    let that = this
    //如果选择授权 则含有用户信息 
    if (e.detail.userInfo) {
      wx.showToast({
        title: '正在授权',
        icon: 'loading',
        duration: 500
      });
      app.globalData.userInfo = e.detail.userInfo; //设置用户信息 
      // 登录 获取在我们这里user_id
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发起网络请求
            wx.request({
              url: app.globalData.apiRequestUrl + 'user/user-info/',
              data: {
                code: res.code,
                wechat_token: app.globalData.requestToken
              },
              success: function (resdata) {

                //获取到session_key 解密 
                var session_key = resdata.data.session_key
                
                that.mini_user(session_key)
              },
              fail: function (error) {

              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else {
      console.log('拒绝授权')
    }
  },
  mini_user: function (session_key) {
    var that = this
    wx.getSetting({
      success: (res) => {

        if (!res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            fail: () => {
              wx.openSetting({})
            },
            success: (res) => {
              /**获取encryptdata **/
              that.api_user(session_key);
            }
          })
        } else {
          /**获取encryptdata **/
          that.api_user(session_key)
        }
      }
    })
  },
  api_user(session_key) {
    let that = this;
    wx.getUserInfo({
      success: (res) => {
        let encryptedData = res.encryptedData
        let iv = res.iv
        var params = new Object()
        let _source = wx.getStorageSync("_source");

        let fastId = wx.getStorageSync("fastId");
        let fastTel = wx.getStorageSync("fastTel");
        let userJiSuPublishedData = wx.getStorageSync("userJiSuPublishedData");
        let fastJobId = wx.getStorageSync("fastJobId") ? wx.getStorageSync("fastJobId") : "";
        if (fastId && fastTel) {
          params.fastId = fastId;
          params.phone = fastTel;
        }
        params.fast_job_id = fastJobId;

        params.session_key = session_key
        params.encryptedData = encryptedData
        params.iv = iv
        params.refid = app.globalData.refId
        params.source = _source ? _source : "";
        params.wechat_token = app.globalData.requestToken
        params.data = userJiSuPublishedData || []
        //发起请求  
        wx.request({
          url: app.globalData.apiRequestUrl + '/user/make-user/',
          data: params,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.hideToast();
            let uinfo = res.data;
            if (uinfo.errcode == "ok") {
              let userInfo = {
                userId: uinfo.data.id,
                token: uinfo.data.sign.token,
                tokenTime: uinfo.data.sign.time,
              }
              app.getUserUuid(userInfo)
              that.setData({
                userInfo: userInfo
              })
              app.globalData.userInfo = userInfo;
              wx.setStorageSync('userInfo', userInfo)
              wx.removeStorageSync("userJiSuPublishedData")
              wx.reLaunch({
                url: '/pages/published/recruit/list',
              })
            } else {
              app.showMyTips(uinfo.errmsg);
            }
            // 授权用户执行操作
            
          },
          fail: function(){
            wx.hideToast();
          }
        })

      }
    })
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
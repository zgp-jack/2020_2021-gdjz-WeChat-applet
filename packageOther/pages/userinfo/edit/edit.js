// pages/userinfo/edit/edit.js
const app = getApp();
let vali = require("../../../../utils/v.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passtype: true,
    username: "",
    phone: "",
    code: "",
    pass: "",
    dis: 1,
    userInfo: {},
    codeTips: "获取验证码",
    getCode: true
  },
  changeInputType: function () {
    this.setData({
      passtype: !this.data.passtype
    })
  },
  enterUsername: function (e) {
    let reg = /^[\u4e00-\u9fa5]$/
    let value = e.detail.value
    let values = value.split("")
    let userNames = []
    for (let i = 0; i < values.length; i++) {
        if (reg.test(values[i])) {
            userNames.push(values[i])
        }
    }
    let userName = userNames.join("")
    this.setData({
      username: userName
    })
  },
  enterUserphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  enterPhoneCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  enterUserpass: function (e) {
    this.setData({
      pass: e.detail.value
    })
  },
  getPhoneCode: function (e) {
    let _this = this;
    let dis = parseInt(e.currentTarget.dataset.dis);
    if (!dis) return false;
    let phone = this.data.phone;
    let v = vali.v.new();
    let userInfo = this.data.userInfo;
    if (v.isMobile(phone)) {
      wx.showLoading({ title: '正在获取验证码' })
      app.doRequestAction({
        url: "index/get-code/",
        way: "POST",
        params: {
          userId: userInfo.userId,
          token: userInfo.token,
          tokenTime: userInfo.tokenTime,
          tel: phone,
          sendType: "have"
        },
        success: function (res) {
          wx.hideLoading();
          _this.setData({
            getCode: false
          })
          let mydata = res.data;
          app.showMyTips(mydata.errmsg);
          if (mydata.errcode == "ok") {
            let _time = mydata.refresh;
            _this.initCountDown(_time);
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: "网络错误，获取失败！",
            icon: "none",
            duration: 2000
          })
        }
      })
    } else {
      console.log(_this.data.phone)
      if (!_this.data.phone) {
        app.showMyTips("请输入正确的手机号！");
        return false;
      }
      if (!v.isMobile(_this.data.phone)) {
        app.showMyTips("手机号输入有误！");
        return false;
      }
    }
  },
  initCountDown: function (_time) {
    let _t = parseInt(_time);
    let _this = this;
    this.setData({
      dis: 0,
      codeTips: _t + "秒后重试"
    });
    let timer = setInterval(function () {
      _t--;
      if (_t == 0) {
        clearInterval(timer);
        _this.setData({
          dis: 1,
          codeTips: "获取验证码"
        })
        return false;
      }
      _this.setData({ codeTips: _t + "秒后重试" })
    }, 1000)
  },
  userSubmitInfo: function () {
    let v = vali.v.new();
    let _this = this;
    if (!v.isRequire(this.data.username, 2)) {
      app.showMyTips("请输入2~5字纯中文姓名!");
      return false;
    }
    if (!this.data.phone) {
      app.showMyTips("请输入正确的手机号！");
      return false;
    }
    if (!v.isMobile(this.data.phone)) {
      app.showMyTips("手机号输入有误！");
      return false;
    }
    if (!v.isRequire(this.data.code, 2) && !_this.data.getCode) {
      app.showMyTips("请输入正确的验证码！");
      return false;
    }
    if (!v.isRequire(this.data.code, 2) && _this.data.getCode) {
      app.showMyTips("请先获取验证码！");
      return false;
    }
    if (!v.isRequireLen(this.data.pass, { min: 6, max: 16 })) {
      app.showMyTips("密码由6-16位数字字母和._组成！");
      return false;
    }
    let userInfo = this.data.userInfo;
    wx.showLoading({ title: '正在保存资料' })
    app.doRequestAction({
      url: "user/bind-tel/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        username: _this.data.username,
        pwd: _this.data.pass,
        tel: _this.data.phone,
        code: _this.data.code
      },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;

        if (mydata.errcode == "ok") {
          wx.showModal({
            title: '温馨提示',
            content: mydata.errmsg,
            showCancel: false,
            success: function () {
              wx.reLaunch({
                url: '/pages/ucenter/ucenter',
              })
            }
          })
        } else {
          app.showMyTips(mydata.errmsg);
        }
      },
      fail: function () {
        wx.hideLoading();
        app.showMyTips("网络出错，修改失败！");
      }
    })
  },
  initUserinfo: function () {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initUserinfo();
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

})
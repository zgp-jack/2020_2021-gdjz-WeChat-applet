// pages/clients-looking-for-work/finding-top/findingtop.js
const app = getApp();
let v = require("../../../utils/v.js");
let reminder = require("../../../utils/reminder.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    point: 0,
    daynumber: 1,
    imgDetelte: app.globalData.apiImgUrl + "lpy/delete.png",
    areaTextcrum: [],
    max_number: "",
    province_integral: "",
    value: 1,
    areaTextId: "",
    top_rules: [],
    max_top_days:""
  },

  jumpstickyrule() {
    let that = this;
    let max_number = that.data.max_number
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/the-sticky-rule/stickyrule?maxnumber=${max_number}`,
    })
  },
  jumpdetail() {
    let that = this;
    let all = JSON.stringify(that.data.areaTextcrum);
    let max_number = that.data.max_number
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/the-sticky-rule/stickyrule?maxnumber=${max_number}&area= ${all}`,
    })
  },
  bindGetUserInfo: function (e) {
    let that = this;
    app.bindGetUserInfo(e, function (res) {
      app.mini_user(res, function (res) {
        app.api_user(res, function (res) {
          let uinfo = res.data;
          if (uinfo.errcode == "ok") {
            let userInfo = {
              userId: uinfo.data.id,
              token: uinfo.data.sign.token,
              tokenTime: uinfo.data.sign.time,
            }
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            that.setData({ userInfo: userInfo });
            // that.getdetail();
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  dayclocy(e) {
    console.log(e)
    let that  = this;
    if (e) {
      var re = /^\d{0,2}$/;
      if (!re.test(e.detail.value)) {
        wx.showModal({
          title: '温馨提示',
          content: '只能输入整数，请重新输入',
          showCancel: false,
          success(res) {
            
            that.setData({
              daynumber: ''
            })
           }
        })
        return
      }
      this.data.value = e.detail.value;
      let value = this.data.value;
      let num = this.data.province_integral;
      let length = this.data.areaTextcrum.length;
      this.setData({
        point: value * num * length
      })
    } else {
      let value = this.data.value;
      let num = this.data.province_integral;
      let length = this.data.areaTextcrum.length;
      this.setData({
        point: value * num * length
      })
    }

  },
  areaId() {
    // areaText
    let id = '';
    let areaText = this.data.areaTextcrum;
    for (let i = 0; i < areaText.length; i++) {
      if (i >= areaText.length - 1) {
        id += areaText[i].id
      } else {
        id += areaText[i].id + ","
      }
    }
    this.data.areaTextId = id;
  },
  submitscop() {
    let that = this;
    let day = that.data.max_top_days;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    if (!userInfo || !userUuid) {
      wx.showModal({
        title: '温馨提示',
        content: '网络出错，请稍后重试',
        showCancel: false,
        success(res) { }
      })
      return
    }
    let vertifyNum = v.v.new()
    

    if (vertifyNum.isNull(this.data.areaTextcrum)) {
      reminder.reminder({ tips: '置顶城市' })
      return
    }
    if (vertifyNum.isNull(this.data.value)) {
      wx.showModal({
        title: '温馨提示',
        content: '输入的置顶天数不能为0或者为空',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (that.data.value - 0 > day) {
      app.showMyTips(`最多可置顶${day}天！`);
      return
    }

    that.areaId()
    let detail = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      uuid: userUuid,
      days: that.data.value,
      citys: 0,
      provinces: that.data.areaTextId
    }

    app.appRequestAction({
      url: 'resumes/do-top/',
      way: 'POST',
      params: detail,
      mask: true,
      success: function (res) {
        let mydata = res.data;
        console.log(mydata)
        if (mydata.errcode == "ok") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (mydata.errcode == "resume_null") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            // showCancel: false,
            success(res) {
              wx.navigateTo({
                url: `/pages/clients-looking-for-work/finding-name-card/findingnamecard`,
              })
            }
          })
          return
        } else if (mydata.errcode == "get_integral") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            success(res) {
              if (res.confirm == true) {
                wx.navigateTo({
                  url: `/pages/getintegral/getintegral`,
                })
              }
            }
          })
          return
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          return
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {

          }
        })
      }
    })
  },
  returnPrevPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  authrasution() {
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    if (!userInfo) {
      this.setData({
        userInfo: false
      })
      return false;
    }

  },
  deletelable(e) {
    let that = this;
    let number = e.currentTarget.dataset.index;
    console.log(number)
    that.data.areaTextcrum.splice(number, 1)
    that.setData({
      areaTextcrum: that.data.areaTextcrum
    })
    that.dayclocy()
  },
  getdetail() {
    let that = this;
    app.appRequestAction({
      url: 'resumes/top-config/',
      way: 'POST',
      success: function (res) {
        let mydata = res.data;
        console.log(mydata)
        if (mydata.errcode == "ok") {
          that.setData({
            max_number: mydata.data.max_number,
            province_integral: mydata.data.province_integral,
            top_rules: mydata.data.top_rules,
            max_top_days: mydata.data.max_top_days,
          })

        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) { }
          })
          return
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.authrasution()
    this.getdetail()
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
    this.dayclocy()
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
  // onShareAppMessage: function () {

  // }
})
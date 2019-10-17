// pages/ucard/ucard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    cardInfo: {},
    showCardSet: false
  },
  previewImage: function(e) {
    let src = e.currentTarget.dataset.src;
    let _this = this;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: _this.data.cardInfo.view_images
    })
  },
  initMycardInfo: function() {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo
    })
    app.appRequestAction({
      url: "resume/my-resume-info/",
      way: "POST",
      params: userInfo,
      success: function(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          let _data = mydata.data;
          _this.setData({
            cardInfo: _data
          })

          if (_data.show_tips == "1"){
            app.returnPrevPage(_data.check_tips_string);
          }
        } else {
          wx.showModal({
            title: '很抱歉',
            content: mydata.errmsg,
            success: function(res) {
              wx.reLaunch({
                url: '/pages/ucenter/ucener',
              })
            }
          })

        }
      }
    })
  },
  hideCradSet: function() {
    this.setData({
      showCardSet: false
    })
  },
  setMycard: function() {
    this.setData({
      showCardSet: true
    })
  },
  setMycardStatus: function() {
    let userInfo = this.data.userInfo;
    let _this = this;
    app.appRequestAction({
      url: "resume/resume-end-status/",
      way: "POST",
      title: "正在修改状态",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        infoId: _this.data.cardInfo.id
      },
      success: function(res) {
        let mydata = res.data;
        console.log(mydata);
        app.showMyTips(mydata.errmsg);
        if (mydata.errcode == "ok") {
          _this.setData({
            "cardInfo.is_end": mydata.end_status
          })
          wx.navigateBack({ delta: 1 })
        }

      }
    })
  },
  settopMycard: function() {
    let userInfo = this.data.userInfo;
    let _this = this;
    app.appRequestAction({
      url: "resume/update-time/",
      way: "POST",
      title: "正在置顶名片",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        infoId: _this.data.cardInfo.id
      },
      success: function(res) {
        let mydata = res.data;
        app.showMyTips(mydata.errmsg);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initMycardInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return app.getUserShareJson();
  }
})
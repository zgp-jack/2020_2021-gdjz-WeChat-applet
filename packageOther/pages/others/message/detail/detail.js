// packageOther/pages/others/message/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 反馈详情id
    id:"",
    // 反馈信息详情
    feedbackDetail:[],
    // 点击已解决或者未解决的显示和可否点击状态
    useful: 0,
    // 选中状态图片
    chooseImage: app.globalData.apiImgUrl + "choose-status",
    // 电话号码
    serverPhone: app.globalData.serverPhone
  },
  initFeedDetail: function (options) {
    let _this = this;
    // 反馈详情id
    let id = options.id
    wx.showLoading({ title: '数据加载中' })
    // 发送详情请求
    app.appRequestAction({
      url: "others/message-detail/",
      way: "POST",
      params: {
        id,
      },
      success: function(res) {
        wx.hideLoading();
        let mydata = res.data
        if (mydata.errcode == "ok") {
          _this.setData({
            feedbackDetail: mydata.data,
            useful: mydata.data.useful
          })
        }else{
          wx.showToast({
            title: mydata.errmsg,
            icon: "none",
            duration: 3000
          })
        }
      },
      fail: function(err) {
        wx.showToast({
            title: '数据加载失败！',
            icon: "none",
            duration: 3000
        })
      }
    })
  },    
  // 点击图片查看大图
  previewImage: function (e) {
    // 点击图片url
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, 
      urls: [url] 
    })
  },   
  // 点击已解决或者未解决反馈状态
  feedbackResult: function (e) {
    let _this = this
    let val = e.currentTarget.dataset.val;
    // 电话号码
    let serverPhone = _this.data.serverPhone;
    let id = this.data.id
    if (val == 2) {
        wx.showModal({
          title:'系统提示',
          content:`是否需要联系客服帮您解决？ 客服电话：${serverPhone}`,
          cancelColor: '#B0ADAD',
          confirmText:'拨打电话',
          confirmColor: '#0099FF',
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
              phoneNumber: serverPhone,
              })
            }
          }
        })
    }
    app.appRequestAction({
      url: "others/message-useful/",
      way: "POST",
      params: {
        id,
        val
      },
      success: function(res) {
        wx.hideLoading();
        let mydata = res.data
        if (mydata.errcode == "ok") {
          if (val == 1) {
            wx.showToast({
              title: mydata.errmsg,
              icon: "none",
              duration: 3000
            })
          }
          _this.setData({
            useful: val
          })
        }else{
          wx.showToast({
            title: mydata.errmsg,
            icon: "none",
            duration: 3000
          })
        }
      },
      fail: function(err) {
        wx.showToast({
            title: '数据加载失败！',
            icon: "none",
            duration: 3000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty("id")) {
      this.setData({ id: options.id })
    }
    console.log("options",options)
    this.initFeedDetail(options)
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
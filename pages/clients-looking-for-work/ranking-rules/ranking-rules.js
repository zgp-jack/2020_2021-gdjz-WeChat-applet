// pages/clients-looking-for-work/ranking-rules/ranking-rules.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rulestatus: "",
    list: [],
    resume_uuid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // getstatus(options) {
  //   console.log(options)
  //   this.setData({
  //     rulestatus: options.hasOwnProperty("rulestatus") ? options.rulestatus : ""
  //   })
  // },

  getdetail() {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let detail = "";
    if (userInfo) {
      detail = {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
      }
    } else {
       detail = {
        userId:"",
        token:"",
        tokenTime:"",
      }
    }
    console.log(detail)
    app.appRequestAction({
      url: 'resumes/sort-rules/',
      way: 'POST',
      params: detail,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(res)
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          that.setData({
            list: mydata.data.lists,
            listlength: mydata.data.lists.length,
            rulestatus: mydata.data.is_resume,
            resume_uuid: mydata.data.resume_uuid
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
  onLoad: function (options) {
    // this.getstatus(options)
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
    this.getdetail()
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
    let that = this;
    let status = that.data.rulestatus;

    let commonShareImg = app.globalData.commonShareImg;
    let userInfo = wx.getStorageSync("userInfo");
    let refId = userInfo.hasOwnProperty('userId') ? userInfo.userId : false;
    let uuid = that.data.resume_uuid;
    let commonShareTips = app.globalData.commonShareTips;
    if (status == 1) {

      return {
        title: commonShareTips,
        imageUrl: commonShareImg,
        path: `/pages/boss-look-card/lookcard?uuid=${uuid}&refId=${refId}&sharedekeId=1`//这是一个路径
      }
    } else {
      if (refId) {
        return {
          title: commonShareTips,
          imageUrl: commonShareImg,
          path: `/pages/index/index?refId=${refId}`//这是一个路径
        }
      } else {
        return {
          title: commonShareTips,
          imageUrl: commonShareImg,
          path: `/pages/index/index`//这是一个路径
        }
      }
    }
  }
})
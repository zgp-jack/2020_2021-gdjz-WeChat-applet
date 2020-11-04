// pages/findwork-browsing-record/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positionImage: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    page: 1,//请求页数
    lists:[],//浏览记录列表数据
  },
  reqRecordData: function () {
    let that = this;
    // 用户uid
    let uid = wx.getStorageSync('userUuid')
    // 请求页数
    let page = this.data.page;
    // 请求参数
    let params = { uid, page }
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: 'focus-me/zh-view-list/',
      way: 'POST',
      params: params,
      success: function (res) {
        if (res.data.errcode == "success") {
          wx.hideLoading();
          let list = res.data.data.list;
          // 如果请求的列表有数据就讲请求数据追加到原有数据中
          if (list &&　list.length ) {
            // 浏览记录列表数据
            let lists = this.data.lists;
            // 遍历追加数据
            for (let i = 0; i < list.length; i++) {
              lists.push(list[i]);
            }
            that.setData({ page: parseInt(page) + 1, lists: lists })
          }
          console.log(lists)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none"
        })
      }
    })
  },
  // 获取招工列表
  getRecruitLists: function () {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reqRecordData()
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
    this.reqRecordData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
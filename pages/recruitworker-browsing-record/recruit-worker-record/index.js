// pages/recruitworker-browsing-record/recruit-worker-record/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positionImage: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    page: 1,//请求页数
    id: '',//招工信息id
    hasmore: true,//是否有更多数据
    lists: [],//浏览记录数组
    child: 0,//是否子列表
    cid: "",//工种id
    aid: "",//区域id
    uuid:"",//用户uuid
    show: false,//展示界面
  },
  show: function () {
    this.setData({show:true})
    wx.hideLoading()
  },
  getRecordLists: function () {
    let zg_info_id = this.data.id;
    let that = this;
    // 用户uid
    let userInfo = wx.getStorageSync('userInfo');
    let uuid = wx.getStorageSync('userUuid');
    if (!userInfo) return
    this.setData({uuid})
    // 用户id
    let mid = userInfo.userId;
    // token
    let token = userInfo.token;
    // 请求页数
    let page = this.data.page;
    // 请求参数
    let params = { mid, page, token, zg_info_id }
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: 'focus-me/zg-view-list/',
      way: 'POST',
      params: params,
      success: function (res) {
        if (res.data.errcode == "success") {
          wx.hideLoading();
          let list = res.data.data.list;
          let _list = that.data.lists
          let len = list.length
          that.setData({
            lists: _list.concat(list),
            page: page + 1 ,
            hasmore: len < 15 ? false: true,
          })
        }else{
          wx.hideLoading();
          wx.showModal({
            showCancel: false,
            content: res.data.errmsg,
            success: function () {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
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
  // 去找活详情界面
  getDetail: function (e) {
    let uuid = e.currentTarget.dataset.uuid;
    let userLocation = wx.getStorageSync("userLocation")
    let id = ''
    if (!userLocation) {
      userLocation = ""
    } else {
      userLocation = userLocation.split(",").reverse().join(",")
    }
    if (uuid) {
      wx.navigateTo({
        url: `/pages/boss-look-card/lookcard?uuid=${uuid}&location=${userLocation}&id=${id}`
      })
    }else{
      wx.showToast({
        title: '该工人暂无找活名片',
        icon: 'none',
        duration: 3000,
        mask: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 保存url传过来的信息id
    if (options.hasOwnProperty("id")) {
      this.setData({ id: options.id })
    }
    if (options.hasOwnProperty("aid")) {
      this.setData({ aid: options.aid })
    }
    if (options.hasOwnProperty("cid")) {
      this.setData({ cid: options.cid })
    }
    this.getRecordLists()
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
    this.setData({ page: 1, lists:[], hasmore: true, show: false })
    this.getRecordLists()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let hasmore = this.data.hasmore;
    if (hasmore) {
      this.getRecordLists()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/recruitworker-browsing-record/recruit-worker-lists/index.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,//请求页数
    hasmore: true,//是否还有更多数据
    lists: [],//我的正在招工信息列表
    seeNum: 0,//浏览增加数量
    sumNum: 0,//被查看总数
  },
  getRecruitLists: function () {
    let that = this;
    // 用户uid
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) return
    let mid = userInfo.userId;
    // 请求页数
    let page = this.data.page;
    // 请求参数
    let params = { page, mid }
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: 'focus-me/zg-my-list/',
      way: 'POST',
      params: params,
      success: function (res) {
        if (res.data.errcode == "success") {
          wx.hideLoading();
          let list = res.data.data.list;
          // 处理查看总数和新增加浏览总数的显示
          list.forEach(item => {
            let sum_num = item.sum_num > 99? '99+' : item.sum_num;
            let unread_num = item.unread_num > 99? '99+' : item.unread_num;
            item.sum_num = sum_num;
            item.unread_num = unread_num;
          });
          let _list = that.data.lists
          let len = list.length
          that.setData({
            lists: _list.concat(list),
            page: page + 1 ,
            hasmore: len ? true: false,
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
  // 去增加曝光率
  goTop: function (e) {
    let isCheck = e.currentTarget.dataset.ischeck;//用户审核状态
    let infoIndex =e.currentTarget.dataset.index;//点击招工信息的index
    let topdata = this.data.lists[infoIndex]; //当前招工信息数据
    let id = e.currentTarget.dataset.id; // 信息id
    wx.navigateTo({
      url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=undefined&city_id=${topdata.area_id}&province_id=${topdata.province_id}&ischeck=${isCheck}`,
    })
  },
  // 跳转到招工信息的浏览记录
  goNoReadRecord: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/recruitworker-browsing-record/recruit-worker-record/index?id=${id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecruitLists()
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
    this.setData({ page: 1 })
    this.getRecruitLists()
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
    this.getRecruitLists()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/findwork-browsing-record/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positionImage: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    emptyImage: app.globalData.apiImgUrl + "yc/record-empty.png",
    page: 1,//请求页数
    lists:[],//浏览记录列表数据
    child: 0,//是否子列表
    infoId: "",
    cid: "",//工种id
    aid: "",//区域id
    more: true,
    defalutTop:'',//置顶默认区域
  },
  reqRecordData: function () {
    let more = this.data.more;
    if (!more) return  
    let that = this;
    // 用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) return;
    let mid = userInfo.userId;
    // 请求页数
    let page = this.data.page;
    // 请求参数
    let params = { mid, page }
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
            let lists = that.data.lists;
            // 遍历追加数据
            for (let i = 0; i < list.length; i++) {
              lists.push(list[i]);
            }
            that.setData({ page: parseInt(page) + 1, lists: lists })
            if (page === 1 &&　list.length < 15) {
              that.setData({ more:false })
            }
          }else{
            that.setData({ more:false })
          }
          // 请求第一页的时候讲数据保存到data中，后续下拉请求不再重复保存
          if (page === 1) {
            let zh_info = res.data.data.zh_info;
            let aid = zh_info.city;
            let cid = zh_info.classify_id;
            let defalutTop = res.data.data.default_top_area
            that.setData({ aid, cid, defalutTop })
          }
          // console.log(lists)
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
  getRecruitLists: function (e) {
    // 用户id
    let userId = e.currentTarget.dataset.userid
    // 用户姓名
    let userName = e.currentTarget.dataset.user;
    let url = `/pages/lists/recruit/index?infoId=${userId}&type=record&userName=${userName}`
    wx.navigateTo({
      url: url,
    })
  },
  // 浏览记录为空，去找活置顶
  goTop: function () {
    let topdata = JSON.stringify({ has_top : 0});
    let defalutTop = this.properties.defalutTop;
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/workingtop/workingtop?topdata=" + topdata + "&defaulttop=" + defalutTop,
    })
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
    // this.getRecruitLists()
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
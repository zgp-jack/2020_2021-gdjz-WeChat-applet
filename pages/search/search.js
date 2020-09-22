// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 历史搜索记录
    historySearch:{
      title:"搜索历史",
      historyList:[
        {
          keywords:"粘灰面"
        },{
          keywords:"飘版"
        },{
          keywords:"测试"
        },{
          keywords:"成都焊工"
        },{
          keywords:"焊工"
        },{
          keywords:"成都焊工木工"
        }
      ]
    },
    // 热门搜索记录
    hotSearch:{
      title:"热门搜索",
      hotList:[
        {
          keywords:"粘灰面"
        },{
          keywords:"飘版"
        },{
          keywords:"测试"
        },{
          keywords:"成都焊工"
        },{
          keywords:"焊工"
        },{
          keywords:"成都焊工木工"
        }
      ]
    },
    // tab切换栏
    tab: [{
      key: 0,
      title: "找工作"
      },{
      key: 1,
      title: "找工人"
      }],
    //搜索图标icon地址 
    searchIcon: app.globalData.apiImgUrl + 'yc/helpCenter-search.png',
    changeStatus: 0
  },
  //头部tab切换
  tabChange: function (e) {
    // 获取点击的类别key
    let key = e.currentTarget.dataset.key;
    this.setData({ changeStatus:key })

  },

  //获取搜索历史记录
  gethistrorList:function () {
    let his = wx.getStorageSync("searchHistory")
    console.log(his)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethistrorList()
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
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endimg: app.globalData.apiImgUrl + 'myrecruit-isend.png',
    page: 1,
    types: [{id:'all',name:'全部'},{id:'being',name:'正在招'},{id:'end',name:'已招满'}],
    current: 0,
    hasmore: true,
    lists: [],
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    checkingimg: app.globalData.apiImgUrl + 'published-info.png'
  },
  getRecruitList:function(){
    let _this = this
    let userinfo = wx.getStorageSync('userInfo')
    let userUuid = wx.getStorageSync('userUuid')
    userinfo.mid = userinfo.userId
    userinfo.uuid = userUuid
    userinfo.type = this.data.types[this.data.current].id
    userinfo.page = this.data.page
    app.appRequestAction({
      url: 'job/issue-lists/',
      way: 'POST',
      params: userinfo,
      title: '获取发布列表',
      success:function(res){
        let mydata = res.data
        if(mydata.errcode == 'ok'){
          let lists = _this.data.lists
          let newlist = mydata.data.lists
          let page = _this.data.page
          let len = newlist.length
          _this.setData({
            lists: lists.concat(newlist),
            hasmore: len ? true : false,
            page: len ? page + 1 : page
          })
        }else{
          app.showMyTips(mydata.errmsg)
        }
      }
    })
  },
  userChangeType:function(e){
    let key = e.currentTarget.dataset.key
    this.setData({
      current: parseInt(key),
      page: 1,
      hasmore: true,
      lists: []
    })
    this.getRecruitList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecruitList()
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
    if(!this.data.hasmore) return false
    this.getRecruitList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
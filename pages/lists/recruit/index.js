const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appLinkImg: app.globalData.commonDownloadApp,
    bring: app.globalData.apiImgUrl + 'newlist-jobzd.png', //顶置图片
    autimg: app.globalData.apiImgUrl + 'newlist-jobrealname.png', //实名图片
    hirimg: app.globalData.apiImgUrl + 'newlist-jobfinding.png', //招人图片
    doneimg: app.globalData.apiImgUrl + 'newlist-jobfindend.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'newlist-jobposi.png',//定位
    unitid: app.globalData.unitid,
    ids: '',
    area_id: '',
    page: 1,
    lists: [],
    hasmore: true,
    nodata: app.globalData.apiImgUrl + 'nodata.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getRecommendLists: function(){
    let _this = this;
    app.appRequestAction({
      url: '/job/job-recommend-list/',
      way: 'POST',
      params:{
        area_id: _this.data.area_id,
        classify_id: _this.data.ids,
        page: _this.data.page
      },
      success:(res)=>{
        let mydata = res.data
        if(mydata.errcode == 'ok'){
          let list = mydata.data.list
          let _list = _this.data.lists
          if(list.length){
            _this.setData({
              lists: _list.concat(list),
              page: _this.data.page + 1
            })
          }else{
            _this.setData({
              hasmore: false,
            })
          }
        }
      }
    })
  },
  onLoad: function (options) {
    if(options.hasOwnProperty('ids')){
      this.setData({ids: options.ids})
    }
    if(options.hasOwnProperty('aid')){
      this.setData({
        area_id: options.aid
      })
    }
    this.getRecommendLists()
  },
  showDetailInfo:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/info/info?more=1&id='+id,
    })
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
    let flag = this.data.hasmore
    if(!flag) return false
    this.getRecommendLists()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
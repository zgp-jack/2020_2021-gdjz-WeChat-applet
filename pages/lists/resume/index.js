const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    unitid: app.globalData.unitid,
    location: '',
    aid: '',
    cid: '',
    page: 1,
    lists: [],
    hasmore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      aid: options.aid,
      cid: options.ids,
      location: options.location
    })
    this.getRecommendList()
  },
  getRecommendList:function(){
    let _this = this;
    let { aid, cid, page } = this.data
    app.appRequestAction({
      url: 'resumes/resume-recommend-list/',
      way: 'GET',
      params:{
        province: aid,
        occupations: cid,
        page: page
      },
      hideLoading: true,
      success:(res)=>{
        let mydata = res.data
        if(mydata.errcode == 'ok'){
          let mylist = _this.data.lists
          let lists = mydata.data.list
          let len = lists.length
          _this.setData({
            lists: mylist.concat(mydata.data.list),
            hasmore: len ? true : false,
            page: len ? _this.data.page+1 : _this.data.page
          })
        }
      }
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
    this.getRecommendList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
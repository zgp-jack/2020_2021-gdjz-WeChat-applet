const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appLinkImg: app.globalData.commonDownloadApp,
    bring: app.globalData.apiImgUrl + 'newlist-jobzd.png', //顶置图片
    autimg: app.globalData.apiImgUrl + 'new-list-realname-icon.png', //实名图片
    hirimg: app.globalData.apiImgUrl + 'recruit-lists-new-finding.png', //招人图片
    doneimg: app.globalData.apiImgUrl + 'published-recruit-end.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'newlist-jobposi.png',//定位
    unitid: app.globalData.unitid,
    ids: '',
    area_id: '',
    rids: '',
    area_id: '',
    page: 1,
    lists: [],
    type:1,
    hasmore: true,
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    infoId: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getRecommendLists: function(){
    let _this = this;
    this.setData({
      loading: true
    })
    app.appRequestAction({
      url: '/job/job-recommend-list/',
      way: 'POST',
      params:{
        area_id: _this.data.area_id,
        classify_id: _this.data.ids,
        page: _this.data.page,
        type: _this.data.type,
        job_ids: _this.data.infoId
      },
      success:(res)=>{
        let mydata = res.data
        if(mydata.errcode == 'ok'){
          let list = mydata.data.list
          let _list = _this.data.lists
          let len = list.length
          _this.setData({
            lists: _list.concat(list),
            page: mydata.data.next_page,
            type: mydata.data.type,
            hasmore: len ? true:  false,
          })
        }
      },
      complete:()=>{
        _this.setData({
          loading: false
        })
      }
    })
  },
  onLoad: function (options) {
    if(options.hasOwnProperty('ids')){
      this.setData({ids: options.ids,rids: options.ids})
    }
    if(options.hasOwnProperty('infoId')){
      this.setData({infoId: options.infoId})
    }
    if(options.hasOwnProperty('aid')){
      this.setData({
        area_id: options.aid,
        rarea_id: options.aid
      })
    }
    this.getRecommendLists()
  },
  showDetailInfo:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/info/info?id=${id}&child=1`,
    })
  },
  wantFastIssue: function () {
    if (!this.data.userInfo) {
      app.gotoUserauth();
      return false;
    }
    wx.navigateTo({
      url: '/pages/published/recruit/list?jz=1',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  seemoretorecruit:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  sortNumber: function (a,b)
    {
    return a - b
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    try{
      let oldaid = this.data.area_id.split(',').sort(this.sortNumber).join();
      let oldcid = this.data.ids.split(',').sort(this.sortNumber).join();
      let newaid = this.data.rarea_id.split(',').sort(this.sortNumber).join();
      let newcid = this.data.rids.split(',').sort(this.sortNumber).join();
      if(oldaid != newaid || oldcid != newcid){
        
        this.setData({
          lists: [],
          area_id: newaid,
          ids: newcid,
          page:1,
          type: 1,
          hasmore: true
        })
        this.getRecommendLists()
        if (wx.canIUse('pageScrollTo')) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        }
      }
    }catch(err){
      console.log(err)
    }
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
    let {loading} = this.data
    if(loading) return false
    this.getRecommendLists()
  },
})
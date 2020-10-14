const app = getApp()
const ads = require('../../../utils/ad')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    authentication:app.globalData.apiImgUrl + "new-list-jnzs-icon.png",
    unitid: ads.resumeRecommendAd,
    aid: '',
    cid: '',
    raid: '',
    rcid: '',
    page: 1,
    lists: [],
    type: 1,
    nextpage: 1,
    hasmore: true,
    uuid: '',
    loading: false
  },
  // 如果pagestatus状态为goback代表需要刷新当前数据
  initPageData: function () {
    let pageStatus = this.data.pageStatus;
    let lists =  this.data.lists;
    let pageId = this.data.pageId;
    if (pageStatus == "goback") {
      let index = lists.findIndex((item)=>{
        return item.id == pageId
      })
      lists.splice(index,1)
    }
    this.setData({lists,})
  },
  showDetailInfo:function(e){
    let id = e.currentTarget.dataset.uuid
    wx.navigateTo({
      url: `/pages/boss-look-card/lookcard?uuid=${id}&child=1`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(options)
    this.setData({
      aid: options.aid,
      cid: options.ids,
      raid: options.aid,
      rcid: options.ids,
      uuid: options.uuid
    })
    this.getRecommendList()
  },
  jumptop:function(){
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/finding-name-card/findingnamecard`,
    })
  },
  getRecommendList:function(){
    let _this = this;
    this.setData({
      loading: true
    })
    let { aid, cid, page,type,uuid } = this.data
    let user = wx.getStorageSync('userInfo')
    app.appRequestAction({
      url: 'resumes/resume-recommend-list/',
      way: 'POST',
      params:{
        area_id: aid,
        occupations: cid,
        page: page,
        type: type,
        uuid: uuid,
        uid: user ? user.userId : ''
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
            page: mydata.data.next_page,
            type: mydata.data.type
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
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  seemoretoresume:function(){
    wx.reLaunch({
      url: '/pages/findingworkinglist/findingworkinglist',
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
      let oldaid = this.data.aid.split(',').sort(this.sortNumber).join();
      let oldcid = this.data.cid.split(',').sort(this.sortNumber).join();
      let newaid = this.data.raid.split(',').sort(this.sortNumber).join();
      let newcid = this.data.rcid.split(',').sort(this.sortNumber).join();
      if(oldaid != newaid || oldcid != newcid){
        this.setData({
          lists: [],
          aid: newaid,
          cid: newcid,
          page: 1,
          type:1,
          hasmore: true
        })
        console.log(this.data.ids)
        this.getRecommendList()
        if (wx.canIUse('pageScrollTo')) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        }
      }
    }catch(err){
      console.log(err)
    }
    this.initPageData()
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
    this.getRecommendList()
  },


})
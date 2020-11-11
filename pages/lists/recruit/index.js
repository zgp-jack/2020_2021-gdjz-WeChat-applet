const app = getApp()
const ads = require('../../../utils/ad')
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
    iondzs: app.globalData.apiImgUrl + 'lpy/biaoqian.png',//定位
    unitid: ads.recruitRecommendAd,
    emptyImage: app.globalData.apiImgUrl + 'yc/no-query-data.png',
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
    loading: false,
    show:false,//展示界面
    typeData:'',
    uuid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  show: function () {
    this.setData({show:true})
  },
   // 获取指定格式的时间
   getMyDate(str) {
    var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' +
    this.addZero(oMin);
    return oTime;
  },
  // 如果分钟小于10就添加一个0
  addZero(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  getRecommendLists: function(){
    let _this = this;
    this.setData({
      loading: true
    })
    let userInfo = wx.getStorageSync('userInfo');
    let userUuid = wx.getStorageSync('userUuid');
    let mid = null;
    if (userInfo) {
      mid = userInfo.userId;
    }
    if (userUuid) {
      this.setData({uuid:userUuid})
    }
    let user_id = this.data.infoId;
    let typeData = this.data.typeData;
    let user_name = this.data.userName;
    let page = this.data.page
    let params = typeData === 'record'?{
      user_id,
      page,
      mid
    }:{
      area_id: _this.data.area_id,
      classify_id: _this.data.ids,
      page: _this.data.page,
      type: _this.data.type,
      job_ids: _this.data.infoId,
    }

    app.appRequestAction({
      url: typeData === 'record'?'/focus-me/zg-info-list/':'/job/job-recommend-list/',
      way: 'POST',
      params:params,
      success:(res)=>{
        let mydata = res.data
        if(mydata.errcode == 'ok' || 'success'){
          console.log("mydata.data.list",mydata.data.list)
          let list = mydata.data.list
          if (typeData === 'record') {
            list.forEach(item => {
              item.show_address = item.hasOwnProperty("address")?item.address:'';
              item.time = item.hasOwnProperty("sort_time")?_this.getMyDate( item.sort_time * 1000 ):'';
              item.user_name = user_name;
              item.image = mydata.data.hasOwnProperty("portrait")? mydata.data.portrait:'';
            });
          }
          let _list = _this.data.lists
          let len = list.length
          _this.setData({
            lists: _list.concat(list),
            page: typeData === 'record'? page + 1 : mydata.data.next_page,
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
        rarea_id: options.aid,
        aid: options.aid,
      })
    }
    if (options.hasOwnProperty('type')) {
      this.setData({
        typeData: options.type
      })
    }
    if (options.hasOwnProperty('userName')) {
      wx.setNavigationBarTitle({
        title: `${options.userName}的招工信息`
      })
      this.setData({
        userName: options.userName
      })
    }
    if(options.hasOwnProperty('cid')){
      this.setData({
        cid: options.cid,
      })
    }
    if(options.hasOwnProperty('child')){
      this.setData({
        child: options.child,
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
    let {loading, hasmore} = this.data
    if(loading) return false
    if (!hasmore) return false
    this.getRecommendLists()
  },
})
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    authentication:app.globalData.apiImgUrl + "new-list-jnzs-icon.png",
    unitid: app.globalData.unitid,
    aid: '',
    cid: '',
    raid: '',
    rcid: '',
    page: 1,
    lists: [],
    type: 1,
    nextpage: 1,
    hasmore: true,
    uuid: ''
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
    let { aid, cid, page,type,uuid } = this.data
    let user = wx.getStorageSync('userInfo')
    app.appRequestAction({
      url: 'resumes/resume-recommend-list/',
      way: 'POST',
      params:{
        province: aid,
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
          area_id: newaid,
          ids: newcid,
          page: 1
        })
        this.getRecommendList()
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
    let flag = this.data.hasmore
    if(!flag) return false
    this.getRecommendList()
  },


})
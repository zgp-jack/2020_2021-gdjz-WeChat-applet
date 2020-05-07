const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    unitid: app.globalData.unitid,
    aid: '',
    cid: '',
    raid: '',
    rcid: '',
    page: 1,
    lists: [],
    hasmore: true
  },
  showDetailInfo:function(e){
    let id = e.currentTarget.dataset.uuid
    wx.navigateTo({
      url: `/pages/boss-look-card/lookcard?uuid=${id}`,
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
      rcid: options.ids
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
          if(len >= mydata.data.page_size){
            _this.setData({
              lists: mylist.concat(mydata.data.list),
              hasmore: true,
              page: _this.data.page+1
            })
          }else{
            _this.setData({
              lists: mylist.concat(mydata.data.list),
              hasmore: false,
            })
          }
          
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
    try{
      let oldaid = this.data.aid.split(',').sort(this.sortNumber).join();
      let oldcid = this.data.cid.split(',').sort(this.sortNumber).join();
      let newaid = this.data.raid.split(',').sort(this.sortNumber).join();
      let newcid = this.data.rcid.split(',').sort(this.sortNumber).join();

      if(oldaid != newaid || oldcid != newcid){
        
        this.setData({
          lists: [],
          area_id: newaid,
          ids: newcid
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
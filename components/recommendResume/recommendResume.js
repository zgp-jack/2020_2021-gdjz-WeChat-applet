// components/recommendRecruit.js
const app = getApp();
const ads = require('../../utils/ad')
Component({
  options:{
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    cid: {
      type: String,
      value: ''
    },
    aid: {
      type: String,
      value: ''
    },
    more: {
      type: Number,
      value:0
    },
    location:{
      type: String,
      value: ''
    },
    mine:{
      type: Number,
      value: 0
    },
    child:{
      type: Number,
      value: 0
    },
    uuid: {
      type: String,
      value: ''
    }
  },
  observers:{
    'aid,cid':function(aid,cid){
      if(!cid) return false
      this.getRecommendList()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lists:[],
    pagesize: 15,
    page: 1,
    type: 1,
    unitid: ads.resumeRecommendAd,
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    authentication:app.globalData.apiImgUrl + "new-list-jnzs-icon.png",
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDetailInfo:function(e){
      let id = e.currentTarget.dataset.uuid
      wx.redirectTo({
        url: `/pages/boss-look-card/lookcard?more=1&uuid=${id}&child=${this.properties.child}`,
      })
    },
    seemoreaction:function(){
      let { aid, cid, child, uuid } = this.properties
      let len = this.data.lists.length
      let num = parseInt(this.data.pagesize)
      if(len < num){
        // 如果是列表页就返回
        var pages = getCurrentPages() //获取加载的页面
        var prePage = pages[pages.length-2]
        if(prePage){
          let flag = prePage.route == 'pages/findingworkinglist/findingworkinglist'
          if(flag){
            wx.navigateBack()
            return false
          }
        }
        // 不是列表页就销毁去主列表
        wx.reLaunch({
          url: '/pages/findingworkinglist/findingworkinglist',
        })
        return false
      }
      
      
      if(parseInt(child)){
        var pages = getCurrentPages() 
        var prePage = pages[pages.length-2]
        prePage.setData({
          raid: aid,
          rcid: cid,
          uuid: uuid
        })
        console.log('我返回了')
        wx.navigateBack()
        return false
      }else {
        wx.navigateTo({
          url: '/pages/lists/resume/index?ids='+cid + '&aid='+aid+'&uuid='+uuid,
        })
      }
    },
    jumptop:function(){
      wx.navigateTo({
        url: `/pages/clients-looking-for-work/finding-name-card/findingnamecard`,
      })
    },
    getRecommendList: function(){
      let _this = this;
      let { aid, cid, uuid } = this.properties
      let page = this.data.page
      let type = this.data.type
      let user = wx.getStorageSync('userInfo')
      app.appRequestAction({
        url: 'resumes/details-recommend-list/',
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
            _this.setData({
              lists: mydata.data.list
            })
          }
        }
      })
    },
  }
})

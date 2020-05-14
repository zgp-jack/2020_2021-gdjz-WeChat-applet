// components/recommendRecruit.js
const app = getApp();
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
    unitid: app.globalData.unitid,
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
      let { aid, cid, child } = this.properties
      console.log(child)
      
      let len = this.data.lists.length
      let num = parseInt(this.data.pagesize)
      if(len < num){
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
          rcid: cid
        })
        wx.navigateBack()
        return false
      }else {
        wx.navigateTo({
          url: '/pages/lists/resume/index?ids='+cid + '&aid='+aid,
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
      let { aid, cid } = this.properties
      let page = this.data.page
      app.appRequestAction({
        url: 'resumes/resume-recommend-list/',
        way: 'GET',
        params:{
          area_id: aid,
          occupations: cid,
          page: page
        },
        hideLoading: true,
        success:(res)=>{
          let mydata = res.data
          if(mydata.errcode == 'ok'){
            _this.setData({
              lists: mydata.data.list,
              pagesize: mydata.data.page_size
            })
          }
        }
      })
    },
  }
})

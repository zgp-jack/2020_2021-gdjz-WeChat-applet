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
    }
  },
  observers:{
    aid:function(aid){
      if(!aid) return false
      this.getRecommendList()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lists:[],
    page: 1,
    unitid: app.globalData.unitid
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDetailInfo:function(e){
      let id = e.currentTarget.dataset.uuid
      wx.navigateTo({
        url: `/pages/boss-look-card/lookcard?more=1&uuid=${id}&location=${this.properties.location}`,
      })
    },
    seemoreaction:function(){
      let { aid, cid,more } = this.properties
      console.log(aid,cid,more)
      if(more){
        wx.navigateBack()
      }else {
        wx.navigateTo({
          url: '/pages/lists/resume/index?ids='+cid + '&aid='+aid,
        })
      }
    },
    getRecommendList: function(){
      let _this = this;
      let { aid, cid } = this.properties
      let page = this.data.page
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
            _this.setData({
              recommendlist: mydata.data.list
            })
          }
        }
      })
    },
  }
})

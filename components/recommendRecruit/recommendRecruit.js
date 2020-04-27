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
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detailinfoaction:function(e){
      let id = e.currentTarget.dataset.id
      let more = this.properties.more
      let url = more ? '/pages/detail/info/info?more=1&id=' + id : '/pages/detail/info/info?id=' + id
      wx.redirectTo({
        url: url,
      })
    },
    seemoreaction:function(){
      let { aid, cid } = this.properties
      let more = this.properties.more
      if(more){
        wx.navigateBack()
      }else {
        wx.navigateTo({
          url: '/pages/lists/recruit/index?ids='+cid + '&aid='+aid,
        })
      }
    },
    getRecommendList: function(){
      let _this = this;
      let { aid, cid } = this.properties
      app.appRequestAction({
        url: '/job/job-recommend-list/',
        way: 'POST',
        params:{
          area_id: aid,
          classify_id: cid,
          page: 1
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

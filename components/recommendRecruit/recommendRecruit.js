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
      value: '',
      observer:function(newval){
        
      }
    },
    aid: {
      type: String,
      value: ''
    },
    more: {
      type: Number,
      value:0
    },
    mine:{
      type: Number,
      value : 0,
    },
    child:{
      type: Number,
      value: 0
    },
    infoId:{
      type: String,
      value:''
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
    unitid: app.globalData.unitid,
    bring: app.globalData.apiImgUrl + 'newlist-jobzd.png', //顶置图片
    autimg: app.globalData.apiImgUrl + 'newlist-jobrealname.png', //实名图片
    hirimg: app.globalData.apiImgUrl + 'recruit-lists-new-finding.png', //招人图片
    doneimg: app.globalData.apiImgUrl + 'newlist-jobfindend.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'newlist-jobposi.png',//定位,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    wantFastIssue: function () {
      if (!this.data.userInfo) {
        app.gotoUserauth();
        return false;
      }
      wx.navigateTo({
        url: '/pages/published/recruit/list?jz=1',
      })
    },
    detailinfoaction:function(e){
      let id = e.currentTarget.dataset.id
      wx.redirectTo({
        url: '/pages/detail/info/info?id=' + id + '&child=' + this.properties.child,
      })
    },
    seemoreaction:function(){
      let len = this.data.lists.length
      let num = this.data.pagesize
      if(len < num){
        wx.reLaunch({
          url: '/pages/index/index',
        })
        return false
      }
      let { aid, cid, infoId } = this.properties
      if(this.properties.child){
        var pages = getCurrentPages() 
        var prePage = pages[pages.length-2]
        prePage.setData({
          rarea_id: aid,
          rids: cid
        })
        wx.navigateBack()
        return false
      }
      wx.navigateTo({
        url: '/pages/lists/recruit/index?ids='+cid + '&aid='+aid+'&infoId='+infoId,
      })
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
          job_ids: _this.properties.infoId,
          page: 1,
          type: 1,
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

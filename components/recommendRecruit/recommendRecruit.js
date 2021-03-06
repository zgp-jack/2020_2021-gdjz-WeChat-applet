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
    },
    type:{
      type: String,
      value:''
    }
  },
  observers:{
    'aid,cid':function(aid,cid){
      if(!cid) return false
      if(this.data.isload) return false
        this.getRecommendList()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lists:[],
    pagesize: 15,
    unitid: ads.recruitRecommendAd,
    bring: app.globalData.apiImgUrl + 'newlist-jobzd.png', //顶置图片
    autimg: app.globalData.apiImgUrl + 'newlist-jobrealname.png', //实名图片
    hirimg: app.globalData.apiImgUrl + 'recruit-lists-new-finding.png', //招人图片
    doneimg: app.globalData.apiImgUrl + 'published-recruit-end.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'lpy/biaoqian.png',//定位,
    isload: false
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
      const pages = getCurrentPages();//获取当前的页面栈
      const prevPage = pages[pages.length - 1];//当前的page
      let url = prevPage.route;
      if (url === 'pages/findwork-browsing-record/recordlist/index') {
        wx.navigateTo({
          url: '/pages/detail/info/info?id=' + id + '&child=' + this.properties.child,
        })
      }else{
        wx.redirectTo({
          url: '/pages/detail/info/info?id=' + id + '&child=' + this.properties.child,
        })
      }
    },
    seemoreaction:function(){
      let { aid, cid, infoId } = this.properties
      let cidArray = cid.split(',');
      let cidItem = cidArray[0];
      // 推荐列表数据的来源，“record”代表来自于浏览记录
      let type = this.data.type;
      // 如果推荐数据是在浏览记录页面，点击“查看更多”跳转到招工列表
      if (type == 'record') {
        wx.reLaunch({
          url: `/pages/index/index?id=${cidItem}&aid=${aid}`,
        })
        return false
      }

      let len = this.data.lists.length
      let num = this.data.pagesize
      if(len < num){
        // 如果是列表页就返回
        var pages = getCurrentPages() //获取加载的页面
        var prePage = pages[pages.length-2]
        if(prePage){
          let flag = prePage.route == 'pages/index/index'
          if(flag){
            wx.navigateBack()
            return false
          }
        }
        // 不是列表页就销毁去主列表
        wx.reLaunch({
          url: '/pages/index/index',
        })
        return false
      }
      if(this.properties.child){
        var pages = getCurrentPages() 
        var prePage = pages[pages.length-2]
        prePage.setData({
          rarea_id: aid,
          rids: cid
        })
        this.setData({
          isload: true
        })
        wx.navigateBack()
        return false
      }
      wx.navigateTo({
        url: '/pages/lists/recruit/index?ids='+cid + '&aid='+aid+'&infoId='+infoId,
      })
    },
    getRecommendList: function(){
      console.log('组件触发')
      let _this = this;
      let { aid, cid } = this.properties
      app.appRequestAction({
        url: '/job/details-recommend-list/',
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
          _this.triggerEvent("show")
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

// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 找工作历史搜索记录
    historySearch:{
      title:"搜索历史",
      historyList:[]
    },
    //找工人历史搜索记录
    historySearchGr:{
      title:"搜索历史",
      historyList:[]
    },
    // 热门搜索记录
    hotSearch:{
      title:"热门搜索",
      hotList:[]
    },
    // tab切换栏
    tab: [{
      key: 0,
      title: "找工作"
      },{
      key: 1,
      title: "找工人"
      }],
    //搜索图标icon地址 
    searchIcon: app.globalData.apiImgUrl + 'yc/helpCenter-search.png',
    delImg: app.globalData.apiImgUrl + "new-published-close-icon.png",
    changeStatus: 0,
    inputTetx: "",
    focusInput: false,
    //进入搜索页面之前搜索的内容
    indexKey: "",
    //从那个页面进入的搜索页面
    source:""
  },
  //头部tab切换
  tabChange: function (e) {
    // 获取点击的类别key
    let key = e.currentTarget.dataset.key;
    this.setData({ changeStatus:key })
    this.getStorageSearch()
  },
  //监听搜索框
  searchInput: function (e) {
    //去除空格
    // var text = e.detail.value;
    // var removeSpace = text.replace(/\s*/g,"");
    this.setData({inputTetx:e.detail.value})
  },

  //点击搜索 储存搜索历史
  clickSearch: function (e) {
    //更新活跃状态
    app.activeRefresh()
    //判断是否输入内容 或者空格 为空不保存
    let k = this.isEmpty(this.data.inputTetx)
      //保存
      //判断找工作还是找工人
      if(this.data.changeStatus == 0){
        var historyList = this.data.historySearch;
        if(historyList.historyList.length === 6) {
          historyList.historyList.pop()
          historyList.historyList.unshift({
          keywords:this.data.inputTetx,
        })
        }else{
          historyList.historyList.unshift({
            keywords:this.data.inputTetx,
          })
      }
        //去重
        var result = [];
        var obj = {};
        for(var i =0; i<historyList.historyList.length; i++){
          if(!obj[historyList.historyList[i].keywords]){
            result.push(historyList.historyList[i]);
            obj[historyList.historyList[i].keywords] = true;
          }
        }
        historyList.historyList = result
        this.setData({historySearch:result})
        //存入strorage
        if(!k) {
          wx.setStorageSync('historySearch', historyList)
        }
        //跳转找工作页面
        wx.reLaunch({
          url:"/pages/index/index?keywrods="+this.data.inputTetx
        })
      }else{
        var historyList = this.data.historySearchGr;
        if(historyList.historyList.length === 6) {
          historyList.historyList.pop()
          historyList.historyList.unshift({
          keywords:this.data.inputTetx,
        })
        }else{
          historyList.historyList.unshift({
            keywords:this.data.inputTetx,
          })
        }
        var result = [];
        var obj = {};
        for(var i =0; i<historyList.historyList.length; i++){
          if(!obj[historyList.historyList[i].keywords]){
            result.push(historyList.historyList[i]);
            obj[historyList.historyList[i].keywords] = true;
          }
        }
        historyList.historyList = result
        this.setData({historySearchGr:result})
        if(!k) {
          wx.setStorageSync('historySearchGr', historyList)
        }
        //跳转找工作页面
        wx.reLaunch({
          url:"/pages/findingworkinglist/findingworkinglist?keywrods="+this.data.inputTetx
        })
        this.getStorageSearch()
      }
      
  },
    //判断字符是否为空的方法
  isEmpty:function isEmpty(obj){
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if(typeof obj == "undefined" || obj == null || obj == "" || re.test(obj)){
        return true;
    }else{
        return false;
    }
  },
  //获取缓存中的历史搜索记录
  getStorageSearch: function () {
    if(this.data.changeStatus == 0){
      var history = wx.getStorageSync('historySearch')
      if(history && history.historyList.length){
        this.setData({historySearch:history})
      }
    }else {
      var history = wx.getStorageSync('historySearchGr')
      if(history && history.historyList.length){
        this.setData({historySearchGr:history})
      }
    }
    
  },
  //删除历史搜索
  deleteHistorySearch: function () {
    if(this.data.changeStatus == 0){
      var t = this
      wx.removeStorage({
        key: "historySearch",
        success(res) {
          t.setData({
            historySearch:{
              title:"搜索历史",
              historyList:[]
            }
          })
        }
      })
    }else {
      var t = this
      wx.removeStorage({
        key: "historySearchGr",
        success(res) {
          t.setData({
            historySearchGr:{
              title:"搜索历史",
              historyList:[]
            }
          })
        }
      })
    }
    
  },
  //点击历史搜索热门搜索标签直接搜索
  clickTabSearch(e){
    this.setData({
      inputTetx:e.currentTarget.dataset.key
    })
    //调用搜索方法 保存历史搜索
    this.clickSearch()
  },
  //获取热门搜索
  getHotsearch:function (){
    var _this = this
    app.appRequestAction({
      url:"index/hot-search/",
      way: "GET",
      success:function (res) {
        if(res.data.errcode == "ok"){
          _this.setData({
            "hotSearch.hotList":res.data.data
          })
        }else {
          app.showMyTips(res.data.errmsg)
        }
      },
      fail:()=>{
        app.showMyTips('网络错误，加载失败！')
      }
    })
  },
  //关闭搜索 跳转页面
  closeSearch(){
    if(this.data.source == 0) {
      if(this.data.indexKey !== ""){
        //跳转找工作页面
        wx.reLaunch({
          url:this.data.indexKey!="" ? "/pages/index/index?keywrods="+this.data.indexKey:"/pages/index/index"
        })
      }else{
        //跳转找工作页面
        wx.reLaunch({
          url:"/pages/index/index"
        })
      }
      
    }else {
      if(this.data.indexKey !== ""){
        //跳转找工人页面
      wx.reLaunch({
        url:this.data.indexKey!="" ? "/pages/findingworkinglist/findingworkinglist?keywrods="+this.data.indexKey:"/pages/findingworkinglist/findingworkinglist"
      })
      }else {
        //跳转找工人页面
      wx.reLaunch({
        url:"/pages/findingworkinglist/findingworkinglist"
      })
      }
    }
  },
  // 清除搜索输入框内容
  clearContent: function () {
    setTimeout(()=>{
      this.setData({
        inputTetx:""
      })
    },50)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断默认显示找工作还是找工人
    if(options.changeStatus){
      this.setData({
        changeStatus:options.changeStatus,
        source:options.changeStatus
      })
    }
    if(options.key){
      this.setData({
        inputTetx:options.key,
        indexKey:options.key
      })
    }else{
      this.setData({
        inputTetx:"",
        indexKey:""
      })
    }
    this.getStorageSearch()
    this.getHotsearch()
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
     //进入页面获取焦点弹出键盘
    this.setData({
      focusInput:true
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
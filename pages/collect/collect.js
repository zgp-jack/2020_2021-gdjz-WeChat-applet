// pages/published/published.js
let footerjs = require("../../utils/footer.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        footerActive: "member",
        infoIndex:"",
        publishIndex: 0,
        apiUrlLink: ["job/collect-list/","fleamarket/published-market/"],
        publishedTitle:["我收藏的招工信息","我收藏的找活信息"],
        nodataImg: app.globalData.apiImgUrl + "nodata.png",
        isFirstRequest:true,
        page:1,
        lists:[],
        userInfo:"",
        pageSize:20,
        showNoData:false, 
        nothavamore:false,
        publishedData: [
            {
                title: '收藏的招工信息'
            },
            {
                title: '收藏的找活信息'
            }
        ],
        newTopShow:false,
      collecticon: app.globalData.apiImgUrl + "collect-tipicon.png",
      collecthand: app.globalData.apiImgUrl + "collect-tiphand.png",
      showCollectTips:false,
    },

    showThisList:function(e){
        let index = e.currentTarget.dataset.index;
        wx.setNavigationBarTitle({ title: (index == "1") ? "鱼泡网-我收藏的找活信息" : "鱼泡网-我收藏的招工信息" })
        if (this.data.publishIndex == index) return false;
        console.log(this.data.publishIndex)
      if (this.data.publishIndex == 0){
        this.setData({ 
          publishIndex : 1,
          lists: [],
          nothavamore: false,
          showNoData: true,
        })
        return false;
      }
        this.setData({
            publishIndex: index,
            page:1,
            lists:[],
            showNoData:false,
            nothavamore:false,
            isFirstRequest:true
        })
        this.getPublishedData();
    },
    initPublishedData: function (options){
        if (options && options.hasOwnProperty("type")){
            this.setData({ publishIndex: parseInt(options.type) })
            wx.setNavigationBarTitle({ title: (options.type == "1") ? "鱼泡网-我收藏的找活信息" : "鱼泡网-我收藏的招工信息" })
        }
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo: userInfo })
        this.getPublishedData();
    },
    getPublishedData:function(){
        let _this = this;
        let _index = this.data.publishIndex
        let userInfo = this.data.userInfo
        wx.showLoading({ title: '数据加载中', })
        app.doRequestAction({
            url: _this.data.apiUrlLink[_index],
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime:userInfo.tokenTime,
                page: _this.data.page
            },
            success: function (res) {
                wx.hideLoading()
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    if (mydata.list.length > 0) {
                        let newData = _this.data.lists;
                        if(_this.data.page != 1){
                            for(let i =0;i<mydata.list.length;i++){
                                newData.push(mydata.list[i])
                            }
                        }
                        _this.setData({
                            lists: (_this.data.page == 1) ? mydata.list : newData,
                            pageSize: mydata.pageSize ? mydata.pageSize : 20,
                            isFirstRequest : false
                        })
                        setTimeout(function(){
                            _this.setData({ nothavamore: (mydata.list.length < _this.data.pageSize) ? true : false, })
                        },0)
                    } else {
                        _this.setData({
                            showNoData: _this.data.isFirstRequest ? true : false,
                            nothavamore: _this.data.isFirstRequest ? false : true,
                        })
                    }
                } else {
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: "none",
                        duration: 2000
                    })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: '网络出错，数据加载失败！',
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    cancleCollect:function(e){
      let _this = this;
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let userInfo = wx.getStorageSync("userInfo");
      let data = {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        id: id
      };

      app.appRequestAction({
        url: "job/collect/",
        way: "POST",
        params: data,
        title: "操作中",
        failTitle: "网络错误，操作失败！",
        success: function (res) {
          let mydata = res.data;
          app.showMyTips(mydata.errmsg);
          if (mydata.errcode == "ok") {
            let list = app.arrDeepCopy(_this.data.lists);
            list.splice(index, 1);
            _this.setData({ "lists": list })
          }
        }
      })

    },
    showCollectInfo:function(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/detail/info/info?id='+id,
      })
    },
    // 共用footer
    jumpThisLink: function (e) {
        app.jumpThisLink(e);
    },
    initFooterData: function () {
        this.setData({
            footerImgs: footerjs.footerImgs,
            publishActive: footerjs.publishActive,
            showPublishBox: footerjs.showPublishBox
        })
    },
    doPublishAction: function () {
        footerjs.doPublishAction(this);
    },
    closePublishAction: function () {
        footerjs.closePublishAction(this);
    },
    valiUserCard: function () {
        let userInfo = this.data.userInfo;
        footerjs.valiUserCard(this, app, userInfo);
  }, 
  initCollectTips: function(options){
    if (options.hasOwnProperty("jz")) this.setData({ showCollectTips:true })
  },
  closeCollect:function(){
    this.setData({ showCollectTips: false })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initFooterData();
      this.initCollectTips(options);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
     
    },

    /**
     * 生命周期函数--监听页面显示
     */
  onShow: function (options) {
    this.setData({ isFirstRequest:true })
      this.initPublishedData(options);
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
        if (this.data.isFirstRequest || this.data.showNoData || this.data.nothavamore) return false;
        this.setData({
            page:this.data.page + 1
        })
        this.getPublishedData();
    },

})
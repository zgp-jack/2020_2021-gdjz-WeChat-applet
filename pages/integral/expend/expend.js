// pages/source/source.js showRecord showComplain showThisRecord
const app = getApp();
Page({

    /**
     * 页面的初始数据 showThisRecord  userEnterComplain userComplaintAction closeThisRerocd closeThisRerocd
     */
    data: {
        loadingGif: app.globalData.apiImgUrl + "loading.gif",
        nodata: app.globalData.apiImgUrl + "nodata.png",
        nothavemore:false,
        isNone:false,
        isFirst:true,
        userInfo:{},
        lists:[],
        day:7,
        pageSize:15,
        page :1,
        showRecord:false,
        info:{},
        showComplain: false,
        complainInfo: "",
        infoId: "",
        type: "",
        cindex:"",
        showWork:false
    },
  userCancleComplain: function () {
    this.setData({ showComplain: false, complainInfo:"" })
  },
  complainInfo: function (e) {
    let infoId = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    this.subscribeToNews(infoId,type)
  },
  subscribeToNews: function(infoId, type) {
    let userInfo = this.data.userInfo;
    let _this = this;
    if (wx.canIUse('requestSubscribeMessage') === true) {
        wx.requestSubscribeMessage({
            tmplIds: ['uZcoNQz86gAr3P4DYtgt85PnVgMcN_Je27TeHdKhz14'],
            success(res) {
                if (res.errMsg == "requestSubscribeMessage:ok") {
                    app.appRequestAction({
                        url: "leaving-message/add-subscribe-msg/",
                        way: "POST", 
                        mask: true,
                        params: {
                            userId: userInfo.userId,
                            token: userInfo.token,
                            tokenTime: userInfo.tokenTime,
                            type: 5
                        },
                        success: function(res) {
                            _this.setData({ showComplain: true, infoId: infoId, type: type })
                        },
                    })
                }
            }
        })
    } else {
        _this.setData({ showComplain: true, infoId: infoId, type: type })
    }
  },
  userEnterComplain: function (e) {
    this.setData({ complainInfo: e.detail.value })
  },
  bindconfirm: function (e) {
    this.setData({ complainInfo: e.detail.value })
  },
  userComplaintAction: function (e) {
    let _this = this;
    let userInfo = this.data.userInfo;
    let infoId = this.data.infoId;
    let type = this.data.type;
    let info = this.data.complainInfo;
    info = info.replace(/^\s+|\s+$/g, '');
    if (!info) {
      app.showMyTips("请输入您的投诉内容");
      return false;
    }
    app.appRequestAction({
      url: "publish/complain/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        infoId: infoId,
        type: type,
        content: info
      },
      title: "正在提交投诉",
      failTitle: "网络错误，投诉失败！",
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok"){
            _this.setData({ showComplain: false, complainInfo: "", "info.show_complain":0 })
        }
        wx.showModal({
          title: '提示',
          content: mydata.errmsg,
          showCancel:false
        })
      }
    })
  },
    getIntegralHeader: function () {
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo:userInfo })
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url: "integral/header-words/",
            way: "POST",
            params:{
                userId:userInfo.userId,
                token: userInfo.token,
                tokenTime:userInfo.tokenTime,
                type: "expend"
            },
            success: function (res) {
                wx.hideLoading();
                let mydata = res.data;
                _this.setData({
                    lists: mydata.firstList.list,
                    day: mydata.day,
                    pageSize: mydata.firstList.pageSize,
                    isNone: mydata.firstList.list.length ? false : true,
                    isFirst:false
                })
                if ((mydata.firstList.list.length < parseInt(mydata.firstList.pageSize)) && mydata.firstList.list.length){
                    _this.setData({ nothavemore : true })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: '数据加载失败，请稍后重试！',
                    icon: "none",
                    duration: 5000
                })
            }
        })
    },
    getNextPageData:function(){
        let _this = this;
        let userInfo = this.data.userInfo;
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url:"integral/integral-record/",
            way:"POST",
            params:{
                userId: userInfo.userId,
                token:userInfo.token,
                tokenTime:userInfo.tokenTime,
                type:"expend",
                page:_this.data.page
            },
            success:function(res){
                wx.hideLoading();
                let mydata = res.data.list;
                let pagesize = res.data.pageSize;
                
                if(mydata.length == 0){
                    _this.setData({
                        nothavemore : true
                    })
                } else {
                    let addData = _this.data.lists;
                    for (let i = 0; i < mydata.length; i++) {
                        addData.push(mydata[i]);
                    }
                    _this.setData({
                        lists:addData,
                        nothavemore: (mydata.length < parseInt(pagesize)) ? true : false
                    })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: '数据加载失败，请稍后重试！',
                    icon: "none",
                    duration: 5000
                })
            }
        })
    },
    showThisRecord:function(e){
        console.log(e)
        let _this = this;
        let id = e.currentTarget.dataset.id;
        let userInfo = this.data.userInfo;
        userInfo.logId = id;
        console.log(userInfo.logId )
        app.appRequestAction({
            title:"信息获取中",
            url:"integral/look-used-info/",
            way:"POST",
            params:userInfo,
            success:function(res){
              console.log(res)
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                  if (mydata.info.type == "job"){
                    _this.setData({ info: mydata.info, showRecord:true })
                  } else if (mydata.info.type == "resume"){
                    _this.setData({ info: mydata.info, showWork: true })
                  }
                }else{
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel: false,
                    })
                }
            },
            fail:function(){
                wx.showModal({
                    title: '温馨提示',
                    content: '网络错误，数据加载失败！',
                    showCancel:false,
                })
            }
        })
    },
    closeThisRerocd:function(){
        this.setData({ 
          showRecord:false,
          showWork:false
         })
    },
    callThisPhone:function(e){
        app.callThisPhone(e);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getIntegralHeader();
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
        if ((this.data.isFirst) || (this.data.isNone) || (this.data.nothavemore)) return false;
        this.setData({ page : this.data.page + 1 })
        this.getNextPageData();
    },

})
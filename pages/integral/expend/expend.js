// pages/source/source.js showRecord showComplain showThisRecord
const app = getApp();
let v = require("../../../utils/v.js");
Page({

  /**
   * 页面的初始数据 showThisRecord  userEnterComplain userComplaintAction closeThisRerocd closeThisRerocd
   */
  data: {
    complaincontent: app.globalData.complaincontent,
    loadingGif: app.globalData.apiImgUrl + "loading.gif",
    nodata: app.globalData.apiImgUrl + "nodata.png",
    nothavemore: false,
    isNone: false,
    isFirst: true,
    userInfo: {},
    lists: [],
    day: 7,
    pageSize: 15,
    page: 1,
    showRecord: false,
    info: {},
    showComplain: false,
    complainInfo: "",
    infoId: "",
    type: "",
    cindex: "",
    showWork: false,
    sign: app.globalData.apiImgUrl + "lpy/integral/select2.png",
    signright: app.globalData.apiImgUrl + "lpy/integral/select1.png",
    beforeDate: "",
    emdDate: "",
    birthday: "",
    classify: [],
    classifyArray: [],
    classifyName: "",
    classifyNameId: 0,
    stime: 0,
    bak: 0,
    getintegral:0,
    getexpend:0,
    next_page:"",
    showintegral:true
  },
  userCancleComplain: function() {
    this.setData({
      showComplain: false,
      complainInfo: ""
    })
  },
  complainInfo: function(e) {
    let infoId = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    this.setData({
      showComplain: true,
      infoId: infoId,
      type: type
    })

  },
  subscribeToNews: function(mydata) {
    app.subscribeToNews("complain", function() {
      wx.showModal({
        title: '提示',
        content: mydata.errmsg,
        showCancel: false
      })
    })

  },
  userEnterComplain: function(e) {
    this.setData({
      complainInfo: e.detail.value
    })
  },
  bindconfirm: function(e) {
    this.setData({
      complainInfo: e.detail.value
    })
  },
  userComplaintAction: function(e) {
    let _this = this;
    let userInfo = this.data.userInfo;
    let infoId = this.data.infoId;
    let type = this.data.type;
    let info = this.data.complainInfo;
    let complaincontent = this.data.complaincontent
    let vertifyNum = v.v.new()
    info = info.replace(/^\s+|\s+$/g, '');
    if (!info || info.length < 5 || info.length > 100 || !vertifyNum.isChinese(info)) {
      app.showMyTips(complaincontent);
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
      success: function(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          _this.setData({
            showComplain: false,
            complainInfo: "",
            "info.show_complain": 0
          })
          _this.subscribeToNews(mydata)
        } else {
          wx.showModal({
            title: '提示',
            content: mydata.errmsg,
            showCancel: false
          })
        }

      }
    })
  },
  getIntegralHeader: function(userInfo) {
    let _this = this;
    wx.showLoading({
      title: '数据加载中'
    })
    let date = _this.data.birthday.split("-")
    console.log(date)
    app.doRequestAction({
      url: "integral/expend-lists/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        y: date[0],
        m: date[1],
        stime: _this.data.stime,
        type: _this.data.classifyNameId,
        bak: _this.data.bak
      },
      success: function(res) { 
        console.log(res)
        wx.hideLoading();
        let mydata = res.data;
        console.log(mydata)
        if (mydata.errcode = "ok"){
          _this.setData({
            bak: mydata.data.bak,
            stime: mydata.data.stime,
            lists: [...mydata.data.lists, ..._this.data.lists],

            next_page: mydata.data.next_page,
            isNone: false
          })
          if (_this.data.showintegral){
            _this.setData({
            getintegral: mydata.data.sum_data.get,
              getexpend: mydata.data.sum_data.expend,
            })
          }
          if (_this.data.lists.length==0){
            _this.setData({
              isNone:true
            })
          }
          if (_this.data.lists.length != 0 && mydata.data.lists ==0){
            _this.setData({
              nothavemore: true
            })
          }
        }
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败，请稍后重试！',
          icon: "none",
          duration: 5000
        })
      }
    })
  },
  // getNextPageData: function() {
  //   let _this = this;
  //   let userInfo = this.data.userInfo;
  //   wx.showLoading({
  //     title: '数据加载中'
  //   })
  //   app.doRequestAction({
  //     url: "integral/integral-record/",
  //     way: "POST",
  //     params: {
  //       userId: userInfo.userId,
  //       token: userInfo.token,
  //       tokenTime: userInfo.tokenTime,
  //       type: "expend",
  //       page: _this.data.page
  //     },
  //     success: function(res) {
  //       wx.hideLoading();
  //       let mydata = res.data.list;
  //       let pagesize = res.data.pageSize;

  //       if (mydata.length == 0) {
  //         _this.setData({
  //           nothavemore: true
  //         })
  //       } else {
  //         let addData = _this.data.lists;
  //         for (let i = 0; i < mydata.length; i++) {
  //           addData.push(mydata[i]);
  //         }
  //         _this.setData({
  //           lists: addData,
  //           nothavemore: (mydata.length < parseInt(pagesize)) ? true : false
  //         })
  //       }
  //     },
  //     fail: function(err) {
  //       wx.hideLoading();
  //       wx.showToast({
  //         title: '数据加载失败，请稍后重试！',
  //         icon: "none",
  //         duration: 5000
  //       })
  //     }
  //   })
  // },
  showThisRecord: function(e) {
    console.log(e)
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let userInfo = this.data.userInfo;
    userInfo.logId = id;
    console.log(userInfo.logId)
    app.appRequestAction({
      title: "信息获取中",
      url: "integral/look-used-info/",
      way: "POST",
      params: userInfo,
      success: function(res) {
        console.log(res)
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          if (mydata.info.type == "job") {
            _this.setData({
              info: mydata.info,
              showRecord: true
            })
          } else if (mydata.info.type == "resume") {
            _this.setData({
              info: mydata.info,
              showWork: true
            })
          }
        } else {
          wx.showModal({
            title: '温馨提示',
            content: mydata.errmsg,
            showCancel: false,
          })
        }
      },
      fail: function() {
        wx.showModal({
          title: '温馨提示',
          content: '网络错误，数据加载失败！',
          showCancel: false,
        })
      }
    })
  },
  closeThisRerocd: function() {
    this.setData({
      showRecord: false,
      showWork: false
    })
  },
  callThisPhone: function(e) {
    app.callThisPhone(e);
  },
  birthday(e) {
    this.setData({
      birthday: e.detail.value,
      stime: 0,
      bak: 0,
      nothavemore: false,
      lists: []
    })
    console.log(123123)
    this.getIntegralHeader(this.data.userInfo)
  },
  getDate() {
    let newdate = new Date();
    let nowyear = newdate.getFullYear();
    let nowmonth = newdate.getMonth() + 1;
    if (nowmonth >= 1 && nowmonth <= 9) {
      nowmonth = "0" + nowmonth;
    }
    this.setData({
      emdDate: nowyear + "-" + nowmonth
    })
    console.log(this.data.birthday)
  },
  selectType(e) {
    let that = this;
    let odedail = e.detail.value;
    console.log(odedail)
    console.log(that.data.classifyArray[odedail])
    console.log(that.data.classifyArray)
    this.setData({
      classifyName: that.data.classifyArray[odedail],
      classifyNameId: that.data.classify[odedail].type,
      stime: 0,
      bak: 0,
      nothavemore: false,
      lists:[]
    })
    that.getIntegralHeader(that.data.userInfo)
  },
  dointegral(){
    console.log(1232)
    let expend = "expend"
    wx.navigateTo({
      url: `/pages/integral/source/source?expend=${expend}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getDetail() {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo
    })
    app.appRequestAction({
      url: "integral/expend-config/",
      way: "POST",
      params: userInfo,
      success: function(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          let classifymap = mydata.data.types.map((item, index) => item.name)

          that.setData({
            birthday: mydata.data.default.y + "-" + mydata.data.default.m,
            beforeDate: mydata.data.min.y + "-" + mydata.data.min.m,
            classify: mydata.data.types,
            classifyArray: classifymap,
            classifyName: classifymap[0],
            classifyNameId: mydata.data.types[0].type
          })
          that.getIntegralHeader(userInfo)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: mydata.errmsg,
            showCancel: false,
          })
        }
      },
      fail: function() {
        wx.showModal({
          title: '温馨提示',
          content: '网络错误，数据加载失败！',
          showCancel: false,
        })
      }
    })
  },
  onLoad: function(options) {
    this.getDetail()
    this.getDate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(12312)
    if ( (this.data.isNone) || (this.data.nothavemore)) return false;
    this.setData({showintegral:false})
    this.getIntegralHeader(this.data.userInfo)
  },

})
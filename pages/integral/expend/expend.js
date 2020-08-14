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
    beforeDate: "2017-01-01",
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
    showintegral:true,
    system_type:"",
    source:"",
    classifyIndex:0,
    showend: false, // 软删除不展示已招满
    errcode:false
  },
  userCancleComplain: function() {
    this.setData({
      showComplain: false,
      complainInfo: ""
    })
  },

  complainInfo: function(e) {
    if (e.currentTarget.dataset.complain === 0) {
      return
    }
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
    app.initSystemInfo(function (res) {
      if (res)_this.setData({system_type: res.platform})
    })
    let date = _this.data.birthdaysubmit.split("-")
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
        bak: _this.data.bak,
        system_type: _this.data.system_type
      },
      success: function(res) { 
        console.log(res)
        wx.hideLoading();
        let mydata = res.data;
        if (mydata.errcode = "ok"){
          _this.setData({
            bak: mydata.data.bak,
            stime: mydata.data.stime,
            lists: [..._this.data.lists, ...mydata.data.lists],

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
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let userInfo = this.data.userInfo;
    userInfo.logId = id;
    userInfo.time = e.currentTarget.dataset.time;
    app.appRequestAction({
      title: "信息获取中",
      url: "integral/look-used-info/",
      way: "POST",
      params: userInfo,
      success: function(res) {
        console.log(res)
        let mydata = res.data;
        if (mydata.errcode == "ok" || mydata.errcode == "deleted") {
          if (mydata.info.type == "job") {
            _this.setData({
              errcode:mydata.errcode,
              info: mydata.info,
              showRecord: true,
              showend: mydata.errcode == "ok"||"deleted" ? true : false
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
    let data = this.data
    let date = e.detail.value.split("-")
    let end = data.emdDate.split("-")
    let start = data.beforeDate.split("-")
    let selectdate = Date.UTC(date[0] - 0, date[1]-0);
    let enddate = Date.UTC(end[0] - 0, end[1] - 0);
    let startdate = Date.UTC(start[0] - 0, start[1] - 0);
    if (selectdate > enddate) {
      date[0] = end[0]
      date[1] = end[1]
    }
    if (selectdate < startdate) {
      date[0] = start[0]
      date[1] = start[1]
    }
    this.setData({
      birthday: date[0] + '年' + date[1] + '月',
      birthdaysubmit: date[0] + '-' + date[1] ,
      stime: 0,
      bak: 0,
      nothavemore: false,
      lists: [],
      showintegral:true
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

    this.setData({
      classifyName: that.data.classifyArray[odedail],
      classifyNameId: that.data.classify[odedail].type,
      classifyIndex: odedail,
      stime: 0,
      bak: 0,
      nothavemore: false,
      lists:[],
      showintegral: true
    })
    that.getIntegralHeader(that.data.userInfo)
  },
  dointegral(){
    let num = parseInt(this.data.getintegral)
    if(!num) return false
    let date = this.data.birthdaysubmit
    let source = this.data.source
    let expend = "expend"
    if (source == "source"){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateTo({
        url: `/pages/integral/source/source?expend=${expend}&date=${date}`,
      })
    }

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
          let datestr = that.data.datestr
          that.setData({
            beforeDate: mydata.data.min.y + "-" + mydata.data.min.m,
            classify: mydata.data.types,
            classifyArray: classifymap, 
            classifyName: "消耗分类",
            classifyNameId: mydata.data.types[0].type
          })

          if(datestr){
            let arr = datestr.split('-')
            that.setData({
              birthday: arr[0] + "年" + arr[1]+"月",
              birthdaysubmit: datestr,
            })
          }else{
            that.setData({
              birthday: mydata.data.default.y + "年" + mydata.data.default.m+"月",
              birthdaysubmit: mydata.data.default.y + "-" + mydata.data.default.m,
            })
          }
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
    if (options.hasOwnProperty("source")) {
      this.setData({
        source: options.source
      })
    }
    if (options.hasOwnProperty("date")) {
      this.setData({
        datestr: options.date
      })
    }
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
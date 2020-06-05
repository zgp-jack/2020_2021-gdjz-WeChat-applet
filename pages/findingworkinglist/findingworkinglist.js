
//userTapSearch 
const app = getApp();
let footerjs = require("../../utils/footer.js");
let areas = require("../../utils/area.js");
let md5 = require("../../utils/md5.js");
var amapFile = require('../../utils/amap-wx.js');
const ads = require('../../utils/ad')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toptown: app.globalData.apiImgUrl + 'newlist-jobzd.png',
    rullIntegral: app.globalData.apiImgUrl + "resume-list-rules-btn.png",
    finded: app.globalData.apiImgUrl + "lpy/finded.png",
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    testImg: "http://cdn.yupao.com/miniprogram/images/user.png",
    gender: "",
    information: "",
    regionone: "",
    userInfo: "",
    unitid: ads.resumeListAd,
    footerActive: "findwork",
    touchStartTime: 0,
    touchEndTime: 0,
    lastTapTime: 0,
    lastTapTimeoutFunc: null,
    isFirstRequest: true,
    listsImg: {
      infoman: app.globalData.apiImgUrl + "infoman.png",
      posi: app.globalData.apiImgUrl + "posi.png",
      status: app.globalData.apiImgUrl + "status.png",
      nodata: app.globalData.apiImgUrl + "nodata.png",
      rilitime: app.globalData.apiImgUrl + "rilitime.png",
    },
    loadingGif: app.globalData.apiImgUrl + "loading.gif",
    nodata: app.globalData.apiImgUrl + "nodata.png",
    selectimg: app.globalData.apiImgUrl + 'select.png',
    returnTopImg: app.globalData.apiImgUrl + 'returntop.png',
    realNames: app.globalData.apiImgUrl + 'new-list-realname-icon.png?t=1', 
    authentication: app.globalData.apiImgUrl + 'new-list-jnzs-icon.png',
    showListsInfo: 0,
    province: -1,
    userCity: -1,
    worktype: -1,
    workinfo: -1,
    teamindex: -1,
    newindex: -1,
    // searchDate: {
    //   page: 1,
    //   list_type: "resume",
    //   area_id: 1,
    //   classify_id: "",
    //   keywords: "",
    //   staff_id: "",
    //   sort:"newest"
    // },
    searchDate: {
      page: 1,
      occupations: "resume",
      sort: "recommend",
      keywords: "",
      occupations: "",
      province: 1
    },
    fillterArea: [],
    fillterType: [],
    fillterTeam: [],
    fillterNewest: [],
    recommendteam: [{ name: "推荐" }],
    notice: {
      autoplay: true,
      indicatorDots: false,
      circular: true,
      vertical: true,
      interval: 5000,
      duration: 1000,
      lists: []
    },
    phone: "",
    wechat: "",
    lists: [],
    areaText: "选择城市",
    typeText: "选择工种",
    teamText: "人员构成",
    recommended: "推荐",
    showNothinkData: false,
    nothavemore: false,
    showMyLoading: false,
    jixieLinkImg: app.globalData.commonJixieAd,
    appLinkImg: app.globalData.commonDownloadApp,
    fixedAdImg: app.globalData.fixedDownApp,
    fixedGetIntegral: app.globalData.fixedGetIntegral,
    userShareData: {
      showApp: false,
      showWin: false,
      integral: "1"
    },
    userShareTime: {},
    isload: false,
    scrollTop: 0,
    showReturnTopImg: false,
    showHistoryList: false,
    historyList: [],
    joingroup: []
  },
  jumptop() {
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/finding-name-card/findingnamecard`,
    })
  },
  stopThisAction: function () {
    return false;
  },

  showListsType: function (e) {
    let type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      showListsInfo: (this.data.showListsInfo == type) ? 0 : type
    })
  },
  jumprull() {
    wx.navigateTo({
      url: "/packageOther/pages/ranking-rules/ranking-rules",
    })
  },
  userChooseNewest(e) {

    let _this = this;
    let index = parseInt(e.currentTarget.dataset.index);
    let _id = e.currentTarget.dataset.id;
    let text = e.currentTarget.dataset.type


    this.setData({ newindex: index })

    _this.returnTop();
    _this.setData({
      isFirstRequest: true,
      "searchDate.page": 1,
      "searchDate.sort": _id,
      recommended: text
    })
    _this.doRequestAction(false);
    _this.closeAllSelect();

  },
  userChooseTeam: function (e) {

    let _this = this;
    let index = parseInt(e.currentTarget.dataset.index);
    let _id = e.currentTarget.dataset.id;
    let teamText = e.currentTarget.dataset.team;
    let _sid = this.data.searchDate.staff_id;
    this.setData({ teamindex: index })
    //if (_id == _sid) return false;

    _this.returnTop();
    _this.setData({
      isFirstRequest: true,
      "searchDate.page": 1,
      "searchDate.type": _id,
      teamText: teamText
    })
    _this.doRequestAction(false);
    _this.closeAllSelect();
  },
  
  touchStart: function (e) {
    
    this.touchStartTime = e.timeStamp
  },
  touchEnd: function (e) {
    
    this.touchEndTime = e.timeStamp
  },
  userChooseProvince: function (e) {

    var _this = this;
    let index = parseInt(e.currentTarget.dataset.index);
    let directCtiy = parseInt(e.currentTarget.dataset.haschild);
    let _id = e.currentTarget.dataset.id;
    let areaText = e.currentTarget.dataset.area;
    // let _sid = this.data.searchDate.area_id;
    let _sid = this.data.searchDate.province;
    let panme = e.currentTarget.dataset.pname;
    let mydata = { "name": areaText, "id": _id, "ad_name": panme };
    this.setData({ province: index })
    
    //if (_id == _sid) return false;

    if (_this.touchEndTime - _this.touchStartTime < 350) {

      var currentTime = e.timeStamp
      var lastTapTime = _this.lastTapTime
      _this.lastTapTime = currentTime
      if (!directCtiy) app.setStorageAction(_id, mydata)
      if (currentTime - lastTapTime < 300) {
        //console.log("double tap");

        clearTimeout(_this.lastTapTimeoutFunc);
        _this.returnTop();
        _this.setData({
          isFirstRequest: true,
          "searchDate.page": 1,
          "searchDate.province": _id,
          areaText: areaText,
        })
        wx.setStorageSync("areaId", _id)
        wx.setStorageSync("areaText", areaText)
        _this.doRequestAction(false);
        _this.closeAllSelect();

      } else {
        _this.lastTapTimeoutFunc = setTimeout(function () {
          //console.log("tap");
          if (directCtiy == 0) {
            _this.returnTop();
            _this.setData({
              isFirstRequest: true,
              "searchDate.page": 1,
              "searchDate.province": _id,
              areaText: areaText
            })
            _this.doRequestAction(false);
            _this.closeAllSelect();
            wx.setStorageSync("areaId", _id)
            wx.setStorageSync("areaText", areaText)
          }
        }, 300);
      }
    }
  },
  userChooseCity: function (e) {
    let pname = e.currentTarget.dataset.pname;
    let pid = parseInt(e.currentTarget.dataset.pid);
    let areaText = e.currentTarget.dataset.area;
    let id = parseInt(e.currentTarget.dataset.id);
    app.globalData.areaIs = true;
    //if(parseInt(this.data.searchDate.area_id) == id) return false;
    this.setData({
      userCity: id,
      isFirstRequest: true,
      areaText: areaText,
      "searchDate.page": 1,
      "searchDate.province": id
    })
    let mydata = { "name": areaText, "id": id, ad_name: pname };
    if (id != pid) {
      app.setStorageAction(id, mydata)
    }

    this.returnTop();
    this.doRequestAction(false);
    this.closeAllSelect();
    wx.setStorageSync("areaId", id)
    wx.setStorageSync("areaText", areaText)
    wx.setStorageSync("showCity", id)
  },

  closeAllSelect: function () {
    this.setData({
      showListsInfo: 0
    })
  },
  userChooseWorktype: function (e) {
    var _this = this;
    let index = parseInt(e.currentTarget.dataset.index);
    let haschild = parseInt(e.currentTarget.dataset.haschild);
    let _type = parseInt(this.data.searchDate.classify_id);
    let _typeid = parseInt(e.currentTarget.dataset.id);
    let typeText = e.currentTarget.dataset.type;
    this.setData({ worktype: index })
    //if (_type == _typeid) return false;

    if (_this.touchEndTime - _this.touchStartTime < 350) {
      var currentTime = e.timeStamp
      var lastTapTime = _this.lastTapTime
      _this.lastTapTime = currentTime

      if (currentTime - lastTapTime < 300) {

        clearTimeout(_this.lastTapTimeoutFunc);

        _this.setData({
          isFirstRequest: true,
          "searchDate.page": 1,
          "searchDate.occupations": _typeid,
          typeText: typeText
        })
        _this.returnTop();
        _this.doRequestAction(false);
        _this.closeAllSelect();

      } else {
        _this.lastTapTimeoutFunc = setTimeout(function () {

          if (haschild == 0) {
            _this.setData({
              isFirstRequest: true,
              "searchDate.page": 1,
              "searchDate.occupations": _typeid,
              typeText: typeText
            })
            _this.returnTop();
            _this.doRequestAction(false);
            _this.closeAllSelect();
          }
        }, 300);
      }
    }

  },
  userChooseWorkinfo: function (e) {
    let typeText = e.currentTarget.dataset.type;
    let id = parseInt(e.currentTarget.dataset.id);
    //if (parseInt(this.data.searchDate.classify_id) == id) return false;
    this.setData({
      workinfo: id,
      typeText: typeText,
      isFirstRequest: true,
      "searchDate.page": 1,
      "searchDate.occupations": id
    })
    this.returnTop();
    this.doRequestAction(false);
    this.closeAllSelect();

  },
  showThisNotice: function (e) {
    let _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/static/notice?type=1&id=' + _id,
    })
  },
  doRequestAction: function (_append, callback) {
    let _this = this;
    if (_this.data.isload) return false;
    let userLocation = wx.getStorageSync("userLocation");

    let locate = {}
    Object.assign(locate, _this.data.searchDate, {
      location: userLocation ? userLocation.split(",").reverse().join(",") : '',
    })
    this.setData({
      isload: true,
      nothavemore: false,
      showNothinkData: false
    })
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: "resumes/index/",
      params: locate,
      success: function (res) {
        callback ? callback() : ""
        if (res.data.errcode == "ok") {
          _this.setData({ isload: false })
          wx.hideLoading();
          let mydata = res.data.errmsg;
          let _page = parseInt(_this.data.searchDate.page)
          _this.setData({ isFirstRequest: false });
          if (mydata && mydata.length) {
            let _data = _this.data.lists;
            for (let i = 0; i < mydata.length; i++) {
              _data.push(mydata[i]);
            }
            _this.setData({
              "searchDate.page": (parseInt(_page) + 1),
              lists: _append ? _data : mydata
            })
            // _this.setData({
            //   information: _data
            // })
          } else {
            if (_page == 1) {
              _this.setData({
                showNothinkData: true,
                lists: []
              })
            } else {
              _this.setData({
                nothavemore: true
              })
            }
          }
        }
      },
      fail: function (err) {
        callback ? callback() : ""
        _this.setData({ isload: false })
        wx.hideLoading();
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none"
        })
      }
    })
  },

  initNeedData: function () {
    let _this = this;
    let _mark = true;
    let _wx = wx.getStorageSync("resume_wx");
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo ? userInfo : false })
    let _time = Date.parse(new Date());
    if (_wx && _wx.expirTime) {
      if (parseInt(_wx.expirTime) > _time) _mark = false;
    }
    app.getNoticeInfo(userInfo,function(mydata){
      _this.setData({
        "notice.lists": mydata.notice,
        member_less_info: mydata.member_less_info,
        phone: mydata.phone,
        wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number),
        joingroup: mydata.join_group_config
      })
      if (_mark) {
        let extime = _time + (mydata.wechat.outTime * 1000);
        wx.setStorageSync("resume_wx", { wechat: mydata.wechat.number, expirTime: extime });
      }
    })
  },
  errImg: function (e) {
    let index = e.currentTarget.dataset.index;
    let obj = `lists[${index}].headerimg`;
    this.setData({
      [obj]: "http://cdn.yupao.com/miniprogram/images/user.png"
    })

  },

  initAreaInfo: function () {
    let areaId = wx.getStorageSync("areaId");
    let areaText = wx.getStorageSync("areaText");
    this.setData({
      "searchDate.province": areaId ? areaId : 1
    })
    this.doRequestAction(false);
  },
  callThisPhone: function (e) {
    app.callThisPhone(e);
  },
  clipboardWechat: function (e) {
    let wechat = e.currentTarget.dataset.wechat;
    wx.setClipboardData({
      data: wechat,
      success(res) {
        wx.hideToast();
        wx.showModal({
          title: '恭喜您',
          content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
          showCancel: false,
          success: function () { }
        })
      }
    })
  },

  bindInputFocus: function () {
    this.setData({
      showHistoryList: true
    })
  },

  searchThisWords: function (e) {

    let text = e.currentTarget.dataset.text;

    this.setData({
      "searchDate.keywords": text,
      showHistoryList: false
    })

    this.userTapSearch();
  },
  closeHistory: function () {
    this.setData({
      showHistoryList: false
    })
  },
  clearHistory: function () {
    this.setData({
      showHistoryList: false
    })
    let his = wx.getStorageSync("searchHistory")
    if (his.hasOwnProperty("resume")) {
      his.resume = [];
      wx.setStorageSync("searchHistory", his)
    }
    this.initSearchHistory();
  },
  bindKeyInput: function (e) {
    let text = e.detail.value;

    this.setData({
      "searchDate.keywords": text,
    })
  },
  initSearchHistory: function () {
    let his = wx.getStorageSync("searchHistory")
    if (his) {
      let job = his.hasOwnProperty("resume");
      if (job) {
        let jobs = his.resume
        this.setData({ historyList: jobs })
      }
    }
  },

  //用户点击搜索
  userTapSearch: function () {
    // if (!this.data.userInfo) {
    //   app.gotoUserauth();
    //   return false;
    // }
    //if (this.data.searchDate.keywords == "") return false;

    let text = this.data.searchDate.keywords;
    if (text) {
      let his = wx.getStorageSync("searchHistory")
      if (his) {
        let job = his.hasOwnProperty("resume");
        if (job) {
          let jobs = his.resume;
          let index = jobs.indexOf(text);
          if (index != -1) {
            jobs.splice(index, 1);
          }
          jobs.unshift(text);

        } else {
          his.resume = [];
          his.resume.push(text)
        }
        his.resume.splice(4)
        wx.setStorageSync("searchHistory", his)
      } else {
        let myhis = {
          resume: [text]
        }
        wx.setStorageSync("searchHistory", myhis)
      }
    }
    this.returnTop();
    this.setData({
      "searchDate.page": 1,
      showHistoryList: false
    })
    this.doRequestAction(false);
    this.initSearchHistory();
  },
  returnTop: function () {
    //this.setData({ scrollTop: 0 })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showToast({
        title: '当前微信版本过低，无法自动回到顶部，请升级到最新微信版本后重试。',
        icon: 'none'
      })
    }
  },
  valiFilterProvince: function () {
    let _this = this;
    let areaId = wx.getStorageSync("areaId");
    let showCity = wx.getStorageSync("showCity");
    let areaText = wx.getStorageSync("areaText");
    
    if (areaId == "1") {
      _this.setData({ areaText: "全国" })
      _this.initAreaInfo();
      return false;
    }
    if (showCity && showCity == areaId && app.globalData.areaIs) {
      if (areaText) {
        _this.setData({ areaText: areaText })
        _this.initAreaInfo();
      }

    }else{
      _this.setData({ areaText: areaText })
      _this.initAreaInfo();
      return false
      app.appRequestAction({
        url: "resume/get-resume-province/",
        hideLoading: true,
        params: { area_id: areaId },
        success: function (res) {
          let mydata = res.data;
          _this.setData({ areaText: mydata.provinceName })

          wx.setStorageSync("areaId", mydata.provinceId)

          _this.initAreaInfo();

        }
      });

    }
  },

  //新版本搜索
  doSearchRequestAction: function (_append) {
    let _this = this;
    this.setData({
      nothavemore: false,
      showNothinkData: false
    })
    let _data = _this.data.searchDate;
    _data.system_time = (parseInt(new Date().getTime() / 1000) + app.globalData.userGapTime);
    let _str = md5.hexMD5(_data.system_time.toString());
    _data.system_token = md5.hexMD5(_str.substring(0, 16));
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: "index/info-list-new/",
      params: _data,
      success: function (res) {
        app.globalData.isFirstLoading ? "" : wx.hideLoading();
        let mydata = res.data;

        if (mydata.errcode == "token_fail") {
          app.initAdminTime(function () {
            _this.doSearchRequestAction();
          })
          return false;
        }

        let _page = parseInt(_this.data.searchDate.page)
        _this.setData({ isFirstRequest: false });
        if (mydata && mydata.length) {
          let _data = _this.data.lists;
          for (let i = 0; i < mydata.length; i++) {
            _data.push(mydata[i]);
          }
          _this.setData({
            "searchDate.page": (parseInt(_page) + 1),
            lists: _append ? _data : mydata
          })
        } else {
          if (_page == 1) {
            _this.setData({
              showNothinkData: true,
              lists: []
            })
          } else {
            _this.setData({
              nothavemore: true
            })
          }
        }

      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: '网络错误，加载失败！',
          showCancel: false
        })
      }
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
    footerjs.initMsgNum(this);
  },
  doPublishAction: function () {
    footerjs.doPublishAction(this);
  },
  closePublishAction: function () {
    footerjs.closePublishAction(this);
  },
  valiUserCard: function () {

    let userInfo = this.data.userInfo;
    // if(!userInfo){
    //   app.gotoUserauth();
    //   return false;
    // }
    footerjs.valiUserCard(this, app, userInfo);
  },
  getFilterData: function () {
    let _this = this;
    // this.setData({ fillterArea: areas.getProviceList() })
    _this.setData({
      fillterArea: areas.getAreaArr
    })
    app.globalData.allTypes ? this.setData({ fillterType: app.globalData.allTypes.classTree, fillterTeam: app.globalData.allTypes.staffTree, fillterNewest: app.globalData.allTypes.resumeListType }) : app.getListsAllType(function (_data) {
      _this.setData({
        fillterType: _data.classTree,
        fillterTeam: _data.staffTree,
        fillterNewest: _data.resumeListType
      })
    })
    
  },
  initUserShareTimes: function () {
    app.pageInitSystemInfo(this);
  },
  userShareAction: function () {
    let _this = this;
    app.userShareAction(function (_str) {
      if (_str == "share") {
        _this.setData({
          "userShareData.showApp": true
        })
      } else {
        _this.setData({
          "userShareData.showWin": true,
          userShareTime: app.globalData.userShareData,
          "userShareData.integral": _str.integral
        })
      }
    })
  },
  userTapLink: function (e) {
    this.setData({ "userShareData.showApp": false, "userShareData.showWin": false })
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  closeWinbox: function (e) {
    let type = e.currentTarget.dataset.type;
    if (type == "app") {
      this.setData({ "userShareData.showApp": false })
    } else {
      this.setData({ "userShareData.showWin": false })
    }
  },
  onPageScroll: function (e) {
    let top = e.scrollTop;
    this.setData({ showReturnTopImg: (top > 960) ? true : false })
  },
  /**
   * 生命周期函数--监听页面加载
   */





  showDetailInfo: function (e) {

    let uuid = e.currentTarget.dataset.uuid
    let userLocation = wx.getStorageSync("userLocation")
    if (!userLocation) {
      userLocation = ""
    } else {
      userLocation = userLocation.split(",").reverse().join(",")
    }

    wx.navigateTo({
      url: `/pages/boss-look-card/lookcard?uuid=${uuid}&location=${userLocation}`
    })
  },

  persondetail(e) {
    let userLocation = wx.getStorageSync("userLocation")
    if (!userLocation) {
      userLocation = ""
    } else {
      userLocation = userLocation.split(",").reverse().join(",")
    }
    let uuid = e.currentTarget.dataset.uuid

    wx.navigateTo({
      url: `/pages/boss-look-card/lookcard?uuid=${uuid}&location=${userLocation}`,
    })
  },
  checkIsInvite: function (options) {
    if (options.hasOwnProperty("refid")) {
      app.globalData.refId = options.refid;
    }
    if (options.hasOwnProperty("source")) {
      wx.setStorageSync("_source", options.source);
    }
  },
  onLoad(options) {
    this.initSearchHistory();
    this.initUserShareTimes();
    this.getFilterData();
    this.valiFilterProvince();
    this.initFooterData();
    this.initNeedData();
    this.checkIsInvite(options);
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
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
    footerjs.initMsgNum(this);
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
   * 页面相关事件处理函数--监听用户下拉动作 onReachBottom
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    //wx.startPullDownRefresh()
    this.returnTop();
    this.setData({
      "searchDate.page": 1,
      showHistoryList: false
    })
    this.doRequestAction(false, function () {

      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if ((this.data.isFirstRequest) || (this.data.showNothinkData) || (this.data.nothavemore)) return false;
    this.doRequestAction(true);
  },


  onShareAppMessage: function () {

    let commonShareTips = app.globalData.commonShareTips;
    return {
      title: commonShareTips,
      imageUrl: app.globalData.commonShareImg,
      path: '/pages/index/index'
    }

  },
  /**
   * 用户点击右上角分享
   */
})


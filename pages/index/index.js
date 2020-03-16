// pages/lists/lists. bindInputFocus /geocode/regeo ref userLocation userChooseProvince
const app = getApp();
let footerjs = require("../../utils/footer.js");
let areas = require("../../utils/area.js");
let md5 = require("../../utils/md5.js");
const Amap = require("../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
Page({

  /**
   * 页面的初始数据 showDetailInfo footerImgs
   */
  data: {
    showShadowFc: false,
    fcheader: app.globalData.apiImgUrl + "yindao-fc-tips.png",
    fcbody: app.globalData.apiImgUrl + "yindao-fc-body.png",
    unitid: app.globalData.unitid,
    footerActive: "recruit",
    userInfo: true,
    touchStartTime: 0,
    touchEndTime: 0,
    lastTapTime: 0,
    lastTapTimeoutFunc: null,
    isFirstRequest: true,
    userAuthBtn: 400,
    listsImg: {
      infoman: app.globalData.apiImgUrl + "infoman.png",
      posi: app.globalData.apiImgUrl + "posi.png",
      status: app.globalData.apiImgUrl + "status.png",
      nodata: app.globalData.apiImgUrl + "nodata.png",
      rilitime: app.globalData.apiImgUrl + "rilitime.png",
    },
    userAuthGif: app.globalData.apiImgUrl + "user-auth.gif",
    loadingGif: app.globalData.apiImgUrl + "loading.gif",
    nodata: app.globalData.apiImgUrl + "nodata.png",
    selectimg: app.globalData.apiImgUrl + 'select.png',
    returnTopImg: app.globalData.apiImgUrl + 'returntop.png',
    showListsInfo: 0,
    province: -1,
    userCity: -1,
    worktype: -1,
    workinfo: -1,
    searchDate: {
      page: 1,
      list_type: "job",
      area_id: 1,
      classify_id: "",
      keywords: "",
      joblisttype: "newest"
    },
    fillterArea: [],
    fillterType: [],
    fillterListType: [],
    joblisttype: "",
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
    listText: "最新",
    showNothinkData: false,
    nothavemore: false,
    showMyLoading: false,
    jixieLinkImg: app.globalData.commonJixieAd,
    appLinkImg: app.globalData.commonDownloadApp,
    fixedAdImg: app.globalData.fixedDownApp,
    fixedGetIntegral: app.globalData.fixedGetIntegral,
    userAuthImg: "http://cdn.yupao.com/miniprogram/images/gdjz-userauth.gif?t=" + new Date().getTime(),
    userShareData: {
      showApp: false,
      showWin: false,
      integral: "1",
    },
    userShareTime: {},
    firstJoin: false,
    fastIssueImg: app.globalData.apiImgUrl + "index-fast-issue.png",
    // showFastIssue: app.globalData.showFastIssue,
    joblistjz: app.globalData.apiImgUrl + "joblist_zd.png",
    joblistwyjz: app.globalData.apiImgUrl + "joblist_wyzd.png",
    isload: false,
    scrollTop: 0,
    showReturnTopImg: false,
    bring: app.globalData.apiImgUrl + 'newlist-jobzd.png', //顶置图片
    autimg: app.globalData.apiImgUrl + 'newlist-jobrealname.png', //实名图片
    hirimg: app.globalData.apiImgUrl + 'newlist-jobfinding.png', //招人图片
    doneimg: app.globalData.apiImgUrl + 'newlist-jobfindend.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'newlist-jobposi.png',//定位
    historydel: app.globalData.apiImgUrl + "historylist-del.png",
    feedbackimg: app.globalData.apiImgUrl + "feedbackmsg-img.png",
    rightarrow: app.globalData.apiImgUrl + "feedback-rightarrow.png",
    iImgUrl: app.globalData.apiImgUrl, //图片地址
    showHistoryList: false,
    historyList: [],
    // member_notice:{},
    member_less_info: {},
    msgsNumber: [],
    joingroup: []
  },
  getMapInfo: function (callback) {
    let that = this;
    amapFun.getRegeo({
      success: function (data) {
        let gpsLocation = {
          province: data[0].regeocodeData.addressComponent.province,
          city: data[0].regeocodeData.addressComponent.city,
          adcode: data[0].regeocodeData.addressComponent.adcode,
          citycode: data[0].regeocodeData.addressComponent.citycode
        }
        let province = areas.getProviceItem(gpsLocation.province, gpsLocation.city)
        wx.setStorageSync("areaText", province.name)
        wx.setStorageSync("areaId", province.id)

        callback(province)
      },
      fail: function (info) {
        wx.setStorageSync("areaText", "全国")
        wx.setStorageSync("areaId", "1")
      }
    })
  },
  wantFastIssue: function () {
    if (!this.data.userInfo) {
      app.gotoUserauth();
      return false;
    }
    wx.navigateTo({
      url: '/pages/published/published?type=0&jz=1',
    })
  },
  showDetailInfo: function (e) {
    // console.log(e)
    // let uinfo = this.data.userInfo;
    app.showDetailInfo(e);
  },
  touchStart: function (e) {
    console.log(e)
    this.touchStartTime = e.timeStamp
  },
  touchEnd: function (e) {
    console.log(e)
    this.touchEndTime = e.timeStamp
  },
  showListsType: function (e) {
    let type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      showListsInfo: (this.data.showListsInfo == type) ? 0 : type
    })
  },
  closeAllSelect: function () {

    this.setData({
      showListsInfo: 0
    })
  },
  userChooseProvince: function (e) {
    var _this = this;
    let index = parseInt(e.currentTarget.dataset.index);
    let directCtiy = parseInt(e.currentTarget.dataset.haschild);
    let _id = e.currentTarget.dataset.id;
    let areaText = e.currentTarget.dataset.area;
    let _sid = this.data.searchDate.area_id;
    let panme = e.currentTarget.dataset.pname;
    let mydata = { "name": areaText, "id": _id, "ad_name": panme };
    this.setData({ province: index })

    //if(_id == _sid) return false;
    console.log(_this.touchEndTime)
    console.log(_this.touchStartTime)
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
          "searchDate.area_id": _id,
          areaText: areaText
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
              "searchDate.area_id": _id,
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
    app.globalData.areaIs = false;
    //if(parseInt(this.data.searchDate.area_id) == id) return false;
    this.setData({
      userCity: id,
      isFirstRequest: true,
      areaText: areaText,
      "searchDate.page": 1,
      "searchDate.area_id": id
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
      console.log("tap1");
      if (currentTime - lastTapTime < 300) {
        console.log("double tap");
        clearTimeout(_this.lastTapTimeoutFunc);

        _this.setData({
          isFirstRequest: true,
          "searchDate.page": 1,
          "searchDate.classify_id": _typeid,
          typeText: typeText
        })
        _this.returnTop();
        _this.doRequestAction(false);
        _this.closeAllSelect();

      } else {
        _this.lastTapTimeoutFunc = setTimeout(function () {
          console.log("tap");
          if (haschild == 0) {
            _this.setData({
              isFirstRequest: true,
              "searchDate.page": 1,
              "searchDate.classify_id": _typeid,
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
  userChooseListType: function (e) {
    let type = e.currentTarget.dataset.type;
    let name = e.currentTarget.dataset.name;
    this.setData({
      "searchDate.joblisttype": type,
      listText: name,
      isFirstRequest: true,
      "searchDate.page": 1,
    })
    this.returnTop();
    this.doRequestAction(false);
    this.closeAllSelect();
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
      "searchDate.classify_id": id
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
    this.setData({
      isload: true,
      nothavemore: false,
      showNothinkData: false
    })
    try {
      wx.showLoading({ title: '数据加载中' })
    } catch (err) {
      console.log(err);
    }

    let _params = _this.data.searchDate;
    let uinfo = wx.getStorageSync("userInfo");
    if (uinfo) {
      _params.userId = uinfo.userId;
      _params.token = uinfo.token;
      _params.tokenTime = uinfo.tokenTime;
    }
    app.doRequestAction({
      url: "job/list-new/",
      way: "POST",
      params: _params,
      success: function (res) {
        callback ? callback() : ""
        _this.setData({ isload: false })
        app.globalData.isFirstLoading ? "" : wx.hideLoading();
        let mydata = res.data;
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
    app.doRequestAction({
      url: "job/list-new/",
      way: "POST",
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
    let _wx = wx.getStorageSync("_wx");
    let userInfo = this.data.userInfo;
    let _time = Date.parse(new Date());
    this.validateLogin();
    if (_wx && _wx.expirTime) {
      if (parseInt(_wx.expirTime) > _time) _mark = false;
    }
    if (userInfo) userInfo.type = "job"
    else userInfo = { type: "job" }
    app.doRequestAction({
      url: "index/less-search-data/",
      way: "POST",
      params: userInfo,
      success: function (res) {
        let mydata = res.data;

        console.log(mydata)
        _this.setData({
          "notice.lists": mydata.notice,
          // member_notice: mydata.member_notice,
          member_less_info: mydata.member_less_info,
          phone: mydata.phone,
          wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number),
          joingroup: mydata.join_group_config
        })
        app.globalData.serverPhone = mydata.phone;
        app.globalData.joingroup = mydata.join_group_config;

        if (_mark) {
          let extime = _time + (mydata.wechat.outTime * 1000);
          wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime });
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '数据加载失败！',
          icon: "none",
          duration: 3000
        })
      }
    })
  },
  initAreaInfo: function () {
    let areaId = wx.getStorageSync("areaId");
    let areaText = wx.getStorageSync("areaText");
    this.setData({
      "searchDate.area_id": areaId ? areaId : 1,
      areaText: areaText ? areaText : "全国"
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
    if (his.hasOwnProperty("job")) {
      his.job = [];
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
      let job = his.hasOwnProperty("job");
      if (job) {
        let jobs = his.job
        this.setData({ historyList: jobs })
      }
    }
  },
  userTapSearch: function () {
    // if(!this.data.userInfo){
    //   app.gotoUserauth();
    //   return false;
    // }
    //if(this.data.searchDate.keywords == "") return false;
    let text = this.data.searchDate.keywords;
    if (text) {
      let his = wx.getStorageSync("searchHistory")
      if (his) {
        let job = his.hasOwnProperty("job");
        if (job) {
          let jobs = his.job;
          let index = jobs.indexOf(text);
          if (index != -1) {
            jobs.splice(index, 1);
          }
          jobs.unshift(text);

        } else {
          his.job = [];
          his.job.push(text)
        }
        his.job.splice(4)
        wx.setStorageSync("searchHistory", his)
      } else {
        let myhis = {
          job: [text]
        }
        wx.setStorageSync("searchHistory", myhis)
      }
    }


    this.returnTop();
    this.setData({
      "searchDate.page": 1,
      showHistoryList: false
    })
    this.initSearchHistory();
    this.doRequestAction(false);
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
  initUserinfo: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    // app.initSystemInfo(function (res) {
    //     if (res) {
    //         let _h = (res.windowWidth * 0.7) / 0.6216;
    //         _this.setData({ userAuthBtn: _h })
    //     }
    // })

    // if(!userInfo){
    //     this.setData({ userInfo:false })
    //     return false;
    // }
    this.setData({ userInfo: userInfo ? userInfo : false });
    this.initNeedData();
    // if (userInfo) if (!app.globalData.showFastIssue.request) app.isShowFastIssue(this);
    // else this.setData({ showFastIssue: app.globalData.showFastIssue })

  },
  valiUserUrl: function (e) {
    let userInfo = this.data.userInfo;
    app.valiUserUrl(e, userInfo);
  },
  //用户授权
  bindGetUserInfo: function (e) {
    let that = this;
    app.bindGetUserInfo(e, function (res) {
      app.mini_user(res, function (res) {
        app.api_user(res, function (res) {
          let uinfo = res.data;
          if (uinfo.errcode == "ok") {
            let userInfo = {
              userId: uinfo.data.id,
              token: uinfo.data.sign.token,
              tokenTime: uinfo.data.sign.time,
            }
            that.setData({
              userInfo: userInfo
            })
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            that.initNeedData();
            //that.initUserShareTimes();
            // if (!app.globalData.showFastIssue.request) app.isShowFastIssue(that);
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  // 检查是否邀请
  checkIsInvite: function (options) {
    if (options.hasOwnProperty("refid")) {
      app.globalData.refId = options.refid;
    }
    if (options.hasOwnProperty("source")) {
      wx.setStorageSync("_source", options.source);
    }
  },
  // 验证用户登录状态
  validateLogin: function () {
    let _this = this;
    let userInfo = this.data.userInfo;
    if (!userInfo) return false;
    app.doRequestAction({
      url: "user/validate-login/",
      way: "POST",
      params: userInfo,
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "update") {
          _this.setData({
            "userInfo.token": mydata.data.token,
            "userInfo.tokenTime": mydata.data.time
          })
          app.globalData.userInfo = _this.data.userInfo;
          wx.setStorageSync('userInfo', _this.data.userInfo)
        } else if (mydata.errcode == "fail") {
          console.log(mydata.errmsg)
          app.showMyTips(mydata.errmsg);
          _this.setData({
            userInfo: false
          })
        }
      }
    });
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
    console.log("发布被点击了");
    footerjs.doPublishAction(this);
  },
  closePublishAction: function () {
    console.log("关闭被点击了");
    footerjs.closePublishAction(this);
  },
  valiUserCard: function () {
    let userInfo = this.data.userInfo;
    footerjs.valiUserCard(this, app, userInfo);
  },
  initUserLocation: function () {
    let _this = this;
    let areaId = wx.getStorageSync("areaId");
    let areaText = wx.getStorageSync("areaText");
    let gpsOrientation = wx.getStorageSync("gpsOrientation");

    if (areaId && areaText) {
      _this.initAreaInfo()
    } else if (gpsOrientation) {
      wx.setStorageSync("areaText", gpsOrientation.name)
      wx.setStorageSync("areaId", gpsOrientation.id)
      _this.initAreaInfo();
    } else {
      _this.setData({
        "searchDate.area_id": 1,
        areaText: "全国"
      })
      _this.doRequestAction(false);

      _this.getMapInfo(function (res) {
        _this.setData({
          "searchDate.page": 1,
        })
        _this.initAreaInfo();
      })

    }

  },
  timerLoading: function () {
    let _this = this;
    wx.showLoading({ title: '数据加载中' })
    setTimeout(function () {
      wx.hideLoading();
      app.globalData.isFirstLoading = false
    }, 3000)
  },
  getFilterData: function () {
    let _this = this;
    this.setData({
      fillterArea: areas.getAreaArr
    })
    if (app.globalData.allTypes) {
      _this.setData({ fillterType: app.globalData.allTypes.classTree, fillterListType: app.globalData.allTypes.jobListType, "searchDate.joblisttype": app.globalData.allTypes.jobListType[0].type, listText: app.globalData.allTypes.jobListType[0].name });
      if (_this.data.fillterType.length == 1) _this.setData({ typeText: _this.data.fillterType[0].name })
    } else {
      app.getListsAllType(function (_data) {
        _this.setData({ fillterType: _data.classTree, fillterListType: _data.jobListType, "searchDate.joblisttype": _data.jobListType[0].type, listText: _data.jobListType[0].name })
        if (_this.data.fillterType.length == 1) _this.setData({ typeText: _this.data.fillterType[0].name })
      });
    }
  },

  initUserShareTimes: function () {
    let userInfo = wx.getStorageSync("userInfo");
    app.pageInitSystemInfo(this);
    if (userInfo) app.initUserShareTimes();
  },
  stopThisAction: function () {
    return false;
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
  initAdminTime: function (callback) {
    app.initAdminTime();
  },
  initFirstTips: function () {
    app.initFirstTips(this);
  },
  getUserUuid: function () {
    app.getUserUuid();
  },
  initFirstFcInfo: function () {
    let isshow = wx.getStorageSync('isshowfc')
    if (isshow) return;
    this.setData({ showShadowFc: true })
    wx.setStorageSync('isshowfc', 1)
  },
  closeFc: function () {
    this.setData({ showShadowFc: false })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initFirstFcInfo();
    this.initSearchHistory();
    //this.isShowFastIssue();
    this.initFirstTips();
    this.initAdminTime();
    //this.initUserShareTimes();
    this.getFilterData();
    this.timerLoading();
    this.initUserLocation();
    this.initFooterData();
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
    this.getUserUuid();
    this.initUserinfo();
    footerjs.initMsgNum(this);
  },
  onPageScroll: function (e) {
    let top = e.scrollTop;
    this.setData({ showReturnTopImg: (top > 960) ? true : false })
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

  /**
   * 用户点击右上角分享 工地急招 gpsPorvince closeAllSelect firstJoin
   */
  onShareAppMessage: function () {
    //this.userShareAction();
    return app.getUserShareJson();
  }
})
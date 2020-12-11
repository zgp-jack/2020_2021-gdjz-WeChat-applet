// pages/lists/lists. bindInputFocus /geocode/regeo ref userLocation userChooseProvince
const app = getApp();
let footerjs = require("../../utils/footer.js");
let areas = require("../../utils/area.js");
let md5 = require("../../utils/md5.js");
const Amap = require("../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
const ads = require('../../utils/ad')
Page({

  /**
   * 页面的初始数据 showDetailInfo footerImgs
   */
  data: {
    showShadowFc: false,
    fcheader: app.globalData.apiImgUrl + "yindao-fc-tips.png",
    fcbody: app.globalData.apiImgUrl + "yindao-fc-body.png",
    unitid: ads.recruitListAd,
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
    listText: "最新排序",
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
    autimg: app.globalData.apiImgUrl + 'new-list-realname-icon.png', //实名图片
    hirimg: app.globalData.apiImgUrl + 'recruit-lists-new-finding.png', //招人图片
    doneimg: app.globalData.apiImgUrl + 'published-recruit-end.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'lpy/biaoqian.png',//定位
    historydel: app.globalData.apiImgUrl + "historylist-del.png",
    feedbackimg: app.globalData.apiImgUrl + "feedbackmsg-img.png",
    rightarrow: app.globalData.apiImgUrl + "feedback-rightarrow.png",
    iImgUrl: app.globalData.apiImgUrl, //图片地址
    showHistoryList: false,
    historyList: [],
    // member_notice:{},
    member_less_info: {},
    msgsNumber: [],
    joingroup: [],
    turntableimg:app.globalData.apiImgUrl + 'mini-turntable-new.png',
    inviteturntable:app.globalData.apiImgUrl + 'inviteuser-getintegral.png',
    showturntable: false,
    jgjzData: {},
    resumeText:"",
    // pageStatus是goback的话需要刷新当前页面状态
    pageStatus:'',
    // pageStatus是goback的话需要刷新当前页面信息ID
    pageId: '',
    //没有数据时 按钮显示状态
    isNullStatus:"",
    //搜索框清除按钮
    delImg: app.globalData.apiImgUrl + "new-published-close-icon.png",
    //是否显示清除按钮
    showdeletekey:false,
    // 刷新提示框提示内容
    tipBox: {//提示框显示信息
      showTitle: true,
      showIcon: false,
      showCancel: true,
      confirmColor:'',
      cancelColor:'',
      content: [{
        des: '',
        color: '',
        text: []
      }
    ],
      confirmText: '',
      cancelText: '',
      showClose: false
    },
    // 刷新状态
    refreshStatus: false,
    // 刷新成功icon
    successIcon:app.globalData.apiImgUrl + 'yc/findwork-publish-success.png',
    // 提示框状态
    boxType: false
  },
  getPhoneNumber:function(e){
    console.log(e)
    if(e.detail.errMsg != "getPhoneNumber:ok"){
      wx.navigateTo({
        url: '/packageOther/pages/userinfo/phone/phone',
      })
      return
      
    }
    wx.login({
      complete: (res) => {
        let code = res.code
        app.appRequestAction({
          url: 'http://localhost/axin/login',
          params:{
            code: code
          },
          success:(data => {
            let datajson = data.data.data
            let mydata = JSON.parse(datajson)
            app.appRequestAction({
              url: 'http://localhost/axin/en',
              params:{
                sessionKey: mydata.session_key,
                encryptedData:e.detail.encryptedData,
                iv: e.detail.iv
              },
              success:res=>{
                console.log(res)
              }
            })
            
          })
        })
      },
    })
  },
  showdownappaction:function(){
    wx.navigateTo({
      url: '/packageOther/pages/download/download-app',
    })
    //this.selectComponent("#downapptips").showaction() 
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
      url: '/pages/published/recruit/list?jz=1',
    })
  },
  showDetailInfo: function (e) {
    let userLocation = wx.getStorageSync("userLocation")
    if (!userLocation) {
      userLocation = ""
    } else {
      userLocation = userLocation.split(",").reverse().join(",")
    }
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/info/info?id=' + id
    })
    
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
    app.activeRefresh()
  },
  closeAllSelect: function (e) {
    app.activeRefresh()
    this.setData({
      showListsInfo: 0
    })
    if(e && e.target.dataset.gosearch == 1){
      if(this.data.searchDate.keywords == ""){
        wx.navigateTo({
          url: "/pages/search/search?changeStatus=0"
        })
      }else {
        wx.navigateTo({
          url: "/pages/search/search?changeStatus=0&key="+this.data.searchDate.keywords
        })
      }
    }
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
    wx.setStorageSync('typeText', typeText)
    wx.setStorageSync('typeId', _typeid)
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
    wx.setStorageSync("joblisttype",type)
    wx.setStorageSync("joblistname",name)
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
    wx.setStorageSync('typeText', e.currentTarget.dataset.type)
    wx.setStorageSync('typeId', e.currentTarget.dataset.id)
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
        app.activeRefresh()
        callback ? callback() : ""
        _this.setData({ isload: false })
        app.globalData.isFirstLoading ? "" : wx.hideLoading();
        let mydata = res.data.data;
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
          _this.setData({
            isNullStatus:res.data.is_null
          })
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
        app.activeRefresh()
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
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo ? userInfo : false });
    let _time = Date.parse(new Date());
    this.validateLogin();
    if (_wx && _wx.expirTime) {
      if (parseInt(_wx.expirTime) > _time) _mark = false;
    }
    if (userInfo) userInfo.type = "job"
    else userInfo = { type: "job" }
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
        wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime });
      }
    })
  },
  initAreaInfo: function () {
    let areaId = wx.getStorageSync("areaId");
    let areaText = wx.getStorageSync("areaText");
    let typeText = wx.getStorageSync('typeText');
    let typeId = wx.getStorageSync('typeId');
    let joblisttype = wx.getStorageSync('joblisttype');
    let joblistname = wx.getStorageSync('joblistname');
    this.setData({
      "searchDate.area_id": areaId ? areaId : 1,
      areaText: areaText ? areaText : "全国",
      typeText: typeText ? typeText : "全部分类",
      "searchDate.classify_id": typeId ? typeId:"0",
      "searchDate.joblisttype": joblisttype ? joblisttype:"newest",
      listText: joblistname ? joblistname:"最新排序"
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
    //判断是搜索还是取消按钮
    if(this.data.showdeletekey){
      //清除搜索内容 重新请求搜索接口
      this.deletekey()
    }else {
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
    }
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
    this.setData({ userInfo: userInfo ? userInfo : false });
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

  // 根据发布方式不同发布招工：未登录或者“fast_add_job”是快速发布，“ordinary_add_job”是普通发布。
  publishJob:function () {
    app.initJobView()
  },

  // 共用footer

  jumpThisLink: function (e) {
    app.jumpThisLink(e);
  },
  userTapTurntable:function(){
    let user = wx.getStorageSync('userInfo')
    if(!user){
      wx.navigateTo({
        url: '/pages/userauth/userauth',
      })
    }else{
      wx.navigateTo({
        url: '/pages/turntable/turntable',
      })
    }
  },
  initFooterData: function () {
    this.setData({
      footerImgs: footerjs.footerImgs,
      publishActive: footerjs.publishActive,
      showPublishBox: footerjs.showPublishBox,
      resumeText:app.globalData.resumeText,
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
  getFilterData: function (options) {
    let joblistname = wx.getStorageSync('joblistname')
    let joblisttype = wx.getStorageSync('joblisttype')
    let _this = this;
    this.setData({
      fillterArea: areas.getAreaArr
    })
    if (options.hasOwnProperty("aid")) {
      let aid = options.aid
      let area = areas.getAreaArr;
      let areaName = '';
      area.forEach(areaItem => {
        if (areaItem.has_children) {
          let index = areaItem.children.findIndex((item=>item.id == aid))
          if (index != -1) {
            areaName = areaItem.children[index].name
          }
        }else{
          if (areaItem.id == aid) {
            areaName = areaItem.name;
          }
        }
      });
      if (areaName) {
        wx.setStorageSync('areaId', aid);
        wx.setStorageSync('areaText', areaName)
      }
    }
    let {id} = options
    if (app.globalData.allTypes) {
      _this.setData({ fillterType: app.globalData.allTypes.classTree, fillterListType: app.globalData.allTypes.jobListType, "searchDate.joblisttype": joblisttype ? joblisttype : app.globalData.allTypes.jobListType[0].type, listText: joblistname ? joblistname : app.globalData.allTypes.jobListType[0].name });
      _this.initSelectedData(id,app.globalData.allTypes)
      if (_this.data.fillterType.length == 1) _this.setData({ typeText: _this.data.fillterType[0].name })
    } else {
      app.getListsAllType(function (_data) {
        _this.setData({ fillterType: _data.classTree, fillterListType: _data.jobListType, "searchDate.joblisttype":joblisttype ? joblisttype : _data.jobListType[0].type, listText: joblistname ? joblistname :_data.jobListType[0].name })
        _this.initSelectedData(id,_data)
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
  initTurntable:function(){
    let userinfo = wx.getStorageSync('userInfo')
    if(!userinfo) return

    let _this = this
    app.appRequestAction({
        url: 'member/turntable/',
        way: 'POST',
        mask: true,
        params: userinfo,
        success: function(res){
          let mydata = res.data
          if(mydata.errcode == "ok"){
            let f = mydata.data.is_turntable
            _this.setData({
                showturntable: f && mydata.data.show_turntable
            })
          }
        },
        fail:()=>{
          app.showMyTips('网络错误，加载失败！')
        }
      })
  },
  // 初始化选中数据
  initSelectedData: function (id,data) {
    let classTree = data.classTree
    for (let i = 0; i < classTree.length; i++) {
      if (classTree[i].id == id) {
        this.setData({
          worktype: i,
          typeText: classTree[i].name,
          "searchDate.classify_id": id
        })
        //判断是否有传入 工种id 有则存入缓存
        wx.setStorageSync('typeText',classTree[i].name)
        wx.setStorageSync('typeId', id)
        return
      }else{
        if (classTree[i].has_children == 1) {
          let childrenClassTree = classTree[i].children;
          for (let j = 0; j < childrenClassTree.length; j++) {
            if (childrenClassTree[j].id == id) {
              this.setData({
                worktype: i,
                typeText: childrenClassTree[j].name,
                "searchDate.classify_id": id,
                workinfo: id
              })
              //判断是否有传入 工种id 有则存入缓存
              wx.setStorageSync('typeText',childrenClassTree[j].name)
              wx.setStorageSync('typeId', id)
              return
            }
          }
        }
      }
    }
  },
  // 如果pagestatus状态为goback代表需要刷新当前数据
  initPageData: function () {
    let pageStatus = this.data.pageStatus;
    let lists =  this.data.lists;
    let pageId = this.data.pageId;
    if (pageStatus == "goback") {
      let index = lists.findIndex((item)=>{
        return item.id == pageId
      })
      lists.splice(index,1)
    }
    this.setData({lists,})
  },
  //跳转找活名片
  goFinding: function () {
    wx.navigateTo({
      url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
    })
  },
  //删除搜索内容
  deletekey:function () {
    this.setData({
      "searchDate.keywords":"",
      showdeletekey:false,
      "searchDate.page": 1,
    })
    //重新请求搜索接口
    this.returnTop();
    this.doRequestAction(false)
  },
  // 点击取消刷新找活名片记录时间，在一定时间段内不再展示
  cancelRefresh: function () {
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) return;
    let token = userInfo.token;
    app.appRequestAction({
      url: 'resumes/cancel-refresh/',
      way: 'POST',
      params: {token},
      success: function (res) {
        let mydata= res.data
        if (mydata.errcode === "ok") {
        }else{
          wx.showToast({
            title: mydata.errmsg,
            icon: "none"
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none"
        })
      }
    })
  },
  // 没有找活名片招工列表弹窗
  noCardBox: function () {
    wx.showModal({
      title: "温馨提示",
      content: "您还未发布找活名片，您可以发布找活名片，让老板主动来找您。",
      confirmText: "去发布",
      confirmColor: "#797979",
      cancelColor: "#0097FF",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/jsIssueResume/index',
          })
        }
        if (res.cancel) {
          let time = new Date().getTime()
          wx.setStorageSync('noCardCancelTime', time)
        }
      }
    })
  },
  // 有找活名片，没有刷新没有置顶弹窗
  haveCardBox: function () {
    this.setData({
      "tipBox.content[0].des": `您的找活名片排名靠后，您可以去刷新或置顶找活名片，让老板主动来联系您。`,
      "tipBox.confirmText": "去刷新",
      "tipBox.cancelText": "去置顶",
      "tipBox.showCancel": true,
      "tipBox.showIcon": false,
      "tipBox.showClose": true,
      "tipBox.showTitle": true,
      "tipBox.confirmColor": "#0097FF",
      "tipBox.cancelColor": "#797979",
      refreshStatus: false,
      boxType: "haveCardBox"
    })
    this.selectComponent("#promptbox").show()
  },
  // 没有找活名片招工列表弹窗 与 有找活名片，没有刷新没有置顶弹窗
  showPromtBox: function (day, hasResume) {
    // 没有找活名片点击取消的时间缓存
    let haveCancelTime = wx.getStorageSync("haveCardCancelTime")
    // 没有找活名片点击取消的时间缓存
    let NoCancelTime = wx.getStorageSync("noCardCancelTime")
    // 当前时间戳
    let currentTime = new Date().getTime();
    if (!hasResume) {
      if (!NoCancelTime) {
        this.noCardBox()
      }else{
        let dueTime = NoCancelTime + (day * 24 * 60 * 60 * 1000 - 1)
        if (currentTime > dueTime) {
          this.noCardBox()
        }
      }
    }else{
      if (!haveCancelTime) {
        this.haveCardBox()
      }else{
        // 最新到期时间
        let dueTime = haveCancelTime + (day * 24 * 60 * 60 * 1000 - 1)
        if (currentTime > dueTime) {
          this.haveCardBox()
        }
      }
    }
  },
  // 如果有找活名片当天未刷新过且未置顶弹窗（is_pop 0, has_resume 1, is_refreshed_today 0）
  // 点击关闭按钮根据后台返回天数设置不再展示弹窗 （cancel_refresh_top_expire_days）
  tapClose: function () {
    // 点击关闭按钮的时间戳
    let clickTime = new Date().getTime()
    // 保存到缓存
    wx.setStorageSync("haveCardCancelTime", clickTime)
  },
  // 找工作列表是否弹出引导刷新找活名片请求
  showRefresh: function () {
    let that = this;
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) return;
    let token = userInfo.token;
    app.appRequestAction({
      url: '/resumes/popup/',
      way: 'POST',
      params: {token},
      success: function (res) {
        let mydata= res.data
        if (mydata.errcode === "ok") {
          // 是否弹窗。0-不弹窗；1-弹窗
          let showPopup = mydata.data.is_popup;
          // 是否有找活名片。0-否；1-是
          let hasResume = mydata.data.has_resume;
          // is_refreshed_today 今天是否刷新过找活。0-否；1-是
          let dayFirstRefresh = mydata.data.is_refreshed_today
          app.globalData.dayFirstRefresh = dayFirstRefresh
          if (showPopup) {
            if (hasResume) {
              if (!dayFirstRefresh) {
                that.showPromtBox(parseInt(mydata.data.cancel_refresh_top_expire_days,10),hasResume)
              }
            } else {
              that.showPromtBox(parseInt(mydata.data.cancel_publish_expire_days,10),hasResume)
            }
          }
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none"
        })
      }
    })
  },
  confirm: function () {
    if (this.data.refreshStatus) {
      this.setData({refreshStatus: false})
    }else{
      app.refreshReq(2, this)
    }
  },
  cancel: function () {
    // 弹窗类型，refreshSuccess 非首次刷新成功弹窗 
    // haveCardBox 有找活名片且未置顶且当日未刷新弹窗
    let boxType = this.data.boxType;
    if (boxType == 'haveCardBox') {
      wx.navigateTo({
        url: '/pages/clients-looking-for-work/workingtop/workingtop',
      })
      // 点击关闭按钮的时间戳
      let clickTime = new Date().getTime()
      // 保存到缓存
      wx.setStorageSync("haveCardCancelTime", clickTime)
      this.setData({ boxType: false })
    }
  },
  /**
   * 生命周期函数--监听页面加载®
   */
  onLoad: function (options) {
    let u =wx.getStorageSync('userInfo')
    let uuid = wx.getStorageSync('userUuid')
    this.setData({
      jgjzData: {...u,userUuid: uuid}
    })
    var isEmpty = app.isEmpty(options.keywrods)
    if(!isEmpty){
      this.setData({
        "searchDate.keywords":options.keywrods
      })
    }
    //判断是否有搜索内容
    if(this.data.searchDate.keywords){
      this.setData({
        showdeletekey:true
      })
    }else {
      this.setData({
        showdeletekey:false
      })
    }
    this.initFirstFcInfo();
    this.initSearchHistory();
    //this.isShowFastIssue();
    this.initFirstTips();
    this.initAdminTime();
    //this.initUserShareTimes();
    this.getFilterData(options);
    this.timerLoading();
    this.initUserLocation();
    this.initFooterData();
    this.checkIsInvite(options);
    this.initNeedData()
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
    let pages = getCurrentPages();
    let index = pages.length - 1
    let path = pages[index].__displayReporter.showReferpagepath
    path = path.slice(0, -5)
    //如果置顶或者发布回来 需要刷新数据
    if(path == "pages/clients-looking-for-work/finding-name-card/findingnamecard"){
      this.returnTop();
      this.setData({
        "searchDate.page": 1,
        showHistoryList: false
      })
      this.doRequestAction(false)
    }
    this.getUserUuid();
    this.initUserinfo();
    footerjs.initMsgNum(this);
    this.initTurntable();
    app.initResume(this)
    this.initPageData()
    this.showRefresh()
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
    this.showRefresh()
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
  },
  onShareTimeline:function () {
    let commonShareTips = app.globalData.commonShareTips;
    let commonShareImg = app.globalData.commonShareImg;
    return {
      title: commonShareTips,
      imageUrl: commonShareImg
    }
  }
})
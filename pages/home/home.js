
// infolists errImg showArea  areadata areadata  certificate
let footerjs = require("../../utils/footer.js");
let areas = require("../../utils/area.js");
let ads = require("../../utils/ad")
const app = getApp();
let videoAd = null
Page({
  data: {
    source: app.globalData.requestToken,
    version: app.globalData.version,
    realNames: app.globalData.apiImgUrl + 'new-list-realname-icon.png',
    authentication: app.globalData.apiImgUrl + 'new-list-jnzs-icon.png',
    finded: app.globalData.apiImgUrl + "lpy/finded.png",
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    headerimg: "",
    footerActive: "home",
    areaId: 1,
    areaText: "全国",
    userInfo: false,
    indexImgs: {
      logo: app.globalData.apiImgUrl + "logo.png",
      area: app.globalData.apiImgUrl + "area.png",
      areamore: app.globalData.apiImgUrl + "areamore.png",
      loadapp: app.globalData.apiImgUrl + "loadapp.png",
      infoman: app.globalData.apiImgUrl + "infoman.png",
      posi: app.globalData.apiImgUrl + "posi.png",
      status: app.globalData.apiImgUrl + "status.png",
      notice: app.globalData.apiImgUrl + "notice.png?t=2",
      nodata: app.globalData.apiImgUrl + "nodata.png",
      rilitime: app.globalData.apiImgUrl + "rilitime.png",
    },
    swiper: {
      autoplay: true,
      indicatorDots: false,
      circular: true,
      interval: 5000,
      duration: 1000,
      imgUrls: [],
      newBanner:[]
    },
    notice: {
      autoplay: true,
      indicatorDots: false,
      circular: true,
      vertical: true,
      interval: 5000,
      duration: 1000,
      lists: []
    },
    industry: {
      jzzg: app.globalData.apiImgUrl + "a.png",
      zxzg: app.globalData.apiImgUrl + "b.png",
      hgzp: app.globalData.apiImgUrl + "c.png",
      gczg: app.globalData.apiImgUrl + "d.png",
      gwzg: app.globalData.apiImgUrl + "e.png",
      jxzl: app.globalData.apiImgUrl + "jx.png",
      zbcg: app.globalData.apiImgUrl + "zbcg.png",
      zjxm: app.globalData.apiImgUrl + "zjxm.png",
      esjy: app.globalData.apiImgUrl + "es.png",
      gjsc: app.globalData.apiImgUrl + "ypsc.png",
      driver: app.globalData.apiImgUrl + "driver.png",
      jixiezr: app.globalData.apiImgUrl + "jixiezr.png",
      newzjxm: app.globalData.apiImgUrl + "newindex-zjxmicon.png",
      zsdg: app.globalData.apiImgUrl + "index-cate-sdg.png",
      zgjg: app.globalData.apiImgUrl + "index-cate-gjg.png",
    },
    fun: {
      yqhy: app.globalData.apiImgUrl + "yqhy.png",
      smrz: app.globalData.apiImgUrl + "smcx.png",
      zjxm: app.globalData.apiImgUrl + "index-newzjxm.png",

    },
    infolists: [],
    showArea: false,
    isScroll: true,
    areadata: [],
    jixieLinkImg: app.globalData.commonJixieAd,
    fixedAdImg: app.globalData.apiImgUrl + 'seevideo-getintegral.png',
    phone: app.globalData.serverPhone,
    locationHistory: false,
    gpsOrientation: false,
    gpsposi: "../../images/gps-posi.png",
    clearinput: "../../images/clear-input.png",
    allAreaLists: [],
    nAreaLists: [],
    isAllAreas: true,
    showInputList: false,
    searchInputVal: "",
    areaInputFocus: false,
    bring: app.globalData.apiImgUrl + 'newlist-jobzd.png', //顶置图片
    autimg: app.globalData.apiImgUrl + 'new-list-realname-icon.png', //实名图片
    hirimg: app.globalData.apiImgUrl + 'recruit-lists-new-finding.png', //招人图片
    doneimg: app.globalData.apiImgUrl + 'published-recruit-end.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'lpy/biaoqian.png',//定位
    iImgUrl: app.globalData.apiImgUrl, //图片地址,
    inviteUserImg: app.globalData.fixedDownApp,
    showAd: true,
    showFollow: false,
    thisyear: new Date().getFullYear(),
    showAuthQuery: false,
    resumeText:"",
    workTypes:[{id:"25",isHasWorkType:true},{id:"19",isHasWorkType:true},{id:"14",isHasWorkType:true}]
  },
  // 根据发布方式不同发布招工：未登录或者“fast_add_job”是快速发布，“ordinary_add_job”是普通发布。
  publishJob:function () {
    app.initJobView()
  },
  userInvite:function(){
    wx.navigateTo({
      url: '/pages/static/invite'
    })
  },
  showVideoAd:function(){
    if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => videoAd.show())
            .catch(err => {
              this.videoAdStop()
            })
          })
      }

  },
  createVideo:function(){
    let _this = this
      
      if (wx.createRewardedVideoAd) {
          
          videoAd = wx.createRewardedVideoAd({
              adUnitId: ads.videoAd
          })
          videoAd.onLoad(() => {
            
          })
          videoAd.onError((err) => {
            this.setData({
              showAd: false
            })
          })
          videoAd.onClose(status => {
            if (status && status.isEnded || status === undefined) {
              this.videoAdStop()
            }
          })
      }
  },
  videoAdStop:function(){
    
    app.userGetTempIntegral(0,function(data){
      
      if(data.errcode == "ok"){
        let times = data.data.times
        if(times == 0){
          _this.setData({
            showAd: false
          })
        }
      }else if(data.errcode == "to_invited"){
        _this.setData({
          showAd: false
        })
      }
    })
  },
  userSeeVideo:function(){
    let _this = this
    let userinfo = wx.getStorageSync('userInfo')
    if(!userinfo){
      wx.navigateTo({
        url: '/pages/userauth/userauth',
      })
      return
    }
    app.valiUserVideoAdStatus(function(data){
      if(data.errcode == 'ok'){
        _this.showVideoAd()
      }else if(data.errcode == 'to_invited'){
        _this.setData({
          showAd: false
        })
        _this.selectComponent("#minitoast").showToast(data.errmsg)
        //app.showMyTips(data.errmsg)
      }else{
        _this.selectComponent("#minitoast").showToast(data.errmsg)
        //app.showMyTips(data.errmsg)
      }
    })
  },
  initVideoTimes:function(){
    let _this = this
    app.valiUserVideoAdStatus(function(data){
      if(data.errcode == 'ok'){
        let times = data.data.times
        if(times == 0){
          _this.setData({
            showAd: false
          })
        }
      }else if(data.errcode == 'to_invited'){
        _this.setData({
          showAd: false
        })
      }
    })
  },
  showdownappaction:function(){
    wx.navigateTo({
      url: '/packageOther/pages/download/download-app',
    })
    //this.selectComponent("#downapptips").showaction()
  },
  chooseInputCtiy: function (e) {
    this.chooseThisCtiy(e);
    this.setData({ isAllAreas: true, searchInputVal: "", showArea: false })
  },
  clearInputAction: function () {
    this.setData({ isAllAreas: true, showInputList: false, searchInputVal: "" })
  },
  searchInput: function (e) {
    let val = e.detail.value
    this.setData({ searchInputVal: val })
    if (!val) this.setData({ showInputList: false, isAllAreas: true })
    else {
      this.setData({ showInputList: true })
      this.filterInputList(val);
    }
  },
  filterInputList: function (val) {
    let list = app.arrDeepCopy(this.data.allAreaLists);
    let nlist = list.filter(function (item) {
      return (item.cname.indexOf(val) != -1);
    })
    this.setData({ nAreaLists: nlist, isAllAreas: false })
  },
  showInputList: function () {
    this.setData({ showInputList: true })
  },
  callThisPhone: function (e) {
    app.callThisPhone(e);
  },
  toastDevelop: function () {
    app.showMyTips("该功能正在完善阶段");
  },
  showArea: function () {
    this.setData({
      showArea: true
    })
  },
  closeArea: function () {
    this.setData({ areaInputFocus: false })
    setTimeout(() => {
      this.setData({
        showArea: false,
        showInputList: false,
        isAllAreas: true,
        searchInputVal: "",
      })
    }, 10)
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
  getIndexListData: function (callback) {
    let userLocation = wx.getStorageSync("userLocation")
    if (!userLocation) {
      userLocation = ""
    } else {
      userLocation = userLocation.split(",").reverse().join(",")
    }
    let _this = this;
    let id = _this.data.areaId;
    wx.showLoading({
      title: '数据加载中',
    })
    app.appRequestAction({
      url: "index/new-index-msg/",
      params: { area: this.data.areaId, location: userLocation},
      hideLoading: true,
      success: function (res) {
        
        _this.setData({
          infolists: res.data
        })
        wx.hideLoading();
        wx.setStorageSync("areaId", _this.data.areaId);
        wx.setStorageSync("areaText", _this.data.areaText);
        callback ? callback() : ""
      },
      fail: function (err) {
        wx.hideLoading();
        callback ? callback() : ""
      }
    });
  },
  getAreaData: function () {
    app.getAreaData(this);
  },
  chooseThisCtiy: function (e) {
    app.globalData.areaIs = false;
    let id = e.currentTarget.dataset.id;
    let area = e.currentTarget.dataset.area;
    let pname = e.currentTarget.dataset.pname;
    let mydata = { "name": area, "id": id, ad_name: pname };
    this.setData({
      areaId: parseInt(id),
      areaText: area,
    })
    this.closeArea();
    this.getIndexListData();
    wx.setStorageSync("areaId", id);
    wx.setStorageSync("areaText", area);
    app.setStorageAction(id, mydata)
    this.initHistoryLoc();
  },
  getSwipersData: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let userUuid = wx.getStorageSync('userUuid');
    let _this = this;
    let areaId = wx.getStorageSync("areaId");
    let areaText = wx.getStorageSync("areaText");
    app.doRequestAction({
      url: "index/index-banner-carousel/",
      success: function (res) {
        let mydata = res.data;
        let newBanner = mydata.banner_newest;
        let banner = newBanner.reduce(function (current,item) {
          if (item.type === "3" ) {
            let selfUrl = item.self_url;
            let bannerData = selfUrl.split(",")
            let arug = userInfo?`?userId=${userInfo.userId}&token=${userInfo.token}&tokenTime=${userInfo.tokenTime}&userUuid=${userUuid}`:''
            let url = `${bannerData[0]}${arug}`;
            let appId = bannerData[1]
            item.self_url = url;
            item.app_id = appId;
            current.push(item)
          } else {
            current.push(item)
          }
          return current
        },[])
        _this.setData({
          "notice.lists": mydata.notice,
          "swiper.imgUrls": mydata.banner,
          "swiper.newBanner": banner,
          areaId: areaId ? areaId : mydata.address.id,
          areaText: areaText ? areaText : mydata.address.name,
          showAuthQuery: mydata.show_auth_query ? true : false
        })
        areaId ? "" : wx.setStorageSync("areaId", mydata.address.id);
        areaText ? "" : wx.setStorageSync("areaText", mydata.address.name);
      }
    });
  },
  showAllDataLists: function (e) {
    let type = e.currentTarget.dataset.type;
    if (type == "information") {
      wx.navigateTo({
        url: '/pages/lists/lists?areaId=' + this.data.areaId
      });
    } else if (type == "resume") {
      wx.navigateTo({
        url: '/pages/lists/lists?areaId=' + this.data.areaId
      });
    } else if (type == "fleamarket") {
      wx.navigateTo({
        url: '/pages/lists/lists?areaId=' + this.data.areaId
      });
    }
  },
  showMsgInfo: function (e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    if (type == "job") {
      wx.navigateTo({
        url: '/pages/detail/info/info?id=' + id
      });
    } else if (type == "resume") {
      wx.navigateTo({
        url: '/pages/detail/ucard/ucard?id=' + id
      });
    } else if (type == "fleamarket") {
      wx.navigateTo({
        url: '/pages/detail/usedinfo/usedinfo?id=' + id
      });
    }
  },
  initIndexData: function () {
    let _this = this;
    this.initUserInfo(function () {
      let areaId = wx.getStorageSync("areaId");
      let areaText = wx.getStorageSync("areaText");
      _this.setData({
        areaId: areaId,
        areaText: areaText,
      })
      _this.getIndexListData();
      _this.getSwipersData();
    })
  },
  jumpThisLink: function (e) {
    app.jumpThisLink(e);
  },
  valiUserCard: function () {
    let userInfo = this.data.userInfo;
    footerjs.valiUserCard(this, app, userInfo);
  },
  initUserInfo: function (callback) {
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) app.globalData.userInfo = userInfo; //app存入userinfo
    this.setData({
      userInfo: userInfo ? userInfo : false
    })
    callback ? callback() : ""
  },
  initHistoryLoc: function () {
    let h = wx.getStorageSync("locationHistory");
    let p = wx.getStorageSync("gpsOrientation");
    if (h) this.setData({ locationHistory: h })
    if (p) this.setData({ gpsOrientation: p })
  },
  initInputList: function () {
    let list = areas.getInputList();
    this.setData({ allAreaLists: list })
  },
  onLoad: function (options) {
    //this.createVideo()
    //this.initVideoTimes()
    this.initInputList();
    this.initFooterData();
    this.getAreaData();
    this.getFilterData()
  },
  valiUserUrl: function (e) {
    app.valiUserUrl(e, this.data.userInfo)
  },
  errImg: function (e) {
    
    let index = e.currentTarget.dataset.index;
    
    let obj = `infolists.resume.lists[${index}].headerimg`;
    this.setData({
      [obj]: "http://cdn.yupao.com/miniprogram/images/user.png"
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
  //授权登录
  bindUserInfo :function(e){
    let url = e.currentTarget.dataset.url
    let login =e.currentTarget.dataset.login
    let u = wx.getStorageSync('userInfo')
    let that = this;
    if (login != "0") {
      if (u) {
        wx.navigateTo({
          url: url,
        })
      } else {
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
                let userUuid = uinfo.data.uuid;
                app.globalData.userInfo = userInfo;
                wx.setStorageSync('userInfo', userInfo)
                wx.setStorageSync('userUuid', userUuid)
                wx.navigateTo({
                  url: url,
                })
                // wx.navigateBack({ delta: 1 })
              } else {
                app.showMyTips(uinfo.errmsg);
              }
            });
          });
        });
      }
    }else{
      wx.navigateTo({
        url:url,
      })
    }
  },
  // 初始化选中数据
  initSelectedData: function (data) {
    let classTree = data.classTree
    let workTypes = this.data.workTypes;
    for (let n = 0; n < workTypes.length; n++) {
      for (let i = 0; i < classTree.length; i++) {
        if (classTree[i].id === workTypes[n].id) {
          workTypes[n].isHasWorkType = true
          this.setData({
            workTypes,
          })
        }else{
          if (classTree[i].has_children === 1) {
            let childrenClassTree = classTree[i].children;
            let num = 0;
            for (let j = 0; j < childrenClassTree.length; j++) {
              if (childrenClassTree[j].id === workTypes[n].id) {
                workTypes[n].isHasWorkType = true
                this.setData({
                  workTypes,
                })
              }else{
                num + 1
              }
            }
            if (num == childrenClassTree.length) {
              workTypes[n].isHasWorkType = false
                this.setData({
                workTypes,
              })
            }
          }else{
            workTypes[n].isHasWorkType = false
              this.setData({
              workTypes,
            })
          }
        }
      }
      
    }
    
  },
  // 初始化工种
  getFilterData: function () {
    let _this = this;
    if (app.globalData.allTypes) {
      _this.initSelectedData(app.globalData.allTypes)
    } else {
      app.getListsAllType(function (_data) {
        _this.initSelectedData(_data)
      });
    }
  },
  // 如果pagestatus状态为goback代表需要刷新当前数据
  initPageData: function () {
    let type = this.data.type;
    let pageStatus = this.data.pageStatus;
    let lists = type?(type === "findWorker"?this.data.infolists.resume.lists:this.data.infolists.job.lists):[]
    let pageId = this.data.pageId;
    if (pageStatus == "goback") {
      let index = lists.findIndex((item)=>{
        return item.id == pageId
      })
      lists.splice(index,1)
    }
    if (type === "findWorker") {
      this.setData({"infolists.resume.lists":lists})
    }
    if (type === "findWork") {
      this.setData({"infolists.job.lists":lists})
    }
  },
  homeActiveRefresh:function() {
    app.activeRefresh()
  },
  //
  toIssueRecruit(){
    app.initJobView()
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
    this.initIndexData();
    this.initUserInfo();
    this.initHistoryLoc();
    app.initResume(this)
    // this.initPageData()
    
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
    videoAd = null
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    //wx.startPullDownRefresh()
    this.getIndexListData(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();
    })
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


// infolists errImg showArea  areadata areadata  certificate
let footerjs = require("../../utils/footer.js");
let areas = require("../../utils/area.js");
const app = getApp();
Page({
  data: {
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
      imgUrls: []
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
      newzjxm: app.globalData.apiImgUrl + "newindex-zjxmicon.png"
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
    fixedAdImg: app.globalData.fixedPublishImg,
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
    doneimg: app.globalData.apiImgUrl + 'newlist-jobfindend.png', //已找到
    iondzs: app.globalData.apiImgUrl + 'newlist-jobposi.png',//定位
    iImgUrl: app.globalData.apiImgUrl, //图片地址
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
    let _this = this;
    let areaId = wx.getStorageSync("areaId");
    let areaText = wx.getStorageSync("areaText");
    app.doRequestAction({
      url: "index/index-banner-carousel/",
      success: function (res) {
        let mydata = res.data;
        _this.setData({
          "notice.lists": mydata.notice,
          "swiper.imgUrls": mydata.banner,
          areaId: areaId ? areaId : mydata.address.id,
          areaText: areaText ? areaText : mydata.address.name
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
    this.initInputList();
    this.initFooterData();
    this.getAreaData();
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
  }

})

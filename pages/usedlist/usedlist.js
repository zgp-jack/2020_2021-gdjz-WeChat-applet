// pages/lists/lists.js
const app = getApp();
let areas = require("../../utils/area.js");
let md5 = require("../../utils/md5.js");
const ads = require('../../utils/ad')
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo:false,
        unitid: ads.usedListAd,
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
        showListsInfo: 0,
        province: -1,
        worktype: -1,
        workinfo: -1,
        searchDate: {
            page: 1,
            list_type: "fleamarket",
            area_id: 1,
            classify_id: "",
            keywords: "",
            attribute_id: ""
        },
        fillterArea: [],
        fillterType: [],
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
        typeText: "选择分类",
        showNothinkData: false,
        nothavemore: false,
        showMyLoading: false,
        appLinkImg: app.globalData.commonDownloadApp,
        fixedAdImg:app.globalData.fixedDownApp,
        fixedGetIntegral: app.globalData.fixedGetIntegral,
        userShareData: {
            showApp: false,
            showWin: false,
            integral: "1"
        },
        userShareTime: {},
      isload: false,
      scrollTop: 0,
      showReturnTopImg:false,
      joingroup: []
    },
    showdownappaction:function(){
      wx.navigateTo({
        url: '/packageOther/pages/download/download-app',
      })
      //this.selectComponent("#downapptips").showaction()
    },
    stopThisAction: function () {
        return false;
    },
    touchStart: function (e) {
        this.touchStartTime = e.timeStamp
    },
    touchEnd: function (e) {
        this.touchEndTime = e.timeStamp
    },
    showListsType: function (e) {
        let type = parseInt(e.currentTarget.dataset.type);
        this.setData({
            showListsInfo: (this.data.showListsInfo == type) ? 0 : type
        })
    },

    userChooseProvince: function (e) {
      app.globalData.areaIs = false;
        var _this = this;
        let index = parseInt(e.currentTarget.dataset.index);
        let directCtiy = parseInt(e.currentTarget.dataset.haschild);
        let _id = e.currentTarget.dataset.id;
        let areaText = e.currentTarget.dataset.area;
      let pname = e.currentTarget.dataset.pname;
        let _sid = this.data.searchDate.area_id;
        this.setData({ province: index })
      let mydata = { "name": areaText, "id": _id, ad_name: pname };
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
        let areaText = e.currentTarget.dataset.area;
      let pname = e.currentTarget.dataset.pname;
        let id = parseInt(e.currentTarget.dataset.id);
      let pid = parseInt(e.currentTarget.dataset.pid); 
       // if (parseInt(this.data.searchDate.area_id) == id) return false;
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
    closeAllSelect: function () {
        this.setData({
            showListsInfo: 0
        })
    },
    userChooseWorktype: function (e) {
        var _this = this;
        let index = parseInt(e.currentTarget.dataset.index);
        let haschild = parseInt(e.currentTarget.dataset.haschild);
        let _typeid = parseInt(e.currentTarget.dataset.id);
        let typeText = e.currentTarget.dataset.type;
        this.setData({ worktype: index })

        if (_this.touchEndTime - _this.touchStartTime < 350) {
            var currentTime = e.timeStamp
            var lastTapTime = _this.lastTapTime
            _this.lastTapTime = currentTime;
            if (currentTime - lastTapTime < 300) {
                //console.log("double tap");
                clearTimeout(_this.lastTapTimeoutFunc);
                _this.setData({
                    isFirstRequest: true,
                    "searchDate.page": 1,
                    "searchDate.classify_id": _typeid,
                    "searchDate.attribute_id": "",
                    typeText: typeText
                })
                _this.returnTop();
                _this.doRequestAction(false);
                _this.closeAllSelect();

            } else {
                _this.lastTapTimeoutFunc = setTimeout(function () {
                    //console.log("tap");
                    if (haschild == 0) {
                        _this.setData({
                            isFirstRequest: true,
                            "searchDate.page": 1,
                            "searchDate.classify_id": _typeid,
                            "searchDate.attribute_id": "",
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
        let _key = parseInt(e.currentTarget.dataset.key);
        let pid = this.data.fillterType[_key].id;
        
        this.setData({
            workinfo: id,
            typeText: typeText,
            isFirstRequest: true, 
            "searchDate.page": 1,
            "searchDate.classify_id": pid,
            "searchDate.attribute_id": id
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
    doRequestAction: function (_append,callback) {
        let _this = this;
      if (_this.data.isload) return false;
        this.setData({
          isload: true,
            nothavemore: false,
            showNothinkData: false
        })
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url: "index/info-list/",
            params: _this.data.searchDate,
            success: function (res) {
              callback ? callback() : ""
              _this.setData({ isload: false })
                wx.hideLoading();
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
            url: "index/info-list-new/",
            params: _data,
            success: function (res) {
                app.globalData.isFirstLoading ? "" : wx.hideLoading();
                let mydata = res.data;

                if (mydata.errcode == "token_fail") {
                    _this.initAdminTime(function () {
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
    if (his.hasOwnProperty("used")) {
      his.used = [];
      wx.setStorageSync("searchHistory", his)
    }
    this.initSearchHistory();
  },
  bindKeyInput: function (e) {
    this.setData({
      "searchDate.keywords": e.detail.value,
    })
  },
  initSearchHistory: function () {
    let his = wx.getStorageSync("searchHistory")
    if (his) {
      let job = his.hasOwnProperty("used");
      if (job) {
        let jobs = his.used
        this.setData({ historyList: jobs })
      }
    }
  },
    userTapSearch: function () {
      // if (!this.data.userInfo) {
      //   app.gotoUserauth();
      //   return false;
      // }
      //let userInfo = 
        //if (this.data.searchDate.keywords == "") return false;

      let text = this.data.searchDate.keywords;
      if (text) {
        let his = wx.getStorageSync("searchHistory")
        if (his) {
          let job = his.hasOwnProperty("used");
          if (job) {
            let jobs = his.used;
            let index = jobs.indexOf(text);
            if (index != -1) {
              jobs.splice(index, 1);
            }
            jobs.unshift(text);

          } else {
            his.used = [];
            his.used.push(text)
          }
          his.used.splice(4)
          wx.setStorageSync("searchHistory", his)
        } else {
          let myhis = {
            used: [text]
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
    jumpThisLink: function (e) {
        app.jumpThisLink(e);
    },
    getFilterData: function () {
        let _this = this;
        this.setData({ fillterArea: areas.getAreaArr })
        app.globalData.allTypes ? this.setData({ fillterType: app.globalData.allTypes.fleamarketTree }) : app.getListsAllType(function (_data) {
            _this.setData({
                fillterType: _data.fleamarketTree
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
  onLoad: function (options) {
      this.initSearchHistory();
        //this.initUserShareTimes();
        this.getFilterData();
        this.initNeedData();
        this.initAreaInfo();
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
     * 用户点击右上角分享
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
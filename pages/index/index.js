// pages/lists/lists.
let footerjs = require("../../utils/footer.js");
let areas = require("../../utils/area.js");
let md5 = require("../../utils/md5.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        unitid: app.globalData.unitid,
        footerActive: "recruit",
        userInfo:true,
        touchStartTime:0,
        touchEndTime:0,
        lastTapTime:0,
        lastTapTimeoutFunc:null,
        isFirstRequest:true,
        userAuthBtn:400,
        listsImg:{
            infoman: app.globalData.apiImgUrl + "infoman.png",
            posi: app.globalData.apiImgUrl + "posi.png",
            status: app.globalData.apiImgUrl + "status.png",
            nodata: app.globalData.apiImgUrl + "nodata.png",
            rilitime: app.globalData.apiImgUrl + "rilitime.png",
        },
        userAuthGif: app.globalData.apiImgUrl +"user-auth.gif",
        loadingGif: app.globalData.apiImgUrl + "loading.gif",
        nodata: app.globalData.apiImgUrl + "nodata.png",
        selectimg: app.globalData.apiImgUrl + 'select.png',
        showListsInfo:0,
        province:-1,
        userCity:-1,
        worktype: -1,
        workinfo: -1,
        searchDate:{
            page:1,
            list_type:"job",
            area_id: 1,
            classify_id: "",
            keywords: "",
        },
        fillterArea: [],
        fillterType:[],
        notice: {
            autoplay: true,
            indicatorDots: false,
            circular: true,
            vertical: true,
            interval: 5000,
            duration: 1000,
            lists: []
        },
        phone:"",
        wechat:"",
        lists:[],
        areaText:"选择城市",
        typeText:"选择工种",
        showNothinkData:false,
        nothavemore:false,
        showMyLoading:false,
        jixieLinkImg: app.globalData.commonJixieAd,
        appLinkImg: app.globalData.commonDownloadApp,
        fixedAdImg:app.globalData.fixedDownApp,
        fixedGetIntegral: app.globalData.fixedGetIntegral,
        userAuthImg: "http://cdn.yupao.com/miniprogram/images/gdjz-userauth.gif?t=" + new Date().getTime(),
        userShareData:{
            showApp:false,
            showWin:false,
            integral:"1",
        },
        userShareTime:{},
        firstJoin: false,
        fastIssueImg: app.globalData.apiImgUrl + "index-fast-issue.png",
        showFastIssue: app.globalData.showFastIssue,
        joblistjz: app.globalData.apiImgUrl + "joblist_jz.png",
        joblistwyjz:app.globalData.apiImgUrl+"joblist_wyjz.png"
    },
    wantFastIssue:function(){
      wx.navigateTo({
        url: '/pages/published/published?type=0&jz=1',
      })
    },             
    showDetailInfo:function(e){
        app.showDetailInfo(e);
    },
    touchStart: function (e) {
        this.touchStartTime = e.timeStamp
    },
    touchEnd: function (e) {
        this.touchEndTime = e.timeStamp
    },
    showListsType:function(e){
        let type = parseInt(e.currentTarget.dataset.type);
        this.setData({
            showListsInfo: (this.data.showListsInfo == type ) ? 0 : type
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
        this.setData({ province: index })
        //if(_id == _sid) return false;
        if (_this.touchEndTime - _this.touchStartTime < 350) {
            var currentTime = e.timeStamp
            var lastTapTime = _this.lastTapTime
            _this.lastTapTime = currentTime

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
    userChooseCity:function(e){
        let areaText = e.currentTarget.dataset.area;
        let id = parseInt(e.currentTarget.dataset.id);
        //if(parseInt(this.data.searchDate.area_id) == id) return false;
        this.setData({
            userCity: id,
            isFirstRequest: true,
            areaText: areaText,
            "searchDate.page":1,
            "searchDate.area_id": id
        })
        this.returnTop();
        this.doRequestAction(false);
        this.closeAllSelect();
        wx.setStorageSync("areaId", id)
        wx.setStorageSync("areaText", areaText)
    },
    userChooseWorktype:function(e){
        var _this = this;
        let index = parseInt(e.currentTarget.dataset.index);
        let haschild = parseInt(e.currentTarget.dataset.haschild);
        let _type = parseInt(this.data.searchDate.classify_id);
        let _typeid = parseInt(e.currentTarget.dataset.id);
        let typeText = e.currentTarget.dataset.type;
        this.setData({worktype: index })
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
    showThisNotice:function(e){
        let _id =  e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/static/notice?id=' + _id,
        })
    },
    doRequestAction:function(_append){
        let _this = this;
        this.setData({
            nothavemore:false,
            showNothinkData:false
        })
        try{
          wx.showLoading({ title: '数据加载中' })
        }catch(err){
          console.log(err);
        }

      let _params = _this.data.searchDate;
      let uinfo = wx.getStorageSync("userInfo");
      if (uinfo){
        _params.userId = uinfo.userId;
        _params.token = uinfo.token;
        _params.tokenTime = uinfo.tokenTime;
      }
        app.doRequestAction({
            url:"index/info-list/",
          params: _params,
            success:function(res){
                app.globalData.isFirstLoading ? "" : wx.hideLoading();
                let mydata = res.data;
                let _page = parseInt(_this.data.searchDate.page)
                _this.setData({ isFirstRequest:false });
                if(mydata && mydata.length){
                    let _data = _this.data.lists;
                    for(let i = 0;i<mydata.length;i++){
                        _data.push(mydata[i]);
                    }
                    _this.setData({
                        "searchDate.page": (parseInt(_page) + 1),
                        lists: _append ? _data: mydata
                    })
                }else{
                    if (_page == 1){
                        _this.setData({
                            showNothinkData:true,
                            lists:[]
                        })
                    }else{
                        _this.setData({
                            nothavemore: true
                        })
                    }
                }
                
            },
            fail:function(err){
                wx.hideLoading();
                wx.showToast({
                    title: '网络出错，数据加载失败！',
                    icon:"none"
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
        _data.system_time = (parseInt(new Date().getTime() / 1000) + app.globalData.userGapTime) ;
        let _str = md5.hexMD5(_data.system_time.toString());
        _data.system_token =md5.hexMD5(_str.substring(0, 16)) ;
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url: "index/info-list-new/",
            params: _data ,
            success: function (res) {
                app.globalData.isFirstLoading ? "" : wx.hideLoading();
                let mydata = res.data;

                if (mydata.errcode == "token_fail"){
                    app.initAdminTime(function (){
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
    initNeedData:function(){
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = this.data.userInfo;
        let _time = Date.parse(new Date());
        this.validateLogin();
        if (_wx && _wx.expirTime){
            if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        app.doRequestAction({
            url:"index/less-search-data/",
            params: { 
                type:"job",
                userId: _mark ? (userInfo.userId ? userInfo.userId : "" ) : "",
            },
            success:function(res){
                let mydata = res.data;
                _this.setData({
                    "notice.lists": mydata.notice,
                    phone: mydata.phone,
                    wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number)
                })
                app.globalData.serverPhone = mydata.phone;
                if(_mark){
                    let extime = _time + (mydata.wechat.outTime * 1000);
                    wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime});
                }
            },
            fail:function(err){
                wx.showToast({
                    title: '数据加载失败！',
                    icon:"none",
                    duration: 3000
                })
            }
        })
    },
    initAreaInfo:function(){
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
    bindKeyInput:function(e){
        this.setData({
            "searchDate.keywords": e.detail.value
        })
    },
    userTapSearch:function(){
        //if(this.data.searchDate.keywords == "") return false;
        this.returnTop();
        this.setData({
            "searchDate.page": 1
        })
        this.doSearchRequestAction(false);
    },
    returnTop:function(){
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        }else{
            wx.showToast({
                title: '当前微信版本过低，无法自动回到顶部，请升级到最新微信版本后重试。',
                icon: 'none'
            })
        }
    },
    initUserinfo:function(){
        let _this = this;
        app.initSystemInfo(function (res) {
            if (res) {
                let _h = (res.windowWidth * 0.7) / 0.6216;
                _this.setData({ userAuthBtn: _h })
            }
        })
        let userInfo = wx.getStorageSync("userInfo");
        if(!userInfo){
            this.setData({ userInfo:false })
            return false;
        }
        this.setData({ userInfo: userInfo });
        this.initNeedData();
        if (!app.globalData.showFastIssue.request) app.isShowFastIssue(this);
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
                        if (!app.globalData.showFastIssue.request) app.isShowFastIssue(that);
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
    valiUserCard:function(){
        let userInfo = this.data.userInfo;
        footerjs.valiUserCard(this,app, userInfo);
    },
    initUserLocation: function () {
        let _this = this;
        let areaId = wx.getStorageSync("areaId");
        let areaText = wx.getStorageSync("areaText");

        if (!areaId || !areaText) {
            app.appRequestAction({
                url: "index/only-get-area-id/",
                hideLoading:true,
                success: function (res) {
                    let mydata = res.data;
                    if (mydata.errcode == "ok") {
                        wx.setStorageSync("areaText", mydata.areaText);
                        wx.setStorageSync("areaId", mydata.areaId);
                    } else {
                        if (!areaText || !areaId) {
                            wx.setStorageSync("areaText", "全国");
                            wx.setStorageSync("areaId", "1");
                        }
                    }
                },
                fail: function () {
                    if (!areaText || !areaId) {
                        wx.setStorageSync("areaText", "全国");
                        wx.setStorageSync("areaId", "1");
                    }
                },
                complete: function () {
                    _this.initAreaInfo();
                }
            });
        } else {
            _this.initAreaInfo();
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
        _this.setData({ fillterType: app.globalData.allTypes.classTree });
        if (_this.data.fillterType.length == 1) _this.setData({ typeText: _this.data.fillterType[0].name })
      } else {
        app.getListsAllType(function (_data) {
          _this.setData({ fillterType: _data.classTree })
          if (_this.data.fillterType.length == 1) _this.setData({ typeText: _this.data.fillterType[0].name })
        });
      }   
    },
    
    initUserShareTimes:function(){
        let userInfo = wx.getStorageSync("userInfo");
        app.pageInitSystemInfo(this);
        if(userInfo) app.initUserShareTimes();
    },
    userShareAction:function(){
        let _this = this;
        app.userShareAction(function(_str){
            if(_str == "share"){
                _this.setData({
                    "userShareData.showApp":true
                })
            }else{
                _this.setData({
                    "userShareData.showWin": true,
                    userShareTime: app.globalData.userShareData,
                    "userShareData.integral": _str.integral
                })
            }
        })
    },
    userTapLink:function(e){
        this.setData({ "userShareData.showApp": false, "userShareData.showWin": false })
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
        })
    },
    closeWinbox:function(e){
        let type = e.currentTarget.dataset.type;
        if(type == "app"){
            this.setData({ "userShareData.showApp":false })
        }else{
            this.setData({ "userShareData.showWin": false })
        }
    },
    initAdminTime:function(callback){
        app.initAdminTime();
    },
    initFirstTips:function(){
        app.initFirstTips(this);
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //this.isShowFastIssue();
        this.initFirstTips();
        this.initAdminTime();
        //this.initUserShareTimes();
        this.getFilterData();
        this.timerLoading();
        this.initUserLocation();
        this.initUserinfo();
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
        if ((this.data.isFirstRequest) || (this.data.showNothinkData) || (this.data.nothavemore)) return false;
        this.doRequestAction(true);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        //this.userShareAction();
        return app.getUserShareJson();
    }
})
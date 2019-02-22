// pages/lists/lists.
let footerjs = require("../../utils/footer.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        appLinkImg: app.globalData.commonDownloadApp,
        fixedAdImg:app.globalData.fixedDownApp,
        fixedGetIntegral: app.globalData.fixedGetIntegral,
        userAuthImg: "http://yupao.oss-cn-beijing.aliyuncs.com/miniprogram/images/gdjz-userauth.gif?t=" + new Date().getTime(),
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
    userChooseProvince:function(e){
        var _this = this;
        let index = parseInt(e.currentTarget.dataset.index);
        let directCtiy = parseInt(e.currentTarget.dataset.haschild);
        let _id = e.currentTarget.dataset.id;
        let areaText = e.currentTarget.dataset.area;
        let _sid = this.data.searchDate.area_id;
        this.setData({ province: index })
        if(_id == _sid) return false;
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
                    "searchDate.page":1,
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
                    if (directCtiy == 0){
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
    closeAllSelect: function () {
        this.setData({
            showListsInfo: 0
        }) 
    },
    userChooseCity:function(e){
        let areaText = e.currentTarget.dataset.area;
        let id = parseInt(e.currentTarget.dataset.id);
        if(parseInt(this.data.searchDate.area_id) == id) return false;
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
        if (_type == _typeid) return false;
        
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
        if (parseInt(this.data.searchDate.classify_id) == id) return false;
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
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url:"index/info-list/",
            params: _this.data.searchDate,
            success:function(res){
                wx.hideLoading();
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
            url:"index/search-data/",
            params: { 
                type:"job",
                userId: _mark ? (userInfo.userId ? userInfo.userId : "" ) : "",
            },
            success:function(res){
                let mydata = res.data;
                _this.setData({
                    fillterArea: mydata.areaTree,
                    fillterType: mydata.classifyTree,
                    "notice.lists": mydata.notice,
                    phone: mydata.phone,
                    wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number)
                })
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
        if(this.data.searchDate.keywords == "") return false;
        this.returnTop();
        this.setData({
            "searchDate.page": 1
        })
        this.doRequestAction(false);
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
        footerjs.doPublishAction(this);
    },
    closePublishAction: function () {
        footerjs.closePublishAction(this);
    },
    valiUserCard:function(){
        let userInfo = this.data.userInfo;
        footerjs.valiUserCard(this,app, userInfo);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUserinfo();
        this.initFooterData();
        this.initAreaInfo();
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
        let userInfo = this.data.userInfo;
        let _path = userInfo ? '/pages/index/index?refid=' + userInfo.userId : "/pages/index/index";
        return {
            title: '全国建筑工地招工平台',
            path: _path,
            imageUrl: app.globalData.commonShareImg
        }
    }
})
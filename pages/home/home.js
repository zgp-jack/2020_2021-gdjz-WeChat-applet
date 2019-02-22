let footerjs = require("../../utils/footer.js"); 
const app = getApp();
Page({
    data: {
    footerActive: "home",
    areaId: 1,
    areaText:"全国",
    userInfo:"",
    indexImgs:{
        logo: app.globalData.apiImgUrl + "logo.png", 
        area: app.globalData.apiImgUrl + "area.png",
        areamore: app.globalData.apiImgUrl + "areamore.png",
        loadapp: app.globalData.apiImgUrl + "loadapp.png",
        infoman: app.globalData.apiImgUrl + "infoman.png", 
        posi: app.globalData.apiImgUrl + "posi.png", 
        status: app.globalData.apiImgUrl + "status.png", 
        notice: app.globalData.apiImgUrl + "notice.png", 
        nodata: app.globalData.apiImgUrl + "nodata.png",
        rilitime: app.globalData.apiImgUrl + "rilitime.png",
    },
    swiper:{
        autoplay:true,
        indicatorDots:false,
        circular:true,
        interval:5000,
        duration:1000,
        imgUrls: []
    },
    notice: {
        autoplay: true,
        indicatorDots: false,
        circular: true,
        vertical:true,
        interval: 5000,
        duration: 1000,
        lists: []
    },
    industry:{
        jzzg: app.globalData.apiImgUrl + "a.png",
        zxzg: app.globalData.apiImgUrl + "b.png",
        hgzp: app.globalData.apiImgUrl + "c.png",
        gczg: app.globalData.apiImgUrl + "d.png",
        gwzg: app.globalData.apiImgUrl + "e.png",
        jxzl: app.globalData.apiImgUrl + "jx.png",
        zbcg: app.globalData.apiImgUrl + "zbcg.png",
        zjxm: app.globalData.apiImgUrl + "zjxm.png", 
        esjy: app.globalData.apiImgUrl + "es.png",
        gjsc: app.globalData.apiImgUrl + "ypsc.png"
    }, 
    fun: [ 
        { img: app.globalData.apiImgUrl + "yqhy.png", title: "邀请好友" ,url:"../static/invite"},
        { img: app.globalData.apiImgUrl + "smrz.png", title: "实名认证", url: "../realname/realname" },
        { img: app.globalData.apiImgUrl + "smcx.png", title: "实名查询", url: "../query/query"},
        { img: app.globalData.apiImgUrl + "syjc.png", title: "使用教程", url: "../course/course"},
        { img: app.globalData.apiImgUrl + "jbpz.png", title: "举报骗子", url: "../report/report" },
        { img: app.globalData.apiImgUrl + "gywm.png", title: "关于我们", url: "../about/about"}
      ],
    infolists:[],
    showArea : false,
    isScroll:true,
    areadata:[],
    fixedAdImg:app.globalData.fixedPublishImg
  },
    toastDevelop:function(){
        app.showMyTips("该功能正在完善阶段");
    },
    showArea:function(){
        this.setData({
            showArea:true
        })
    },
    closeArea: function () {
        this.setData({
            showArea: false
        })
    },
    initFooterData:function(){
        this.setData({
            footerImgs: footerjs.footerImgs,
            publishActive: footerjs.publishActive,
            showPublishBox: footerjs.showPublishBox
        })
    },
    doPublishAction:function(){
        footerjs.doPublishAction(this);
    },
    closePublishAction: function () {
        footerjs.closePublishAction(this);
    },
    getIndexListData:function(){
        let _this = this;
        let id = _this.data.areaId;
        wx.showLoading({
            title: '数据加载中',
        })
        app.doRequestAction({
            url: "index/index-msg-list/",
            params:{area:this.data.areaId},
            success: function (res) {
                _this.setData({
                    infolists: res.data
                })
                wx.hideLoading();
                wx.setStorageSync("areaId", _this.data.areaId);
                wx.setStorageSync("areaText", _this.data.areaText);
            },
            fail:function(err){
                wx.hideLoading();
            }
        });
    },
    getAreaData: function () {
        let _this = this;
        let areadata = wx.getStorageSync("areadata");
        if (areadata){
            _this.setData({
                areadata: areadata
            })
            return false;
        }
        app.doRequestAction({
            url: "index/index-area/",
            success: function (res) {
                _this.setData({
                    areadata: res.data
                })
                wx.setStorageSync('areadata', res.data)
            }
        });

    },
    chooseThisCtiy:function(e){
        let id = e.currentTarget.dataset.id;
        let area = e.currentTarget.dataset.area;
        this.setData({
            areaId: parseInt(id),
            areaText: area,
        })
        this.closeArea();
        this.getIndexListData();
        wx.setStorageSync("areaId", id);
        wx.setStorageSync("areaText", area);

    },
    getSwipersData:function(){
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
    showAllDataLists:function(e){
        let type = e.currentTarget.dataset.type;
        if (type == "information"){
            wx.navigateTo({
                url: '/pages/lists/lists?areaId='+ this.data.areaId
            });
        } else if (type == "resume"){
            wx.navigateTo({
                url: '/pages/lists/lists?areaId=' + this.data.areaId
            });
        } else if (type == "fleamarket"){
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
    initIndexData:function(){
        let areaId = wx.getStorageSync("areaId");
        let areaText = wx.getStorageSync("areaText");
        let userInfo = wx.getStorageSync("userInfo");
        if(userInfo) app.globalData.userInfo = userInfo; //app存入userinfo
        this.setData({
            areaId: areaId, 
            areaText: areaText,
            userInfo: userInfo ? userInfo :false
        })
        this.getIndexListData();
        this.getSwipersData();
    },
    jumpThisLink:function(e){
        app.jumpThisLink(e);
    },
    valiUserCard: function () {
        let userInfo = this.data.userInfo;
        footerjs.valiUserCard(this, app, userInfo);
    },
    onLoad: function (options) {
      this.initIndexData();
      this.initFooterData();
      this.getAreaData();
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

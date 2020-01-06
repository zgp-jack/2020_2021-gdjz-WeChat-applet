const app = getApp();
let footerjs = require("../../utils/footer.js");
Page({

    /**
     * 页面的初始数据 valiUserUrl releaselive
     */
    data: {
        showRecharge:false,
        footerActive: "member",
        nouser: app.globalData.apiImgUrl + "userauth-userinfo-null.png",
        realNames: app.globalData.apiImgUrl + 'newresume-infolist-ysm.png?t=1',
        feedbackimg: app.globalData.apiImgUrl + "feedbackmsg-img.png",
        rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
        ucenterimgs: {
            recruit: app.globalData.apiImgUrl + "new-ucenter-recruit.png",
            mycard: app.globalData.apiImgUrl + "new-ucenter-mycard.png",
            trade: app.globalData.apiImgUrl + "new-ucenter-trade.png",
            ucenterMsg: app.globalData.apiImgUrl + "new-ucenter-msg.png",
            getintegral: app.globalData.apiImgUrl + "new-ucenter-getintegral.png",
            invite: app.globalData.apiImgUrl + "new-ucenter-invite.png",
            integral: app.globalData.apiImgUrl + "new-ucenter-integral.png",
            integrallog: app.globalData.apiImgUrl + "new-ucenter-integrallog.png",
            realname: app.globalData.apiImgUrl + "new-ucenter-realname.png",
            collect: app.globalData.apiImgUrl + "new-ucenter-collect.png",
            feedback: app.globalData.apiImgUrl + "new-ucenter-feedback.png",
            ucenterHelp: app.globalData.apiImgUrl + "new-ucenter-help.png",
        },
        userInfo: false,
        member: {},
        showReturnIntegral: false,
        // showFastIssue: {
        //     show: 0,
        //     request: false
        // },
    },
    
    initUserInfo: function(callback) {
        let userInfo = wx.getStorageSync("userInfo");
        if (!userInfo) {
            // this.setData({ showFastIssue: false })
            callback ? callback() : ""
            return false
        };
        // if (!app.globalData.showFastIssue.request) app.isShowFastIssue(this);
        // else this.setData({ showFastIssue: app.globalData.showFastIssue })
        this.setData({ userInfo: userInfo })
        let _this = this;
        wx.showLoading({ title: '正在初始化用户数据', })
        app.doRequestAction({
            url: "user/personal/",
            way: "POST",
            params: userInfo,
            success: function(res) {
                callback ? callback() : ""
                wx.hideLoading();
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.setData({
                        member: mydata.member,
                        is_checking: mydata.is_checking,
                        hasNoticeMsg: mydata.member.has_notice_msg.hasNoticeMsg,
                        showReturnIntegral: (parseInt(mydata.member.return_integral) == 0) ? false : true
                    })
                } else {
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: "none",
                        duration: 5000
                    })
                }
            },
            fail: function(err) {
                callback ? callback() : ""
                wx.hideLoading();
                wx.showToast({
                    title: '网络出错，数据加载失败！',
                    icon: "none",
                    duration: 5000
                })
            }
        })
    },
    valiUserUrl: function(e) {
        app.globalData.showdetail = true
        app.valiUserUrl(e, this.data.userInfo)
    },
    suggestUserUrl: function(e) {
        app.globalData.showdetail = true
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url,
        })
    },
    gotoUserauth: function() {
        app.gotoUserauth();
    },
    downappfun: function(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({ url: url })
    },
    // 共用footer
    jumpThisLink: function(e) {
        app.jumpThisLink(e);
    },
    initFooterData: function() {
        this.setData({
            footerImgs: footerjs.footerImgs,
            publishActive: footerjs.publishActive,
            showPublishBox: footerjs.showPublishBox
        })
    },
    doPublishAction: function() {
        footerjs.doPublishAction(this);
    },
    closePublishAction: function() {
        footerjs.closePublishAction(this);
    },
    valiUserCard: function() {
        let userInfo = this.data.userInfo;
        footerjs.valiUserCard(this, app, userInfo);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.initFooterData();
        this.initGetIntegralList();
    },
    initGetIntegralList:function(){
        let _this = this;
        app.initSystemInfo(function(res){
            if (res && res.platform != "ios"){
                _this.setData({
                    showRecharge: true
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.initUserInfo();
        footerjs.initMsgNum(this);
    },
    releaselive() {
        app.globalData.showdetail = true
        wx.navigateTo({
            url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
        })
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
        wx.showNavigationBarLoading()
            //wx.startPullDownRefresh()
        this.initUserInfo(function() {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh();
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return app.getUserShareJson();
    }
})
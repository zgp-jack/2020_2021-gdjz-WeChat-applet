// pages/invite/invite.js
var footerjs = require("../../utils/footer.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shareUrl:"",
        userInfo:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
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
    onLoad: function (options) {
        this.initFooterData();
        this.getUserInviteLink();
    },
    copyUserShareUrl:function(){
        let _this = this;
        wx.setClipboardData({
            data: _this.data.shareUrl,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    title: '系统提示',
                    content: "您的邀请链接已复制到粘贴板,赶快去邀请好友吧！",
                    showCancel: false,
                    success: function (res) {}
                })
            }
        })
    },
    jumpThisLink: function (e) {
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let _page = "/" + currentPage.route
        let _url = e.currentTarget.dataset.url;
        if (_url == _page) return false;
        console.log(_url, _page);
        wx.navigateTo({
            url: _url
        })
    },
    getUserInviteLink:function(){
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({
            userInfo: userInfo
        })
        app.doRequestAction({
            url:"index/invite-friends/",
            way:"POST",
            params: userInfo,
            success:function(res){
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                    _this.setData({
                        shareUrl: mydata.link
                    })
                }else{
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: 'none'
                    })
                }
            },
            fail:function(err){
                wx.showToast({
                    title: '网络出错，未获取到邀请链接，请重新进入页面！',
                    icon:'none'
                })
            }
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
        let userId = this.data.userInfo.userId
        return {
            title: '全国建筑工地招工平台',
            path: '/pages/index/index?refid='+userId,
            imageUrl: app.globalData.commonShareImg
        }
    }
})
const app = getApp();
let footerjs = require("../../utils/footer.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        footerActive: "member",
        ucenterimgs:{
            published: app.globalData.apiImgUrl + "uc-publish.png",
            used: app.globalData.apiImgUrl + "ucenter-used.png",
            card: app.globalData.apiImgUrl + "uc-card.png",
            recharge: app.globalData.apiImgUrl + "uc-recharge.png",
            expend: app.globalData.apiImgUrl + "uc-recode.png",
            original: app.globalData.apiImgUrl + "uc-source.png",
            downapp: app.globalData.apiImgUrl + "uc-downapp.png",
            feedback: app.globalData.apiImgUrl + "ucenter-feedback.png",
            invite: app.globalData.apiImgUrl + "ucnter-yaoqing.png",
        },
        userInfo:{},
        member:{},
        showReturnIntegral:false
    },
    initUserInfo:function(){
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo:userInfo })
        let _this = this;
        wx.showLoading({ title: '正在初始化用户数据', })
        app.doRequestAction({
            url:"user/personal/",
            way:"POST",
            params: userInfo,
            success:function(res){
                wx.hideLoading();
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                    _this.setData({
                        member:mydata.member,
                        showReturnIntegral: (parseInt(mydata.member.return_integral) == 0) ? false:true
                    })
                }else{
                    wx.showToast({
                        title: mydata.errmsg,
                        icon:"none",
                        duration:5000
                    })
                }
            },
            fail:function(err){
                wx.hideLoading();
                wx.showToast({
                    title: '网络出错，数据加载失败！',
                    icon: "none",
                    duration: 5000
                })
            }
        })
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
    valiUserCard: function () {
        let userInfo = this.data.userInfo;
        footerjs.valiUserCard(this, app, userInfo);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initFooterData();
        this.initUserInfo();
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
            imageUrl: "http://yupao.oss-cn-beijing.aliyuncs.com/miniprogram/images/minishare.png"
        }
    }
})
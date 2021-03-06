// pages/userinfo/pass/pass.js
let vali = require("../../../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        oldicon: true,
        newicon: true,
        sureicon: true,
        oldPass: "",
        newPass: "",
        rePass: "",
        userInfo: {}
    },
    changeInputType: function (e) {
        let _type = e.currentTarget.dataset.type;
        (_type == "old") ? this.setData({ oldicon: !this.data.oldicon }) : ((_type == "new") ? this.setData({ newicon: !this.data.newicon }) : this.setData({ sureicon: !this.data.sureicon }))
    },
    enterOldPass: function (e) {
        this.setData({ oldPass: e.detail.value })
    }, 
    enterNewPass: function (e) {
        this.setData({ newPass: e.detail.value })
    },
    enterRePass: function (e) {
        this.setData({ rePass: e.detail.value })
    },
    userUpdataPass: function () {
        let _this = this;
        let userInfo = this.data.userInfo;
        let v = vali.v.new();
        if (!v.isRequire(_this.data.oldPass, 6)) {
            app.showMyTips("原密码有误!");
            return false;
        }
        if (!v.isRequire(_this.data.newPass, 6)) {
            app.showMyTips("新密码由6-16位数字字母组成!");
            return false;
        }
        if (_this.data.newPass != _this.data.rePass) {
            app.showMyTips("两次输入的密码不一致!");
            return false;
        }
        userInfo.oldPwd = _this.data.oldPass;
        userInfo.onePwd = _this.data.newPass;
        userInfo.twoPwd = _this.data.rePass;
        app.doRequestAction({
            url: "user/update-pwd/",
            way: "POST",
            params: userInfo,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel:false,
                        success:function(){
                            wx.reLaunch({ url: '/pages/ucenter/ucenter' })
                        }
                    })
                }else{
                    app.showMyTips(mydata.errmsg);
                }
            },
            fail: function () {
                app.showMyTips("网络错误，修改失败！");
            }
        })
    },
    initUserinfo: function () {
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo: userInfo })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUserinfo();
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

})
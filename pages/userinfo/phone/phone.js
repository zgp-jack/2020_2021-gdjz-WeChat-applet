// pages/userinfo/phone/phone.js
let vali = require("../../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:"",
        phone:"",
        code:"",
        codeTips:"获取验证码",
        status:1,
        source:0,
    },
    userEnterPhone:function(e){
        this.setData({
            phone: e.detail.value
        })
    },
    userEnterCode:function(e){
        this.setData({
            code:e.detail.value
        })
    },
    userGetCode:function(e){
        let v = vali.v.new();
        let _this = this;
        let status = parseInt(this.data.status);
        let userInfo = this.data.userInfo;
        if(status == 0) return false;
        if (v.isMobile(_this.data.phone)) {
            wx.showLoading({ title: '正在获取验证码' })
            app.doRequestAction({
                url: "index/get-code/",
                way: "POST",
                params: {
                    userId: userInfo.userId,
                    token: userInfo.token,
                    tokenTime: userInfo.tokenTime,
                    tel: _this.data.phone,
                    sendType: "no"
                },
                success: function (res) {
                    wx.hideLoading();
                    let mydata = res.data;
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: "none",
                        duration: 2000
                    })
                    if (mydata.errcode == "ok") {
                        let _time = mydata.refresh;
                        _this.initCountDown(_time);
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: "网络错误，获取失败！",
                        icon: "none",
                        duration: 2000
                    })
                }
            })
        } else {
            wx.showToast({
                title: "手机号码不正确！",
                icon: "none",
                duration: 2000
            })
        }
    },
    initCountDown: function (_time) {
        let _t = parseInt(_time);
        let _this = this;
        this.setData({
            status: 0,
            codeTips: _t + "秒后重试"
        });
        let timer = setInterval(function () {
            _t--;
            if (_t == 0) {
                clearInterval(timer);
                _this.setData({
                    dis: 1,
                    codeTips: "获取验证码"
                })
                return false;
            }
            _this.setData({ codeTips: _t + "秒后重试" })
        }, 1000)
    },
    initUserInfo: function (options){
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ 
            userInfo:userInfo,
            source: (options.hasOwnProperty("type")) ? options.type : 0
        }) 
    },
    userChangeTel:function(){
        let _this = this;
        let source = this.data.source;
        let v = vali.v.new();
        if (!v.isMobile(_this.data.phone)){
            app.showMyTips("手机号码有误！");
            return false;
        }
        let userInfo = this.data.userInfo;
        wx.showLoading({ title: '正在获取验证码' })
        app.doRequestAction({
            url: "user/update-tel/",
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                tel: _this.data.phone,
                code: _this.data.code
            },
            success: function (res) {
                wx.hideLoading();
                let mydata = res.data;
                wx.showToast({
                    title: mydata.errmsg,
                    icon: "none",
                    duration: 2000
                })
                if (mydata.errcode == "ok") {
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function () {
                            if (source == 0) {
                                wx.reLaunch({ url: '/pages/ucenter/ucenter' })
                            } else if (source == "info") {
                                wx.navigateBack({ delta: 2 })
                            }
                        }
                    })
                }else{
                    app.showMyTips(mydata.errmsg);
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: "网络错误，修改失败！",
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUserInfo(options);
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
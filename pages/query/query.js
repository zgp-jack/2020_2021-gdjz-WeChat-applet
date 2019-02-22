// pages/query/query.js
let vali = require("../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showResult:false,
        userInfo:{},
        username:"",
        phone:"",
        age:'',
        workType:[],
        registerCtiy:"",
        recentlyCity:"",
        tel:""
    },
    callThisPhone:function(e){
        let phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    initUserAuth:function(){
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo:userInfo });
        wx.showLoading({
            title: '正在加载数据',
            mask:true
        })
        app.doRequestAction({
            url:"resume/auth-status/",
            way:"POST",
            params:userInfo,
            success:function(res){
                wx.hideLoading();
                let mydata = res.data;
                if (mydata.errcode == "auth_pass"){

                } else if (mydata.errcode == "auth_not_pass" || mydata.errcode == "not_auth"){
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        success(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/realname/realname',
                                })
                            } else if (res.cancel) {
                                wx.reLaunch({
                                    url: '/pages/index/index',
                                })
                            }
                        }
                    })
                }else{
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        success(res) {
                            wx.reLaunch({
                                url: '/pages/index/index',
                            })
                        }
                    })
                }
            },
            fail:function(){
                wx.hideLoading();
                wx.showModal({
                    title: '温馨提示',
                    content: '网络错误，未能识别到您的身份！',
                    success(res) {
                        wx.redirectTo({
                            url: '/pages/index/index',
                        })
                    }
                })
            }
        })
    },
    enterPhone:function(e){
        this.setData({
            phone :e.detail.value
        })
    },
    userQueryPhone:function(){
        let v = vali.v.new();
        let _this = this;
        let phone = this.data.phone;
        let userInfo = this.data.userInfo;
        if (v.isMobile(phone)) {
            wx.showLoading({ title: '正在查询该用户' })
            app.doRequestAction({
                url: "resume/query-worker/",
                way: "POST",
                params: {
                    userId: userInfo.userId,
                    token: userInfo.token,
                    tokenTime: userInfo.tokenTime,
                    tel:phone
                },
                success: function (res) {
                    wx.hideLoading();
                    let mydata = res.data;
                    console.log(mydata);
                    if (mydata.errcode == "ok") {
                        _this.setData({
                            showResult : true,
                            age: mydata.member.age,
                            workType:mydata.member.occupations,
                            registerCity: mydata.member.register_address,
                            recentlyCity:mydata.member.finally_login_address,
                            username: mydata.member.username,
                            tel:mydata.member.tel
                        })
                    }else{
                        _this.setData({ showResult : false })
                        wx.showModal({
                            title: '温馨提示',
                            content: mydata.errmsg,
                            showCancel:false,
                            success(res) {}
                        })
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: "网络错误，查询失败！",
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //this.initUserAuth();
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
        this.initUserAuth();
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
// pages/getintegral/getintegral.js goThisPage
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showRecharge:false,
        phone: ""
    },
    callThisPhone:function(e){
        let phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    goThisPage:function(e){
        let _url = e.currentTarget.dataset.url;
        wx.navigateTo({ url: _url })
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ phone:app.globalData.serverPhone })
        this.initGetIntegralList();
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
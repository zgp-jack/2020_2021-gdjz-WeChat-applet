// pages/fast-issue/tips/tips.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{}
    },
    reLaunchIndex: function (e) {
        let url = e.currentTarget.dataset.url;
        wx.reLaunch({ url: url })
    },
    usreFastAuth:function(e){
        let that = this;
        app.bindGetUserInfo(e, function (res) {
            app.mini_user(res, function (res) {
                app.api_user(res, function (res) {
                    let uinfo = res.data;
                    console.log(uinfo);
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
                        wx.reLaunch({ url: '../lists/lists' })
                    } else {
                        app.showMyTips(uinfo.errmsg);
                    }
                });
            });
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
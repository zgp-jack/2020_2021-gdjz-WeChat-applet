// pages/notice/notice.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        noticeId:0,
        content:"",
        title:""
    },
    getNoticeInfo:function(options){
        let _this = this;
        let id = options.id;
        app.doRequestAction({
            url: "index/notice-info/",
            params: { id: id },
            success: function (res) {
                let msg = res.data.data;
                _this.setData({
                    noticeId: id,
                    content: msg.content,
                    title: msg.title
                })
                wx.setNavigationBarTitle({
                    title: msg.title
                })
                WxParse.wxParse('content', 'html', msg.content,_this,5);
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getNoticeInfo(options);
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

    }
})
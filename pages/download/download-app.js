// pages/downapp/downapp.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        appUrl: "https://android.myapp.com/myapp/detail.htm?apkName=io.dcloud.H576E6CC7&amp;ADTAG=mobile",
        appImg: app.globalData.apiImgUrl + "downloadappimg.png"
    },
    copyAppUrl: function () {
        wx.setClipboardData({
            data: this.data.appUrl,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    title: '温馨提示',
                    content: '鱼泡APP下载地址已复制到粘贴板,请粘贴到浏览器中下载!',
                    showCancel:false,
                    success:function(){}
                })
            }
        })
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
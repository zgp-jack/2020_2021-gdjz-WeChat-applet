// pages/ucenter/ucenterNew/hireMembers.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        publishedData: [{
                title: '鱼泡找活会员'
            },
            {
                title: '鱼泡招工会员'
            }
        ],
        publishIndex: 0,
        realNames: app.globalData.apiImgUrl + 'newresume-infolist-ysm.png?t=1',
        member: {},
        userInfo: true,
        membersData: [
            { name: '1个月', value: '154', type: '微信支付', },
            { name: '6个月', value: '266', type: '微信支付', },
            { name: '8个月', value: '999', type: '微信支付', },
        ],
        activeIndex: 0,
    },

    showThisList: function(e) {
        let index = e.currentTarget.dataset.index;
        wx.setNavigationBarTitle({
            title: (index == "1") ? "招工会员" : "找活会员",
        })
        if (this.data.publishIndex == index) return false;
        this.setData({
            publishIndex: index,
            page: 1,
            lists: [],
            showNoData: false,
            nothavamore: false,
            isFirstRequest: true
        })
        this.initUserInfo();
    },
    chooseThisMoney: function(e) {
        let _index = e.currentTarget.dataset.index;
        this.setData({
            activeIndex: parseInt(_index)
        })
    },
    initUserInfo: function(callback) {
        let userInfo = wx.getStorageSync("userInfo");
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        this.initUserInfo();
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

    }
})
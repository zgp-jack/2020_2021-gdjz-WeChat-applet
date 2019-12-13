// pages/ucenter/ucenterNew/invite.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lists: [{
                His: "10:29:52",
                day: "11",
                expend_integral_string: "消耗正式积分：1",
                expense_integral: "1",
                expense_type: "1",
                headerText: "查看招工信息",
                id: "32658629",
                is_return: "0",
                issue_user_id: "0",
                source: "wx456feacb0e86162f",
                target_id: "9563754",
                target_uuid: "",
                temp_integral: "0",
                time: "1576031392",
                title: "四川挖掘机司机",
                token: "4663922_1_9563754",
                user_id: "4663922",
                year_month: "2019.12"
            },
            {
                His: "16:26:35",
                day: "06",
                expend_integral_string: "消耗正式积分：1",
                expense_integral: "1",
                expense_type: "2",
                headerText: "查看找活信息",
                id: "32170076",
                is_return: "0",
                issue_user_id: null,
                source: "wx31a1c86a67bc6c54",
                target_id: "393026",
                target_uuid: "",
                temp_integral: "0",
                time: "1575620795",
                title: "钢结构安装，各种钢楼梯，铁栏杆，彩钢瓦等专业10多年",
                token: "4663922_2_393026",
                user_id: "4663922",
                year_month: "2019.12",
            },
            {
                His: "16:25:31",
                day: "06",
                expend_integral_string: "消耗积分：0",
                expense_integral: "0",
                expense_type: "2",
                headerText: "查看找活信息",
                id: "32169959",
                is_return: "0",
                issue_user_id: null,
                source: "wx31a1c86a67bc6c54",
                target_id: "413921",
                target_uuid: "",
                temp_integral: "0",
                time: "1575620731",
                title: "我们是多年的安装队，维修和装修工程。技术过傲。真诚相待。塌实做事。彩钢瓦房，门窗，成都，新都周边最好。",
                token: "4663922_2_413921",
                user_id: "4663922",
                year_month: "2019.12",
            }
        ]
    },
    initUserInfo: function(callback) {
        let userInfo = wx.getStorageSync("userInfo");
        if (!userInfo) {
            this.setData({ showFastIssue: false })
            return false
        };
        if (!app.globalData.showFastIssue.request) app.isShowFastIssue(this);
        else this.setData({ showFastIssue: app.globalData.showFastIssue })
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
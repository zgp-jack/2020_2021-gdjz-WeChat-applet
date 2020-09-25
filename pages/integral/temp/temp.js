// pages/source/source.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingGif: app.globalData.apiImgUrl + "loading.gif",
        nodata: app.globalData.apiImgUrl + "nodata.png",
        nothavemore: false,
        isNone: false,
        isFirst: true,
        userInfo: "",
        lists: [],
        pageSize: 15,
        page: 1
    },
    // 格式化时间
    getMyDate(str) {
        var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' +
        this.addZero(oMin);
        return oTime;
      },
      // 如果分钟小于10就添加一个0
    addZero(num) {
      if (parseInt(num) < 10) {
        num = '0' + num;
      }
      return num;
    },
    getIntegralHeader: function () {
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo: userInfo })
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url: "integral/header-words/",
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                type: "temp"
            },
            success: function (res) {
                wx.hideLoading();
                let mydata = res.data;
                let lists = mydata.firstList.list;
                for (const item of lists) {
                    let time = item.time * 1000
                    let newTime = _this.getMyDate(time)
                    item.time = newTime
                }
                _this.setData({
                    lists: lists,
                    pageSize: mydata.firstList.pageSize,
                    isNone: mydata.firstList.list.length ? false : true,
                    isFirst: false
                })
                if ((mydata.firstList.list.length < parseInt(mydata.firstList.pageSize)) && mydata.firstList.list.length) {
                    _this.setData({ nothavemore: true })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: '数据加载失败，请稍后重试！',
                    icon: "none",
                    duration: 5000
                })
            }
        })
    },
    getNextPageData: function () {
        let _this = this;
        let userInfo = this.data.userInfo;
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url: "integral/integral-record/",
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                type: "temp",
                page: _this.data.page
            },
            success: function (res) {
                wx.hideLoading();
                let mydata = res.data.list;
                let pagesize = res.data.pageSize;

                if (mydata.length == 0) {
                    _this.setData({
                        nothavemore: true
                    })
                } else {
                    let addData = _this.data.lists;
                    for (let i = 0; i < mydata.length; i++) {
                        addData.push(mydata[i]);
                    }
                    _this.setData({
                        lists: addData,
                        nothavemore: (mydata.length < parseInt(pagesize)) ? true : false
                    })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: '数据加载失败，请稍后重试！',
                    icon: "none",
                    duration: 5000
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getIntegralHeader();
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
        if ((this.data.isFirst) || (this.data.isNone) || (this.data.nothavemore)) return false;
        this.setData({ page: this.data.page + 1 })
        this.getNextPageData();
    },

})
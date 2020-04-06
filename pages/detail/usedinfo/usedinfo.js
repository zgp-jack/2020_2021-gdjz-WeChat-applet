// pages/usedinfo/usedinfo.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: false,
        usedInfo: {},
        notice: {
            autoplay: true,
            indicatorDots: false,
            circular: true,
            vertical: true,
            interval: 5000,
            duration: 1000,
            lists: []
        },
        phone: "",
        wechat: "",
      joingroup:[]
    },
    initUsedinfo: function (options) {
        let _this = this;
        let _id = options.id;
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo: userInfo ? userInfo : false });
        userInfo = userInfo ? userInfo : {}
        userInfo.infoId = _id;
        app.appRequestAction({
            url: "fleamarket/fleamarket-info/",
            way: "POST",
            params: userInfo,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.setData({
                        usedInfo: mydata.data
                    })
                    let t = mydata.data.title;
                    wx.setNavigationBarTitle({ title: t })
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel:false,
                        success(res) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }
            },
            fail: function () {
                wx.showModal({
                    title: '温馨提示',
                    content: '网络异常，数据加载失败！',
                    showCancel: false,
                    success(res) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        })
    },
    callThisPhone:function(e){
        let _end = e.currentTarget.dataset.end;
        if(_end == "2") return false;
        app.callThisPhone(e);
    },
    clipboardWechat: function (e) {
        let wechat = e.currentTarget.dataset.wechat;
        wx.setClipboardData({
            data: wechat,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    title: '恭喜您',
                    content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
                    showCancel: false,
                    success: function () { }
                })
            }
        })
    },
    showThisNotice: function (e) {
        let _id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/static/notice?type=1&id=' + _id,
        })
    },
    initNeedData: function () {
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = wx.getStorageSync("userInfo");
        let _time = Date.parse(new Date());
        if (_wx && _wx.expirTime) {
            if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        app.doRequestAction({
            url: "index/less-search-data/",
            params: {
              type: "job",
              userId: _mark ? (userInfo ? userInfo.userId : "") : "",
            },
            success: function (res) {
                let mydata = res.data;
                _this.setData({
                    "notice.lists": mydata.notice,
                    phone: mydata.phone,
                    wechat: _mark ? mydata.wechat.number : _wx.wechat,
                    joingroup: mydata.join_group_config
                })

                app.globalData.joingroup = mydata.join_group_config
                app.globalData.copywechat = mydata.wechat.number
                app.globalData.callphone = mydata.phone

                if (_mark) {
                    let extime = _time + (mydata.wechat.outTime * 1000);
                    wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime });
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '数据加载失败！',
                    icon: "none",
                    duration: 3000
                })
            }
        })
    },
  getPhonCons() {
    this.setData({
      joingroup: app.globalData.joingroup
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUsedinfo(options);
        this.initNeedData();
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
        return app.getUserShareJson();
    }
})
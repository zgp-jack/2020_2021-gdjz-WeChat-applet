const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wechat: "",
        phone: "",
        page: 1,
        restaurants: [],
        hasmore: true,
        nodata: app.globalData.apiImgUrl + "nodata.png",
        isViewImgs: false,
        userInfo: true,
        icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    },
    initUserData: function(options) {
        let userInfo = wx.getStorageSync("userInfo");
        let td = this.data
        let tel = options.tel || userInfo.tel;
        let name = options.name || userInfo.username;
        if (!userInfo) {
            this.setData({
                userInfo: false
            })
            return false;
        } else {
            this.setData({
                userInfo: userInfo
            })
        }
        this.setData({
            tel: tel,
            "member.phone": tel,
            "member.username": name,
            userInfo: userInfo
        });
    },
    returnPrevPage() {
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },
    bindGetUserInfo: function(e) {
        let that = this;
        app.bindGetUserInfo(e, function(res) {
            app.mini_user(res, function(res) {
                app.api_user(res, function(res) {
                    let uinfo = res.data;
                    if (uinfo.errcode == "ok") {
                        let userInfo = {
                            userId: uinfo.data.id,
                            token: uinfo.data.sign.token,
                            tokenTime: uinfo.data.sign.time,
                            username: uinfo.data.username,
                            tel: uinfo.data.tel,
                        }
                        app.globalData.userInfo = userInfo;
                        wx.setStorageSync('userInfo', userInfo)
                        that.setData({ userInfo: userInfo });
                        that.getFeedbackList();
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
    onLoad: function(options) {
        this.initUserData(options)
        this.initNeedData();
    },
    onShow: function() {
        if (this.data.isViewImgs) {
            this.setData({
                isViewImgs: false
            });
            return false;
        }
        this.setData({
            page: 1,
            hasmore: true
        })
        this.getFeedbackList(true);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },

    onHide: function() {
        wx.hideToast()

    },
    //下拉加载方法
    getFeedbackList: function(bool) {
        let _this = this;
        let td = this.data
        let page = td.page;
        let userInfo = wx.getStorageSync("userInfo");
        if (!userInfo) return false;
        // 发送网络请求
        app.appRequestAction({
            url: "leaving-message/list/",
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                page: td.page,
            },
            success: function(res) {
                let mydata = res.data.data;
                let len = mydata.length;
                if (len) {
                    let mylist = td.restaurants
                    let _list = bool ? mydata : mylist.concat(mydata)
                    page = page + 1;
                    _this.setData({
                        restaurants: _list,
                    })
                } else {
                    if (page !== 1) {
                        app.showMyTips("没有更多数据");
                        _this.setData({
                            hasmore: false
                        })
                        return false;
                    }
                }
                _this.setData({
                    page: page
                })
            },


        })
    },


    ////下拉加载生命周期
    onReachBottom: function() {
        if ((this.data.page != 1) && this.data.hasmore) this.getFeedbackList()
    },

    valiUserUrl: function() {
        let userInfo = wx.getStorageSync("userInfo");
        let td = this.data
        let tels = td.tel || userInfo.tel
        let username = userInfo.username || td.member.username
        wx.navigateTo({
            url: '/pages/others/message/publish/publish?tel=' + tels + "&name=" + username + "&wechat=" + td.wechat + "&phone=" + td.phone
        })
    },
    clipboardWechat: function(e) {
        let wechat = e.currentTarget.dataset.wc;
        wx.setClipboardData({
            data: wechat,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    title: '恭喜您',
                    content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
                    showCancel: false,
                    success: function() {}
                })
            }
        })
    },
    callThisPhone: function(e) {
        app.callThisPhone(e);
    },
    initNeedData: function() {
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = this.data.userInfo;
        let _time = Date.parse(new Date());
        if (_wx && _wx.expirTime) {
            if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        app.doRequestAction({
            url: "index/search-data/",
            params: {
                type: "job",
                userId: _mark ? (userInfo.userId ? userInfo.userId : "") : "",
            },
            success: function(res) {
                let mydata = res.data;
                _this.setData({
                    phone: mydata.phone,
                    wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number)
                })
                if (_mark) {
                    let extime = _time + (mydata.wechat.outTime * 1000);
                    wx.setStorageSync("_wx", {
                        wechat: mydata.wechat.number,
                        expirTime: extime
                    });
                }
            },
            fail: function(err) {
                wx.showToast({
                    title: '数据加载失败！',
                    icon: "none",
                    duration: 3000
                })
            }
        })
    },
    //tup
    restimg(e) {
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        const dataArr = this.data.restaurants.find(fo => fo.id === item.id)
        const images = dataArr.images
        this.setData({
            isViewImgs: true
        })
        wx.previewImage({
            current: images[index],
            urls: images
        })
    },
})
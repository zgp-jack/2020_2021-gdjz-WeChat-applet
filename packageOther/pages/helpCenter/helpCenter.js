// pages/ucenter/ucenterNew/helpCenter.js 
const app = getApp();
Page({
    data: {
        // 向右的方向箭头
        rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
        question: app.globalData.apiImgUrl + "new-ucenter-question.png",
        // 搜索框Icon
        searchIcon: app.globalData.apiImgUrl + "yc/helpCenter-search.png",
        isEnd: false,
        page:1,
        helpeLists:[],
        memberInfo:[],
        // 点击一级标题展示二级标题
        showDetail:false,
        // 手机系统ios或者andriod
        system:""
    },
    //点击最外层列表展开收起
    listTap(e) {
        //获取点击的下标值
        let aIndex = e.currentTarget.dataset.parentindex, 
        helpeLists = this.data.helpeLists;
        //变换其打开、关闭的状态
        helpeLists[aIndex].show = !helpeLists[aIndex].show || false; 
        //如果点击后是展开状态，则让其他已经展开的列表变为收起状态
        if (helpeLists[aIndex].show) { 
          this.packUp(helpeLists, aIndex);
        }
        this.setData({
            helpeLists
        });
    },
    //让所有的展开项，都变为收起
    packUp(data, index) {
        for (let i = 0, len = data.length; i < len; i++) { //其他最外层列表变为关闭状态
            if (index != i) {
                data[i].show = false;
            }
        }
    },
    // 获取帮助中心问题列表数据
    getHelpeData: function() {
        let _this = this;
        wx.showLoading({ title: '数据加载中' })
        // 获取手机设备的平台信息ios或者Android
        _this.initGetIntegralList()
        app.appRequestAction({
            url: "/others/feedback-tree/",
            params: {
                system:_this.data.system,
            },
            success: function(res) {
                wx.hideLoading();
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    let lists = mydata.data;
                    _this.setData({
                        helpeLists: lists
                    })
                } else {
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: 'none',
                        duration: 5000
                    })
                }
            },
            fail: function(err) {
                wx.hideLoading();
                wx.showToast({
                    title: '加载失败，请稍后重试！',
                    icon: 'none',
                    duration: 5000
                })
            }
        })
    },
    getFeedbackList: function() {
        let _this = this;
        let page = 1;
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
                page: 1,
            },
            success: function(res) {
                let mydata = res.data.data;
                if (page === 1) {
                    let memberInfo = res.data.memberInfo;
                    _this.setData({
                        memberInfo: memberInfo
                    })
                }
            },
        })
    },
    // 获取当前设备平台信息ios或者android
    initGetIntegralList:function(){
        let _this = this;
        app.initSystemInfo(function(res){
            if (res && res.platform == "ios"){
                _this.setData({
                    system: 'ios'
                })
            }else if( res && res.platform != "ios"){
                _this.setData({
                    system: 'android'
                })
            }
        })
    },
    // 去问题答案详情页面
    findAnswer: function (e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url,
        })
    },
    initNeedData: function() {
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = wx.getStorageSync("userInfo");
        let _time = Date.parse(new Date());
        if (_wx && _wx.expirTime) {
            if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        app.appRequestAction({
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
    suggestUserUrl: function() {
        let _this = this.data;
        let tels = _this.memberInfo.phone || "";
        let username = _this.memberInfo.username || "";
        wx.navigateTo({
            url: '/packageOther/pages/others/message/publish/publish?tel=' + tels + "&name=" + username + "&wechat=" + _this.wechat + "&phone=" + _this.phone
        })
    },
    showQuestionDetail: function () {
        this.setData({
            showDetail: !this.data.showDetail
        })
    },
    // 点击我的反馈跳转到我的反馈列表
    goFeedback: function () {
        wx.navigateTo({
          url: '/packageOther/pages/others/message/lists/lists',
        })
    },
    // 点击去发布意见反馈
    goPublishFeedback: function () {
        wx.navigateTo({
            url: '/packageOther/pages/others/message/publish/publish',
        })
    },
    onLoad: function(options) {
        this.getHelpeData();
        this.initNeedData();
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
        this.getFeedbackList()
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
        if(this.data.isEnd) return false;
        this.getHelpeData()
    }
})
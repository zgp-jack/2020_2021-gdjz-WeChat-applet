// pages/ucenter/ucenterNew/helpCenter.js 
const app = getApp();
Page({
    data: {
        rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
        question: app.globalData.apiImgUrl + "new-ucenter-question.png",
        isEnd: false,
        page:1,
        listsImg: {
          nodata: app.globalData.apiImgUrl + "nodata.png",
        },
        helpeLists:[],
        memberInfo:[]
    },
    //点击最外层列表展开收起
    listTap(e) {
        // console.log('触发了最外层');
        let aIndex = e.currentTarget.dataset.parentindex, //获取点击的下标值
        helpeLists = this.data.helpeLists;
        helpeLists[aIndex].show = !helpeLists[aIndex].show || false; //变换其打开、关闭的状态
        if (helpeLists[aIndex].show) { //如果点击后是展开状态，则让其他已经展开的列表变为收起状态
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
    
    getHelpeData: function() {
        let _this = this;
        wx.showLoading({ title: '数据加载中' })
        _this.initGetIntegralList()
        app.appRequestAction({
            url: "others/help-feedback/",
            params: {
                page: _this.data.page,
                system:_this.data.system,
            },
            success: function(res) {
                wx.hideLoading();
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    let _list = _this.data.helpeLists;
                    let _lists = mydata.lists;

                    if(_lists.length == 0){
                        _this.setData({ isEnd:true})
                    }else{
                        let mylist = _list.concat(_lists);
                        let _page = _this.data.page + 1;
                        _this.setData({ helpeLists: mylist, page: _page});
                    }
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
            url: '/pages/others/message/publish/publish?tel=' + tels + "&name=" + username + "&wechat=" + _this.wechat + "&phone=" + _this.phone
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
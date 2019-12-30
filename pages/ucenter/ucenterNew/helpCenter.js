// pages/ucenter/ucenterNew/helpCenter.js 
const app = getApp();
Page({
    data: {
        rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
        question: app.globalData.apiImgUrl + "new-ucenter-question.png",
        nothavemore: false,
        showNothinkData: false,
        page:1,
        listsImg: {
          nodata: app.globalData.apiImgUrl + "nodata.png",
        },
    },
    //点击最外层列表展开收起
    listTap(e) {
        console.log('触发了最外层');
        let Index = e.currentTarget.dataset.parentindex, //获取点击的下标值
            HelpeLists = this.data.HelpeLists;
        HelpeLists[Index].show = !HelpeLists[Index].show || false; //变换其打开、关闭的状态
        if (HelpeLists[Index].show) { //如果点击后是展开状态，则让其他已经展开的列表变为收起状态
            this.packUp(HelpeLists, Index);
        }
        this.setData({
            HelpeLists
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
        console.log(_this.data.system)
        this.setData({
            nothavemore: false,
            showNothinkData: false
          })
        app.doRequestAction({
            url: "others/help-feedback/",
            params: {
                page: _this.data.page,
                system:_this.data.system,
            },
            success: function(res) {
                wx.hideLoading();
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    
                    _this.setData({ isFirstRequest: false });
                    _this.setData({
                        HelpeLists: mydata.lists
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
    suggestUserUrl: function(e) {
        app.globalData.showdetail = true
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url,
        })
    },
    onLoad: function(options) {
        if ((this.data.isFirstRequest) || (this.data.showNothinkData) || (this.data.nothavemore)) return false;
        this.getHelpeData();
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
        this.getHelpeData()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
// pages/fast-issue/lists/lists.js
const app =getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:1,
        userInfo:{},
        lists:[],
        isEnd:false
    },
    initFastList:function(){
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo: userInfo });
        this.getFastList();
    },
    getFastList:function(){
        let _this = this;
        let userInfo = this.data.userInfo;
        userInfo.page = this.data.page;
        app.appRequestAction({
            title: "正在加载数据",
            mask: true,
            failTitle: "网络错误，数据加载失败！",
            url: "fast-issue/list/",
            way: "POST",
            params: userInfo,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    let _list = _this.data.lists;
                    let _lists = mydata.data;
                    if(_lists.length == 0){
                        _this.setData({ isEnd:true })
                    }else{
                        let mylist = _list.concat(_lists);
                        let _page = _this.data.page + 1;
                        _this.setData({ lists: mylist, page: _page});
                    }
                }else{
                    app.showMyTips(mydata.errmsg);
                }
            }
        })
    },
    toThisPage:function(e){
        let status = e.currentTarget.dataset.status;
        let type = e.currentTarget.dataset.type;
        let id = e.currentTarget.dataset.id;
        if(status != "1") return false;
        wx.navigateTo({ url: (type == "job") ? '/pages/published/published' : '/pages/mycard/mycard' });
    },
    goThisPage: function (e) {
        let url = e.currentTarget.dataset.url;
        wx.reLaunch({ url: url })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initFastList();
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
        if(this.data.isEnd) return false;
        this.getFastList();
    },

})
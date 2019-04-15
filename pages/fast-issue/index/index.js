// pages/fast-issue/index/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerbg: app.globalData.apiImgUrl + "fast-index-header.png",
        textareaActive:false,
        content:"",
        phone:"",
        showTel:false,
        isphone:false,
        userInfo:{}
    },
    getTextareaFocus:function(e){
        this.setData({ textareaActive: true })
    },
    userEnterContent:function(e){
        let val = e.detail.value;
        this.setData({ content: val });
        let content = val.replace(/\s+/g, "");
        let _partten = /1[3,4,5,6,7,8,9]\d{9}/g;
        let phone = content.match(_partten);
        if(this.checkType(phone,'array')){
            let tel = phone[0];
            this.setData({ showTel: true, phone: tel, isphone:true });
        }
    },
    checkType: function(obj, _type){
        var _re = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        if(_type == undefined) return _re;
        if (_re == _type) return true;
        return false;
    },
    getUserPhone:function(e){
        this.setData({ phone:e.detail.value });
    },
    userSubmitAction:function(){
        let val = this.data.content;
        let content = val.replace(/\s+/g, "");
        let phone = this.data.phone;
        let _patten = /^1[3-9]\d{9}$/;
        if(!content){
            app.showMyTips("请粘贴或输入您的招工信息！");
            return false;
        }
        if (phone == "") {
            this.setData({ isphone: false, showTel: true });
            app.showMyTips("请输入您的手机号");
            return false;
        }
        if(!_patten.test(phone)){
            this.setData({  showTel: true });
            app.showMyTips("您输入的手机号码有误");
            return false;
        }
        let userInfo = this.data.userInfo;
        userInfo.content = content;
        userInfo.phone = phone;
        console.log(1);
        app.appRequestAction({
            title: "正在发布招工",
            mask: true,
            failTitle: "网络错误，招工发布失败！",
            url: "fast-info/",
            way: "POST",
            params: userInfo,
            success: function (res) {
                let mydata = res.data;
                app.showMyTips(mydata.errmsg);
                if (mydata.errcode == "ok") {
                    let fastId = mydata.fastId;
                    wx.setStorageSync("fastId", fastId);
                    wx.setStorageSync("fastTel", phone);
                    wx.navigateTo({
                        url: '/pages/fast-issue/code/code',
                    })
                }
            }
        })
    },
    initUserInfo:function(){
        let userInfo = wx.getStorageSync("userInfo");
        if (userInfo) this.setData({ userInfo: userInfo });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUserInfo();
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

    }
})
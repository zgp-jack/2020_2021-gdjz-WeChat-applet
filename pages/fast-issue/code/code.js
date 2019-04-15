// pages/fast-issue/code/code.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code : "",
        time:10,
        phone:"",
        userInfo:{},
        fastId:0,
        hasUser:false,
    },
    getPhoneCode:function(e){
        this.setData({ code: e.detail.value })
    },
    initPageAction:function(){
        let userInfo = wx.getStorageSync("userInfo");
        let fastId = wx.getStorageSync("fastId");
        let phone = wx.getStorageSync("fastTel");
        if (userInfo) this.setData({ userInfo: userInfo, hasUser:true });
        this.setData({ fastId: fastId, phone: fastId })
        this.initCodeTime();
    },
    initCodeTime: function () {
        let _this = this;
        let codeTime = this.data.time;
        let timer = setInterval(function () {
            codeTime--;
            _this.setData({ time: codeTime })
            if (codeTime == 0) {
                clearInterval(timer);
                return false;
            }
        }, 1000)
    },
    recodeAction:function(e){
        let _t = parseInt(e.currentTarget.dataset.time);
        if(_t != 0) return false;
        let _this = this;
        let phone = this.data.phone;

        app.appRequestAction({
            title: "正在获取验证码",
            mask: true,
            failTitle: "网络错误，验证码获取失败！",
            url: "send-fast-code/",
            way: "POST",
            params: { phone: phone },
            success: function (res) {
                let mydata = res.data;
                app.showMyTips(mydata.errmsg);
                console.log(mydata);
                if (mydata.errcode == "ok") {
                    let _time = parseInt(mydata.refresh);
                    _this.setData({ time: _time });
                    _this.initCodeTime();
                }
            }
        })
    },
    userSubmitAction:function(){
        let code = this.data.code;
        if(!code){
            app.showMyTips("请输入正确的验证码!");
            return false;
        }
        let userinfo = this.data.userInfo;
        let phone = this.data.phone;
        console.log(userinfo);
        userinfo.phone = phone;
        userinfo.code = code;
        userinfo.fastId = this.data.fastId;
        app.appRequestAction({
            title: "正在提交数据",
            mask: true,
            failTitle: "网络错误，信息保存失败！",
            url: "fast-check-code/",
            way: "POST",
            params: userinfo,
            success: function (res) {
                let mydata = res.data;
                app.showMyTips(mydata.errmsg);
                //console.log(mydata);
                if (mydata.errcode == "ok") {
                    let hasUser = _this.data.hasUser;
                    wx.navigateTo({
                        url: hasUser ? '/pages/fast-issue/lists/lists' : '/pages/fast-issue/tips/tips',
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initPageAction();
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
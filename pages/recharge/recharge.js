// pages/recharge/recharge.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        rechargeData:[],
        activeIndex:1,
        integral:0,
    },
    chooseThisMoney:function(e){
        let _index = e.currentTarget.dataset.index;
        this.setData({
            activeIndex: parseInt(_index)
        })
    },
    initUserInfo:function(){
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo:userInfo });
        app.appRequestAction({
            url:"integral/integral-price/",
            way:"POST",
            params:userInfo,
            success:function(res){
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                    let _list = mydata.list;
                    for(let i = 0;i<_list.length;i++){
                        if(_list[i].default == "1"){
                            _this.setData({ activeIndex:i });
                        }
                    }
                    _this.setData({ 
                        rechargeData:mydata.list,
                        integral:mydata.user.integral
                    })
                }else{
                    app.returnPrevPage(mydata.errmsg);
                }
            },
            fail:function(){
                app.returnPrevPage("网络异常，数据加载失败！");
            }
        })
    },
    userRechargeAction:function(){
        let userInfo = this.data.userInfo;
        let _this = this;
        wx.login({
            success:function(res){
                app.appRequestAction({
                    url: "get-openid/",
                    way: "POST",
                    params: { js_code: res.code },
                    failTitle:"网络异常，发起支付失败！",
                    success: function (resd) {
                        let openid = resd.data.openid
                        let priceType = _this.data.rechargeData[_this.data.activeIndex].id;
                        userInfo.openid = openid
                        userInfo.priceType = priceType
                        app.appRequestAction({
                            url: "create-order/",
                            way: "POST",
                            failTitle:"网络异常，发起支付失败！",
                            params: userInfo,
                            success: function (resd) {
                                console.log(resd)
                                let result = resd.data.payData
                                console.log(res)
                                wx.requestPayment({
                                    appId: result.appId,
                                    timeStamp: result.timeStamp,
                                    nonceStr: result.nonceStr,
                                    package: result.package,
                                    signType: result.signType,
                                    paySign: result.paySign,
                                    success: function (resss) {
                                        let _i = parseInt(_this.data.integral) + parseInt(_this.data.rechargeData[_this.data.activeIndex].integral);
                                        _this.setData({ integral:_i });
                                        wx.showModal({
                                            title: '恭喜您',
                                            content: '您已经成功充值' + _this.data.rechargeData[_this.data.activeIndex].integral+'个积分',
                                            cancelText:"会员中心",
                                            confirmText:"继续充值",
                                            success:function(res){
                                                if (res.cancel) {
                                                    wx.reLaunch({
                                                        url: '/pages/ucenter/ucenter',
                                                    })
                                                }
                                            }
                                        })
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
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
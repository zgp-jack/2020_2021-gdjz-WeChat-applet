// pages/getintegral/getintegral.js goThisPage
const app = getApp();
const ads = require('../../utils/ad')
let videoAd = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showRecharge:false,
        phone: "",
        showad: true,
        title: '',
        content: '',
        total: 0,
        times: 0,
        have:0,
        tips: app.globalData.userSeeVideoTips,
        showAd: false,
        icon: app.globalData.apiImgUrl + 'integral/new-integral-tips-icon.png'
    },
    callThisPhone:function(e){
        let phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    goThisPage:function(e){
        let _url = e.currentTarget.dataset.url;
        wx.navigateTo({ url: _url })
    },
    initGetIntegralList:function(){
        let _this = this;
        app.initSystemInfo(function(res){
            if (res && res.platform != "ios"){
                _this.setData({
                    showRecharge: true
                })
            }
        })
    },
    userSeeVideo:function(){
        if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    //两次展示广告失败，直接获得奖励
                    console.log('两次展示广告失败，直接获得奖励')
                    this.videoAdStop()
                })
            })
        }
    },
    userClickVideoBtn:function(){
        let _this = this
        let have = this.data.have
        let tips = this.data.tips
        if(!have){
            _this.selectComponent("#minitoast").showToast(tips)
            //app.showMyTips(tips)
            return
        }
        app.valiUserVideoAdStatus(function(data){
            if(data.errcode == 'ok'){
                _this.userSeeVideo()
                let total = data.total
                let times = data.times
                if(total - times <= 0){
                    _this.selectComponent("#minitoast").showToast(tips)
                    //app.showMyTips(tips)
                    return 
                }
            }else if(data.errcode == 'to_invited'){
                let showtips = data.data.tips
                _this.setData({
                    tips: showtips
                })
                _this.selectComponent("#minitoast").showToast(showtips)
                //app.showMyTips(showtips)
            }else{
                _this.selectComponent("#minitoast").showToast(data.errmsg)
                //app.showMyTips(data.errmsg)
            }
        })
    },
    createVideo:function(){
        let _this = this
        
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: ads.videoAd
            })
            videoAd.onLoad(() => {
                this.setData({
                    showad: true
                })
            })
            videoAd.onError((err) => {
                
            })
            videoAd.onClose((status) => {
                if (status && status.isEnded || status === undefined) {
                    this.videoAdStop()
                }
                
            })
        }
    },
    videoAdStop:function(){
        let _this = this
        app.userGetTempIntegral(0,function(mydata){
            
            if(mydata.errcode == "ok"){
                let times = _this.data.total - mydata.data.times
                _this.setData({
                    have: mydata.data.times,
                    times: times < 0 ? 0 : times
                })
            }else if(mydata.errcode == "to_invited"){
                _this.setData({
                    have: 0,
                    times: mydata.data.total
                })
            }
        })
    },
    initVideoAd:function(){
        let userinfo = wx.getStorageSync('userInfo')
        userinfo.mid = userinfo.userId
        let _this = this
        app.appRequestAction({
            url: 'integral/adv-introduce/',
            way: 'POST',
            params: userinfo,
            success: function(res){
              let mydata = res.data
              let have = mydata.data.totalTimes - mydata.data.usedTimes
                _this.setData({
                    title: mydata.data.title,
                    content: mydata.data.describe,
                    total: mydata.data.totalTimes,
                    times: mydata.data.usedTimes,
                    have: have < 0 ? 0 : have
                })
            },
            fail:()=>{
              app.showMyTips('网络错误，加载失败！')
            }
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //this.initVideoAd()
        this.setData({ phone:app.globalData.serverPhone })
        this.initGetIntegralList();
        //this.createVideo()
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
        videoAd = null
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

})
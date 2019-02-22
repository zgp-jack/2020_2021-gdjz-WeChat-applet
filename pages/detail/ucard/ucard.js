// pages/ucard/ucard.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: { 
        infoId:"",
        userInfo:{},
        ucardInfo:{},
        isShare:false,
        shareMsg:"",
        shareFlag:false,
        showComplain:false,
        complainInfo:"",
    },
    previewImage:function(e){
        let src = e.currentTarget.dataset.src;   
        let _this = this; 
        wx.previewImage({
            current: src, 
            urls: _this.data.ucardInfo.view_images 
        })
    },
    callThisPhone:function(e){
        app.callThisPhone(e);
    },
    initUcardInfo: function (options){
        let _this = this;
        let id = options.id;
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo:userInfo,infoId:id });
        userInfo.infoId = id;
        userInfo.type = "resume";
        app.appRequestAction({
            url:"resume/resume-info/",
            way:"POST",
            params:userInfo,
            success:function(res){
                let mydata = res.data;
                _this.setData({ ucardInfo: mydata.result })
                _this.doDetailAction(mydata,{
                    success:function(){},
                    share:function(){
                        _this.setData({
                            shareFlag: true,
                            isShare: true,
                            shareMsg: mydata.errmsg
                        })
                    }
                });
            },
            fail:function(){
                wx.showModal({
                    title: '温馨提示',
                    content: '网络错误，加载失败！',
                    showCancel:false,
                    success(res) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        })
    },
    doDetailAction:function(mydata,_obj){
        if ((mydata.errcode == "ok") || (mydata.errcode == "end") || (mydata.errcode == "ajax")) { //获取成功、已找到
            _obj.success();
        } else if (mydata.errcode == "auth_not_pass") {  //实名未通过、（进入实名）
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                showCancel: false,
                success(res) {
                    wx.navigateTo({
                        url: '/pages/realname/realname',
                    })
                }
            })
        } else if (mydata.errcode == "to_auth") { //是否进入实名 （取消=>返回、确定=>实名）
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                cancelText: "返回列表",
                confirmText: "实名认证",
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/realname/realname',
                        })
                    } else if (res.cancel) {
                        wx.navigateBack({ delta: 1 })
                    }

                }
            })
        } else if (mydata.errcode == "none_tel") { //绑定手机
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                cancelText: "返回列表",
                confirmText: "绑定手机",
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/userinfo/edit/edit',
                        })
                    } else if (res.cancel) {
                        wx.navigateBack({ delta: 1 })
                    }

                }
            })
        } else if (mydata.errcode == "to_share") { //分享
            _obj.share();
        } else if (mydata.errcode == "get_integral") { //积分不足 是否前往获取积分
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                cancelText: "返回列表",
                confirmText: "获取积分",
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/getintegral/getintegral',
                        })
                    } else if (res.cancel) {
                        wx.navigateBack({ delta: 1 })
                    }

                }
            })
        } else {  //用户异常、用户验证失败
            wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                showCancel: false,
                confirmText: "我知道了",
                success(res) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        }
    },
    getInfoTel:function(){
        let _this = this;
        let userInfo = this.data.userInfo;
        let infoId = this.data.infoId;
        userInfo.infoId = infoId;
        userInfo.type = "resume";
        app.appRequestAction({
            url:"resume/get-tel/",
            way:"POST",
            params:userInfo,
            success:function(res){
                let mydata = res.data;
                _this.doDetailAction(mydata, {
                    success: function () {
                        _this.setData({ 
                            "ucardInfo.tel_str": mydata.tel,
                            "ucardInfo.show_ajax_btn":false
                        })
                    },
                    share: function () {
                        _this.setData({
                            "ucardInfo.tel_str": mydata.tel,
                            "ucardInfo.show_ajax_btn": false,
                            shareFlag:true,
                            isShare: true,
                            shareMsg:mydata.errmsg
                        })
                    }
                });
            }
        })
    },
    userEnterComplain:function(e){
        this.setData({ complainInfo : e.detail.value })
    },
    userTapComplain:function(){
        this.setData({ showComplain : true })
    },
    userCancleComplain:function(){
        this.setData({ showComplain: false })
    },
    userComplaintAction: function () {
        let _this = this;
        let userInfo = this.data.userInfo;
        let infoId = this.data.infoId;
        let info = this.data.complainInfo;
        if(info == ""){
            app.showMyTips("请输入您的投诉内容");
            return  false;
        }
        app.appRequestAction({
            url:"publish/complain/",
            way:"POST",
            params:{
                userId:userInfo.userId,
                token:userInfo.token,
                tokenTime:userInfo.tokenTime,
                infoId: infoId,
                type:"resume",
                content: info
            },
            title:"正在提交投诉",
            failTitle:"网络错误，投诉失败！",
            success:function(res){
                let mydata = res.data;
                app.showMyTips(mydata.errmsg);
                if (mydata.errcode == "ok") _this.setData({ showComplain: false })
            }
        })
    },
    userShareAddIntegral:function(){
        let userInfo = wx.getStorageSync("userInfo");
        app.appRequestAction({
            url:"user/user-share/",
            way:"POST",
            params:userInfo,
            success:function(){},
            fail:function(){}
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUcardInfo(options);
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
        if (this.data.shareFlag) this.userShareAddIntegral();
        let userId = this.data.userInfo.userId
        let _this = this;
        setTimeout(function(){
            _this.setData({ isShare:false })
        },500);
        return {
            title: app.globalData.commonShareTips,
            path: '/pages/index/index?refid=' + userId,
            imageUrl: app.globalData.commonShareImg
        }
    }
})
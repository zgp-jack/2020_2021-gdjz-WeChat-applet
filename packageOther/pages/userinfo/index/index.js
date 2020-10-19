// pages/userinfo/index/index.js
let vali = require("../../../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        allowEditName:false,
        userName:"",
        member:{},
    },
    initUserinfo: function (options){
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ 
            userInfo:userInfo,
            userName: options.name,
            member : {
                img: options.img,
                auth: options.auth,
                tel: options.tel,
                name: options.name,
                pass: options.pass
            }
        });
    },
    allowUserEntername:function(e){
        let auth = parseInt(e.currentTarget.dataset.auth);
        if(auth > 0) return false
        this.setData({ allowEditName:true })
    },
    userEntername:function(e){
        let value = e.detail.value
        this.setData({
            userName: value
        })
    },
    cancleEditInfo:function(){
        this.setData({ allowEditName: false })
    },
    sureEditInfo:function(){
        let v = vali.v.new();
        let _this = this;
        let username = this.data.userName
        let userInfo = this.data.userInfo;
        if (!v.chineseReg(username)) {
            app.showMyTips("请输入2~5字纯中文姓名！");
            return false; 
        }
        wx.showLoading({ title: '正在修改姓名' })
        app.doRequestAction({
            url:"user/update-username/",
            way:"POST",
            params:{
                userId:userInfo.userId,
                token:userInfo.token,
                tokenTime:userInfo.tokenTime,
                username:_this.data.userName
            },
            success:function(res){
                wx.hideLoading();
                let mydata = res.data;
                app.showMyTips(mydata.errmsg);
                if(mydata.errcode == "ok"){
                    _this.setData({
                        "member.name": _this.data.userName,
                        allowEditName: false,
                    })
                }
                
            },
            fail:function(){
                wx.hideLoading();
                app.showMyTips("网络出错,修改失败！")
            }
        })
    },
    userUplodImg:function(){
        let _this = this;
        let userInfo = this.data.userInfo;
        app.userUploadImg(function (imgRes,mydata){
            app.doRequestAction({
                url:"user/update-header/",
                way:"POST",
                params:{
                    userId:userInfo.userId,
                    token:userInfo.token,
                    tokenTime:userInfo.tokenTime,
                    headerImg: mydata.url
                },
                success:function(res){
                    wx.hideLoading();
                    let _data = res.data;
                    app.showMyTips(_data.errmsg);
                    if(_data.errcode == "ok"){
                        _this.setData({
                            "member.img": imgRes.tempFilePaths ? imgRes.tempFilePaths[0]:imgRes
                        })
                    }
                },
                fail:function(){
                    wx.hideLoading();
                    app.showMyTips("网络出错，上传失败！");
                }
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUserinfo(options);
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
        wx.reLaunch({
            url: '/pages/ucenter/ucenter',
        })
        return false;
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
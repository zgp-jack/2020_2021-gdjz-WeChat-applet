// pages/feedback/feedback.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        normalImg: app.globalData.apiImgUrl + "uploads.png",
        delImg: app.globalData.apiImgUrl + "del.png",
        imgs:[],
        imglists:[],
        maxLen:9,
        userInfo:"",
        content:"",
        wechat:"",
        phone:""
    },
    userUploadsImg:function(e){
        let _type = parseInt(e.currentTarget.dataset.type); 
        let _index = parseInt(e.currentTarget.dataset.index); 
        let _this = this;
        app.userUploadImg(function(imgRes,mydata){
            wx.hideLoading();
            wx.showToast({
                title: mydata.errmsg,
                icon: "none",
                duration: 2000
            })
            let imgs = _this.data.imgs;
            let imglists = _this.data.imglists;
            if (_type == 0) {
                imgs[_index] = mydata.url;
                imglists[_index] = imgRes.tempFilePaths[0];
            } else {
                imgs.push(mydata.url)
                imglists.push(imgRes.tempFilePaths[0])
            }
            _this.setData({ imgs: imgs, imglists: imglists })
        })
    },
    userEnterContent:function(e){
        this.setData({
            content: e.detail .value
        })
    },
    delThisImg:function(e){
        let index = parseInt(e.currentTarget.dataset.index);
        let imgs = this.data.imgs;
        let imglists = this.data.imglists;
        imgs.splice(index, 1);
        imglists.splice(index,1);
        this.setData({
            imgs: imgs,
            imglists: imglists
        })
    },
    userSubmitFeedback:function(){
        let _this = this;
        let userInfo = this.data.userInfo;
        let imgs = this.data.imgs;
        let content = this.data.content
        content = content.replace(/^\s+|\s+$/g, '');
        if (!content){
            wx.showToast({
                title: "请输入留言内容！",
                icon: "none",
                duration: 2000
            })
            return false;
        }
        wx.showLoading({ title: '正在留言' })
        app.doRequestAction({
            url:"index/leaving-message/",
            way:"POST",
            params:{
                userId:userInfo.userId,
                token:userInfo.token,
                tokenTime:userInfo.tokenTime,
                images:imgs,
                content: content
            },
            success:function(res){
                wx.hideLoading();
                let mydata = res.data;
                wx.showToast({
                    title: mydata.errmsg,
                    icon: "none",
                    duration: 2000
                })
                if(mydata.errcode == "ok"){
                    wx.showModal({
                        title: '系统提示',
                        content: mydata.errmsg,
                        showCancel:false,
                        success:function(res){
                            wx.navigateBack({ delta:1  })
                        }
                    })
                }
            },
            fail:function(){
                wx.hideLoading();
                wx.showToast({
                    title: "网络错误，留言失败！",
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    initNeedData: function () {
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = this.data.userInfo;
        let _time = Date.parse(new Date());
        if (_wx && _wx.expirTime) {
            if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        app.doRequestAction({
            url: "index/search-data/",
            params: {
                type: "job",
                userId: _mark ? (userInfo.userId ? userInfo.userId : "") : "",
            },
            success: function (res) {
                let mydata = res.data;
                _this.setData({
                    phone: mydata.phone,
                    wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number)
                })
                if (_mark) {
                    let extime = _time + (mydata.wechat.outTime * 1000);
                    wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime });
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '数据加载失败！',
                    icon: "none",
                    duration: 3000
                })
            }
        })
    },
    callThisPhone:function(e){
        app.callThisPhone(e);
    },
    clipboardWechat: function (e) {
        let wechat = e.currentTarget.dataset.wc;
        wx.setClipboardData({
            data: wechat,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    title: '恭喜您',
                    content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
                    showCancel:false,
                    success:function(){}
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    initUploadImgsApi:function(){
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ 
            userInfo: userInfo
        })
        this.initNeedData();
    },
    onLoad: function (options) {
        this.initUploadImgsApi();
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
// pages/published/published.js
let footerjs = require("../../utils/footer.js");
let pd = require("../../utils/p.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        footerActive: "member",
        areaLists:["全国","省"],
        areaIntegral:[100,20],
        areaIndex:0,
        publishIndex:0,
        costIntegral:100,
        inputValue:1,
        showSetTop:false,
        infoId:0,
        infoIndex:"",
        apiUrlLink: ["job/published-jobs/","fleamarket/published-market/"],
        apiSetTopLink: ["job/update-top-status/","fleamarket/update-time/"],
        apiStatusLink: ["job/job-end-status/","fleamarket/fleamarket-end-status/"],
        publishedTitle:["我发布的招工信息","我发布的二手交易信息"],
        nodataImg: app.globalData.apiImgUrl + "nodata.png",
        isFirstRequest:true,
        page:1,
        lists:[],
        userInfo:"",
        pageSize:20,
        showNoData:false,
        nothavamore:false,
        publishedData: [
            {
                title: '招工信息',
                normalImg: app.globalData.apiImgUrl + "published-zg.png",
                activeImg: app.globalData.apiImgUrl + "published-zg-active.png",
            },
            {
                title: '二手交易',
                normalImg: app.globalData.apiImgUrl + "published-ershou.png",
                activeImg: app.globalData.apiImgUrl + "published-ershou-active.png",
            }
        ],
        publishedImg:{
            edit: app.globalData.apiImgUrl + "detail-edit.png",
            wzz: app.globalData.apiImgUrl + "detail-wzz.png",
            yzd: app.globalData.apiImgUrl + "detail-yzd.png",
            top: app.globalData.apiImgUrl + "detail-top.png",
            wzd: app.globalData.apiImgUrl + "detail-wzd.png",
            time: app.globalData.apiImgUrl + "published-djs.png",
        },
        pd: pd.pd,
        ids:[2,6,7,11,16],
        newTopShow:false,
      collecticon: app.globalData.apiImgUrl + "collect-tipicon.png",
      collecthand: app.globalData.apiImgUrl + "collect-tiphand.png",
      showCollectTips:false
    },
    bindAreaChange:function(e){
        this.setData({ areaIndex: e.detail.value })
        this.calcCostIntegral();
    },
    userEnterTopDay:function(e){
        this.setData({ inputValue: e.detail.value })
        this.calcCostIntegral();
    },
    calcCostIntegral:function(){
        this.setData({
            costIntegral: this.data.areaIntegral[this.data.areaIndex] * this.data.inputValue
        })
    },
    cancleSetTop:function(){
        this.setData({
            showSetTop:false,
            inputValue:1,
            areaIndex:0,
            costIntegral:100
        })
    },
    sureSetTop:function(){
        let infoId = this.data.infoId;
        let userInfo = this.data.userInfo;
        let day = this.data.inputValue;
        let monty = this.data.costIntegral;
        let areaIndex = this.data.areaIndex;
        let infoIndex = parseInt(this.data.infoIndex);
        let _this = this;
        wx.showLoading({ title: '加载中' })
        app.doRequestAction({
            url:"job/set-job-top/",
            way:"POST",
            params:{
                userId:userInfo.userId,
                token:userInfo.token,
                tokenTime:userInfo.tokenTime,
                infoId: infoId,
                money: monty,
                day: day,
                level: parseInt(areaIndex) + 1
            },
            success:function(res){
                wx.hideLoading();
                let mydata = res.data;
                if(mydata.errcode == "integralBad"){
                    wx.showModal({
                        title: '设置急招失败',
                        content: mydata.errmsg,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/getintegral/getintegral',
                                })
                            } else if (res.cancel) {
                                _this.cancleSetTop();
                                
                            }
                        }
                    });
                }else{
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: "none",
                        duration: 2000
                    })
                    if(mydata.errcode == "ok"){
                        _this.cancleSetTop();
                        let newData = _this.data.lists;
                        newData[infoIndex] = mydata.data;
                        _this.setData({ lists: newData })
                    }
                }
            },
            fail:function(res){
                wx.hideLoading();
                wx.showToast({
                    title: "网络错误，设置急招失败！",
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    showThisList:function(e){
        let index = e.currentTarget.dataset.index;
        wx.setNavigationBarTitle({ title: (index == "1") ? "鱼泡网-我发布的二手交易" : "鱼泡网-我发布的招工" })
        if (this.data.publishIndex == index) return false;
        this.setData({
            publishIndex: index,
            page:1,
            lists:[],
            showNoData:false,
            nothavamore:false,
            isFirstRequest:true
        })
        this.getPublishedData();
    },
    initPublishedData: function (options){
        if (options && options.hasOwnProperty("type")){
            this.setData({ publishIndex: parseInt(options.type) })
            wx.setNavigationBarTitle({ title: (options.type == "1") ? "鱼泡网-我发布的二手交易" : "鱼泡网-我发布的招工" })
        }
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo: userInfo })
        this.getPublishedData();
    },
    getPublishedData:function(){
        let _this = this;
        let _index = this.data.publishIndex
        let userInfo = this.data.userInfo
        wx.showLoading({ title: '数据加载中', })
        app.doRequestAction({
            url: _this.data.apiUrlLink[_index],
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime:userInfo.tokenTime,
                page: _this.data.page
            },
            success: function (res) {
                wx.hideLoading()
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    if (mydata.data.length > 0) {
                        let newData = _this.data.lists;
                        if(_this.data.page != 1){
                            for(let i =0;i<mydata.data.length;i++){
                                newData.push(mydata.data[i])
                            }
                        }
                        _this.setData({
                            lists: (_this.data.page == 1) ? mydata.data : newData,
                            pageSize: mydata.pageSize,
                            isFirstRequest : false
                        })
                        setTimeout(function(){
                            _this.setData({ nothavamore: (mydata.data.length < _this.data.pageSize) ? true : false, })
                        },0)
                    } else {
                        _this.setData({
                            showNoData: _this.data.isFirstRequest ? true : false,
                            nothavamore: _this.data.isFirstRequest ? false : true,
                        })
                    }
                } else {
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: "none",
                        duration: 2000
                    })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: '网络出错，数据加载失败！',
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    setThisTop:function(e){
        let _id = e.currentTarget.dataset.id;
        let _index = this.data.publishIndex;
        let infoIndex = e.currentTarget.dataset.index;
        let status = e.currentTarget.dataset.status;
        let userInfo = this.data.userInfo;
        let _this = this;
        this.setData({ infoId: _id, infoIndex: infoIndex })
        if(_index == 1){
            wx.showLoading({ title: '正在执行操作' })
            app.doRequestAction({
                url: _this.data.apiSetTopLink[_index],
                way: "POST",
                params: {
                    userId: userInfo.userId,
                    token: userInfo.token,
                    tokenTime: userInfo.tokenTime,
                    infoId: _id
                },
                success: function (res) {
                    wx.hideLoading();
                    let mydata = res.data;
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: "none",
                        duration:1500
                    })
                    if (mydata.errcode == "ok") {
                        let rowData = _this.data.lists[infoIndex];
                        let reData = _this.data.lists;
                        reData.splice(infoIndex,1);
                        reData.unshift(rowData);
                        _this.setData({
                            lists: reData
                        })
                    }
                },
                fail: function (err) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "网络不太好，操作失败！",
                        icon: "none",
                        duration: 3000
                    })
                }
            })
        }else{
            wx.showLoading({ title: '正在执行操作' })
            app.doRequestAction({
                url: _this.data.apiSetTopLink[_index],
                way: "POST",
                params: {
                    userId: userInfo.userId,
                    token: userInfo.token,
                    tokenTime: userInfo.tokenTime,
                    infoId: _id,
                    status: status ? status : "0"
                },
                success: function (res) {
                    wx.hideLoading();
                    let mydata = res.data;
                    if(mydata.errcode == "ok"){
                        let newData = _this.data.lists;
                        newData[infoIndex] = mydata.data;
                        _this.setData({ lists: newData })
                    }
                    if(mydata.errcode == "outTime"){
                        _this.setData({
                            showSetTop:true
                        })
                    }else{
                        wx.showToast({
                            title: mydata.errmsg,
                            icon: "none",
                            duration: 1500
                        })
                    }
                },
                fail: function (err) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "网络不太好，操作失败！",
                        icon: "none",
                        duration: 3000
                    })
                }
            })
        }
        
    },
    setInfoStatus:function(e){
        let _id = e.currentTarget.dataset.id;
        let _index = this.data.publishIndex;
        let infoIndex = e.currentTarget.dataset.index;
        let userInfo = this.data.userInfo;
        let _this = this;
        wx.showLoading({ title: '正在修改状态' })
        app.doRequestAction({
            way:"POST",
            url: _this.data.apiStatusLink[_this.data.publishIndex],
            params:{
                userId:userInfo.userId,
                token:userInfo.token,
                tokenTime:userInfo.tokenTime,
                infoId: _id
            },
            success:function(res){
                wx.hideLoading();
                let mydata = res.data;
                wx.showToast({
                    title: mydata.errmsg,
                    icon: "none",
                    duration: 1500
                })
                if(mydata.errcode == "ok"){
                    let newData = _this.data.lists;
                    newData[infoIndex] = mydata.data;
                    _this.setData({ lists: newData })
                }
            },
            fail:function(){
                wx.hideLoading();
                wx.showToast({
                    title: "网络不太好，操作失败！",
                    icon: "none",
                    duration: 3000
                })
            }
        })
    },

    //选择多省份
    setThisTop1:function(e){
        this.setData({ newTopShow:true })
        let id = e.currentTarget.dataset.id;
        let ids = e.currentTarget.dataset.ids;
        this.initJobPd(ids);
    },
    checkboxChange:function(e){
        let ids = e.detail.value;
        this.initJobPd(ids);
    },
    initJobPd:function(ids){
        let p = app.arrDeepCopy(this.data.pd);
        let _pd = p.map(item => {
            for (let i = 0; i < ids.length; i++) {
                let itemId = parseInt(ids[i]);
                let id = parseInt(item.id);
                item.checked = false;
                if(itemId == id){
                    item.checked = true;
                    break;
                }
            }
            return item;
        })
        //console.log(_pd);
        this.setData({ pd: _pd });
    },
    closeNewTop:function(){
        this.setData({ newTopShow:false });
    },
    sureNewTop:function(){
        
    },
    // 共用footer
    jumpThisLink: function (e) {
        app.jumpThisLink(e);
    },
    initFooterData: function () {
        this.setData({
            footerImgs: footerjs.footerImgs,
            publishActive: footerjs.publishActive,
            showPublishBox: footerjs.showPublishBox
        })
    },
    doPublishAction: function () {
        footerjs.doPublishAction(this);
    },
    closePublishAction: function () {
        footerjs.closePublishAction(this);
    },
    valiUserCard: function () {
        let userInfo = this.data.userInfo;
        footerjs.valiUserCard(this, app, userInfo);
  }, 
  initCollectTips: function(options){
    if (options.hasOwnProperty("jz")) this.setData({ showCollectTips:true })
  },
  closeCollect:function(){
    this.setData({ showCollectTips: false })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initFooterData();
        this.initPublishedData(options);
        this.initCollectTips(options);
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
        if (this.data.isFirstRequest || this.data.showNoData || this.data.nothavamore) return false;
        this.setData({
            page:this.data.page + 1
        })
        this.getPublishedData();
    },

})
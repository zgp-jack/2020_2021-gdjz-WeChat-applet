// pages/published/published.js  lists
let footerjs = require("../../../../utils/footer.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerActive: "member",
    finded: app.globalData.apiImgUrl + "lpy/finded.png",
    nodataImg: app.globalData.apiImgUrl + "collect-nodata.png",
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    isFirstRequest: true,
    page: 1,
    lists: [],
    userInfo: "",
    pageSize: 15,
    showNoData: false,
    nothavamore: false,
    realNames: app.globalData.apiImgUrl + 'newresume-infolist-ysm.png', 
    authentication:app.globalData.apiImgUrl + "new-list-jnzs-icon.png",
    collectIcon: {
      infoIcon: app.globalData.apiImgUrl + "new-collect-info.png",
      infoTitle: '招工信息',
      resumeIcon: app.globalData.apiImgUrl + "new-collect-resume-active.png",
      resumeTitle: '找活信息'
    },
    resumeText:""
  },
  // 根据发布方式不同发布招工：未登录或者“fast_add_job”是快速发布，“ordinary_add_job”是普通发布。
  publishJob:function () {
    app.initJobView()
  },
  showThisList: function (e) {
    wx.redirectTo({ url: "/packageOther/pages/collect/info/info" })
  },
  initPublishedData: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo })
    this.getPublishedData();
  },
  getPublishedData: function () {
    let _this = this;
    let userLocation = wx.getStorageSync("userLocation");
    let _index = this.data.publishIndex
    let userInfo = this.data.userInfo
    wx.showLoading({ title: '数据加载中', })
    app.doRequestAction({
      url: "resumes/collect-resume-list/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        page: _this.data.page,
        location: userLocation ? userLocation.split(",").reverse().join(",") : '',
      },
      success: function (res) {
        wx.hideLoading()
        let mydata = res.data;
        console.log(mydata);
        if (mydata.errcode == "200") {
          if (mydata.list.length > 0) {
            let newData = _this.data.lists;
            if (_this.data.page != 1) {
              for (let i = 0; i < mydata.list.length; i++) {
                newData.push(mydata.list[i])
              }
            }
            console.log(_this.data.page)
            _this.setData({
              lists: (_this.data.page == 1) ? mydata.list : newData,
              pageSize: mydata.pageSize ? mydata.pageSize : 15,
              isFirstRequest: false
            })
            setTimeout(function () {
              _this.setData({ nothavamore: (mydata.list.length < _this.data.pageSize) ? true : false, })
            }, 0)
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
  cancleCollect: function (e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let userInfo = wx.getStorageSync("userInfo");
    let data = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      resume_uuid: id
    };

    app.appRequestAction({
      url: "resumes/resume-collect/",
      way: "POST",
      mask: true,
      params: data,
      title: "操作中",
      failTitle: "网络错误，操作失败！",
      success: function (res) {
        let mydata = res.data;
        app.showMyTips(mydata.errmsg);
        if (mydata.errcode == "ok") {
          let list = app.arrDeepCopy(_this.data.lists);
          list.splice(index, 1);
          _this.setData({ "lists": list })
        }
      }
    })

  },
  showCollectInfo: function (e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let msg = e.currentTarget.dataset.msg;
    let tips = e.currentTarget.dataset.tips;
    let uuid = e.currentTarget.dataset.uuid;
    let view = e.currentTarget.dataset.view;
    let viewMsg = e.currentTarget.dataset.viewmsg
    let _id = e.currentTarget.dataset.id
    let _this = this
    if (!view) {
      wx.showModal({
        showCancel: false,
        content: viewMsg,
        success: function () {
          //点击已经被删除的信息 提示已下架-点击确定删除该信息
          let itemListData = _this.data.lists
          for(let i = 0 ;i<itemListData.length;i++){
            if(itemListData[i].id == _id){
              itemListData.splice(i,1)
              _this.setData({
                lists:itemListData
              })
            }
          }
        }
      })
      return
    }
    if (msg == "1") {
      wx.showModal({
        title: '温馨提示',
        content: tips,
        showCancel: false
      })
      return false;
    }
    else{
      let userLocation = wx.getStorageSync("userLocation")
      if (!userLocation) {
        userLocation = ""
      } else {
        userLocation = userLocation.split(",").reverse().join(",")
      }
      let uuid = e.currentTarget.dataset.uuid
      wx.navigateTo({
        url: `/pages/boss-look-card/lookcard?uuid=${uuid}&location=${userLocation}`
      })
    }
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
    footerjs.initMsgNum(this);
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
  errImg:function(e){
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let obj = `lists[${index}].resume.headerimg`;
    this.setData({
      [obj]: "http://cdn.yupao.com/miniprogram/images/user.png"
    })
  },
  //点击跳转到找活列表界面
  goFindWork:function () {
    wx.reLaunch({
      url: '/pages/findingworkinglist/findingworkinglist',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initFooterData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.setData({ isFirstRequest: true, lists: [], page: 1 })
    this.initPublishedData(options);
    app.initResume(this)
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
      page: this.data.page + 1
    })
    this.getPublishedData();
  },

})
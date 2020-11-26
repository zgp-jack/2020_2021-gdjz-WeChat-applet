// pages/information/mymessage/mymessage.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    userInfo: true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    // newmessage:{
    //   type1:'/pages/information/system/system',// 1 系统消息
    //   type2:'/pages/information/wanted/wanted',// 2 招工信息
    //   type3:'/pages/information/recruit/recruit',// 3 名片信息
    //   type7:'/pages/information/leaveword/leaveword',// 7 留言信息
    //   type6:'/pages/information/complain/complain'// 6 投诉信息
    // },
    listsImg: {
      nodata: app.globalData.apiImgUrl + "nodata.png",
    },
  },
  //  }
  valiUserUrl: function (e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      // url: this.data.newmessage[jtype] + "?type="+type
      url: '/pages/information/system/system' + "?type="+type
    })
  },
  initGetIntegralList:function(){
    let _this = this;
    app.initSystemInfo(function(res){
        if (res && res.platform == "ios"){
            _this.terminal_type='ios'
        }else if( res && res.platform != "ios"){
            _this.terminal_type= 'android'
        }
    })
  },
  getMymessage: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    this.setData({ userInfo: userInfo ? userInfo : false})
    if (!userInfo) return false;
    _this.initGetIntegralList()
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: "member/user-messages/",
      way: "POST",
      params: { terminal_type:_this.terminal_type },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;
        if (mydata.errcode == "ok") {
            _this.setData({
              lists: mydata.data.lists,
            })
        } else {
            wx.showToast({
                title: mydata.errmsg,
                icon: "none",
                duration: 5000
            })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败，请稍后重试！',
          icon: "none",
          duration: 5000
        })
      }
    })
  },
  
  returnPrevPage() {
    wx.reLaunch({
        url: '/pages/index/index',
    })
  },
  bindGetUserInfo: function(e) {
      let that = this;
      app.bindGetUserInfo(e, function(res) {
          app.mini_user(res, function(res) {
              app.api_user(res, function(res) {
                  let uinfo = res.data;
                  if (uinfo.errcode == "ok") {
                    let userInfo = {
                        userId: uinfo.data.id,
                        token: uinfo.data.sign.token,
                        tokenTime: uinfo.data.sign.time,
                    }
                    let userUuid = uinfo.data.uuid;
                    app.globalData.userInfo = userInfo;
                    wx.setStorageSync('userInfo', userInfo)
                    wx.setStorageSync('userUuid', userUuid)
                    that.setData({ userInfo: userInfo,userUuid:userUuid });
                    that.getMymessage();
                  } else {
                      app.showMyTips(uinfo.errmsg);
                  }
              });
          });
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.activeRefresh()
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
    this.getMymessage()
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
})
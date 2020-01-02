// pages/information/system/system.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    userInfo: true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    newmessage:{
      type1:'/pages/realname/realname',      // 1 系统信息
      type2:'/pages/integral/source/source', // 2 招工信息
      type3:'/pages/realname/realname',      // 3 名片信息
      type4:'/pages/integral/source/source', // 4 证书信息
      type5:'/pages/realname/realname',      // 5 项目信息
      type6:'/pages/integral/source/source', // 6 投诉招工信息
      type7:'/pages/realname/realname',      // 7 留言信息
      type8:'/pages/integral/source/source', // 8 积分管理-充值
      type9:'/pages/realname/realname',      // 9 实名认证
      type10:'/pages/realname/realname',     // 9 投诉找活信息
    },
    isEnd: false,
    page:1,
    listsImg: {
      nodata: app.globalData.apiImgUrl + "nodata.png",
    },
    lists:[],
      
    // {
    //   "1": "系统信息",
    //   "2": "招工信息",
    //   "3": "名片信息",
    //   "4": "证书信息",
    //   "5": "项目信息",
    //   "7": "留言信息",
    //   "6": "投诉招工信息",
    //   "10": "投诉找活信息",
    //   "8": "积分管理",
    //   "9": "实名认证"
  },

  getMymessage: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    this.setData({ userInfo: userInfo })
    if (!userInfo) return false;
    wx.showLoading({ title: '数据加载中' })
    app.doRequestAction({
      url: "member/message-of-type/",
      way: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        mid: userInfo.userId,
        token: userInfo.token,
        time: userInfo.tokenTime,
        uuid: userUuid,
      },
      params: {
        type:_this.data.type,
        page: _this.data.page,
    },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;
        if (mydata.errcode == "ok") {
            let _list = _this.data.lists;
            let _lists = mydata.data.lists;

            if(_lists.length == 0){
                _this.setData({ isEnd:true})
            }else{
                let mylist = _list.concat(_lists);
                let _page = _this.data.page + 1;
                _this.setData({ lists: mylist, page: _page});
            }
        } else {
            wx.showToast({
                title: mydata.errmsg,
                icon: 'none',
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
  valiUserUrl:function(){
    let type = this.data.type
    console.log(type,"type")
    let jtype = "type" + type
    wx.navigateTo({
      url: this.data.newmessage[jtype] 
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
    let type =options.type
    this.setData({
      type: type
    })
    this.getMymessage()
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
    if(this.data.isEnd) return false;
    this.getMymessage()
  }
})
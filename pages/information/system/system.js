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
    homebtnImg: app.globalData.apiImgUrl + "yp-return-jobinfo.png",
    newmessage:{
                                             // 1 系统信息
      type2:'/pages/published/published',            // 2 招工信息
      type3:'/pages/clients-looking-for-work/finding-name-card/findingnamecard',      // 3 名片信息
      type4:'/pages/clients-looking-for-work/all-skills-certificate/skillscertificate', // 4 证书信息
      type5:'/pages/clients-looking-for-work/all-project-experience/allexperience',      // 5 项目信息
      type6:'/pages/integral/return/return', // 6 投诉招工信息
      type7:'/pages/others/message/lists/lists',      // 7 留言信息
      type8:'/pages/integral/source/source', // 8 积分管理-充值
      type9:'/pages/realname/realname',      // 9 实名认证
      type10:'/pages/integral/return/return',     // 10 投诉找活信息
    },
    isEnd: false,
    page:1,
    listsImg: {
      nodata: app.globalData.apiImgUrl + "nodata.png",
    },
    lists:[],
    type:'',
    isShare: false,
    // 招工-列表，找活-基础资料跳名片列表and项目、证书跳对应列表，留言跳留言列表， 投诉-退分记录列表，充值跳积分来源列表，实名跳实名认证，
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
    this.setData({ userInfo: userInfo ? userInfo : false})
    if (!userInfo) return false;
    _this.initGetIntegralList()
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: "member/message-of-type/",
      way: "POST",
      params: {
        type:_this.data.type,
        page: _this.data.page,
        terminal_type:_this.terminal_type
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
  

  getshow: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo ? userInfo : false})
    if (!userInfo) return false;
    _this.initGetIntegralList()
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: "member/message-of-type/",
      way: "POST",
      params: {
        type:_this.data.type,
        page: 1,
        terminal_type:_this.terminal_type
    },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          let _lists = mydata.data.lists;
            if(_lists.length == 0){
              _this.setData({ isEnd:true})
          }else{
            _this.setData({ lists: _lists, page: 2,isEnd:false});

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
  valiUserUrl:function(e){
    app.globalData.allexpress = true;
    app.globalData.showdetail = true
    app.globalData.allskill = true;
    let type = e.currentTarget.dataset.type
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
    // console.log(type,"type")
    this.setData({
      type: type
    })
    if(options.type == "1" || options.type == "8" || options.type == "9"){
      var titleTypr = "系统提醒"
    } else if(options.type == "2"){
      var titleTypr = "招工提醒"
    } else if(options.type == "3" || options.type == "4" || options.type == "5"){
      var titleTypr = "找活提醒"
    } else if(options.type == "6" || options.type == "10"){
      var titleTypr = "投诉提醒"
    } else if(options.type == "7"){
      var titleTypr = "我的信息-留言"
    } 
    wx.setNavigationBarTitle({
      title: titleTypr
    })  
    let pages = getCurrentPages();
    this.setData({
      isShare: pages.length === 1 ? true : false
    });
        
    // this.getMymessage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成*
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getshow()
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
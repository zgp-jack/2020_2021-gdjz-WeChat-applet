// components/issueok/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    userInfo: false,
    icon: app.globalData.apiImgUrl + 'mini-fast-success-icon.png',
    close: app.globalData.apiImgUrl + 'mini-close-icon.png',
  },
  created:function(){
    this.initUserinfo()
    console.log(this.data.userInfo)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show:function(){
      let bool = this.data.show
      this.setData({
        show: !bool
      })
    },
    goToResumeList:function(){
      wx.reLaunch({
        url: '/pages/findingworkinglist/findingworkinglist',
      })
    },
    manageRecuit:function(){
      wx.reLaunch({
        url: '/pages/published/recruit/list',
      })
    },
    bindGetUserInfo:function(e){
      let token = app.globalData.fastToken
      let that = this;
      app.bindGetUserInfo(e, function (res) {
        app.mini_user(res, function (res) {
          app.api_user(res, function (res) {
            let uinfo = res.data;
            if (uinfo.errcode == "ok") {
              let userInfo = {
                userId: uinfo.data.id,
                token: uinfo.data.sign.token,
                tokenTime: uinfo.data.sign.time,
              }
              that.setData({
                userInfo: userInfo
              })
              app.globalData.userInfo = userInfo;
              wx.setStorageSync('userInfo', userInfo)
              app.appRequestAction({
                title: "发布中",
                mask: true,
                failTitle: "网络错误，保存失败！",
                url: "fast-issue/to-job/",
                way: "POST",
                params: { 
                  token: token,
                },
                success: function (res) {
                  let mydata = res.data;
                  if (mydata.errcode == "ok") {
                    wx.reLaunch({
                      url: '/pages/published/recruit/list',
                    })
                  }else{
                    app.showMyTips(mydata.errmsg);
                    }}
              })
            } else {
              app.showMyTips(uinfo.errmsg);
            }
          });
        });
      });
    },
    initUserinfo:function(){
      let u = wx.getStorageSync('userInfo')
      if(u){
        this.setData({
          userInfo: u
        })
      }
    },
  }
})

// pages/clients-looking-for-work/ranking-rules/ranking-rules.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: app.globalData.apiImgUrl + "nodata.png",
    rulestatus: "",
    list: [],
    resume_uuid: "",
    type: "",
    warm_tips: [],
    sort_flag: "",
    has_resume: "",
    onoff:true,
    showbutton:true
  },
  againshow(){
    this.getdetail()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // getstatus(options) {
  //   console.log(options)
  //   this.setData({
  //     rulestatus: options.hasOwnProperty("rulestatus") ? options.rulestatus : ""
  //   })
  // },

  getdetail() {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let detail = "";
    if (userInfo) {
      detail = {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        system_type: that.data.type
      }
    } else {
      detail = {
        userId: "",
        token: "",
        tokenTime: "",
        system_type: that.data.type
      }
    }
   
    app.appRequestAction({
      url: 'resumes/sort/',
      way: 'POST',
      params: detail,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(res)
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          console.log(1)
          that.setData({
            list: mydata.data.sort_rule_lists,
            listlength: mydata.data.sort_rule_lists.length,
            rulestatus: mydata.data.resume_data.hasOwnProperty("info") ? mydata.data.resume_data.info.hasOwnProperty("check")? mydata.data.resume_data.info.check:"":"",
            resume_uuid: mydata.data.resume_data.hasOwnProperty("info") ? mydata.data.resume_data.info.hasOwnProperty("uuid") ? mydata.data.resume_data.info.uuid :"": "",
            warm_tips: mydata.data.warm_tips,
            sort_flag: mydata.data.resume_info.sort_flag,
            has_resume: mydata.data.resume_info.has_resume,
            onoff: true
          })

          if (mydata.data.resume_data.hasOwnProperty("certificate_count") && mydata.data.resume_data.hasOwnProperty("project_count")){
            console.log(123)
            wx.setStorageSync("projectnum", mydata.data.resume_data.project.length )
            wx.setStorageSync("skillnum", mydata.data.resume_data.certificates.length)
            wx.setStorageSync("certificate_count", mydata.data.resume_data.certificate_count)
            wx.setStorageSync("project_count", mydata.data.resume_data.project_count)
          }else{
            wx.setStorageSync("projectnum", 0)
            wx.setStorageSync("skillnum", 0)
            wx.setStorageSync("certificate_count", 3)
            wx.setStorageSync("project_count", 5)
          }
        } else {
          that.setData({
            onoff: false
          })
        }
      },
      fail: function (err) {
        that.setData({
          onoff: false
        })
      }
    })
  },

  initGetIntegralList: function () {
    let _this = this;
    try {
      const res = wx.getSystemInfoSync()
      console.log(res)
      if (res && res.platform == "ios") {
        _this.setData({
          type: "ios"
        })
      }
    } catch (e) {
      // Do something when catch error
      app.showMyTips("获取机型失败请重新进入");
    }

    console.log(_this.data.type)
  },
  jumpyemian(e) {
    console.log(e)
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      app.gotoUserauth();
      this.setData({
        showbutton: true
      })
      return false;
    }
    if (this.data.has_resume == 1 && e.currentTarget.dataset.jump == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.minipath,
      })
    } else if (this.data.has_resume == 0 && e.currentTarget.dataset.minipath == '/pages/recharge/recharge' && e.currentTarget.dataset.jump == 1){
      wx.navigateTo({
        url: "/pages/recharge/recharge",
      })
    } else if (e.currentTarget.dataset.jump == 1){
      wx.navigateTo({
        url: "/pages/clients-looking-for-work/finding-name-card/findingnamecard",
      })
    }
  },

  getstatus(){
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
       this.setData({
         showbutton:false
       })
    }
  },
  onLoad: function (options) {
    // this.getstatus(options)
    this.initGetIntegralList();
    
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
    this.getdetail();
    this.getstatus()
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
  onShareAppMessage: function (e) {

    console.log(e)
    let that = this;
    let status = that.data.rulestatus;
    let userInfo = wx.getStorageSync("userInfo");
    let commonShareImg = app.globalData.commonShareImg;
    let refId = userInfo.hasOwnProperty('userId') ? userInfo.userId : false;
    let uuid = that.data.resume_uuid;
    let commonShareTips = app.globalData.commonShareTips;

    if (e.target.dataset.hasOwnProperty("share") && e.target.dataset.share == "invite_friend"){
      return {
        title: commonShareTips,
        imageUrl: commonShareImg,
        path: `/pages/index/index?refId=${refId}`//这是一个路径
      }
    }else if (status == 2) {

      return {
        title: commonShareTips,
        imageUrl: commonShareImg,
        path: `/pages/boss-look-card/lookcard?uuid=${uuid}&refId=${refId}&sharedekeId=1`//这是一个路径
      }
    } else {
      if (refId) {
        return {
          title: commonShareTips,
          imageUrl: commonShareImg,
          path: `/pages/index/index?refId=${refId}`//这是一个路径
        }
      } else {
        return {
          title: commonShareTips,
          imageUrl: commonShareImg,
          path: `/pages/index/index`//这是一个路径
        }
      }
    }
  }
})
// pages/clients-looking-for-work/ranking-rules/ranking-rules.js
const app = getApp();
let num = app.globalData.userSeeVideoNum
let max = app.globalData.userSeeVideoMax
let ads = require('../../../utils/ad')
let videoAd = null
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
    onoff: true,
    showbutton: true,
    ranking: "",
    rankjump: "rankjump",
    showAd: true
  },
  againshow() {
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
  getallstatus() {
    wx.setStorageSync("skillpass", 0)
    wx.setStorageSync("pass", 0)
    app.globalData.allexpress = true;
    app.globalData.allskill = true;
  },
  setstorege(mydata) {
    let that = this;
    if (mydata.data.resume_data.hasOwnProperty("info")) {
      wx.setStorageSync("uuid", mydata.data.resume_data.info.uuid)
    }

    if (mydata.data.resume_data.hasOwnProperty("certificate_count") && mydata.data.resume_data.hasOwnProperty("project_count")) {
      if (mydata.data.resume_data.project.length == 0 || mydata.data.resume_data.certificates.length == 0) {
        that.setData({
          ranking: "ranking"
        })
      }
      that.getallstatus()
      wx.setStorageSync("projectnum", mydata.data.resume_data.project.length)
      wx.setStorageSync("skillnum", mydata.data.resume_data.certificates.length)
      wx.setStorageSync("certificate_count", mydata.data.resume_data.certificate_count)
      wx.setStorageSync("project_count", mydata.data.resume_data.project_count)
    } else {
      that.getallstatus()
      wx.setStorageSync("projectnum", 0)
      wx.setStorageSync("skillnum", 0)
      wx.setStorageSync("certificate_count", 3)
      wx.setStorageSync("project_count", 5)
    }
  },
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
    detail.load_adv = 1
    app.appRequestAction({
      url: 'resumes/sort/',
      way: 'POST',
      params: detail,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(res)
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          that.setData({
            list: mydata.data.sort_rule_lists,
            listlength: mydata.data.sort_rule_lists.length,
            rulestatus: mydata.data.resume_data.hasOwnProperty("info") ? mydata.data.resume_data.info.hasOwnProperty("check") ? mydata.data.resume_data.info.check : "" : "",
            resume_uuid: mydata.data.resume_data.hasOwnProperty("info") ? mydata.data.resume_data.info.hasOwnProperty("uuid") ? mydata.data.resume_data.info.uuid : "" : "",
            warm_tips: mydata.data.warm_tips,
            sort_flag: mydata.data.resume_info.sort_flag,
            has_resume: mydata.data.resume_info.has_resume,
            onoff: true,
            certificate_count: res.data.data.resume_data.certificate_count ? res.data.data.resume_data.certificate_count : "",
            project_count: res.data.data.resume_data.project_count ? res.data.data.resume_data.project_count : "",
          })
          that.setstorege(mydata)
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
      wx.showModal({
        title: '温馨提示',
        content: `获取机型失败请重新进入`,
        showCancel: false,
        success(res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
      // // Do something when catch error
      // app.showMyTips("获取机型失败请重新进入");
    }


  },
  jumpyemian(e) {
    let _this = this
    let ranking = this.data.ranking;
    let rankjump = this.data.rankjump;
    let userInfo = wx.getStorageSync("userInfo");
    let certificate_count = this.data.certificate_count;
    let project_count = this.data.project_count;
    let resume_uuid = this.data.resume_uuid;
    if (!userInfo) {
      app.gotoUserauth();
      this.setData({
        showbutton: true
      })
      return false;
    }
    let type = e.currentTarget.dataset.type
    let jump = e.currentTarget.dataset.jump
    let minipath = e.currentTarget.dataset.minipath
    if(type == '7'){
      if(jump == "1"){
        wx.navigateTo({
          url: minipath,
        })
        return
      }else{
        let allowed = parseInt(e.currentTarget.dataset.allow)
        if(allowed){
          _this.addclicklog(type)
          app.valiUserVideoAdStatus(function(data){
            if(data.errcode == 'ok'){
              let times = data.data.times
              if(times){
                _this.showVideoAd()
              }else{
                _this.selectComponent("#minitoast").showToast(app.globalData.userSeeVideoTips)
                //app.showMyTips(app.globalData.userSeeVideoTips)
              }
            }else if(data.errcode == 'to_invited'){
              _this.setData({
                showAd: false
              })
              _this.selectComponent("#minitoast").showToast(data.errmsg)
              //app.showMyTips(data.errmsg)
            }else{
              _this.selectComponent("#minitoast").showToast(data.errmsg)
              //app.showMyTips(data.errmsg)
            }
          },2)
        }else{
          _this.selectComponent("#minitoast").showToast(app.globalData.userSeeVideoTips)
          //app.showMyTips(app.globalData.userSeeVideoTips)
        }
        return 
      }
    }
    this.addclicklog(type)
    if (this.data.has_resume == 1 && e.currentTarget.dataset.jump == 1 && e.currentTarget.dataset.minipath == "/pages/clients-looking-for-work/finding-name-card/findingnamecard") {
      app.globalData.showdetail = true
      wx.navigateTo({
        url: e.currentTarget.dataset.minipath + `?rankjump=${rankjump}`,
      })
    } else if (this.data.has_resume == 1 && e.currentTarget.dataset.jump == 1) {
      if (e.currentTarget.dataset.minipath == '/pages/clients-looking-for-work/new-project-experience/projectexperience' || e.currentTarget.dataset.minipath == '/pages/clients-looking-for-work/addcertificate/addcertificate') {
        wx.navigateTo({
          url: e.currentTarget.dataset.minipath + `?ranktype=${ranking}` + `&certificate_count=${certificate_count}` + `&resume_uuid=${resume_uuid}` + `&project_count=${project_count}`,
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.minipath + `?ranktype=${ranking}`,
        })
      }
    } else if (this.data.has_resume == 0 && e.currentTarget.dataset.minipath == '/pages/recharge/recharge' && e.currentTarget.dataset.jump == 1) {
      wx.navigateTo({
        url: "/pages/recharge/recharge",
      })
    } else if (this.data.has_resume == 0 && e.currentTarget.dataset.minipath == '/pages/realname/realname' && e.currentTarget.dataset.jump == 1) {
      wx.navigateTo({
        url: "/pages/realname/realname",
      })
    } else if (e.currentTarget.dataset.jump == 1) {
      wx.navigateTo({
        url: "/pages/clients-looking-for-work/finding-name-card/findingnamecard" + `?rankjump=${rankjump}`,
      })
    }
  },

  getstatus() {
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      this.setData({
        showbutton: false
      })
    }
  },
  addclicklog(item) {
    let userInfo = wx.getStorageSync("userInfo");
    let detail = '';
    if (userInfo) {
     detail = {
        type: item
      }
      app.appRequestAction({
        url: 'resumes/add-click-log/',
        way: 'POST',
        params: detail,
        failTitle: "操作失败，请稍后重试！",
        success(res) {

        }
      })
    }
  },
  showVideoAd:function(){
    if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => videoAd.show())
            .catch(err => {
              this.videoAdStop()
            })
          })
      }

  },
  createVideo:function(){
    let _this = this;
      let times = app.globalData.userSeeVideoTimes
      if(times.ok && !times.times){
        //app.showMyTips(app.globalData.userSeeVideoTips)
        
        return
      }
      
      if (wx.createRewardedVideoAd) {
          videoAd = wx.createRewardedVideoAd({
              adUnitId: ads.videoSortAd
          })
          videoAd.onLoad(() => {})
          videoAd.onError((err) => {
            this.setData({
              showAd: false
            })
          })
          videoAd.onClose(status => {
            if (status && status.isEnded || status === undefined) {
              this.videoAdStop()
            }
          })
      }
  },
  videoAdStop:function(){
    let _this = this
    app.userGetTempIntegral(1,()=>{
      
      _this.getdetail()
    })
  },
  userSeeVideo:function(){
    let _this = this
    app.valiUserVideoAdStatus(function(data){
      if(data.errcode == 'ok'){
        _this.showVideoAd()
      }else if(data.errcode == 'to_invited'){
        _this.setData({
          fixedAdImg: _this.data.inviteUserImg
        })
        app.showMyTips(data.errmsg)
      }else{
        app.showMyTips(data.errmsg)
      }
    })
  },
  activeRefresh:function () {
    app.activeRefresh()  
  },
  onLoad: function (options) {
    // this.getstatus(options)
    this.createVideo()
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
    videoAd = null
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
    if (e.target){
    if (e.target.dataset.hasOwnProperty("share") && e.target.dataset.share == "invite_friend") {
      that.addclicklog(e.target.dataset.type)
      return {
        title: commonShareTips,
        imageUrl: commonShareImg,
        path: `/pages/index/index?refid=${refId}`//这是一个路径
      }
    } else if (status == 2) {
      that.addclicklog(e.target.dataset.type)
      return {
        title: commonShareTips,
        imageUrl: commonShareImg,
        path: `/pages/boss-look-card/lookcard?uuid=${uuid}&refId=${refId}&sharedekeId=1`//这是一个路径
      }
    } else {
      if (refId) {
        that.addclicklog(e.target.dataset.type)
        return {
          title: commonShareTips,
          imageUrl: commonShareImg,
          path: `/pages/index/index?refid=${refId}`//这是一个路径
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
  },
  onShareTimeline:function () {
    let commonShareTips = app.globalData.commonShareTips;
    let commonShareImg = app.globalData.commonShareImg;
    return {
      title: commonShareTips,
      imageUrl: commonShareImg
    }
  }
})
const app = getApp();
let remain = require("../../../utils/remain.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allskill: [],
    allskilength: 0,
    skillpass: 0,
    allskilltwo: [],
    allskillthree: [],
    allskillonef:false
  },
  allskill() {
    let userInfo = wx.getStorageSync("userInfo");
    let detail = {}
    Object.assign(detail, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })
    let that = this;
    app.appRequestAction({
      url: 'resumes/resume-list/',
      way: 'POST',
      params: detail,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(res)
        if (res.data.errcode == 200) {
          that.setData({
            allskill: res.data.data.certificates,
            allskilength: res.data.data.certificates.length
          })
          console.log(that.data.allskilength)
          let allskilltwo = [];
          for (let i = 0; i < that.data.allskill.length; i++) {
            if (that.data.allskill[i].check == "2") {
              allskilltwo.push(that.data.allskill[i])
            }
          }
          // console.log(that.data.allskilltwo)
          console.log(allskilltwo)
          that.setData({
            allskilltwo: allskilltwo
          });
        }
      },
      fail: function (err) {
        app.showMyTips("获取失败");
      }
    })
  },
  addskill() {
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate",
    })
  },
  editor(e) {
    console.log(e)
    wx.setStorageSync("skilltail", e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate",
    })
  },
  deleskill() {
    wx.removeStorageSync("skilltail")
  },
  getskill() {
    let skillpass = wx.getStorageSync("skillpass");
    if (skillpass) {
      this.setData({
        skillpass: skillpass
      })
    }
    wx.removeStorageSync("skillpass")
  },

  allskilleng(){
    let that = this;
    if (!app.globalData.allskill) {
      let allskill = wx.getStorageSync("allskill");
      this.setData({
        allskillonef: true
      });
      this.setData({
        skillpass: 8
      })
      if (allskill != []) {
        console.log(allskill)
        let skill = [];
        for (let i = 0; i < allskill.length; i++) {
          if (allskill[i].check == "2") {
            skill.push(allskill[i])
          }
        }
        that.setData({
          allskillthree: skill
        });
      }
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (app.globalData.allskill) {
      this.allskill();
    }
    this.allskilleng()
    this.deleskill();
    this.getskill();
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
})
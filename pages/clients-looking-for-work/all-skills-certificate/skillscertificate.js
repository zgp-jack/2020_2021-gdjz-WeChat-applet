const app = getApp();
let remain = require("../../../utils/remain.js");
Page({

  /**
   * 页面的初始数据 addskill app.globalData.previewproject previewskill != []
   */
  data: {
    notthrough: app.globalData.apiImgUrl + "lpy/notthrough.png",
    inreview: app.globalData.apiImgUrl + "lpy/review.png",
    experienceitem: app.globalData.apiImgUrl + "lpy/newresume-experience-item.png",
    allskill: [],
    allskilength: 0,
    skillpass: 0,
    allskilltwo: [],
    allskillthree: [],
    allskillonef: false,
    onoff: false, listsImg: {
      nodata: app.globalData.apiImgUrl + "nodata.png",
    },
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
        
        if (res.data.errcode == 200) {
          that.setData({
            allskill: res.data.data.certificates,
            allskilength: res.data.data.certificates.length
          })
          
          let allskilltwo = [];
          for (let i = 0; i < that.data.allskill.length; i++) {
            if (that.data.allskill[i].check == "2") {
              allskilltwo.push(that.data.allskill[i])
            }
          }
          
          
          that.setData({
            allskilltwo: allskilltwo,
            onoff: true,
            certificate_count:res.data.data.certificate_count,
            project_count:res.data.data.project_count,
            resume_uuid:res.data.data.info.uuid
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: `操作失败，请稍后重试！`,
            showCancel: false,
            success(res) {
            }
          })
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },
  addskill() {
    let skillnum = this.data.allskill.length
    wx.setStorageSync("skillnum", skillnum)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid+"&skillnum=" + skillnum,
    })
  },
  editor(e) {
    
    wx.setStorageSync("skilltail", e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid,
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

  allskilleng() {
    let that = this;
    if (!app.globalData.allskill) {
      let allskill = wx.getStorageSync("allskill");
      this.setData({
        allskillonef: true
      });
      this.setData({
        skillpass: 8
      })
      
      let skill = [];
      for (let i = 0; i < allskill.length; i++) {
        skill.push(allskill[i])
      }
      that.setData({
        allskillthree: skill
      });

    }

  },
  previewImage: function (e) {
    let url = e.currentTarget.dataset.url;
    let i = e.currentTarget.dataset.index;
    
    let type = e.currentTarget.dataset.type;
    let urls = type == "1" ? this.data.allskillthree[i].image : this.data.allskill[i].image
    wx.previewImage({
      current: url,
      urls: urls
    })
    app.globalData.previewskill = false;
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
    if (app.globalData.previewskill) {
      if (app.globalData.allskill) {
        this.allskill();
      }
      this.allskilleng()
      this.deleskill();
      this.getskill();
    }
    app.globalData.previewskill = true;
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
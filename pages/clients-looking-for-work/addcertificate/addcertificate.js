const app = getApp();
let v = require("../../../utils/v.js");
let remain = require("../../../utils/remain.js");
Page({

  /**
   * 页面的初始数据 bindstartDate nowDate
   */
  data: {
    imgArrs: [],
    idArrs: [],
    date: "",
    name: "",
    resume_uuid: "",
    showModal: false,
    obtnbut: true,
    uuid: "",
    // nowDate: ""
  },
  // getbirth() {
  //   var date = new Date();
  //   var year = date.getFullYear();
  //   var month = date.getMonth() + 1;
  //   var day = date.getDate();
  //   if (month < 10) {
  //     month = "0" + month;
  //   }
  //   if (day < 10) {
  //     day = "0" + day;
  //   }
  //   var nowDate = year + "-" + month + "-" + day;
  //   this.setData({
  //     nowDate: nowDate
  //   });

  // },
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindstartDate(e) {
    this.setData({
      date: e.detail.value
    })
  },
  previewImage(e) {
    console.log(e)
    let that = this
    wx.previewImage({
      urls: that.data.imgArrs,
      current: e.target.dataset.item,
    })
  },
  chooseImage() {
    let that = this;
    if (that.data.imgArrs.length >= 3) {
      wx.showModal({
        title: '温馨提示',
        content: '您最多只能选择三张图片',
        showCancel: false,
        success(res) { }
      })
      return
    }
    app.userUploadImg(function (img, url) {
      wx.hideLoading()
      that.data.imgArrs.push(url.httpurl)
      that.data.idArrs.push(url.url)
      that.setData({
        imgArrs: that.data.imgArrs
      })
    })
  },
  previewImage(e) {
    console.log(e)
    let that = this
    wx.previewImage({
      urls: that.data.imgArrs,
      current: e.target.dataset.item,
    })
  },
  delete(e) {
    console.log(e)
    this.data.imgArrs.splice(e.currentTarget.dataset.index, 1)
    this.data.idArrs.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgArrs: this.data.imgArrs
    })
    this.setData({
      idArrs: this.data.idArrs
    })
  },
  getuuid() {
    let userInfo = wx.getStorageSync("uuid");
    this.setData({
      resume_uuid: userInfo
    })
  },
  vertify() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    Object.assign(project, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      certificate_uuid: this.data.uuid
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/del-certificate/',
      way: 'POST',
      params: project,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(res)
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
    this.setData({
      showModal: false
    })
  },
  deleteexper() {
    this.setData({
      showModal: true
    })
  },
  obtn() {
    this.setData({
      showModal: false
    })
  },
  preserve() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()
    if (vertifyNum.isNull(this.data.name)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的职业技能为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.idArrs)) {
      wx.showModal({
        title: '温馨提示',
        content: '您添加的图片为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的领取证书时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    Object.assign(project, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      resume_uuid: this.data.resume_uuid,
      image: this.data.idArrs,
      name: this.data.name,
      certificate_time: this.data.date
    })

    console.log(this.data.idArrs)
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      params: {ig:["234234","dsfsdf"]},
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(project)
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            // if (res.data.errcode)
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
  },
  preservechixu() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()
    if (vertifyNum.isNull(this.data.name)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的职业技能为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.idArrs)) {
      wx.showModal({
        title: '温馨提示',
        content: '您添加的图片为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的领取证书时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }

    Object.assign(project, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      resume_uuid: this.data.resume_uuid,
      image: this.data.idArrs,
      name: this.data.name,
      certificate_time: this.data.date
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      failTitle: "操作失败，请稍后重试！",
      params: project,
      success(res) {
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            if (res.data.errcode == "ok") {
              that.setData({
                imgArrs: [],
                idArrs: [],
                date: "",
                name: "",
              })
            }
          }
        })
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
  },

  getskill() {
    let skilltail = wx.getStorageSync("skilltail");
    console.log(skilltail)
    if (skilltail) {
      wx.setNavigationBarTitle({
        title: '修改您的技能证书'
      })
      this.setData({
        obtnbut: false
      })
      this.setData({
        skill: skilltail.uid
      })
      console.log(this.data.skill)

      this.setData({
        name: this.data.skill.name,
        imgArrs: this.data.skill.image,
        idArrs: this.data.skill.images,
        resume_uuid: this.data.skill.resume_uuid,
        uuid: this.data.skill.uuid,
        date: this.data.skill.certificate_time
      })
    }
  },
  preserveone() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()
    if (vertifyNum.isNull(this.data.name)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的职业技能为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.idArrs)) {
      wx.showModal({
        title: '温馨提示',
        content: '您添加的图片为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的领取证书时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    Object.assign(project, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      resume_uuid: this.data.resume_uuid,
      name: this.data.name,
      image: this.data.idArrs,
      certificate_uuid: this.data.uuid,
      certificate_time: this.data.date
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      failTitle: "操作失败，请稍后重试！",
      params: project,
      success(res) {
        console.log(res)
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            if (res.data.errcode == "ok") {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getskill()
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
    this.getuuid()
    // this.getbirth()
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
const app = getApp();
let v = require("../../../utils/v.js");
let remain = require("../../../utils/remain.js");
let reminder = require("../../../utils/ reminder.js");
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
    certificate_count:0,
    certificate_cou: 0,
    imgArrslength:true,
    skill_show:true
  },
  getbirthall() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    let time = this.data.date.split("-");
    let timeone = this.data.date.split("-")[0] - 0;
    let timetwo = this.data.date.split("-")[1] - 0;
    let timethree = this.data.date.split("-")[2] - 0;
    console.log(time)
    if (year - timeone == 20 && month - timetwo >= 0 && day - timethree > 0 || year - timeone > 20 || year - timeone < 0 || year - timeone == 0 && month - timetwo <= 0 && day - timethree < 0 ) {
      return false
    }
    return true
  },
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
    // if (that.data.imgArrs.length >= 3) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '您最多只能选择三张图片',
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }
    app.userUploadImg(function (img, url) {
      wx.hideLoading()
      that.data.imgArrs.push(url.httpurl)
      that.data.idArrs.push(url.url)
      that.setData({
        imgArrs: that.data.imgArrs
      })
      if (that.data.imgArrs.length >= 3) {
        that.setData({
          imgArrslength: false
        })
      }
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
    if (this.data.imgArrs.length < 3) {
      this.setData({
        imgArrslength: true
      })
    }
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
            if (res.data.errcode == "ok") {
              app.globalData.allskill = true;
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
    let that = this;
    if (that.data.certificate_cou >= that.data.certificate_count) {
      wx.showModal({
        title: '温馨提示',
        content: `最多只能添加${that.data.certificate_count}个技能证书`,
        showCancel: false,
        success(res) {
          wx.navigateBack({
            delta: 1
          })
         }
      })
      return
    }
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()
    if (vertifyNum.isNull(this.data.name)) {
      reminder.reminder({ tips: '职业技能' })
      return
    }
    if (!that.getbirthall()){
      wx.showModal({
        title: '温馨提示',
        content: '领取证书的范围必须在前20年内',
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
      reminder.reminder({ tips: '领取证书时间' })
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

    app.appRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      params: project,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(res)
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            if (res.data.errcode == "ok") {
              app.globalData.allskill = true;
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
  preservechixu() {
    let that = this;
    if (that.data.certificate_cou >= that.data.certificate_count) {
      wx.showModal({
        title: '温馨提示',
        content: `最多只能添加${that.data.certificate_count}个技能证书`,
        showCancel: false,
        success(res) { 
          wx.navigateBack({
            delta: 1
          })

        }
      })
      return
    }
    if (!that.getbirthall()) {
      wx.showModal({
        title: '温馨提示',
        content: '领取证书的范围必须在前20年内',
        showCancel: false,
        success(res) { }
      })
      return
    }
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()
    if (vertifyNum.isNull(this.data.name)) {
      reminder.reminder({ tips: '职业技能' })
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
      reminder.reminder({ tips: '领取证书时间' })
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
                certificate_cou: res.data.count
              })

              that.skillshow()
              app.globalData.allskill = true;
              that.setData({
                imgArrs: [],
                idArrs: [],
                date: "",
                name: "",
                imgArrslength:true
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
  preservechixutui(){
    wx.navigateBack({
      delta: 1
    })
  },
  getskill() {

    let skilltail = wx.getStorageSync("skilltail");
    let certificate_count = wx.getStorageSync("certificate_count");
    let certificate_cou = wx.getStorageSync("skillnum");
    if (certificate_cou) {
      this.setData({
        certificate_cou: certificate_cou
      })
    }
    if (certificate_count) {
      this.setData({
        certificate_count: certificate_count
      })
    }
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
      if (this.data.imgArrs.length >= 3) {
        this.setData({
          imgArrslength: false
        })
      }
    }
  },
  preserveone() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()
    if (vertifyNum.isNull(this.data.name)) {
      reminder.reminder({ tips: '职业技能' })
      return
    }
    this.getbirthall()
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
      reminder.reminder({ tips: '领取证书时间' })
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
              app.globalData.allskill = true;
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

  skillshow() {
    let that = this;
    if (that.data.certificate_cou >= that.data.certificate_count - 1) {
      that.setData({
        skill_show: false
      })
    }

    console.log(that.data.certificate_cou)
    console.log(that.data.certificate_count)
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
    this.skillshow() 
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
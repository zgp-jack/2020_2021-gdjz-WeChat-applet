const app = getApp();
let v = require("../../../utils/v.js");
Page({

  /**
   * 页面的初始数据 bindstartDate
   */
  data: {
    imgArrs: [],
    idArrs: [],
    date:"",
    name:"",
    resume_uuid:""
  },
  name(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindstartDate(e){
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
    if (that.data.imgArrs.length >= 6) {
      wx.showModal({
        title: '温馨提示',
        content: '您最多只能选择六张图片',
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
    console.log(project)
    let that = this;
    app.doRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      params: project,
      success(res) {
        console.log(res)
        if (res.data.errcode == "fail") {
          wx.showModal({
            title: '温馨提示',
            content: '输入错误请重新输入',
            showCancel: false,
            success(res) {
            }
          })
        }
        if (res.data.errcode == "ok") {
          wx.showModal({
            title: '温馨提示',
            content: "保存成功",
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
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
    app.doRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      params: project,
      success(res) {
        if (res.data.errcode == "fail") {
          wx.showModal({
            title: '温馨提示',
            content: '输入错误请重新输入',
            showCancel: false,
            success(res) {
            }
          })
        }
        if (res.data.errcode == "ok") {
          wx.showModal({
            title: '温馨提示',
            content: "保存成功",
            showCancel: false,
            success(res) {
              that.setData({
                imgArrs: [],
                idArrs: [],
                date: "",
                name: "",
              })
            }
          })
        }

      }
    })
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
    this.getuuid()
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
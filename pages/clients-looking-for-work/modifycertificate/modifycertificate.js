const app = getApp();
let v = require("../../../utils/v.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skill:[],
    imgArrs: [],
    idArrs: [],
    name:"",
    resume_uuid:"",
    uuid:"",
    time:"",
    showModal: false
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
    app.doRequestAction({
      url: 'resumes/del-certificate/',
      way: 'POST',
      params: project,
      success(res) {
        wx.navigateBack({
          delta: 1
        })
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
  bindstartDate(e) {
    this.setData({
      time: e.detail.value
    })
  },
  ovalue(e) {
    this.setData({
      name: e.detail.value
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
    let that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const path = res.tempFilePaths[0]
        if (that.data.imgArrs.length >= 5) {
          return
        }
        that.data.imgArrs.push(path)
        // that.data.idArrs.push(id)
        that.setData({
          imgArrs: that.data.imgArrs,
          // idArrs: that.data.idArrs
        })

        wx.uploadFile({
          url: '要上传的地址',
          filePath: path,
          name: 'image',
          success: (res) => {
            console.log(res)
            // 根据查看结果是否需要json化
            let { url, id } = JSON.parse(res.data).data
            console.log(url)
            console.log(id)
            that.data.imgArrs.push(url)
            that.data.idArrs.push(id)
            that.setData({
              imgArrs: that.data.imgArrs,
              idArrs: that.data.idArrs
            })
            console.log(that.data.imgArrs)
            console.log(that.data.idArrs)

          }
        })
      }
    })
  },
  getskill(){
    let skilltail = wx.getStorageSync("skilltail");
    console.log(skilltail)
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
      time: this.data.skill.certificate_time
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
    if (vertifyNum.isNull(this.data.time)) {
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
      certificate_time: this.data.time
    })
    console.log(project)
    let that = this;
    app.doRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      params: project,
      success(res) {
        wx.showModal({
          title: '温馨提示',
          content: '保存成功',
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
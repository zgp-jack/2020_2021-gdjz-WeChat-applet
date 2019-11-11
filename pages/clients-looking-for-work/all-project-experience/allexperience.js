const app = getApp();
Page({

  /**
   * 页面的初始数据 editor allgetexpre
   */
  data: {
    allproject: [],
    projectlength: 0,
    allde: false,
    allgetexpre: 0,
    projectwo:[]
  },
  editor(e) {
    console.log(e)
    wx.setStorageSync("projectdetail", e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/new-project-experience/projectexperience",
    })
  },
  delestore() {
    wx.removeStorageSync("projectdetail")
  },
  getexpre() {
    let pass = wx.getStorageSync("pass");
    if (pass) {
      this.setData({
        allgetexpre: pass
      })
    }
    wx.removeStorageSync("pass")
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
  addpro() {
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/new-project-experience/projectexperience",
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  project() {
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
        if (res.errMsg == "request:ok") {
          that.setData({
            allproject: res.data.data.project
          })
          that.setData({
            projectlength: res.data.data.project.length
          })
          console.log(that.data.allproject)
            let projectall = [];
            for (let i = 0; i < that.data.allproject.length; i++) {
              if (that.data.allproject[i].check == "2") {
                projectall.push(that.data.allproject[i])
              }
            }
            that.setData({
              projectwo: projectall
            });

        }
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }

    })
  },
  onShow: function () {
    this.project()
    this.delestore()
    this.getexpre()
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
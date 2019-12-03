const app = getApp();
Page({

  /**
   * 页面的初始数据 editor allgetexpre addpro previewImage previewproject
   */
  data: {
    notthrough: app.globalData.apiImgUrl + "lpy/notthrough.png",
    inreview: app.globalData.apiImgUrl + "lpy/review.png",
    experienceitem: app.globalData.apiImgUrl + "lpy/newresume-experience-item.png",
    allproject: [],
    projectlength: 0,
    allde: false,
    allgetexpre: 0,
    projectwo: [],
    projecthree: [],
    allgetexpreone: false,
    onoff: false
  },
  editor(e) {
    
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
    console.log(new Date("2019-12-03").getTime() / 86400000)
    console.log(parseInt(new Date().getTime() / 86400000))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addpro() {
    let projectnum = this.data.allproject.length
    wx.setStorageSync("projectnum", projectnum)
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
        let allproject = [];
        if (res.data.errcode == 200) {
          let dataproject = res.data.data.project;
          for (let i = 0; i < dataproject.length ; i++){
            if (new Date(dataproject[i].completion_time).getTime() / 86400000 < parseInt(new Date().getTime() / 86400000)) {
              dataproject[i].completiontime = "zhijing"
              allproject.push(dataproject[i])
            }else{
              dataproject[i].completiontime = "zhijin"
              allproject.push(dataproject[i])
            }
          }

          that.setData({
            allproject: allproject
          })
          that.setData({
            projectlength: res.data.data.project.length
          })
          
          let projectall = [];
          for (let i = 0; i < that.data.allproject.length; i++) {
            if (that.data.allproject[i].check == "2") {
              projectall.push(that.data.allproject[i])
            }
          }
          that.setData({
            projectwo: projectall,
            onoff: true
          });

        }
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }

    })
  },

  projecttwo() {
    let that = this;
    if (!app.globalData.allexpress) {
      let allexpress = wx.getStorageSync("allexpress");
      this.setData({
        allgetexpreone: true
      });
      this.setData({
        allgetexpre: 8
      })


      let projectall = [];
      let allproject = [];
      for (let i = 0; i < allexpress.length; i++) {
        projectall.push(allexpress[i])
      }


      for (let i = 0; i < projectall.length; i++) {
        if (new Date(projectall[i].completion_time).getTime() / 86400000 < parseInt(new Date().getTime() / 86400000)) {
          projectall[i].completiontime = "zhijing"
          allproject.push(projectall[i])
        } else {
          projectall[i].completiontime = "zhijin"
          allproject.push(projectall[i])
        }
      }
     
      that.setData({
        projecthree: allproject
      });

    }

  },

  onShow: function () {
    if (app.globalData.previewproject) {
      if (app.globalData.allexpress) {
        this.project()
      }
      this.projecttwo()
      this.getexpre()
      this.delestore()
    }
    app.globalData.previewproject = true;
  },
  previewImage: function (e) {
    
    let url = e.currentTarget.dataset.url;
    let i = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let urls = type == "1" ? this.data.projecthree[i].image : this.data.allproject[i].image
    wx.previewImage({
      current: url,
      urls: urls
    })
    app.globalData.previewproject = false;
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
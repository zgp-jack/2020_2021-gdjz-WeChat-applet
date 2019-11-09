const app = getApp();

Page({

  /**
   * 页面的初始数据 nation view_num prof_degree userEnterComplain
   */
  data: {
    complainInfo: "",
    showComplain: false,
    soucang: app.globalData.apiImgUrl + "newresume-footer-collect.png",
    fenxiang: app.globalData.apiImgUrl + "newresume-footer-share.png",
    zan: app.globalData.apiImgUrl + "newresume-footer-star.png",
    username: '',
    userimg: '',
    showtop: true,
    showtopone: false,
    name: "未填写",
    sex: "未填写",
    nation: "未填写",
    occupations: "未填写",
    telephone: "未填写",
    introduce: "未填写",
    city: "未填写",
    intro: true,
    introne: false,
    selfintro: true,
    selfintrone: false,
    workingyears: "未填写",
    staffcomposition: "未填写",
    cityself: "未填写",
    procity: "未填写",
    personnum: "未填写",
    tags: "未填写",
    headerimg: "../../../images/hearding.png",
    selectk: [],
    selectkone: "",
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    check: "",
    checkstatus: true,
    is_introduces: false,
    view_num: "",
    project: [],
    projectone: [],
    projectlength: 0,
    importimg: "",
    imgArrs: "",
    percent: 0,
    skilllength: 0,
    skillbooks: [],
    skillbooksone: [],
    checkone: false,
    checkonef: 4568,
    checktwo: false,
    checktwof: 4568,
    checkthree: false,
    checkthreef: 4568,
    checkfour: false,
    checkfourf: 4568,
    showbottom: false,
    resume_uuid: "",
    showtan: false
  },
  userComplaintAction: function () {
    let _this = this;
    let userInfo = this.data.userInfo;
    let infoId = this.data.infoId;
    let info = this.data.complainInfo;
    if (info == "") {
      app.showMyTips("请输入您的投诉内容");
      return false;
    }
    app.appRequestAction({
      url: "publish/complain/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        infoId: infoId,
        type: "resume",
        content: info
      },
      title: "正在提交投诉",
      failTitle: "网络错误，投诉失败！",
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") _this.setData({ showComplain: false, complainInfo: "", "ucardInfo.show_complaint.show_complaint": 0 })
        wx.showModal({
          title: '提示',
          content: mydata.errmsg,
          showCancel: false,
          confirmText: mydata.errcode == 'pass_complaint' ? '知道了' : '确定'
        })
      }
    })
  }, 
  userCancleComplain: function () {
    this.setData({ showComplain: false, complainInfo: "" })
  },
  userTapComplain: function () {
    this.setData({ showComplain: true })
  },
  userEnterComplain: function (e) {
    this.setData({ complainInfo: e.detail.value })
  },
  telephorf(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.telephone,
    })
  },
  onShareAppMessage: function () {
    console.log(123)
    return {
      title: '在这里输入标题',
      desc: '在这里输入简介说明',
      path: '../preview-name-card/previewcard'//这是一个路径
    }
  },
  moreproject() {
    wx.setStorageSync("pass", 1)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-project-experience/allexperience",
    })
  },
  moreskill() {
    wx.setStorageSync("skillpass", 1)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-skills-certificate/skillscertificate",
    })
  },
  getdetail() {
    let userInfo = wx.getStorageSync("userInfo");
    let detailid = wx.getStorageSync("detailid");
    let detail = {}
    Object.assign(detail, {
      userId: userInfo.userId,
      resume_uuid: detailid.resume_uuid,
      location: detailid.location,
    })
    let that = this;
    app.appRequestAction({
      url: 'resumes/resume-detail/',
      way: 'POST',
      params: detail,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        let mydata = res.data;
        console.log(mydata)

        if (res.errMsg == "request:ok") {

          let date = new Date();
          let dateo = date.getTime()
          let dateone = new Date(dateo);
          wx.setStorageSync("introdetail", mydata.introduces)
          wx.setStorageSync("introinfo", mydata.info)
          if (mydata.info.uuid) {
            that.setData({
              resume_uuid: mydata.info.uuid
            })
            wx.setStorageSync("uuid", mydata.info.uuid)
          }
          that.setData({
            sex: mydata.info.gender == "1" ? "男" : "女"
          })
          if (mydata.info.birthday) {
            that.setData({
              age: dateone.getFullYear() - (mydata.info.birthday.split("-")[0] - 0)
            })
          }
          that.setData({
            name: mydata.info.hasOwnProperty("username") ? mydata.info.username : "",
            nation: mydata.info.hasOwnProperty("nation") ? mydata.info.nation : "",
            occupations: mydata.info.hasOwnProperty("occupations") ? mydata.info.occupations : "",
            telephone: mydata.info.hasOwnProperty("tel") ? mydata.info.tel : "",
            city: mydata.info.hasOwnProperty("address") ? mydata.info.address : "",
            intro: false,
            introne: true,
            introduce: mydata.info.hasOwnProperty("introduce") ? mydata.info.introduce : "",
            workingyears: mydata.info.hasOwnProperty("experience") ? mydata.info.experience : "",
            staffcomposition: mydata.info.hasOwnProperty("type_str") ? mydata.info.type_str : "",
            cityself: mydata.info.hasOwnProperty("hometown") ? mydata.info.hometown : "",
            procity: mydata.info.hasOwnProperty("prof_degree_str") ? mydata.info.prof_degree_str : "",
            personnum: mydata.info.hasOwnProperty("number_people") ? mydata.info.number_people : "",
            tags: mydata.info.hasOwnProperty("tags") ? mydata.info.tags : "",
          })



          that.setData({
            headerimg: mydata.info.headerimg
          })

          that.setData({
            view_num: mydata.info.hasOwnProperty("view_num") ? mydata.info.view_num : 0
          });

          if (mydata.project != []) {
            console.log(mydata.project)
            let projectall = [];
            for (let i = 0; i < mydata.project.length; i++) {
              if (mydata.project[i].check == "2") {
                projectall.push(mydata.project[i])
              }
            }
            that.setData({
              project: projectall
            });
            that.setData({
              projectone: [projectall[0]]
            });
            that.setData({
              projectlength: projectall.length >= 1 ? projectall.length : 0
            })
          }

          that.setData({
            percent: mydata.info.hasOwnProperty("progress") ? mydata.info.progress : 0
          })

          if (mydata.certificates != []) {
            console.log(mydata.certificates)
            let certificatesall = [];
            for (let i = 0; i < mydata.certificates.length; i++) {
              if (mydata.certificates[i].check == "2") {
                certificatesall.push(mydata.certificates[i])
              }
            }

            that.setData({
              skillbooks: certificatesall
            })
            that.setData({
              skilllength: certificatesall.length >= 1 ? certificatesall.length : 0
            })
            that.setData({
              skillbooksone: [certificatesall[0]]
            })
          }

        }
      },
      fail: function (err) {
        app.showMyTips("请求失败");
      }
    })
  },


  delestore() {
    wx.removeStorageSync("projectdetail")
  },
  deleskill() {
    wx.removeStorageSync("skilltail")
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
  onShow() {
    this.getdetail();
    this.delestore();
    this.deleskill()

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
   * 用户点击右上角分享  projectone
   */
})
const app = getApp();
let remain = require("../../utils/remain.js");

Page({

  /** showComplain telephorft  age workingyears personnum workingyears
   * 页面的初始数据 moreskill projectone occupations introduce telephorft showThisMapInfo onoff
   telephorft occupations moreproject telephorft telephorft authrasution resumes/get-tel/ location*/
  data: {
    userInfo: true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    complainInfo: "",
    showComplain: false,
    soucang: app.globalData.apiImgUrl + "newresume-footer-collect.png",
    soucangone: app.globalData.apiImgUrl + "newresume-footer-collect-active.png",
    fenxiang: app.globalData.apiImgUrl + "newresume-footer-share.png",
    zan: app.globalData.apiImgUrl + "newresume-footer-star.png",
    zanone: app.globalData.apiImgUrl + "newresume-footer-star-active.png",
    username: '',
    userimg: '',
    showtop: true,
    showtopone: false,
    name: "未填写",
    sex: "未填写",
    nation: "未填写",
    occupations: [],
    occupationone: "未填写",
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
    showtan: false,
    onoff: false,
    praise: 0,
    status: 0,
    collect: 0,
    is_read: "",
    distance: "0km",
    location: "",
    showdistan: true,
    is_end: 0,
    detailid: "",
    examine: true,
    options: {
        location:"",
        uuid:""
    }
  },
  errImg: function (e) {
    // console.log(e)
    // let index = e.currentTarget.dataset.index;
    // console.log(index)
    // let obj = `lists[${index}].headerimg`;
    this.setData({
      headerimg: "http://cdn.yupao.com/miniprogram/images/user.png"
    })

  },
  showThisMapInfo: function () {

    if (this.data.location) {
      let loc = this.data.location;
      let locArr = loc.split(",");

      wx.openLocation({
        latitude: parseFloat(locArr[1]),
        longitude: parseFloat(locArr[0]),
        address: this.data.city,
        scale: 18
      })
    }
  },
  telephorft() {
    let that = this
    let userInfo = wx.getStorageSync("userInfo");
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    let detailid = that.data.detailid;
    let dert = {}
    Object.assign(dert, {
      resume_uuid: detailid,
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })
    app.appRequestAction({
      url: "resumes/get-tel/",
      way: "POST",
      failTitle: "网络错误！",
      params: dert,
      success: function (res) {
        console.log(res)
        if (res.data.errcode == 5000) {
          console.log(123)
          remain.remain({
            tips: res.data.errmsg, callback: function () {
            }
          })
        }
        if (res.data.errcode == 200) {
          that.setData({
            telephone: res.data.tel,
            onoff: true
          })
        }
      },
      fail: function (err) {

      }
    })
  },
  userComplaintAction: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    let info = this.data.complainInfo;
    let detailid = _this.data.detailid;
    if (info == "") {
      app.showMyTips("请输入您的投诉内容");
      return false;
    }
    console.log(info)
    app.appRequestAction({
      url: "resumes/complain/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        resume_uuid: detailid,
        content: info
      },
      title: "正在提交投诉",
      failTitle: "网络错误，投诉失败！",
      success: function (res) {
        console.log(res)
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
    let userInfo = wx.getStorageSync("userInfo");
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    app.globalData.allexpress = false
    wx.setStorageSync("allexpress", _this.data.project)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-project-experience/allexperience",
    })
  },
  moreskill() {
    let userInfo = wx.getStorageSync("userInfo");
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    app.globalData.allskill = false
    wx.setStorageSync("allskill", _this.data.skillbooks)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-skills-certificate/skillscertificate",
    })
  },
  getdetail(option) {
    console.log(option)
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    if (!userInfo) {
      userInfo = { userId: null }
    }
    let detail = {
      userId: userInfo.userId,
      resume_uuid: option.uuid,
      location: option.location,
    }
    console.log(that.data.options)
    if (that.data.options.location != "" && that.data.options.uuid != "") {
      this.setData({
        detailid: option.uuid
      })
    } else {
      this.setData({
        detailid: option.uuid,
        options: {
          location: option.location,
          uuid: option.uuid
        }
      })
    }
    console.log(detail)
    app.appRequestAction({
      url: 'resumes/resume-detail/',
      way: 'POST',
      params: detail,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        let mydata = res.data;
        console.log(res)

        if (res.data.errcode == "ok") {

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
              age: dateone.getFullYear() - (mydata.info.birthday.split("-")[0] - 0) + "年"
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
            introduce: mydata.info.hasOwnProperty("introduce") ? mydata.info.introduce == "" ? "未填写" : mydata.info.introduce : "未填写",
            workingyears: mydata.info.hasOwnProperty("experience") ? mydata.info.experience : "",
            staffcomposition: mydata.info.hasOwnProperty("type_str") ? mydata.info.type_str : "",
            cityself: mydata.info.hasOwnProperty("hometown") ? mydata.info.hometown : "",
            procity: mydata.info.hasOwnProperty("prof_degree_str") ? mydata.info.prof_degree_str : "未填写",
            personnum: mydata.info.hasOwnProperty("number_people") ?
              mydata.info.number_people : "未填写",
            tags: mydata.info.hasOwnProperty("tags") ? mydata.info.tags : "",
            praise: mydata.operation.hasOwnProperty("is_zan") ? mydata.operation.is_zan : "",
            collect: mydata.operation.hasOwnProperty("is_collect") ? mydata.operation.is_collect : "",
            status: mydata.operation.hasOwnProperty("status") ? mydata.operation.status : "",
            is_read: mydata.info.hasOwnProperty("is_read") ? mydata.info.is_read : "",
            distance: mydata.info.hasOwnProperty("distance") ? mydata.info.distance == "" ? "0km" : mydata.info.distance : "0km",
            location: mydata.info.hasOwnProperty("location") ? mydata.info.location : "",
            is_end: mydata.info.hasOwnProperty("is_end") ? mydata.info.is_end : "",
            examine: false,
          })

          console.log(that.data.is_read)

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
              projectall.push(mydata.project[i])
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
              certificatesall.push(mydata.certificates[i])
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
            console.log(that.data.skilllength)
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
  praise() {
    let that = this
    let userInfo = wx.getStorageSync("userInfo");
    let detailid = that.data.detailid;
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    let praise = {}
    Object.assign(praise, {
      resume_uuid: detailid,
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })

    app.appRequestAction({
      url: "resumes/resume-support/",
      way: "POST",
      failTitle: "网络错误！",
      params: praise,
      success: function (res) {
        console.log(res)
        if (res.data.errcode == "ok") {
          if (res.data.show == 1) {
            app.showMyTips("点赞成功");
            _this.setData({
              praise: 1
            })
          }
          if (res.data.show == 0) {
            app.showMyTips("取消点赞");
            _this.setData({
              praise: 0
            })
          }
        }
      },
      fail: function (err) {

        app.showMyTips("请求失败");
      }
    })
  },

  collect() {
    let that = this
    let userInfo = wx.getStorageSync("userInfo");
    let detailid = that.data.detailid;
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    let collect = {}
    Object.assign(collect, {
      resume_uuid: detailid,
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })

    app.appRequestAction({
      url: "resumes/resume-collect/",
      way: "POST",
      failTitle: "网络错误！",
      params: collect,
      success: function (res) {
        console.log(res)
        if (res.data.errcode == "ok") {
          if (res.data.show == 1) {
            app.showMyTips("收藏成功");
            _this.setData({
              collect: 1
            })
          }
          if (res.data.show == 0) {
            app.showMyTips("取消收藏");
            _this.setData({
              collect: 0
            })
          }
        }
      },
      fail: function (err) {

        app.showMyTips("请求失败");
      }
    })
  },
  onShareAppMessage: function () {
    console.log(123)
    return {
      title: '在这里输入标题',
      desc: '在这里输入简介说明',
      path: '../boss-look-card/lookcard'//这是一个路径
    }
  },
  authrasution() {
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      this.setData({
        userInfo: false
      })
      return false;
    } else {
      this.setData({
        userInfo: userInfo
      })
      this.telephorft()
    }
  },
  returnPrevPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  bindGetUserInfo: function (e) {
    let that = this;
    app.bindGetUserInfo(e, function (res) {
      app.mini_user(res, function (res) {
        app.api_user(res, function (res) {
          console.log(res)
          let uinfo = res.data;
          if (uinfo.errcode == "ok") {
            let userInfo = {
              userId: uinfo.data.id,
              token: uinfo.data.sign.token,
              tokenTime: uinfo.data.sign.time,
            }
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            that.setData({ userInfo: userInfo });
            console.log(that.data.options)
            that.getdetail(that.data.options)

          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdetail(options);
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
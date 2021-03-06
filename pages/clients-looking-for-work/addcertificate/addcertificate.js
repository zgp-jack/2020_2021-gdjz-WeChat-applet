const app = getApp();
let v = require("../../../utils/v.js");
let remain = require("../../../utils/remain.js");
let reminder = require("../../../utils/reminder.js");
Page({

  /**
   * 页面的初始数据 bindstartDate nowDate deleteexper  obtn quit deleteexper != []
vertify()
   */
  data: {
    addimage: app.globalData.apiImgUrl + "lpy/addimage.png",
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
    skill_show:true,
    display: "none",
    nowDate:"",
    beforeDate:"",
    ranktypes: "",
    deletestatus: true,
    skillnum:'',
    model:{},
    checkonef:"",
    maximg: 3
  },
  vertify() {
    this.setData({
      showModal: false,
      display: "none"
    })
  },
  obtn() {
    this.setData({
      showModal: false,
      display: "none"
    })
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
    
    let that = this
    wx.previewImage({
      urls: that.data.imgArrs,
      current: e.target.dataset.item,
    })
  },
  chooseImage() {
    let that = this;
    let max = this.data.maximg - this.data.imgArrs.length;
    let fail = 0;
    let num = 0
    //allnum有几张图片正在上传;res当前图片是否上传成功
    app.userUploadImg(function (img, url, allnum, res) {
      num++//用于判断 选中的图片是否上传完毕
      if(res !== 'ok') {
        fail++//记录失败次数
      }else{
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
      }
      if(num == allnum && fail !== 0){
        wx.hideLoading()
        wx.showModal({
          title: "提示",
          content:'您有'+fail+'张图片上传失败，请重新上传',
          showCancel:true,
          confirmText:'重新上传',
          success(res){
            if(res.confirm){
              that.chooseImage()
            }
          }
        })
      }
    },max)
  },
  previewImage(e) {
    
    let that = this
    wx.previewImage({
      urls: that.data.imgArrs,
      current: e.target.dataset.item,
    })
  },
  delete(e) {
    
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
  // getuuid() {
  //   let userInfo = wx.getStorageSync("uuid");
  //   this.setData({
  //     resume_uuid: userInfo
  //   })
  // },
  deleteexper() {
    let that = this;
    if (!this.data.deletestatus) {
      return false
    } else {
      this.setData({
        deletestatus: false
      })
    }
    wx.showModal({
      title: '提示',
      content: `技能证书删除后，将无法恢复`,
      showCancel: true,
      success(res) {
        that.setData({
          deletestatus: true
        })
        if (res.confirm) {
          that.vertify()
        } else if (res.cancel) {

        }
      },
      complete() {
        console.log(123)
        that.setData({
          deletestatus: true
        })
      }
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
    
    let that = this;
    app.appRequestAction({
      url: 'resumes/del-certificate/',
      way: 'POST',
      mask: true,
      params: project,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        
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
      showModal: false,
      display: "none"
    })
  },
  quit() {
    this.setData({
      showModal: false,
      display: "none"
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
    if ((vertifyNum.isNull(this.data.name)) || !vertifyNum.isChinese(this.data.name)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实证书名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (this.data.name.length > 12 || this.data.name.length < 3) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实证书名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    // if (!vertifyNum.isChinese(this.data.name)) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '您输入的职业技能没有汉字,请重新输入',
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }

    if (vertifyNum.isNull(this.data.date)) {
      reminder.reminder({ tips: '领证时间' })
      return
    }

    if (vertifyNum.isNull(this.data.idArrs)) {

      wx.showModal({
        title: '温馨提示',
        content: '您添加的图片为空请重新添加',
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

    app.appRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      params: project,
      mask: true,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        if(res.data.errcode == "ok"){
          that.subscribeToNews(res)
          app.activeRefresh()
        }else{
          app.showMyTips(res.data.errmsg);
        }
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
  },
  subscribeToNews: function(res) {
    let that = this;
    app.subscribeToNews("resume",function(){
      remain.remain({
        tips: res.data.errmsg, callback: function () {
          if (that.data.ranktypes == "ranking") {
            wx.redirectTo({
              url: '/pages/clients-looking-for-work/all-skills-certificate/skillscertificate',
            });
          } else {
          app.globalData.allskill = true;
          wx.navigateBack({
            delta: 1
          })
          }
        }
      })
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

    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()

    if (vertifyNum.isNull(this.data.name) || !vertifyNum.isChinese(this.data.name) || this.data.name.length > 12 || this.data.name.length < 3) {
       wx.showModal({
        title: '温馨提示',
        content: '请填写真实证书名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    // if (!vertifyNum.isChinese(this.data.name)) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '请填写真实证书名称，3-12字，必须含有汉字',
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }

    // if (this.data.name.length > 12 || this.data.name.length < 3) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '请填写真实证书名称，3-12字，必须含有汉字',
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }

    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择您的领证时间',
        showCancel: false,
        success(res) { }
      })
      return
    }
    console.log(this.data.idArrs)
    if (vertifyNum.isNull(this.data.idArrs)) {
      wx.showModal({
        title: '温馨提示',
        content: '您添加的图片为空请重新输入',
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
    

    app.appRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      failTitle: "操作失败，请稍后重试！",
      params: project,
      mask: true,
      success(res) {
        if(res.data.errcode == "ok"){
          that.subscribeToNewsAgain(res)
        }else{
          app.showMyTips(res.data.errmsg);
        }
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
  },
  subscribeToNewsAgain: function(res) { 
    let that = this;
    app.subscribeToNews("resume",function(){
      remain.remain({
        tips: res.data.errmsg, callback: function () {
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
      })
    })
    
  },
  preservechixutui(){
    wx.navigateBack({
      delta: 1
    })
  },
  judgecommit(){
    if (this.data.checkonef != "0") return false 
      let userInfo = wx.getStorageSync("userInfo");
      let model = {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        resume_uuid: this.data.skill.resume_uuid || this.data.resume_uuid,
        name: this.data.skill.name,
        image: JSON.parse(JSON.stringify(this.data.skill.images)),
        certificate_uuid: this.data.skill.uuid,
        certificate_time: this.data.skill.certificate_time
      }
      this.setData({
        model: model,
        fail_case: this.data.skill.fail_case,
      })
  },
  getskill() {

    let skilltail = wx.getStorageSync("skilltail");
    let certificate_count = wx.getStorageSync("certificate_count");
    let certificate_cou = wx.getStorageSync("skillnum") || this.data.skillnum;
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
    
    if (skilltail) {
      wx.setNavigationBarTitle({
        title: '修改技能证书'
      })
      this.setData({
        obtnbut: false
      })
      this.setData({
        skill: skilltail.uid
      })
      
      this.setData({
        name: this.data.skill.name,
        imgArrs: this.data.skill.image,
        idArrs: this.data.skill.images,
        resume_uuid: this.data.skill.resume_uuid||this.data.resume_uuid,
        uuid: this.data.skill.uuid,
        date: this.data.skill.certificate_time,
        checkonef: this.data.skill.check
      })
      this.judgecommit()
      if (this.data.imgArrs.length >= 3) {
        this.setData({
          imgArrslength: false
        })
      }
    }
  },
  preserveone() {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()
    if ((vertifyNum.isNull(this.data.name)) || !vertifyNum.isChinese(this.data.name)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实证书名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (this.data.name.length > 12 || this.data.name.length < 3) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实证书名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    // if (!vertifyNum.isChinese(this.data.name)) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '您输入的职业技能没有汉字,请重新输入',
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }

    if (vertifyNum.isNull(this.data.date)) {
      reminder.reminder({ tips: '领证时间' })
      return
    }

    if (vertifyNum.isNull(this.data.idArrs)) {

      wx.showModal({
        title: '温馨提示',
        content: '您添加的图片为空请重新添加',
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
    console.log(this.data.model)

    if(JSON.stringify(project) == JSON.stringify(this.data.model) && this.data.checkonef == '0'){
      wx.showModal({
        title: '温馨提示',
        content: that.data.fail_case,
        showCancel: false,
        success(res) { }
      })
      return
    }

    app.appRequestAction({
      url: 'resumes/certificate/',
      way: 'POST',
      failTitle: "操作失败，请稍后重试！",
      mask: true,
      params: project,
      success(res) {
        that.subscribeToNews(res)
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

    
    
  },
  starttimer() {
    let timer = new Date();
    let d = new Date(timer);
    let times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.setData({
      nowDate: times
    })
    let starttime = this.data.nowDate.split("-");
    let starttimeone = this.data.nowDate.split("-")[0] - 0;
    let starttimetwo = this.data.nowDate.split("-")[1];
    let starttimethree = this.data.nowDate.split("-")[2];

    let beforeDate = (starttimeone - 20) + "-" + starttimetwo + "-" + starttimethree;
    this.setData({
      beforeDate: beforeDate
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  ranktypes(options) {
    if (options.hasOwnProperty("ranktype")) {
    this.setData({
      ranktypes: options.ranktype
    })
    }
  },
  onLoad: function (options) {
    this.getskill()
    this.ranktypes(options)
    let certificate_count = options.certificate_count;
    let resume_uuid = options.resume_uuid
    let skillnum = options.skillnum || "";
    this.setData({
      skillnum:skillnum,
      certificate_count:certificate_count,
      resume_uuid:resume_uuid
    })
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
    // this.getuuid()
    this.starttimer()
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
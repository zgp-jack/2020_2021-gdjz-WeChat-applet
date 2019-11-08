const app = getApp();
let v = require("../../../utils/v.js");
let areas = require("../../../utils/area.js");
let remain = require("../../../utils/remain.js");
//bindstartDate delete vertify
Page({
  data: {
    project: "",
    date: "",
    startdate: "",
    allprovinces: "",
    region: "",
    imgArrs: [],
    importimg: [],
    idArrs: [],
    multiArray: [],
    multiArrayone: [],
    provicemore: [],
    objectMultiArray: [],
    multiIndex: [0, 0],
    multiIndexvalue: "",
    provincecity: "",
    context: "",
    resume_uuid: "",
    projectname: "",
    detail: "",
    showModal: false,
    uuid: "",
    obtnbut: true,
    nowDate: ""
  },
  getbirth() {
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
    var nowDate = year + "-" + month + "-" + day;
    this.setData({
      nowDate: nowDate
    });

  },
  obtn() {
    this.setData({
      showModal: false
    })
  },
  deleteexper() {
    this.setData({
      showModal: true
    })
  },
  projectname(e) {
    this.setData({
      projectname: e.detail.value
    })
  },
  bindDateChange(e) {
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
  bindTextAreaBlur(e) {
    this.setData({
      detail: e.detail.value
    })
  },
  bindstartDate(e) {
    this.setData({
      startdate: e.detail.value
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
      that.data.importimg.push(url.url)
      that.setData({
        imgArrs: that.data.imgArrs
      })
    })
  },
  initAllProvice: function () { //获取所有省份
    let that = this;
    let arr = app.arrDeepCopy(areas.getPublishArea());
    this.setData({
      allprovinces: arr
    })
    let provice = [];
    let provicemore = [];
    let provicechild = [];
    let provicechildmore = [];
    let array = [];
    let arrayname = [];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let data = { id: arr[i].id, pid: arr[i].pid, name: arr[i].name }
      let dataone = arr[i].name

      provice.push(data)
      provicemore.push(dataone)
      array[i] = [];
      arrayname[i] = []
      if (arr[i].children.length == 0) {
        array[i].push(arr[i])
        arrayname[i].push(arr[i].name)
      }
      for (let j = 0; j < arr[i].children.length; j++) {
        if (arr[i].children[j].id) {
          let datachild = { id: arr[i].children[j].id, pid: arr[i].children[j].pid, name: arr[i].children[j].name }

          if (arr[i].children[j].pid - 2 == i) {
            array[i].push(arr[i].children[j])
            arrayname[i].push(arr[i].children[j].name)
          }
        } else {
          let datachildone = arr[i].name
          provicechildmore.push(datachildone)
        }
      }
      provicechild.push(array[i])
      provicechildmore.push(arrayname[i])
    }
    this.setData({
      multiArrayone: [provicemore, provicechildmore],
      objectMultiArray: [provice, provicechild]
    })
    this.setData({
      provicemore: provicemore
    })
    this.setData({
      multiArray: [provicemore, that.data.multiArrayone[1][0]],
      objectMultiArray: [provice, provicechild]
    })
  },
  bindMultiPickerChange: function (e) {    //最终家乡的选择
    let that = this;
    this.setData({
      multiIndex: e.detail.value
    })
    let allpro = '';
    if (this.data.allprovinces[this.data.multiIndex[0]].children.length != 0) {

      allpro = this.data.allprovinces[this.data.multiIndex[0]].id + "," + this.data.allprovinces[this.data.multiIndex[0]].children[this.data.multiIndex[1]].id
      this.setData({
        multiIndexvalue: that.data.allprovinces[that.data.multiIndex[0]].name + that.data.allprovinces[that.data.multiIndex[0]].children[that.data.multiIndex[1]].name
      })
    } else {
      allpro = this.data.allprovinces[this.data.multiIndex[0]].id + "," + this.data.allprovinces[this.data.multiIndex[0]].id
      this.setData({
        multiIndexvalue: that.data.allprovinces[that.data.multiIndex[0]].name + that.data.allprovinces[that.data.multiIndex[0]].name
      })
    }
    this.setData({
      provincecity: allpro
    })
  },

  bindMultiPickerColumnChange: function (e) {   //下滑家乡列表所产生的函数
    let that = this;
    let namearry = this.data.multiArrayone;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case data.multiIndex[0]:
            data.multiArray[1] = namearry[1][data.multiIndex[0]];
            break;
        }
        data.multiIndex[1] = 0;
        break;

    }
    this.setData(data);
    console.log(data)
  },
  preserve() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()

    if (vertifyNum.isNull(this.data.startdate)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的开始时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的完工时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (new Date(this.data.startdate).getTime() > new Date(this.data.date).getTime()){
      wx.showModal({
        title: '温馨提示',
        content: '您输入的开始时间大于完工时间,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.projectname)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的项目名称为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.detail)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的项目描述为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的所在地区为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.importimg)) {
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
      completion_time: this.data.date,
      start_time: this.data.startdate,
      project_name: this.data.projectname,
      detail: this.data.detail,
      province: this.data.provincecity.split(",")[0],
      city: this.data.provincecity.split(",")[1],
      image: this.data.importimg
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/project/',
      way: 'POST',
      params: project,
      failTitle: "操作失败，请稍后重试！",
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
  preservechixu() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()

    if (vertifyNum.isNull(this.data.startdate)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的开始时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的完工时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (new Date(this.data.startdate).getTime() > new Date(this.data.date).getTime()) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的开始时间大于完工时间,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.projectname)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的项目时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.detail)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的项目描述为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的所在地区为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.importimg)) {
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
      completion_time: this.data.date,
      start_time: this.data.startdate,
      project_name: this.data.projectname,
      detail: this.data.detail,
      province: this.data.provincecity.split(",")[0],
      city: this.data.provincecity.split(",")[1],
      image: this.data.importimg
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/project/',
      way: 'POST',
      params: project,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            if (res.data.errcode == "ok") {
              that.setData({
                projectname: "",
                startdate: "",
                date: "",
                detail: "",
                provincecity: "",
                multiIndexvalue: "",
                importimg: [],
                imgArrs: []
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
  getuuid() {
    let userInfo = wx.getStorageSync("uuid");
    this.setData({
      resume_uuid: userInfo
    })
  },
  delete(e) {
    console.log(e)
    this.data.imgArrs.splice(e.currentTarget.dataset.index, 1)
    this.data.importimg.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgArrs: this.data.imgArrs
    })
    this.setData({
      importimg: this.data.importimg
    })
    console.log(this.data.importimg)
  },
  vertify() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    Object.assign(project, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      project_uuid: this.data.uuid
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/del-project/',
      way: 'POST',
      params: project,
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        console.log(res)
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            if (res.data.errcode == "ok") {
              that.delestore();
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

  getproject() {
    let that = this;
    let project = wx.getStorageSync("projectdetail");
    if (project) {
      wx.setNavigationBarTitle({
        title: '修改项目经验'
      })
      this.setData({
        obtnbut: false
      })
      this.setData({
        project: project.uid,
      })
      console.log(this.data.project)

      this.setData({
        projectname: this.data.project.project_name,
        date: this.data.project.completion_time,
        multiIndexvalue: this.data.project.province_name + this.data.project.city_name,
        startdate: this.data.project.start_time,
        detail: this.data.project.detail,
        imgArrs: this.data.project.image,
        resume_uuid: this.data.project.resume_uuid,
        uuid: this.data.project.uuid,
        provincecity: this.data.project.province + "," + this.data.project.city
      })

      var s = this.data.date;
      var a = s.split(/[^0-9]/);
      var d = new Date(a[0], a[1] - 1, a[2])
      if (d.getTime() + 86400000 > new Date().getTime()) {
        this.setData({
          date: "至今"
        })
      }
      console.log(this.data.objectMultiArray)
      let one = "";
      let two = "";
      let osplit = this.data.provincecity.split(",");
      for (let i = 0; i < this.data.objectMultiArray[0].length; i++) {
        if (osplit[0] == this.data.objectMultiArray[0][i].id) {
          this.data.multiIndex[0] = i
          one = i
        }
      }
      for (let i = 0; i < this.data.objectMultiArray[1].length; i++) {
        for (let j = 0; j < this.data.objectMultiArray[1][i].length; j++) {
          if (osplit[1] == this.data.objectMultiArray[1][i][j].id) {
            this.data.multiIndex[1] = j
            two = j
          }
        }
      }
      this.setData({
        multiIndex: this.data.multiIndex
      })

      that.setData({
        multiArray: [that.data.provicemore, that.data.multiArrayone[1][one]],
      })


      this.setData({
        importimg: this.data.project.images
      })
    }
  },
  preserveone() {
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}
    let vertifyNum = v.v.new()

    if (vertifyNum.isNull(this.data.startdate)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的开始时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的完工时间为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (new Date(this.data.startdate).getTime() > new Date(this.data.date).getTime()) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的开始时间大于完工时间,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.projectname)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的项目名称为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.detail)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的项目描述为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的所在地区为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.importimg)) {
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
      completion_time: this.data.date,
      start_time: this.data.startdate,
      project_name: this.data.projectname,
      detail: this.data.detail,
      province: this.data.provincecity.split(",")[0],
      city: this.data.provincecity.split(",")[1],
      image: this.data.importimg,
      project_uuid: this.data.uuid
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/project/',
      way: 'POST',
      params: project,
      failTitle: "操作失败，请稍后重试！",
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
  delestore() {
    wx.removeStorageSync("projectdetail")
  },
  onShow: function () {
    this.getbirth()
    this.getuuid()

  },
  onLoad: function (options) {
    this.initAllProvice()
    this.getproject()

  },

})
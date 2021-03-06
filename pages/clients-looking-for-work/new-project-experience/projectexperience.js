const app = getApp()
let v = require("../../../utils/v.js");
let areas = require("../../../utils/area.js");
let remain = require("../../../utils/remain.js");
let reminder = require("../../../utils/reminder.js");
//bindstartDate delete vertify vertify preservechixu bindTextAreaBlur 大于今天 chooseImage delete preserve showModal vertify() showModal deleteexper vertify multiIndexvalue projectnum nowDate share

Page({
  data: {
    addimage: app.globalData.apiImgUrl + "lpy/addimage.png",
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
    detailength: 0,
    showModal: false,
    uuid: "",
    obtnbut: true,
    nowDate: "",
    beforeDate: "",
    emdDate: "",
    project_cou: 0,
    project_count: 0,
    project_show: true,
    imgArrslength: true,
    display: "none",
    ranktypes: "",
    deletestatus:true,
    model:{},
    checkonef:"",
    maximg: 6,
    reqStatus: true
  },
  hiddenKeyBoard: function () {
    wx.hideKeyboard()
  },
  obtn() {
    this.setData({
      showModal: false,
      display: "none"
    })
  },
  getbirthall() {
    let starttime = this.data.startdate.split("-");
    let starttimeone = this.data.startdate.split("-")[0] - 0;
    let starttimetwo = this.data.startdate.split("-")[1] - 0;
    let starttimethree = this.data.startdate.split("-")[2] - 0;

    let endtime = this.data.date.split("-");
    let endtimeone = this.data.date.split("-")[0] - 0;
    let endtimetwo = this.data.date.split("-")[1] - 0;
    let endtimethree = this.data.date.split("-")[2] - 0;
    if (endtimeone - starttimeone == 20 && endtimetwo - starttimetwo >= 0 && endtimethree - starttimethree > 0 || endtimeone - starttimeone > 20) {
      return false
    }
    return true
  },
  obtn() {
    this.setData({
      showModal: false
    })
  },
  deleteexper() {
    if(!this.data.deletestatus){
          return false
    }else{
      this.setData({
        deletestatus: false
      })
    }

    let that = this;
    wx.showModal({
      title: '提示',
      content: `项目经验删除后，将无法恢复`,
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
      complete(){
        
        that.setData({
          deletestatus: true
        })
      }
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
    if(e.detail.value.length > 500){
      let str = e.detail.value.substring(0,500)
      this.setData({
        detail: str,
        detailength: 500
      })
    }else{
      this.setData({
        detailength: e.detail.value.length
      })
    }
  },
  bindstartDate(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  chooseImage() {
    let that = this;
    let max = this.data.maximg - this.data.imgArrs.length;
    let fail = 0;
    let num = 0
    //allnum有几张图片正在上传;res当前图片是否上传成功
    app.userUploadImg(function (img, url,allnum,res) {
      num++//用于判断 选中的图片是否上传完毕
      if(res !== 'ok') {
        fail++//记录失败次数
      }else{
        wx.hideLoading()
        that.data.imgArrs.push(url.httpurl)
        that.data.importimg.push(url.url)
        that.setData({
          imgArrs: that.data.imgArrs
        })
        if (that.data.imgArrs.length >= 6) {
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
      allpro = this.data.allprovinces[this.data.multiIndex[0]].id
      this.setData({
        multiIndexvalue: that.data.allprovinces[that.data.multiIndex[0]].name
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

  },
  preserve: function () {
    let that = this;
    let project_count = that.data.project_count
    if (that.data.project_cou >= project_count) {
      wx.showModal({
        title: '温馨提示',
        content: `最多只能添加${project_count}个项目`,
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

    // if (vertifyNum.isNull(this.data.projectname)) {
    //   reminder.reminder({ tips: '项目名称' })
    //   return
    // }
    if (vertifyNum.isNull(this.data.projectname) || !vertifyNum.isChinese(this.data.projectname)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (this.data.projectname.length > 12 || this.data.projectname.length < 3) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.startdate)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择开工时间',
        showCancel: false,
        success(res) { }
      })
      return
    }

    // if (new Date(this.data.startdate).getTime() > new Date().getTime()) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: `您输入开始时间不能大于今天`,
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }

    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择完工时间（完工时间必须大于开工时间）',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (new Date(this.data.startdate).getTime() > new Date(this.data.date).getTime()) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择完工时间（完工时间必须大于开工时间）',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择项目所在地区',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (vertifyNum.isNull(this.data.detail)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目介绍，15-500字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }


    if ((!vertifyNum.isChinese(this.data.detail)) || this.data.detail.length < 15 || this.data.detail.length > 500) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目介绍，15-500字，必须含有汉字',
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
      province: String(this.data.provincecity.split(",")[0]),
      city: String(this.data.provincecity.split(",")[1]),
      image: this.data.importimg
    })

    app.appRequestAction({
      url: 'resumes/project/',
      way: 'POST',
      mask: true,
      params: project,
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
  preservechixu() {
    let that = this;
    let project_count = that.data.project_count;
    if (that.data.project_cou >= project_count) {
      wx.showModal({
        title: '温馨提示',
        content: `最多只能添加${project_count}个项目`,
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

    if (vertifyNum.isNull(this.data.projectname) || !vertifyNum.isChinese(this.data.projectname)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (this.data.projectname.length > 12 || this.data.projectname.length < 3) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.startdate)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择开工时间',
        showCancel: false,
        success(res) { }
      })
      return
    }

    // if (new Date(this.data.startdate).getTime() > new Date().getTime()) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: `您输入开始时间不能大于今天`,
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }

    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择完工时间（完工时间必须大于开工时间）',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (new Date(this.data.startdate).getTime() > new Date(this.data.date).getTime()) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择完工时间（完工时间必须大于开工时间）',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择项目所在地区',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (vertifyNum.isNull(this.data.detail)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目介绍，15-500字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }


    if ((!vertifyNum.isChinese(this.data.detail)) || this.data.detail.length < 15 || this.data.detail.length > 500) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目介绍，15-500字，必须含有汉字',
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

    app.appRequestAction({
      url: 'resumes/project/',
      way: 'POST',
      mask: true,
      params: project,
      failTitle: "操作失败，请稍后重试！",
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
            project_cou: res.data.count
          })
          app.globalData.allexpress = true;

          that.projectshow()

          that.setData({
            projectname: "",
            startdate: "",
            date: "",
            detail: "",
            provincecity: "",
            multiIndexvalue: "",
            importimg: [],
            imgArrs: [],
            detailength: 0,
            imgArrslength: true
          })
        }
      })
    })
    
  },
  // getuuid() {
  //   let userInfo = wx.getStorageSync("uuid");
  //   this.setData({
  //     resume_uuid: userInfo
  //   })
  // },
  delete(e) {

    this.data.imgArrs.splice(e.currentTarget.dataset.index, 1)
    this.data.importimg.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgArrs: this.data.imgArrs
    })
    this.setData({
      importimg: this.data.importimg
    })

    if (this.data.imgArrs.length < 6) {
      this.setData({
        imgArrslength: true
      })
    }

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

    let that = this;
    app.appRequestAction({
      url: 'resumes/del-project/',
      way: 'POST',
      mask: true,
      params: project,
      failTitle: "操作失败，请稍后重试！",
      success(res) {

        remain.remain({
          tips: res.data.errmsg, callback: function () {
            if (res.data.errcode == "ok") {
              that.delestore();
              app.globalData.allexpress = true;
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
  judgecommit(){
      if (this.data.checkonef != "0") return false 
      let userInfo = wx.getStorageSync("userInfo");

      let model = {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        resume_uuid: this.data.project.resume_uuid || this.data.resume_uuid,
        completion_time: this.data.project.completion_time,
        start_time: this.data.project.start_time,
        project_name: this.data.project.project_name,
        detail: this.data.project.detail,
        province: (this.data.project.province + "," + this.data.project.city).split(",")[0],
        city: (this.data.project.province + "," + this.data.project.city).split(",")[1],
        image: this.data.project.images[0] == "" ? JSON.parse(JSON.stringify([])) : JSON.parse(JSON.stringify(this.data.project.images)) ,
        project_uuid: this.data.project.uuid,
        
      }
     this.setData({
       model:model,
       fail_case: this.data.project.fail_case,
     })
  },
  getproject() {
    let that = this;
    let project = wx.getStorageSync("projectdetail");
    let project_count = wx.getStorageSync("project_count");
    let projectnum = wx.getStorageSync("projectnum");
    if (project_count) {
      this.setData({
        project_count: project_count
      })
    }
    if (project_count) {
      this.setData({
        project_cou: projectnum
      })
    }
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

      this.setData({
        projectname: this.data.project.project_name,
        date: this.data.project.completion_time,
        multiIndexvalue: this.data.project.province_name + this.data.project.city_name,
        startdate: this.data.project.start_time,
        detail: this.data.project.detail,
        detailength: this.data.project.detail.length,
        imgArrs: this.data.project.image,
        resume_uuid: this.data.project.resume_uuid||this.data.resume_uuid,
        uuid: this.data.project.uuid,
        provincecity: this.data.project.province + "," + this.data.project.city,
        checkonef: this.data.project.check
      })
      this.judgecommit()
      // var s = this.data.date;
      // var a = s.split(/[^0-9]/);
      // var d = new Date(a[0], a[1] - 1, a[2])
      // if (d.getTime() + 86400000 > new Date().getTime()) {
      //   this.setData({
      //     date: "至今"
      //   })
      // }

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
        importimg: this.data.project.images[0] == "" ? [] : this.data.project.images
      })
      if (that.data.imgArrs.length >= 6) {
        that.setData({
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

    if (vertifyNum.isNull(this.data.projectname) || !vertifyNum.isChinese(this.data.projectname)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (this.data.projectname.length > 12 || this.data.projectname.length < 3) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目名称，3-12字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.startdate)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择开工时间',
        showCancel: false,
        success(res) { }
      })
      return
    }

    // if (new Date(this.data.startdate).getTime() > new Date().getTime()) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: `您输入开始时间不能大于今天`,
    //     showCancel: false,
    //     success(res) { }
    //   })
    //   return
    // }

    if (vertifyNum.isNull(this.data.date)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择完工时间（完工时间必须大于开工时间）',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (new Date(this.data.startdate).getTime() > new Date(this.data.date).getTime()) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择完工时间（完工时间必须大于开工时间）',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择项目所在地区',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (vertifyNum.isNull(this.data.detail)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目介绍，15-500字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }


    if ((!vertifyNum.isChinese(this.data.detail)) || this.data.detail.length < 15 || this.data.detail.length > 500) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实项目介绍，15-500字，必须含有汉字',
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
    console.log(this.data.model)
    if (JSON.stringify(project) == JSON.stringify(this.data.model) && this.data.checkonef == '0') {
      wx.showModal({
        title: '温馨提示',
        content: that.data.project.fail_case,
        showCancel: false,
        success(res) { }
      })
      return
    }
    this.setData({ reqStatus: false })
    app.appRequestAction({
      url: 'resumes/project/',
      way: 'POST',
      params: project,
      failTitle: "操作失败，请稍后重试！",
      mask: true,
      success(res) {
        if(res.data.errcode == "ok"){
          that.subscribeToNews(res)
        }else{
          app.showMyTips(res.data.errmsg);
        }
        that.setData({ reqStatus: true })
      },
      fail: function (err) {
        that.setData({ reqStatus: true })
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
              url: '/pages/clients-looking-for-work/all-project-experience/allexperience',
            });
          } else {
            app.globalData.allexpress = true;
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    })
  },
  delestore() {
    wx.removeStorageSync("projectdetail")
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
    let emdDate = (starttimeone + 20) + "-" + starttimetwo + "-" + starttimethree;
    this.setData({
      beforeDate: beforeDate,
      emdDate: emdDate
    })

  },

  onShow: function () {
    // this.getbirth()
    // this.getuuid()
    this.projectshow()
    this.starttimer()

  },
  preservechixutui() {
    wx.navigateBack({
      delta: 1
    })
  },
  projectshow() {
    let that = this;
    if (that.data.project_cou >= that.data.project_count - 1) {

      that.setData({
        project_show: false
      })
    }


  },
  ranktypes(options) {
    if (options.hasOwnProperty("ranktype")) {
    this.setData({
      ranktypes: options.ranktype
    })
    }
  },
  onLoad: function (options) {
    this.initAllProvice()
    this.getproject()
    this.ranktypes(options)
    let project_count = options.project_count;
    let resume_uuid = options.resume_uuid
    this.setData({
      project_count:project_count,
      resume_uuid:resume_uuid
    })
  },

})
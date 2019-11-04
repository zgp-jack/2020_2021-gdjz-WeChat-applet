const app = getApp();
let v = require("../../../utils/v.js");
let areas = require("../../../utils/area.js");
//bindstartDate delete
Page({
  data: {
    date: "",
    startdate:"",
    allprovinces:"",
    region:"",
    imgArrs:[],
    importimg:[],
    idArrs: [],
    multiArray: [],
    multiArrayone: [],
    objectMultiArray: [],
    multiIndex: [0, 0],
    multiIndexvalue:"",
    provincecity:"",
    context:"",
    resume_uuid:"",
    projectname:"",
    detail:""
  },
  projectname(e){
    this.setData({
      projectname: e.detail.value
    })
  },
  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },
  previewImage(e){
    console.log(e)
    let that = this
    wx.previewImage({
      urls: that.data.imgArrs,
      current: e.target.dataset.item,
    })
  },
  bindTextAreaBlur(e){
    this.setData({
      detail: e.detail.value
    })
  },
  bindstartDate(e){
    this.setData({
      startdate: e.detail.value
    })
  },
  chooseImage() {
    let that = this;
    if (that.data.imgArrs.length>=6){
      wx.showModal({
        title: '温馨提示',
        content: '您最多只能选择六张图片',
        showCancel: false,
        success(res) { }
      })
      return
    }
    app.userUploadImg(function(img,url){
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
  preserve(){
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}

    let oimg = ""
    for (let i = 0; i<this.data.importimg.length;i++){
      if (i == this.data.importimg.length-1){
        oimg += this.data.importimg[i]
      }else{
        oimg += this.data.importimg[i] + ","
      }

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
      image: oimg
    })
    console.log(project)
    let that = this;
    app.doRequestAction({
      url: 'resumes/project/',
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
  preservechixu(){
    let userInfo = wx.getStorageSync("userInfo");
    let project = {}

    let oimg = ""
    for (let i = 0; i < this.data.importimg.length; i++) {
      if (i == this.data.importimg.length - 1) {
        oimg += this.data.importimg[i]
      } else {
        oimg += this.data.importimg[i] + ","
      }

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
      image: oimg
    })
    console.log(project)
    let that = this;
    app.doRequestAction({
      url: 'resumes/project/',
      way: 'POST',
      params: project,
      success(res) {
        wx.showModal({
          title: '温馨提示',
          content: '保存成功,继续添加',
          showCancel: false,
          success(res) {
          }
        })

      }
    })
  },
  getuuid(){
    let userInfo = wx.getStorageSync("uuid");
    this.setData({
      resume_uuid: userInfo
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
      importimg: this.data.importimg
    })
  },
  onShow: function () {
    this.initAllProvice()
    this.getuuid()
  },
  onLoad: function (options) {

  },

})
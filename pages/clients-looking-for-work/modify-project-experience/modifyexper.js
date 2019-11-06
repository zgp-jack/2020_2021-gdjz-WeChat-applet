const app = getApp();
let v = require("../../../utils/v.js");
let areas = require("../../../utils/area.js");
Page({

  /**
   * 页面的初始数据 bindstartDate delete deleteexper obtn vertify
   */
  data: {
    project:"",
    resume_uuid:"",
    uuid:"",
    multiArray: [],
    multiArrayone: [],
    objectMultiArray: [],
    multiIndex: [0, 0],
    multiIndexvalue: "",
    provincecity:"",
    imgArrs: [],
    idArrs: [],
    regionone: "",
    showModal: false,
    name:"",
    date: "",
    startdate:"",
    content:""
  },
  changeReginone(e) {
    console.log(e.detail.value)
    this.setData({
      regionone: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },

  preventTouchMove: function () {
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindstartDate(e) {
    this.setData({
      startdate: e.detail.value
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
  vertify(){
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
      success(res) {
        if (res.data.errcode == "fail") {
          wx.showModal({
            title: '温馨提示',
            content: '操作错误请重新操作',
            showCancel: false,
            success(res) {
            }
          })
        }
        if (res.data.errcode == "ok") {
          wx.showModal({
            title: '温馨提示',
            content: '删除成功',
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
    this.setData({
      showModal: false
    })
  },
  delete(e){
    console.log(e)
    this.data.imgArrs.splice(e.currentTarget.dataset.index,1)
    this.data.idArrs.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgArrs: this.data.imgArrs
    })
    this.setData({
      idArrs: this.data.idArrs
    })
  },
  obtn() {
    this.setData({
      showModal: false
    })
  },
  deleteexper(){
    this.setData({
      showModal: true
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
    console.log(that.data.imgArrs)
    console.log(that.data.idArrs)
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
    console.log(this.data.multiArrayone)
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
    if (vertifyNum.isNull(this.data.name)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的项目名称为空请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.content)) {
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
      completion_time: this.data.date,
      start_time: this.data.startdate,
      project_name: this.data.name,
      detail: this.data.content,
      province: this.data.provincecity.split(",")[0],
      city: this.data.provincecity.split(",")[1],
      image: this.data.idArrs,
      project_uuid: this.data.uuid
    })
    console.log(project)
    let that = this;
    app.appRequestAction({
      url: 'resumes/project/',
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
            content: res.data.errmsg,
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
  ovalue(e){
    this.setData({
      name: e.detail.value
    })
  },
  ocontent(e){
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getproject()
    this.initAllProvice()
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
  getproject(){
    let project = wx.getStorageSync("projectdetail");
    this.setData({
      project: project.uid,
    })
    console.log(this.data.project)

    this.setData({
      name: this.data.project.project_name,
      date: this.data.project.completion_time,
      multiIndexvalue: this.data.project.province_name + this.data.project.city_name,
      startdate: this.data.project.start_time,
      content: this.data.project.detail,
      imgArrs: this.data.project.image,
      resume_uuid: this.data.project.resume_uuid,
      uuid: this.data.project.uuid,
      provincecity: this.data.project.province + "," + this.data.project.city
    })


    this.setData({
      idArrs: this.data.project.images
    })
    console.log(this.data.idArrs)
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
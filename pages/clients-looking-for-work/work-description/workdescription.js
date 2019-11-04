// pages/clients-looking-for-work/work-description/workdescription.js
let areas = require("../../../utils/area.js");
const app = getApp();
let v = require("../../../utils/v.js");
Page({

  /**
   * 页面的初始数据  allprovinces
   */ 
  data: {
    workage:"",
    multiArray:[],
    multiArrayone:[],
    objectMultiArray:[],
    multiIndex:[0,0],
    provincecity:"",
    proficiencyarray:[],
    proficiencyarrayone: [],
    degreeone:0,
    compositionarray:[],
    compositionarrayone: [],
    constituttion:"",
    judge:false,
    detailevaluation:[],
    evaluation:[],
    labelnum:"",
    teamsnumber:""
  },
  peopleage(e){   //工龄的选择
    this.setData({
      workage: ~~e.detail.value
    })
  },
  teamsnum(e) {  //队伍人数的额选择
    this.setData({
      teamsnumber: ~~e.detail.value
    })
  },
  proficiency(e) {   //熟练度的选择
    console.log(this.data.proficiencyarrayone[e.detail.value].id)
    this.setData({
      indexproficiency: e.detail.value,
      degreeone: ~~this.data.proficiencyarrayone[e.detail.value].id
    })
  },
  constitute(e){     //人员构成的选择
    this.setData({
      indexperson: e.detail.value,
      constituttion: ~~this.data.compositionarrayone[e.detail.value].id
    })
    if (this.data.compositionarrayone[e.detail.value].id>1){
      this.setData({
        judge: true
      })
    }
  },
  accessprovince() {  //大部分piker需要的数据
    let that = this;
    app.doRequestAction({
      url: 'resumes/get-data/',
      way: 'GET',
      success(res) {
        console.log(res)
        let alllabel = [];
        let proficiencyarray = [];
        let compositionarray = [];

        for (let i = 0; i < res.data.label.length; i++) {
          res.data.label[i].classname = "informationnosave"
        }
        for (let i = 0; i < res.data.prof_degree.length; i++) {
          proficiencyarray.push(res.data.prof_degree[i].name)
        }
        for (let i = 0; i < res.data.type.length; i++) {
          compositionarray.push(res.data.type[i].name)
        }

        that.setData({
          detailevaluation: res.data.label,
          proficiencyarray: proficiencyarray,
          proficiencyarrayone: res.data.prof_degree,
          compositionarray: compositionarray,
          compositionarrayone: res.data.type
        })

      }
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
      allpro = this.data.allprovinces[this.data.multiIndex[0]].id
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

  clock(e) {   //标签选择的处理
    let that = this;
    let off = true;
    for (let i = 0; i < this.data.evaluation.length; i++) {
      if (this.data.evaluation[i] === e.currentTarget.dataset.index) {
        this.data.evaluation.splice(i, 1)
        off = false;
      }
    }
    if (this.data.evaluation.length >= 3) {
      return
    }

    if (off) {
      this.data.evaluation.push(e.currentTarget.dataset.index)
      let labelnum = "";
      for (let i = 0; i < this.data.evaluation.length;i++){
        labelnum += this.data.evaluation[i] + ","
      }
      that.setData({
        labelnum: labelnum
      })
    }
    let odetailevaluation = this.data.detailevaluation
    if (odetailevaluation[e.currentTarget.dataset.index - 1].classname != "oinformationnosave") {
      odetailevaluation[e.currentTarget.dataset.index - 1].classname = "oinformationnosave"
      that.setData({
        detailevaluation: odetailevaluation
      })
    } else {
      odetailevaluation[e.currentTarget.dataset.index - 1].classname = "informationnosave"
      that.setData({
        detailevaluation: odetailevaluation
      })
    }

  },
  submitmaterial() {     //发数据给后台
    let information = {}
    let userInfo = wx.getStorageSync("userInfo");
    let vertifyNum = v.v.new()
    if (vertifyNum.isNull(this.data.workage)) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的工龄为空,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      wx.showModal({
        title: '温馨提示',
        content: '您选择的家乡为空,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.degreeone)) {
      wx.showModal({
        title: '温馨提示',
        content: '您选择的熟练度为空,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.constituttion)) {
      wx.showModal({
        title: '温馨提示',
        content: '您选择的人员构成为空,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (vertifyNum.isNull(this.data.teamsnumber) && this.data.constituttion != 1) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的队伍人数为空或者为零,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (this.data.labelnum.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您选择的标签为空,请重新输入',
        showCancel: false,
        success(res) { }
      })
      return
    }
    Object.assign(information, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      experience: this.data.workage,
      hometown: this.data.provincecity,
      prof_degree: this.data.degreeone,
      type: this.data.constituttion,
      number_people: this.data.teamsnumber,
      tags: this.data.labelnum
    })
    console.log(information)
    // app.doRequestAction({
    //   url: "resumes/introduce/",
    //   way: "POST",
    //   params: information,
    //   success: function (res) {
    //     console.log(res)
    //     wx.navigateTo({
    //       url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
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
  onShow: function () {
    this.accessprovince()
    this.initAllProvice()
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
  onShareAppMessage: function () {

  }
})
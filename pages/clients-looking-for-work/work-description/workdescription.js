// .labelnum judge  bindMultiPickerChange bindMultiPickerColumnChange multiIndexvalue submitmaterial indexperson compositionarray
let areas = require("../../../utils/area.js");
const app = getApp();
let v = require("../../../utils/v.js");
let remain = require("../../../utils/remain.js");
let reminder = require("../../../utils/reminder.js");
Page({

  /**
   * multiArray bindMultiPickerColumnChange workage
   */
  data: {
    workage: "",
    multiArray: [],
    multiArrayone: [],
    objectMultiArray: [],
    multiIndex: [0, 0],
    provincecity: "",
    proficiencyarray: [],
    proficiencyarrayone: [],
    degreeone: 0,
    compositionarray: [],
    compositionarrayone: [],
    constituttion: "",
    judge: false,
    detailevaluation: [],
    evaluation: [],
    labelnum: [],
    teamsnumber: "",
    multiIndexvalue: "",
    multiIndexsuan: [],
    provicemore: []
  },
  peopleage(e) { //工龄的选择
    this.setData({
      workage: e.detail.value
    })
  },
  teamsnum(e) { //队伍人数的额选择
    this.setData({
      teamsnumber: e.detail.value
    })
  },
  proficiency(e) { //熟练度的选择

    this.setData({
      indexproficiency: e.detail.value,
      degreeone: this.data.proficiencyarrayone[e.detail.value].id
    })
  },
  constitute(e) { //人员构成的选择
    this.setData({
      indexperson: e.detail.value,
      constituttion: this.data.compositionarrayone[e.detail.value].id
    })


    if (this.data.compositionarrayone[e.detail.value].id > 1) {
      this.setData({
        judge: true
      })
    }
    if (this.data.compositionarrayone[e.detail.value].id <= 1) {
      this.setData({
        judge: false
      })
    }
  },
  accessprovince() { //大部分piker需要的数据
    let that = this;
    app.appRequestAction({
      url: 'resumes/get-data/',
      way: 'GET',
      failTitle: "操作失败，请稍后重试！",
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

        that.getintrodetail()
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: "请求失败",
          showCancel: false,
          success(res) {
            wx.navigateBack({
              delta: 1
            })
           }
        })
        return
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
      let data = {
        id: arr[i].id,
        pid: arr[i].pid,
        name: arr[i].name
      }
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
          let datachild = {
            id: arr[i].children[j].id,
            pid: arr[i].children[j].pid,
            name: arr[i].children[j].name
          }

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
  bindMultiPickerChange: function (e) { //最终家乡的选择

    let that = this;
    this.setData({
      multiIndex: e.detail.value
    })
    let allpro = '';
    if (this.data.allprovinces[this.data.multiIndex[0]].children.length != 0) {

      allpro = this.data.allprovinces[this.data.multiIndex[0]].id + "," + this.data.allprovinces[this.data.multiIndex[0]].children[this.data.multiIndex[1]].id
      this.setData({
        multiIndexvalue: that.data.allprovinces[that.data.multiIndex[0]].name + " " + that.data.allprovinces[that.data.multiIndex[0]].children[that.data.multiIndex[1]].name
      })
    } else {
      allpro = this.data.allprovinces[this.data.multiIndex[0]].id
        + "," + this.data.allprovinces[this.data.multiIndex[0]].id
      this.setData({
        multiIndexvalue: that.data.allprovinces[that.data.multiIndex[0]].name
        // + "" + that.data.allprovinces[that.data.multiIndex[0]].name
      })
    }
    this.setData({
      provincecity: allpro
    })
  },

  bindMultiPickerColumnChange: function (e) { //下滑家乡列表所产生的函数

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

  clock(e) { //标签选择的处理
    let that = this;
    let off = true;
    console.log(e)
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
      for (let i = 0; i < this.data.evaluation.length; i++) {
        if (this.data.evaluation.length - 1 == i) {
          labelnum += this.data.evaluation[i]
        } else {
          labelnum += this.data.evaluation[i] + ","
        }
      }

      that.setData({
        labelnum: labelnum
      })
    }else{
      let labelnum = "";
      for (let i = 0; i < this.data.evaluation.length; i++) {
        if (this.data.evaluation.length - 1 == i) {
          labelnum += this.data.evaluation[i]
        } else {
          labelnum += this.data.evaluation[i] + ","
        }
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
  submitmaterial() { //发数据给后台
    let information = {}
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) return false;
    let vertifyNum = v.v.new()
    let str = /^\d{1,2}$/ig;
    if (!str.test(this.data.workage)) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入您的工龄',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.provincecity)) {
      reminder.reminder({ tips: '家乡' })
      return
    }
    if (vertifyNum.isNull(this.data.degreeone)) {
      reminder.reminder({ tips: '熟练度' })
      return
    }
    if (vertifyNum.isNull(this.data.constituttion)) {
      reminder.reminder({ tips: '人员构成' })
      return
    }
    let strone = /^[0-9]{1,4}$/ig;
    if (!strone.test(this.data.teamsnumber) && this.data.constituttion != 1 || ~~this.data.teamsnumber - 0 <= 1 && this.data.constituttion != 1) {

      wx.showModal({
        title: '温馨提示',
        content: '请输入您的队伍人数不得少于2人',
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (this.data.labelnum.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '请至少选择一个标签',
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
    app.appRequestAction({
      url: "resumes/introduce/",
      way: "POST",
      mask: true,
      params: information,
      failTitle: "操作失败，请稍后重试！",
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == 200) {
          remain.remain({
            tips: res.data.errmsg, callback: function () {
              if (res.data.errcode == 200) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) { }
          })
          return
        }
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
  },

  getintrodetail() {
    let that = this;
    let introdetail = wx.getStorageSync("introdetail");


    this.setData({
      workage: introdetail.hasOwnProperty("experience") ? (introdetail.experience == "0" ? "" : introdetail.experience) : "",
      multiIndexvalue: introdetail.hasOwnProperty("hometown") ? introdetail.hometown : "",
      provincecity: introdetail.hasOwnProperty("hometown_id") ? introdetail.hometown_id : "",
      labelnum: introdetail.hasOwnProperty("tag_id") ? introdetail.tag_id : "",
      degreeone: introdetail.hasOwnProperty("prof_degree") ? introdetail.prof_degree : "",
      constituttion: introdetail.hasOwnProperty("type") ? introdetail.type : "",
      teamsnumber: introdetail.hasOwnProperty("number_people") ? introdetail.number_people == '0' ? '' : introdetail.number_people : "",
      multiIndexsuan: introdetail.hasOwnProperty("hometown_id") ? introdetail.hometown_id.split(",") : "",
    })


    if (introdetail.hasOwnProperty("hometown_id") && introdetail.hometown_id != 0) {
      let one = "";
      let two = "";
      for (let i = 0; i < this.data.objectMultiArray[0].length; i++) {
        if (this.data.multiIndexsuan[0] == this.data.objectMultiArray[0][i].id) {
          this.data.multiIndex[0] = i
          one = i
        }
      }
      for (let i = 0; i < this.data.objectMultiArray[1].length; i++) {
        for (let j = 0; j < this.data.objectMultiArray[1][i].length; j++) {
          if (this.data.multiIndexsuan[1] == this.data.objectMultiArray[1][i][j].id) {
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

    }



    if (introdetail.hasOwnProperty("tag_id") && introdetail.tag_id != null) {
      let tagid = introdetail.tag_id.split(",")
      for (let i = 0; i < this.data.detailevaluation.length; i++) {
        for (let j = 0; j < tagid.length; j++) {
          if (this.data.detailevaluation[i].id == tagid[j]) {
            this.data.detailevaluation[i].classname = "oinformationnosave"
          }
        }
      }


      this.setData({
        detailevaluation: this.data.detailevaluation
      })

      if (introdetail.tag_id) {
        let evaluations = []
        for (let i = 0; i < tagid.length; i++) {
          evaluations.push(tagid[i] - 0)
        }
        this.setData({
          evaluation: evaluations
        })
      }
    }
    if (introdetail.hasOwnProperty("prof_degree")) {
      this.setData({
        indexproficiency: introdetail.prof_degree - 1
      })
    }
    if (introdetail.hasOwnProperty("type")) {
      this.setData({
        indexperson: introdetail.type - 1
      })
    }
    if (introdetail.hasOwnProperty("type")) {
      if (introdetail.type - 0 > 1) {
        this.setData({
          judge: true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.accessprovince();
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
})
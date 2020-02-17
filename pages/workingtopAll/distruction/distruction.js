// pages/workingtopAll/distruction/distruction.js
const app = getApp();
let areas = require("../../../utils/area.js");
let v = require("../../../utils/v.js");
let reminder = require("../../../utils/reminder.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaTextP:[],
    areaTextC:[],
    areaTextId: "",
    max_province: "",
    max_city: "",
    showListsTtile: false,
    showListsAnd: false,
    areadata: [],
    areadataHot: [],
    isAllAreas: true,
    allAreaLists: [],
    nAreaLists: [],
    showInputList: false,
    historyArray: [],
    areaText: [],
    shoWmodifytop: "",
    newId: ""
  },
  getAreaData: function (options) {
    app.getAreaData(this, options);
  },
  searchInput: function (e) {
    let val = e.detail.value
    if (val.length > 0) {
      this.setData({
        showListsTtile: true
      })
    }
    if (val.length == 0) {
      this.setData({
        showListsTtile: false
      })
    }
    this.setData({
      searchInputVal: val
    })
    if (!val) this.setData({
      showInputList: false,
      isAllAreas: true
    })
    else {
      this.setData({
        showInputList: true
      })
      this.filterInputList(val);
    }
  },
  filterInputList: function (val) {
    let list = app.arrDeepCopy(this.data.allAreaLists);
    let nlist = list.filter(function (item) {
      return (item.cname.indexOf(val) != -1);
    })
    this.setData({
      nAreaLists: nlist,
      isAllAreas: false
    })
  },
  showInputList: function () {
    this.setData({
      showInputList: true,
      showListsAnd: true
    })
  },
  closeArea: function () {
    this.setData({
      areaInputFocus: false
    })
    setTimeout(() => {
      this.setData({
        showArea: false,
        showInputList: false,
        isAllAreas: true,
        searchInputVal: "",
        showListsAnd: false,
        showListsTtile: false,
      })
    }, 10)
  },
  clearInputAction: function () {
    this.setData({
      isAllAreas: true,
      showInputList: false,
      searchInputVal: ""
    })
  },
  initInputList: function () {
    let list = areas.getInputList();
    console.log(list)
    this.setData({
      allAreaLists: list
    })
  },

  mustjudge(judgeId) {
    let that = this;

    if ((that.data.areaTextP.length >= that.data.max_province && that.data.areaTextC.length >= that.data.max_city)) {
      wx.showModal({
        title: '温馨提示',
        content: `最多同时置顶${that.data.max_province}个省、${that.data.max_city}个市`,
        showCancel: false,
        success(res) { }
      })
      return "nil"
    }
    if (that.data.areaTextC.length >= that.data.max_city && judgeId != 1 ){
      wx.showModal({
        title: '温馨提示',
        content: `最多同时置顶${that.data.max_province}个省、${that.data.max_city}个市`,
        showCancel: false,
        success(res) { }
      })
      return "nil"
    }
    if (that.data.areaTextP.length >= that.data.max_province && judgeId == 1) {
      wx.showModal({
        title: '温馨提示',
        content: `最多同时置顶${that.data.max_province}个省、${that.data.max_city}个市`,
        showCancel: false,
        success(res) { }
      })
      return "nil"
    }
  },



  getFull(num){
    let that = this;
    for (let i = 0; i < that.data.areadata[num].length; i++) {
      that.data.areadata[num][i].selected = 1;
    }

    for (let i = 0; i < that.data.areadata[num].length; i++) {
      for (let j = 0; j < that.data.areaTextC.length; j++) {
        if (that.data.areadata[num][i].id == that.data.areaTextC[j].id) {
            that.data.areaTextC.splice(j, 1)
        }
      }
    }
    for (let i = 0; i < that.data.areadata[num].length; i++) {
      for (let j = 0; j < that.data.areaText.length; j++) {
        if (that.data.areadata[num][i].id == that.data.areaText[j].id) {
            that.data.areaText.splice(j, 1)
        }
      }
    }
    that.setData({
      areadata: that.data.areadata,
      areaTextC: that.data.areaTextC
    })
  },
  getFullone(num){
    let that = this;
      that.data.areadata[num][0].selected = 1;
    for (let j = 0; j < that.data.areaTextP.length; j++) {
        if (that.data.areadata[num][0].id == that.data.areaTextP[j].id) {
            that.data.areaTextP.splice(j, 1)
        }
      }

    for (let j = 0; j < that.data.areaText.length; j++) {
      if (that.data.areadata[num][0].id == that.data.areaText[j].id) {
        that.data.areaText.splice(j, 1)
      }
    }

    console.log(that.data.areaTextP)
    that.setData({
      areadata: that.data.areadata,
      areaTextP: that.data.areaTextP
    })
  },

  chooseThisCtiy(e) {
    let that = this;
    let num = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.area;
    let pro = e.currentTarget.dataset.pro;
    let cityId = e.currentTarget.dataset.id;
    let judgeId = e.currentTarget.dataset.pid;

    let detail = {
      id: cityId,
      name: name,
      num: num,
      pro: pro
    }
    console.log(num)
    console.log(pro)
    console.log(judgeId)
    console.log(app.globalData.judge)

    console.log(cityId)
    console.log(that.data.shoWmodifytop)
    console.log(that.data.areadata)


    if (that.data.areadata[num][pro].selected == 1) {

   
      if (judgeId == 1) {
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }
        if (num>0){
          that.getFull(num)
        }
   
        that.data.areaTextP.push(detail)
        that.setData({
          areaTextP: that.data.areaTextP
        })
 
      }else{
        let show = that.mustjudge(judgeId)
        if (show == "nil") {

          return
        }
        if (num > 0) {
        that.getFullone(num)
        }
        that.data.areaTextC.push(detail)
        that.setData({
          areaTextC: that.data.areaTextC
        })

      }
 
      let areadatafor = that.data.areadata;
      for (let i = 0; i < areadatafor.length; i++) {
        for (let j = 0; j < areadatafor[i].length; j++) {
          if (areadatafor[i][j].id == cityId) {
            that.data.areadata[i][j].selected = 2
          }
        }
      }
      that.setData({
        areadata: that.data.areadata
      })

      that.setData({
        areaText: [...that.data.areaTextP,...that.data.areaTextC]
      })
      console.log(that.data.areaText)
    } else {

      let areadatafor = that.data.areadata;
      for (let i = 0; i < areadatafor.length; i++) {
        for (let j = 0; j < areadatafor[i].length; j++) {
          if (areadatafor[i][j].id == cityId) {
            that.data.areadata[i][j].selected = 1
          }
        }
      }

      that.setData({
        areadata: that.data.areadata
      })
      for (let i = 0; i < that.data.areaText.length; i++) {
        if (that.data.areaText[i].id == cityId) {
          that.data.areaText.splice(i, 1)
        }
      }
      for (let i = 0; i < that.data.areaTextP.length; i++) {
        if (that.data.areaTextP[i].id == cityId) {
          that.data.areaTextP.splice(i, 1)
        }
      }
      for (let i = 0; i < that.data.areaTextC.length; i++) {
        if (that.data.areaTextC[i].id == cityId) {
          that.data.areaTextC.splice(i, 1)
        }
      }


      that.setData({
        areaText: that.data.areaText,
        areaTextP: that.data.areaTextP,
        areaTextC: that.data.areaTextC
      })

    }
  },
  changeAreaData(data) {

    let that = this;
    for (let i = 0; i < that.data.areadata.length; i++) {
      for (let j = 0; j < that.data.areadata[i].length; j++) {
        that.data.areadata[i][j].selected = 1
        that.data.areadata[i][j].pro = j
        that.data.areadata[i][j].index = i
        // if (j == 0) {
        //   that.data.areadata[i][j].citytop = "全省置顶"
        //   console.log(that.data.areadata)
        // }
      }
    }
    that.data.areadata.shift()
    that.setData({
      areadata: that.data.areadata
    })
    for (let i = 0; i < data.length; i++) {
      data[i].selected = 1
      data[i].pro = i
      data[i].index = 0
      data[i].city = data[i].name

    }
    // that.setData({
    //   areadataHot: data
    // })
    that.data.areadata.unshift(data)
    that.setData({
      areadata: that.data.areadata
    })
    console.log(that.data.areadata)



  },
  hotcities(options) {
    console.log(options)
    let that = this;
    app.appRequestAction({
      url: "job/top-hot-areas/",
      way: "POST",
      mask: true,
      failTitle: "操作失败，请稍后重试！",
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {

          that.changeAreaData(mydata.data)
          that.modifyArea(options)
          // that.gettopareas()
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) { }
          })
        }
      },
      fail(res) {
        // console.log(res)
        // app.showMyTips("修改失败");
      }
    })
  },

  deleteC() {
    let that = this;
    for (let i = 0; i < that.data.areadata.length; i++) {
      for (let j = 0; j < that.data.areadata[i].length; j++) {
        that.data.areadata[i][j].selected = 1
      }
    }
  },
  chooseInputCtiy(e) {
    let that = this;
    console.log(e.currentTarget.dataset)
    let odataset = e.currentTarget.dataset;
    if (that.data.shoWmodifytop != "modifytop") {
      let areaText = that.data.areaText
      for (let i = 0; i < areaText.length; i++) {
        if (areaText[i].id == 1) {
          that.data.areadata[0][0].selected = 1
          that.data.areaText = []
        }
      }
    }
    let detail = {
      id: odataset.id,
      city: odataset.area,
      pid: odataset.pid
    }
    let detailArray = wx.getStorageSync("detailArray");
    for (let i = 0; i < detailArray.length; i++) {
      if (detailArray[i].id == odataset.id) {
        detailArray.splice(i, 1)
      }
    }
    console.log(that.data.areaText)
    for (let i = 0; i < that.data.areaText.length; i++) {
      if (that.data.areaText[i].id == odataset.id) {
        this.setData({
          showListsTtile: false,
          showListsAnd: false,
          showInputList: false,
          searchInputVal: "",
        })
        return
      }
    }

    if (detailArray) {
      detailArray.unshift(detail)
      if (detailArray.length > 6) {
        detailArray.pop()
      }
      wx.setStorageSync("detailArray", detailArray)
      this.setData({
        historyArray: detailArray
      })
    } else {
      let arrty = [detail]
      wx.setStorageSync("detailArray", arrty)
      this.setData({
        historyArray: arrty
      })
    }

    let show = this.mustjudge(odataset.pid);
    if (show == "nil") {
      return
    }
    this.showseleted(odataset)
  },
  hischildren(e) {
    let that = this;
    let data = e.currentTarget.dataset

    console.log(data)
 
    for (let i = 0; i < that.data.areaText.length; i++) {

      if (that.data.areaText[i].id == data.id) {
        console.log(123)
        this.setData({
          showListsTtile: false,
          showListsAnd: false,
          showInputList: false,
          searchInputVal: "",
        })
        return
      }
    }

    let show = this.mustjudge(data.pid)
    if (show == "nil") {
      return
    }
    this.showseleted(data)

  },
  findIndex(Id){
    let that = this;
    for (let i = 0; i < that.data.areadata.length; i++) {
      for (let j = 0; j < that.data.areadata[i].length; j++) {
        if (that.data.areadata[i][j].id == Id){
          return that.data.areadata[i][j].index
        }
      }
    }  
  },
  showseleted(item) {
    let that = this;
    console.log(item)
    let detail = {
      id: item.id,
      name: item.area ? item.area : item.name,
      pid: item.pid
    }
    let index = this.findIndex(item.id)
    if (item.pid == 1){
      this.getFull(index)
      
      that.data.areaTextP.push(detail)
    }else{
      this.getFullone(index)
      that.data.areaTextC.push(detail)
    }


    for (let i = 0; i < that.data.areadata.length; i++) {
      for (let j = 0; j < that.data.areadata[i].length; j++) {

        if (that.data.areadata[i][j].id == item.id) {
          that.data.areadata[i][j].selected = 2

          that.setData({
            areadata: that.data.areadata,
            showListsTtile: false,
            showListsAnd: false,
            showInputList: false,
            searchInputVal: "",
            areaText: [...that.data.areaTextP, ...that.data.areaTextC]
          })
          console.log(that.data.areaText)
        }
      }
    }
    that.data.areaText = that.unique(that.data.areaText)
  },
  delete() {
    wx.removeStorageSync("detailArray")
    this.setData({
      historyArray: []
    })
  },

  gethistory() {
    let detailArray = wx.getStorageSync("detailArray");
    if (detailArray) {
      this.setData({
        historyArray: detailArray
      })
    }
  },
 
  modifyArea(options) {
    console.log(options)
    let that = this;

    if (options.hasOwnProperty("allcity") || options.hasOwnProperty("allpro")) {
      let allcity = JSON.parse(options.allcity)
      let allpro = JSON.parse(options.allpro)

      that.setData({
        areaTextP: allpro,
        areaTextC: allcity,
        areaText: [...allcity, ...allpro]
      })
      let data = that.data.areaText
      console.log(that.data.areadata)
      for (let i = 0; i < data.length; i++) {
        let num = data[i].id;
        for (let j = 0; j < that.data.areadata.length; j++) {
          for (let k = 0; k < that.data.areadata[j].length; k++) {
            if (that.data.areadata[j][k].id == num) {

              that.data.areadata[j][k].selected = 2;
              that.setData({
                areadata: that.data.areadata
              })
            }
          }
        }


      }
    }
  },

  getedArea(item) {
    // let num = e.currentTarget.dataset.index;
    // let name = e.currentTarget.dataset.area;
    // let pro = e.currentTarget.dataset.pro;
    // let cityId = e.currentTarget.dataset.id;
    // let judgeId = e.currentTarget.dataset.pid;

    // let detail = { id: cityId, name: name, num: num, pro: pro }
    console.log(item)

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    for (let i = 0; i < item.length; i++) {
      for (let j = 0; j < that.data.areadata.length; j++) {
        for (let k = 0; k < that.data.areadata[j].length; k++) {
          if (that.data.areadata[j][k].id == item[i]) {
            let numner = that.data.areadata[j][k];
            console.log(numner)
            let detail = {
              id: numner.id,
              name: numner.city,
              num: numner.index,
              pro: numner.pro
            }
            that.data.areaText.push(detail)
            that.data.areadata[j][k].selected = 2;
            that.setData({
              areadata: that.data.areadata,
              areaText: that.data.areaText
            })
          }
        }
      }
    }
    that.data.areaText = that.unique(that.data.areaText)
    console.log(that.data.areaText)
    wx.hideLoading()
  },
  getMax(item) {
    console.log(item)
    if (item.hasOwnProperty("max_province") && item.hasOwnProperty("max_city")) {
      this.setData({
        max_province: item.max_province,
        max_city: item.max_city
      })

    }

  },

  unique(areaText) {
    let arr1 = [];
    let arr1Id = []
    for (var i = 0; i < areaText.length; i++) {

      if (!arr1Id.includes(areaText[i].id)) {
        arr1Id.push(areaText[i].id);
        arr1.push(areaText[i]);
      }
    }
    return arr1;

  },

  seleted() {
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let areaTextP = that.data.areaTextP;
    let areaTextC = that.data.areaTextC;
    let uareaTextP = that.unique(areaTextP)
    let uareaTextC = that.unique(areaTextC)
    let alllength = uareaTextP.length + uareaTextC.length
    let timer = new Date()
    let time = (timer.getTime() - 0)
    prevPage.setData({ //修改上一个页面的变量
      areaProcrum: uareaTextP,
      areaCitycrum: uareaTextC,
      alllength: alllength,
      clocktime: time
    })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  modifytop(options) {
    console.log(options)
    if (options.hasOwnProperty("modifytop")) {
      this.setData({
        shoWmodifytop: options.modifytop
      })
    }

  },
  getNewId(options) {
    if (options.hasOwnProperty("id")) {
      this.setData({
        newId: options.id
      })
    }
  },

  areaId() {
    // areaText
    let id = '';
    let areaText = this.unique(this.data.areaText);
    for (let i = 0; i < areaText.length; i++) {
      if (i >= areaText.length - 1) {
        id += areaText[i].id
      } else {
        id += areaText[i].id + ","
      }
    }
    // this.data.areaTextId = id;
    this.setData({
      areaTextId: id
    })
  },
 
  onLoad: function (options) {
    this.getMax(options);
    this.getAreaData(options);
    this.initInputList();
    this.modifytop(options)
    this.getNewId(options)


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
    this.gethistory()
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
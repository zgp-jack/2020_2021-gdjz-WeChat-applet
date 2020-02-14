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
    this.setData({
      allAreaLists: list
    })
  },

  mustjudge(judgeId) {
    let that = this;
    console.log(that.data.areaText)
    if (that.data.areaText.length >= that.data.max_province && app.globalData.judge == "provice") {
      wx.showModal({
        title: '温馨提示',
        content: `最多可选择${that.data.max_province}个省份置顶`,
        showCancel: false,
        success(res) { }
      })
      return "nil"
    }
    if (that.data.areaText.length >= that.data.max_city && app.globalData.judge == "city") {
      wx.showModal({
        title: '温馨提示',
        content: `最多可选择${that.data.max_city}个市置顶`,
        showCancel: false,
        success(res) { }
      })
      return "nil"
    }

    if (app.globalData.judge != "provice" && app.globalData.judge != "city" && app.globalData.judge != "allprovice") {
      if (judgeId == 1) {
        app.globalData.judge = "provice"
      } else if (judgeId == 0) {
        app.globalData.judge = "allprovice"
      } else {
        app.globalData.judge = "city"
      }
    } else {
      console.log(app.globalData.judge)
      if (app.globalData.judge == "provice" && judgeId != 1 && that.data.shoWmodifytop != "modifytop") {
        wx.showModal({
          title: '温馨提示',
          content: `省、市不能同时存在，请重新选择`,
          showCancel: false,
          success(res) { }
        })
        return "nil"
      }
      if (app.globalData.judge == "provice" && judgeId != 1 && that.data.shoWmodifytop == "modifytop") {
        wx.showModal({
          title: '温馨提示',
          content: `请选择置顶省份或直辖市`,
          showCancel: false,
          success(res) { }
        })
        return "nil"
      }
      if (app.globalData.judge == "city" && (judgeId == 1 || judgeId == 0) && that.data.shoWmodifytop != "modifytop") {
        wx.showModal({
          title: '温馨提示',
          content: `省、市不能同时存在，请重新选择`,
          showCancel: false,
          success(res) { }
        })
        return "nil"
      }
      if (app.globalData.judge == "city" && (judgeId == 1 || judgeId == 0) && that.data.shoWmodifytop == "modifytop") {
        wx.showModal({
          title: '温馨提示',
          content: `请选择置顶市`,
          showCancel: false,
          success(res) { }
        })
        return "nil"
      }
      if (app.globalData.judge == "allprovice" && judgeId != 0 && that.data.shoWmodifytop == "modifytop") {
        wx.showModal({
          title: '温馨提示',
          content: `您已置顶全国，无需修改`,
          showCancel: false,
          success(res) { }
        })
        return "nil"
      }
    }
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
    if (cityId == 1 && that.data.shoWmodifytop == "modifytop" && app.globalData.judge =="allprovice") {
      wx.showModal({
        title: '温馨提示',
        content: `您已置顶全国，无需修改`,
        showCancel: false,
        success(res) { }
      })
      return
    }

    if (that.data.areadata[num][pro].selected == 1) {
      if (cityId != 1 && that.data.shoWmodifytop == "modifytop") {
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }
      } else if (cityId != 1 && that.data.shoWmodifytop != "modifytop") {
        let areaText = that.data.areaText
        for (let i = 0; i < areaText.length; i++) {
          if (areaText[i].id == 1) {
            app.globalData.judge = ""
            that.data.areadata[0][0].selected = 1
            that.data.areaText = []
          }
        }
        console.log(areaText.length)
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }
      } else if (cityId == 1 && that.data.shoWmodifytop == "modifytop" ){
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }
      }
      else if (cityId == 1) {
        let areaText = that.data.areaText
        console.log(that.data.areaText)
        app.globalData.judge = "allprovice"
        that.deleteC()
        that.data.areaText = []
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
      that.data.areaText.push(detail)
      that.setData({
        areaText: that.data.areaText
      })
      console.log(that.data.areaText)
    } else {
      let j = ''
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
          j = i
        }
      }
      that.data.areaText.splice(j, 1)
      that.setData({
        areaText: that.data.areaText
      })

      if (that.data.areaText.length == 0 && that.data.shoWmodifytop != "modifytop") {
        app.globalData.judge = ""
      }
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
          // that.setData({
          //   areadataHot:  
          // })
          console.log(22222222222222222222222222222222222)
          that.changeAreaData(mydata.data)
          that.modifyArea(options)
          that.gettopareas()
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
          app.globalData.judge = ""
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
    if (that.data.shoWmodifytop != "modifytop") {
      let areaText = that.data.areaText
      for (let i = 0; i < areaText.length; i++) {
        if (areaText[i].id == 1) {
          app.globalData.judge = ""
          that.data.areadata[0][0].selected = 1
          that.data.areaText = []
        }
      }
    }
    console.log(data)
    console.log(that.data.areaText)
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
  showseleted(item) {
    console.log(item)
    let detail = {
      id: item.id,
      name: item.area ? item.area : item.name
    }
    let that = this;
    for (let i = 0; i < that.data.areadata.length; i++) {
      for (let j = 0; j < that.data.areadata[i].length; j++) {

        if (that.data.areadata[i][j].id == item.id) {
          that.data.areadata[i][j].selected = 2

          that.data.areaText.push(detail)
          that.setData({
            areadata: that.data.areadata,
            showListsTtile: false,
            showListsAnd: false,
            showInputList: false,
            searchInputVal: "",
            areaText: that.data.areaText
          })
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

    if (options.hasOwnProperty("area")) {
      let data = JSON.parse(options.area)
      console.log(data)
      that.setData({
        areaText: data
      })
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
      this.modifyArea(item)
      console.log(11111111111111111111111111)
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
    let areaText = that.data.areaText;
    let uareaText = that.unique(areaText)
    console.log(uareaText)
    prevPage.setData({ //修改上一个页面的变量
      areaTextcrum: uareaText,
      showMore: app.globalData.judge
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
  gettopareas() {
    let that = this;
    console.log(that.data.newId)
    if (that.data.shoWmodifytop == "modifytop") {
      let userInfo = wx.getStorageSync("userInfo");
      if (!userInfo) return false;
      let userUuid = wx.getStorageSync("userUuid");
      let detail = {
        mid: userInfo.userId,
        token: userInfo.token,
        time: userInfo.tokenTime,
        uuid: userUuid,
        job_id: that.data.newId
      }

      app.appRequestAction({
        url: "job/get-top-areas/",
        way: "POST",
        mask: true,
        params: detail,
        failTitle: "操作失败，请稍后重试！",
        success: function (res) {
          let mydata = res.data;
          if (mydata.errcode == "ok") {
            if (mydata.data.first_city_num > 0) {
              app.globalData.judge = "city"
              that.setData({
                max_city: mydata.data.first_city_num
              })
              that.getedArea(mydata.data.top_city_ids)
            } else if (mydata.data.first_province_num > 0) {
              that.setData({
                max_province: mydata.data.first_province_num
              })
              app.globalData.judge = "provice"
              that.getedArea(mydata.data.top_province_ids)
            } else if (mydata.data.is_county > 0) {
              app.globalData.judge = "allprovice"
              that.getedArea([mydata.data.is_county])
            }

          } else {
            wx.showModal({
              title: '温馨提示',
              content: res.data.errmsg,
              showCancel: false,
              success(res) { }
            })
          }
        }
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
  seletedsub() {
    let that = this;
    let day = that.data.max_top_days;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    if (!userInfo || !userUuid) {
      wx.showModal({
        title: '温馨提示',
        content: '网络出错，请稍后重试',
        showCancel: false,
        success(res) { }
      })
      return
    }
    let vertifyNum = v.v.new()

    console.log(that.data.areaText)
    if (vertifyNum.isNull(that.data.areaText)) {
      reminder.reminder({
        tips: '置顶城市'
      })
      return
    }

    that.areaId()

    console.log(that.data.areaTextId)
    let detail = {
      mid: userInfo.userId,
      token: userInfo.token,
      time: userInfo.tokenTime,
      uuid: userUuid,

      is_country: app.globalData.judge == "allprovice" ? 1 : 0,
      city_ids: app.globalData.judge == "city" ? that.data.areaTextId : "",
      province_ids: app.globalData.judge == "provice" ? that.data.areaTextId : "",
      job_id: that.data.newId
    }

    app.appRequestAction({
      url: 'job/change-top-areas/',
      way: 'POST',
      params: detail,
      mask: true,
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {

          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              console.log(res)
              let that = this;
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
              prevPage.setData({ //修改上一个页面的变量
                refresh: true
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
          return
        } else {
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
          return
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {

          }
        })
      }
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
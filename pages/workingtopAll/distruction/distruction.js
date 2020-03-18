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
    hot: app.globalData.apiImgUrl + "lpy/recruit/settop-hot.png",
    areaTextP: [],
    areaTextC: [],
    areaTextA:[],
    areaTextId: "",
    max_province: "",
    max_city: "",
    showListsTtile: false,
    showListsAnd: false,
    areadatas: [],
    areadataHot: [],
    isAllAreas: true,
    allAreaLists: [],
    nAreaLists: [],
    showInputList: false,
    historyArray: [],
    areaText: [],
    shoWmodifytop: "",
    newId: "",
    specialids: [],
    showlodinga: true,
    showlodingimg: app.globalData.showlodingimg,
    areaDataNotEnd: []
  },
  //
  getAreaData: function(options) {
    let areadata = wx.getStorageSync("areadata");
    let num = app.globalData.areaDataNum;
    let _this = this;
    if (areadata) {
      let mydata = app.arrDeepCopy(areadata)
      mydata.data.shift()
      if (areadata.hasOwnProperty("num") && (areadata.num == num)) {
        _this.setData({
          areaDataNotEnd: mydata.data
        })
        _this.hotcities(options)
        wx.hideLoading()
        return false;
      }
    }
    app.getAreaData(this, function(data) {
      let resdata = app.arrDeepCopy(data)
      resdata.shift()
      _this.hotcities(options)
      _this.setData({
        areaDataNotEnd: resdata
      })
    });

  },
  searchInput: function(e) {
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
  filterInputList: function(val) {
    let list = app.arrDeepCopy(this.data.allAreaLists);
    let nlist = list.filter(function(item) {
      return (item.cname.indexOf(val) != -1);
    })
    this.setData({
      nAreaLists: nlist,
      isAllAreas: false
    })
  },
  showInputList: function() {
    this.setData({
      showInputList: true,
      showListsAnd: true
    })
  },
  closeArea: function() {
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
  clearInputAction: function() {
    this.setData({
      isAllAreas: true,
      showInputList: false,
      searchInputVal: ""
    })
  },
  initInputList: function() {
    let list = areas.getInputList();
    this.setData({
      allAreaLists: list
    })
  },

  mustjudge(judgeId) {
    let that = this;

    if ((that.data.areaTextP.length >= that.data.max_province && that.data.areaTextC.length >= that.data.max_city)) {
      wx.showModal({
        title: '温馨提示',
        content: `最多可同时置顶${that.data.max_city}个市、${that.data.max_province}个省或直辖市`,
        showCancel: false,
        success(res) {
          that.setData({
            showListsTtile: false,
            showListsAnd: false,
            showInputList: false,
            searchInputVal: "",
          })
        }
      })
      return "nil"
    }
    if (that.data.areaTextC.length >= that.data.max_city && judgeId != 1) {
      wx.showModal({
        title: '温馨提示',
        content: `最多可同时置顶${that.data.max_city}个市、${that.data.max_province}个省或直辖市`,
        showCancel: false,
        success(res) {
          that.setData({
            showListsTtile: false,
            showListsAnd: false,
            showInputList: false,
            searchInputVal: "",
          })
        }
      })
      return "nil"
    }
    if (that.data.areaTextP.length >= that.data.max_province && judgeId == 1) {
      wx.showModal({
        title: '温馨提示',
        content: `最多可同时置顶${that.data.max_city}个市、${that.data.max_province}个省或直辖市`,
        showCancel: false,
        success(res) {
          that.setData({
            showListsTtile: false,
            showListsAnd: false,
            showInputList: false,
            searchInputVal: "",
          })
        }
      })
      return "nil"
    }
  },



  getFull(num, cityId, pro) {
    let that = this;
    let areaArr = app.arrDeepCopy(that.data.areadatas)
    let areaArrC = app.arrDeepCopy(that.data.areaTextC)
    let areaArrT = app.arrDeepCopy(that.data.areaText)
    let firstLen = areaArr[num].length;

    if (num != 0) {
      for (let i = 0; i < firstLen; i++) {
        if (i != pro) {
          areaArr[num][i].selected = 1;
        }
      }
    }
    for (let i = 0; i < areaArr[0].length; i++) {
      if (areaArr[0][i].pid == cityId) {
        for (let j = 0; j < areaArrC.length; j++) {
          if (areaArrC[j].id == areaArr[0][i].id) {
            areaArrC.splice(j, 1);
            areaArr[0][i].selected = 1;
            j--
          }
        }
        for (let j = 0; j < areaArrT.length; j++) {
          if (areaArrT[j].id == areaArr[0][i].id) {
            areaArrT.splice(j, 1);
            j--
          }
        }
      }
    }


    for (let j = 0; j < areaArrC.length; j++) {
      if (areaArr[num][pro].id == areaArrC[j].pid) {
        areaArrC.splice(j, 1)
        j--
      }
    }


    for (let j = 0; j < areaArrT.length; j++) {
      if (areaArr[num][pro].id == areaArrT[j].pid) {

        areaArrT.splice(j, 1)
        j--
      }
    }



    that.setData({
      areadatas: areaArr,
      areaTextC: areaArrC,
      areaText: areaArrT
    })
  },
  getFullone(num) {
    let that = this;
    let areaArr = app.arrDeepCopy(that.data.areadatas)
    let areaArrP = app.arrDeepCopy(that.data.areaTextP)
    let areaArrT = app.arrDeepCopy(that.data.areaText)
    areaArr[num][0].selected = 1;
    that.setData({
      areadatas: areaArr
    })

    for (let j = 0; j < areaArrP.length; j++) {
      if (areaArr[num][0].id == areaArrP[j].id) {
        areaArrP.splice(j, 1)
        j--
      }
    }

    for (let j = 0; j < areaArrT.length; j++) {
      if (areaArr[num][0].id == areaArrT[j].id) {
        areaArrT.splice(j, 1)
        j--
      }
    }

    that.setData({
      areaTextP: areaArrP,
      areaText: areaArrT
    })
  },
  getzero(judgeId) {
    let that = this;
    let judgeIdone = judgeId - 2;
    let areaArr = app.arrDeepCopy(that.data.areadatas)
    let areaArrP = app.arrDeepCopy(that.data.areaTextP)
    let areaArrT = app.arrDeepCopy(that.data.areaText)
    areaArr[judgeIdone][0].selected = 1;


    for (let j = 0; j < areaArrP.length; j++) {
      if (areaArr[judgeIdone][0].id == areaArrP[j].id) {
        areaArrP.splice(j, 1)
      }
    }

    for (let j = 0; j < areaArrT.length; j++) {
      if (areaArr[judgeIdone][0].id == areaArrT[j].id) {

        areaArrT.splice(j, 1)
      }
    }
    that.setData({
      areadatas: areaArr,
      areaTextP: areaArrP,
      areaText: areaArrT
    })
  },
  chooseThisCtiy(e) {
    let that = this;
    let num = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.area;
    let pro = e.currentTarget.dataset.pro;
    let cityId = e.currentTarget.dataset.id;
    let judgeId = e.currentTarget.dataset.pid;
    let dareaTextC = app.arrDeepCopy(that.data.areaTextC)
    let dareaTextP = app.arrDeepCopy(that.data.areaTextP)
    let areadatafor = app.arrDeepCopy(that.data.areadatas);
    let detail = {
      id: cityId,
      name: name,
      num: num,
      pro: pro,
      pid: judgeId
    }

    if (areadatafor[num][pro].selected == 1) {


      if (judgeId == 1) {
   
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }

        areadatafor[0][0].selected = 1;
        areadatafor[num][pro].selected = 2


        that.setData({
          areadatas: areadatafor,
        })
        console.log(num, cityId, pro)
        if (num > 0) {
          that.getFull(num, cityId, pro)
        }

        dareaTextP.push(detail)
        that.setData({
          areaTextP: dareaTextP,
          areaTextA:[]
        })

      } else if (judgeId == 0) {
        for (let i = 0; i < areadatafor.length;i++){
          for (let j = 0; j < areadatafor[i].length; j++){
            areadatafor[i][j].selected = 1
          }
        }
        areadatafor[0][0].selected = 2
        let areaTextA = that.data.areaTextA;

        areaTextA.push(detail)
        that.setData({
          areaTextC: [],
          areadatas: areadatafor,
          areaTextP: [],
          areaTextA: areaTextA
        })
      } else {
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }

        areadatafor[0][0].selected = 1;
        areadatafor[num][pro].selected = 2
        let areadataforq = areadatafor[0]
        if (num != 0) {

          for (let i = 0; i < areadataforq.length; i++) {
            if (areadataforq[i].id == cityId) {
              areadataforq[i].selected = 2
            }
          }
        } else {
          let number = areadatafor[judgeId - 2];
          for (let i = 0; i < number.length; i++) {
            if (number[i].id == cityId) {
              number[i].selected = 2
            }
          }

        }
        console.log(areadatafor)
        that.setData({
          areadatas: areadatafor,
        })
        if (num > 0) {
          that.getFullone(num)
        } else if (num == 0) {
          that.getzero(judgeId)
        }



        dareaTextC.push(detail)

        that.setData({
          areaTextC: dareaTextC,
          areaTextA: []
        })

      }
      that.setData({
        areaText: [...that.data.areaTextC, ...that.data.areaTextP, ...that.data.areaTextA]
      })
    
    } else {

      let areadatafor = app.arrDeepCopy(that.data.areadatas);
      let dareaTextC = app.arrDeepCopy(that.data.areaTextC)
      let dareaTextP = app.arrDeepCopy(that.data.areaTextP)
      let areaArrT = app.arrDeepCopy(that.data.areaText)
      if (judgeId == 1) {
        areadatafor[num][pro].selected = 1
      } else if (judgeId == 0) {
        areadatafor[0][0].selected = 1
        that.setData({
          areaTextA: []
        })
      } else {
        areadatafor[num][pro].selected = 1
        if (num != 0) {

          for (let i = 0; i < areadatafor[0].length; i++) {
            if (areadatafor[0][i].id == cityId) {
              areadatafor[0][i].selected = 1
            }
          }
        } else {
          for (let i = 0; i < areadatafor[judgeId - 2].length; i++) {
            if (areadatafor[judgeId - 2][i].id == cityId) {
              areadatafor[judgeId - 2][i].selected = 1
            }
          }

        }
      }




      that.setData({
        areadatas: areadatafor
      })


      for (let i = 0; i < areaArrT.length; i++) {
        if (areaArrT[i].id == cityId) {
          areaArrT.splice(i, 1)
        }
      }
      for (let i = 0; i < dareaTextP.length; i++) {
        if (dareaTextP[i].id == cityId) {
          dareaTextP.splice(i, 1)
        }
      }
      for (let i = 0; i < dareaTextC.length; i++) {
        if (dareaTextC[i].id == cityId) {
          dareaTextC.splice(i, 1)
        }
      }

      that.setData({
        areaText: areaArrT,
        areaTextP: dareaTextP,
        areaTextC: dareaTextC
      })

    }
  },
  changeAreaData(data, options) {

    let that = this;
    let arr = this.data.areaDataNotEnd
    let outlen = arr.length
    for (let i = 0; i < outlen; i++) {
      let inlen = arr[i].length;
      for (let j = 0; j < inlen; j++) {
        let inarr = arr[i][j];
        inarr.selected = 1
        inarr.pro = j
        inarr.index = i + 1
        // if (j == 0) {
        //   that.data.areadata[i][j].citytop = "全省置顶"
        //   console.log(that.data.areadata)
        // }
      }
    }
    // that.data.areadata.shift()

    for (let i = 0; i < data.length; i++) {
      data[i].selected = 1
      data[i].pro = i
      data[i].index = 0
      data[i].city = data[i].name
    }
    // that.setData({
    //   areadataHot: data
    // })
    arr.unshift(data)
    that.setData({
      showlodinga: false
    })

    that.modifyArea(options, arr)

  },
  hotcities(options) {

    let that = this;

    let areadatahot = app.globalData.hotAreaData.use;
    if (areadatahot) {
      let data = app.globalData.hotAreaData.data
      that.changeAreaData(data, options)

    } else {
      app.appRequestAction({
        url: "/job/top-hot-areas-v1/",
        way: "POST",
        mask: true,
        failTitle: "操作失败，请稍后重试！",
        success: function(res) {
          let mydata = res.data;
          if (mydata.errcode == "ok") {

            app.globalData.hotAreaData = {
              data: mydata.data,
              use: true
            }
            that.changeAreaData(mydata.data, options)

            // that.gettopareas()
          } else {
            wx.showModal({
              title: '温馨提示',
              content: res.data.errmsg,
              showCancel: false,
              success(res) {}
            })
          }
        },
        fail(res) {
          // console.log(res)
          // app.showMyTips("修改失败");
        }
      })
    }

  },

  deleteC() {
    let that = this;
    for (let i = 0; i < that.data.areadatas.length; i++) {
      for (let j = 0; j < that.data.areadatas[i].length; j++) {
        that.data.areadatas[i][j].selected = 1
      }
    }
  },
  chooseInputCtiy(e) {
    let that = this;
    let odataset = e.currentTarget.dataset;
    // if (that.data.shoWmodifytop != "modifytop") {
    //   let areaText = that.data.areaText
    //   for (let i = 0; i < areaText.length; i++) {
    //     if (areaText[i].id == 1) {
    //       that.data.areadatas[0][0].selected = 1
    //       that.data.areaText = []
    //     }
    //   }
    // }
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


    for (let i = 0; i < that.data.areaText.length; i++) {

      if (that.data.areaText[i].id == data.id) {
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
  findIndex(Id) {
    let that = this;
    for (let i = 0; i < that.data.areadatas.length; i++) {
      for (let j = 0; j < that.data.areadatas[i].length; j++) {
        if (that.data.areadatas[i][j].id == Id) {
          return that.data.areadatas[i][j].index
        }
      }
    }
  },
  findPro(index, cityid) {
    let that = this;
    let areaArr = app.arrDeepCopy(that.data.areadatas)
    for (let i = 0; i < areaArr[index].length; i++) {
      if (areaArr[index][i].id == cityid) {
        return i
      }
    }
  },
  showseleted(item) {
    let that = this;
    let detail = {
      id: item.id,
      name: item.area ? item.area : item.name,
      pid: item.pid
    }
    let index = this.findIndex(item.id)
    let pro = this.findPro(index, item.id)

    console.log(item.id)
    console.log(pro)
    console.log(index)

    if (item.pid == 1) {
      if (index > 0) {
        this.getFull(index, item.id, pro)
      }


      that.data.areaTextP.push(detail)
    } else {
      if (index > 0) {
        this.getFullone(index)
      } else if (index == 0) {
        that.getzero(item.pid)
      }
      that.data.areaTextC.push(detail)
    }
    that.data.areadatas[0][0].selected = 1;

    for (let i = 0; i < that.data.areadatas.length; i++) {
      for (let j = 0; j < that.data.areadatas[i].length; j++) {

        if (that.data.areadatas[i][j].id == item.id) {
          that.data.areadatas[i][j].selected = 2

          that.setData({
            areadatas: that.data.areadatas,
            showListsTtile: false,
            showListsAnd: false,
            showInputList: false,
            searchInputVal: "",
            areaText: [...that.data.areaTextP, ...that.data.areaTextC]
          })
        }
      }
    }

    that.setData({
      areaTextA:[]
    })
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

  modifyArea(options, areasArr) {
    let that = this;

    if (options.hasOwnProperty("allcity") || options.hasOwnProperty("allpro")) {
      let allcity = JSON.parse(options.allcity)
      let allpro = JSON.parse(options.allpro)
      let allall = JSON.parse(options.allall)

      that.setData({
        areaTextP: allpro,
        areaTextC: allcity,
        areaText: allall
      })

      let hlid = allall.map(item => item.id)
      let outlen = areasArr.length
      for (let i = 0; i < outlen; i++) {
        let inlen = areasArr[i].length
        for (let j = 0; j < inlen; j++) {
          let id = areasArr[i][j].id
          if (hlid.includes(id)) {
            areasArr[i][j].selected = 2
          }
        }
      }
    }

    this.setData({
      areadatas: areasArr
    })
  },

  getedArea(item) {
    // let num = e.currentTarget.dataset.index;
    // let name = e.currentTarget.dataset.area;
    // let pro = e.currentTarget.dataset.pro;
    // let cityId = e.currentTarget.dataset.id;
    // let judgeId = e.currentTarget.dataset.pid;

    // let detail = { id: cityId, name: name, num: num, pro: pro }

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    for (let i = 0; i < item.length; i++) {
      for (let j = 0; j < that.data.areadatas.length; j++) {
        for (let k = 0; k < that.data.areadatas[j].length; k++) {
          if (that.data.areadatas[j][k].id == item[i]) {
            let numner = that.data.areadatas[j][k];
            let detail = {
              id: numner.id,
              name: numner.city,
              num: numner.index,
              pro: numner.pro
            }
            that.data.areaText.push(detail)
            that.data.areadatas[j][k].selected = 2;
            that.setData({
              areadatas: that.data.areadatas,
              areaText: that.data.areaText
            })
          }
        }
      }
    }
    that.data.areaText = that.unique(that.data.areaText)

    wx.hideLoading()
  },
  getMax(item) {

    if (item.hasOwnProperty("max_province") && item.hasOwnProperty("max_city")) {
      this.setData({
        max_province: item.max_province,
        max_city: item.max_city
      })
    }
    if (item.hasOwnProperty("specialids")) {
      this.setData({
        specialids: JSON.parse(item.specialids)
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
  ranking(item) {

    let after = [];
    let specialids = this.data.specialids;

    for (let j = 0; j < item.length; j++) {
      for (let i = 0; i < specialids.length; i++) {
        if (specialids[i] == item[j].id) {

          after.push(item[j])

        }
      }
    }
    for (let i = 0; i < item.length; i++) {
      for (let j = 0; j < after.length; j++) {
        if (item[i].id == after[j].id) {
          item.splice(i, 1)
        }
      }
    }

    after = [...after, ...item]
    return after
  },
  seleted() {
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let areaTextP = that.data.areaTextP;
    let areaTextC = that.data.areaTextC;
    let uareaTextP = that.unique(areaTextP)
    let uareaTextC = that.unique(areaTextC)
    let rankingP = that.ranking(uareaTextP)
    let areaTextA = that.data.areaTextA;


    let alllength = rankingP.length + uareaTextC.length + areaTextA.length;


    console.log(alllength)
    let timer = new Date()
    let time = (timer.getTime() - 0)
    prevPage.setData({ //修改上一个页面的变量
      areaProcrum: rankingP,
      areaCitycrum: uareaTextC,
      areaAllcrum: areaTextA,
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

  onLoad: function(options) {
    this.getMax(options);
    this.getAreaData(options);
    this.initInputList();
    //this.modifytop(options)
    //this.getNewId(options)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.gethistory()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
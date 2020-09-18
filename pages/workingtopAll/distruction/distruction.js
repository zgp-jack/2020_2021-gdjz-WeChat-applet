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
    areaDataNotEnd: [],
    // 滚动目标位置
    select:""
  },
  //获取区域数据
  getAreaData: function(options) {
    // 缓存区域数据
    let areadata = wx.getStorageSync("areadata");
    let num = app.globalData.areaDataNum;
    let _this = this;
    // 如果有区域数据
    if (areadata) {
      // 数据深拷贝一份
      let mydata = app.arrDeepCopy(areadata)
      // 删除第一组元素即热门城市
      mydata.data.shift()
      if (areadata.hasOwnProperty("num") && (areadata.num == num)) {
        // 保存区域数据
        _this.setData({
          areaDataNotEnd: mydata.data
        })
        // 热门城市
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
  // 如果搜索城市框内容为空，点击非输入框以外的区域那么就隐藏历史记录框
  hideInputList:function(e){
    let val = e.detail.value
    if (val.length == 0) {
      this.setData({
        showListsTtile: false,
        showListsAnd: false,
        showInputList: false,
        searchInputVal: "",
      })
    }
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
  getzero(index) {
    let that = this;
    let areaArr = app.arrDeepCopy(that.data.areadatas)
    let areaArrP = app.arrDeepCopy(that.data.areaTextP)
    let areaArrT = app.arrDeepCopy(that.data.areaText)
    for (let i = 0; i < index.length; i++) {
      areaArr[index[i]][0].selected = 1;
    }
    for (let j = 0; j < areaArrP.length; j++) {
      for (let i = 0; i < index.length; i++) {
        if (areaArr[index[i]][0].id == areaArrP[j].id) {
          areaArrP.splice(j, 1)
        }
      }
    }

    for (let j = 0; j < areaArrT.length; j++) {
      for (let i = 0; i < index.length; i++) {
        if (areaArr[index[i]][0].id == areaArrT[j].id) {
          areaArrT.splice(j, 1)
        }
      }
    }
    that.setData({
      areadatas: areaArr,
      areaTextP: areaArrP,
      areaText: areaArrT
    })
  },
  validIsChina:function(){
    let area = this.data.areadatas[0][0]
    return (area.id == '1') ? true : false
  },
  chooseThisCtiy(e) {
    // 获取选择城市信息
    let that = this;
    // 城市（一级数组）index序号
    let num = e.currentTarget.dataset.index;
    // 城市名称
    let name = e.currentTarget.dataset.area;
    // 二级数组index
    let pro = e.currentTarget.dataset.pro;
    // 城市id
    let cityId = e.currentTarget.dataset.id;
    // 城市pid
    let judgeId = e.currentTarget.dataset.pid;
    //城市数据
    let dareaTextC = app.arrDeepCopy(that.data.areaTextC)
    // 省份数据
    let dareaTextP = app.arrDeepCopy(that.data.areaTextP)
    // 拷贝一份区域数据
    let areadatafor = app.arrDeepCopy(that.data.areadatas);
    // 组合选择城市对象
    let detail = {
      id: cityId,
      name: name,
      num: num,
      pro: pro,
      pid: judgeId
    } 
    let index =[]
    for (let i = 0; i < areadatafor.length; i++) {
      let areadataforItem = areadatafor[i]
      for (let j = 0; j < areadataforItem.length; j++) {
        if (areadataforItem[j].id == cityId) {
          index.push(areadataforItem[j].index)
        }
      }
    }
    // 如果区域信息是未选择状态
    if (areadatafor[num][pro].selected == 1) {
    // 如果pid即选择的是省或者直辖市
      if (judgeId == 1) {
        // 如果选择的区域超过了要求的数量给出提示并返回
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }
        // 是否是全国，将全国状态值变为1（未选中）
        let first = that.validIsChina()
        // 是全国将selected设置成1
        if(first) areadatafor[0][0].selected = 1;

        // 将选择的省会的selected状态改为2
        areadatafor[num][pro].selected = 2
        // 将选择省会数据状态改为2后存入data中
        that.setData({
          areadatas: areadatafor,
        })
        // 如果选择的是非热门城市
        if (num > 0) {
          that.getFull(num, cityId, pro)
        }
        // 将选择的省的信息压入dareaTextP中
        dareaTextP.push(detail)
        // 将选择的省信息存入data中
        that.setData({
          areaTextP: dareaTextP,
          areaTextA:[]
        })
        // 选择的是全国
      } else if (judgeId == 0) {
        // 将所有的城市信息选中状态都变成1（未选中）
        for (let i = 0; i < areadatafor.length;i++){
          for (let j = 0; j < areadatafor[i].length; j++){
            areadatafor[i][j].selected = 1
          }
        }
        // 将全国的数据选中状态变成2
        areadatafor[0][0].selected = 2
        let areaTextA = that.data.areaTextA;
        // 将选中的全国信息存入areaTextA中
        areaTextA.push(detail)
        that.setData({
          areaTextC: [],
          areadatas: areadatafor,
          areaTextP: [],
          areaTextA: areaTextA
        })
        // 选中的是市
      } else {
        // 是否通过数量限制检验，没通过直接返回
        let show = that.mustjudge(judgeId)
        if (show == "nil") {
          return
        }
        //是否是全国，将全国状态值变为1（未选中）
        let firstarea = that.validIsChina()
        if(firstarea) areadatafor[0][0].selected = 1;
        // 将选中的市级选中状态变成2
        areadatafor[num][pro].selected = 2
        // 取出所有区域数组的第一个热门城市数据
        let areadataforq = areadatafor[0]
        // 如果选择的非热门城市中包含了热门城市将热门城市选中状态变成2
        if (num != 0) {

          for (let i = 0; i < areadataforq.length; i++) {
            if (areadataforq[i].id == cityId) {
              areadataforq[i].selected = 2
            }
          }
        } else {
        // 如果选择热门城市也将对应省份的城市也选中
          for (let i = 0; i < index.length; i++) {
            let number = areadatafor[index[i]];
            for (let j = 0; j < number.length; j++) {
              if (number[j].id == cityId) {
                number[j].selected = 2
              }
            }
          }
        }
        // 将改变的数据存入data中
        that.setData({
          areadatas: areadatafor,
        })
        // 如果选中的是非热门城市
        if (num > 0) {
        // 将选中城市对应的全省选中状态变成1（（未选中））
          that.getFullone(num)
        } else if (num == 0) {
        // 选中热门城市后将该城市对应的全省状态变成1（未选中）
          that.getzero(index)
        }
        // 将选中城市数据保存在data中
        dareaTextC.push(detail)

        that.setData({
          areaTextC: dareaTextC,
          areaTextA: []
        })

      }
      // 保存所有的选中区域数据
      that.setData({
        areaText: [...that.data.areaTextC, ...that.data.areaTextP, ...that.data.areaTextA]
      })
    // 点击的区域信息是选中状态
    } else {
      // 获取所有选中的数据
      let areadatafor = app.arrDeepCopy(that.data.areadatas);
      let dareaTextC = app.arrDeepCopy(that.data.areaTextC)
      let dareaTextP = app.arrDeepCopy(that.data.areaTextP)
      let areaArrT = app.arrDeepCopy(that.data.areaText)
      // 点击省，将状态变成1未选中
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
          for (let j = 0; j < index.length; j++) {
            for (let i = 0; i < areadatafor[index[j]].length; i++) {
              if (areadatafor[index[j]][i].id == cityId) {
                areadatafor[index[j]][i].selected = 1
              }
            }
            
          }
        }
      }
      that.setData({
        areadatas: areadatafor
      })

      // 删除保存的选中区域的数据
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
      // 重新保存取消选中后的数据
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

    // let areadatahot = app.globalData.hotAreaData.use;
    // if (areadatahot) {
    //   let data = app.globalData.hotAreaData.data
    //   that.changeAreaData(data, options)

    // } else {
      app.appRequestAction({
        url: "/job/top-hot-areas-v1/",
        way: "POST",
        mask: true,
        failTitle: "数据加载失败，请稍后重试！",
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
        }
      })
    // }

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
    let areadatafor = app.arrDeepCopy(that.data.areadatas);
    let detail = {
      id: item.id,
      name: item.area ? item.area : item.name,
      pid: item.pid
    }
    let indexs =[]
    for (let i = 0; i < areadatafor.length; i++) {
      let areadataforItem = areadatafor[i]
      for (let j = 0; j < areadataforItem.length; j++) {
        if (areadataforItem[j].id == detail.id) {
          indexs.push(areadataforItem[j].index)
        }
      }
    }
    let index = this.findIndex(item.id)
    let pro = this.findPro(index, item.id)
    if (item.pid == 1) {
      if (index > 0) {
        this.getFull(index, item.id, pro)
      }
      that.data.areaTextP.push(detail)
    } else {
      if (index > 0) {
        this.getFullone(index)
      } else if (index == 0) {
        that.getzero(indexs)
      }
      that.data.areaTextC.push(detail)
    }
    if(that.validIsChina()){
      that.data.areadatas[0][0].selected = 1;
    }
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
      areaTextA:[],
      select:`selected${detail.id}2`
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
        areaText: allall,
      })
      setTimeout(() => {
        that.setData({
          select:`selected${allall[0].id}2`
        })
      }, 300);
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
    let that = this
    that.gethistory()
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

  },
  onShareTimeline:function () {
    let commonShareTips = app.globalData.commonShareTips;
    let commonShareImg = app.globalData.commonShareImg;
    return {
      title: commonShareTips,
      imageUrl: commonShareImg
    }
  }
})
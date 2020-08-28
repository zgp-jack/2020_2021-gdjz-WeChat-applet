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
  //获取找活置顶的省份城市选择界面
  getAreaData: function(options) {
    //获取本地缓存区域信息
    let areadata = wx.getStorageSync("areadata");
    let num = app.globalData.areaDataNum;
    //如果本地有缓存区域信息
    let _this = this;
    if (areadata) {
    //深拷贝区域信息
      let mydata = app.arrDeepCopy(areadata)
    //删除数组的第一个元素
      mydata.data.shift()
      if (areadata.hasOwnProperty("num") && (areadata.num == num)) {
        //将数据存到data中
        _this.setData({
          areaDataNotEnd: mydata.data
        })
        //获取热门城市
        _this.hotcities(options)
        wx.hideLoading()
        return false;
      }
    }
    //如果没有缓存信息将通过app中方法获取区域数据
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
    // 如果选择的省会长度大于最大要求值与选择城市大于要求的最大城市值，给出提示信息
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
    // 如果选择城市数量大于最大要求数量和选择的是市给出提示信息
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
    // 如果选择省数量大于最大要求数量和选择的是省会给出提示信息
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
    // 获取所有区域数据
    let areaArr = app.arrDeepCopy(that.data.areadatas)
    // 获取城市数据
    let areaArrC = app.arrDeepCopy(that.data.areaTextC)
    let areaArrT = app.arrDeepCopy(that.data.areaText)
    // 当前二维数组的长度
    let firstLen = areaArr[num].length;
    // 如果不是热门城市
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
  //验证是否是全国
  validIsChina:function(){
  // 数组二维数组的第一条是全国
    let area = this.data.areadatas[0][0]
  // 如果id为1返回true
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
    // 如果区域信息是可选择状态
    if (areadatafor[num][pro].selected == 1) {
    // 如果pid即选择的是省
      if (judgeId == 1) {
    
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
          let number = areadatafor[judgeId - 2];
          for (let i = 0; i < number.length; i++) {
            if (number[i].id == cityId) {
              number[i].selected = 2
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
          that.getzero(judgeId)
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
        console.log('直接点击全国 取消')
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
  changeAreaData(data, options) {
    let that = this;
    //获取data中区域数据
    let arr = this.data.areaDataNotEnd
    //数组长度
    let outlen = arr.length
    //遍历数组
    for (let i = 0; i < outlen; i++) {
    //一维数组长度
      let inlen = arr[i].length;
      for (let j = 0; j < inlen; j++) {
    //inarr二维数组中每一个值
        let inarr = arr[i][j];
        inarr.selected = 1
        inarr.pro = j
        inarr.index = i + 1
      }
    }
    //遍历热门城市数组
    for (let i = 0; i < data.length; i++) {
      data[i].selected = 1
      data[i].pro = i
      data[i].index = 0
      data[i].city = data[i].name
    }
    //将热门城市数组压入所有城市数组中
    arr.unshift(data)
    that.setData({
      showlodinga: false
    })
    //修改data中城市数组并将新数组存入data中
    that.modifyArea(options, arr)
    console.log("arr",arr)
  },
  //获取热门城市
  hotcities(options) {
    let that = this;
    //发送请求获取热门城市
    app.appRequestAction({
      url: "/resumes/hot-areas/",
      way: "POST",
      mask: true,
      failTitle: "数据加载失败，请稍后重试！",
      success: function(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          //将热门城市数据存入globalData中
          app.globalData.hotAreaData = {
            data: mydata.data,
            use: true
          }
          that.changeAreaData(mydata.data, options)
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
    console.log('触发了')
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
  // 获取选择最大省数量和城市数量
  getMax(item) {
    console.log("item",item)
    // 获取传过来的最大省数量和最大城市数量
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
    // 选择省区域去重
    let uareaTextP = that.unique(areaTextP)
    // 选择城市区域去重
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
    //获取置顶配置中最大的城市数量和最大省数量并存入data中
    this.getMax(options);
    //获取全国区域数据并组合热门城市存入data中
    this.getAreaData(options);
    this.initInputList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("this.data",this.data)
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
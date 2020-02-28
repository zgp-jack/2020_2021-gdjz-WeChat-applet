const app = getApp();
let areas = require("../../../utils/area.js");
let vali = require("../../../utils/v.js");
const PI = Math.PI;
let EARTH_RADIUS = 6378137.0;
const Amap = require("../../../utils/amap-wx.js");
//historyregionone updated controltap markers address-body mapandpois userEnterAddress mapInputFocus publish/checking-adcode/
const amapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionone: "",
    show: false,
    longitude:"",
    latitude: "",
    markers: [],
    nodataImg: app.globalData.apiImgUrl + "nodata.png",
    addressList: [],
    mapaddressList:[],
    addressText: '',
    addressData: {
      "title": "",
      "adcode": "",
      "location": "",
      "district": ""
    },
    addressTips: "请先输入您的详细地址",
    showArea: false,
    areadata: [],
    locationHistory: false,
    gpsOrientation: false,
    gpsposi: "../../../images/gps-posi.png",
    clearinput: "../../../images/clear-input.png",
    areaText: "北京",
    areaId: 2,
    keyAutoVal: "北京市",
    showMaplist: true,
    allAreaLists: [],
    nAreaLists: [],
    isAllAreas: true,
    showInputList: false,
    searchInputVal: "",
    showHisTitle: false,
    areaInputFocus: false,
    pmaphone: app.globalData.serverPhone,
    showheder:"noshowheder"
  },
  chooseInputCtiy: function (e) {
    this.chooseThisCtiy(e);
    this.setData({ isAllAreas: true, searchInputVal: "", showArea: false, showInputList: false })
  },
  clearInputAction: function () {
    this.setData({ isAllAreas: true, showInputList: false, searchInputVal: "" })
  },
  searchInput: function (e) {
    let val = e.detail.value
    this.setData({ searchInputVal: val })
    if (!val) this.setData({ showInputList: false, isAllAreas: true })
    else {
      this.setData({ showInputList: true })
      this.filterInputList(val);
    }
  },
  filterInputList: function (val) {
    let list = app.arrDeepCopy(this.data.allAreaLists);
    let nlist = list.filter(function (item) {
      let pname = item.cname;
      if (pname.indexOf("-")) {
        pname = pname.split("-").join("")
      }
      return (pname.indexOf(val) !== -1);
    })
    this.setData({ nAreaLists: nlist, isAllAreas: false })
  },
  showInputList: function (e) {
    this.setData({ showInputList: true })
  },
  clearInputVal: function () {
    this.setData({ showMaplist: true, addressText: "", showHisTitle: false })
    this.getMapInfo();
  },
  mapInputFocus: function (e) {
    let val = e.detail.value;
    if (val) return false;
    this.initHistoryCityList()
    this.setData({ showHisTitle: true })

  },
  initHistoryLoc: function () {
    let h = wx.getStorageSync("locationHistory");
    let p = wx.getStorageSync("gpsPorvince");
    if (h) this.setData({ locationHistory: h })
    if (p) this.setData({ gpsOrientation: p })
  },
  detailHistoryCities: function (item) {
    let hc = wx.getStorageSync("historyfindLists");
    if (hc) {
      let len = hc.length;
      for (let i = 0; i < len; i++) {
        if (hc[i].title == item.title) {
          if (hc[i].adcode == item.adcode) {
            if (hc[i].location == item.location) {
              if (hc[i].district == item.district) {
                hc.splice(i, 1);
                break;
              }
            }
          }
        }
      }
      hc.unshift(item)
      if (hc.length > 10) hc.splice(10)
      wx.setStorageSync("historyfindLists", hc)
    } else {
      wx.setStorageSync("historyfindLists", [item])
    }
  },
  initHistoryCityList: function () {
    let hc = wx.getStorageSync("historyfindLists");
    let loc = wx.getStorageSync("userLocation");
    if (hc) {
      if (loc) {
        let len = hc.length;
        for (let i = 0; i < len; i++) {
          hc[i].distance = this.getGreatCircleDistance(loc, hc[i].location)
        }
      }
    } else {
      hc = []
      this.setData({ addressTips: "暂无历史记录" })
    }
    this.setData({ addressList: hc })
  },
  getAreaData: function () {
    app.getAreaData(this);
  },
  showCity: function () {
    this.setData({ showArea: true, addressActive: false })
  },
  closeArea: function () {

    this.setData({ areaInputFocus: false })
    setTimeout(() => {
      this.setData({ showArea: false, addressActive: true, showInputList: false, searchInputVal: "", isAllAreas: true })
    }, 10)


  },
  chooseThisCtiy: function (e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let area = e.currentTarget.dataset.area;
    let pid = parseInt(e.currentTarget.dataset.pid);
    let pname = e.currentTarget.dataset.pname;
    let mydata = { "name": area, "id": id, "ad_name": pname };
    this.setData({ areaId: parseInt(id), areaText: area, showHisTitle: false, keyAutoVal: pname, addressText: "" })
    this.closeArea();
    app.setStorageAction(id, mydata, true)
    let prevPage = app.getPrevPage();
    prevPage.setData({
      areaId: parseInt(id), areaText: area, showHisTitle: false, keyAutoVal: pname, addressText: ""
    })
    this.initHistoryLoc();

    this.getKeywordsInputs(pname, function (data) {
      console.log(data)
      _this.setData({ addressList: data })
    })


    let lastPublishCity = { name: area, ad_name: pname };
    wx.setStorageSync("lastPublishCity", lastPublishCity);
  },
  checkAdcode: function (adcode, callback) {
    let _this = this;
    app.appRequestAction({
      way: 'GET',
      url: 'resumes/check-adcode/',
      params: {
        adcode: adcode
      },
      success: function (res) {
        console.log(res)
        if (res.data.errcode == "ok") {
          let provincelocal = {};
          Object.assign(provincelocal,{
            province: res.data.province,
            city: res.data.city,
            adcode: adcode
          })
          wx.setStorageSync("provincelocal", provincelocal)
        }
        if (res.data.errcode == "fail") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            complete: function () {
              //_this.userTapAddress();
            }
          })
        } else {
          callback()
        }
      },
      fail: function () {
        callback()
      }
    })

  },
  getMapInfo: function () {
    let that = this;
    this.getKeywordsInputs(this.data.keyAutoVal, function (data) {
      that.setData({ addressList: data })
    });
    return false;
  },
  userLocFun: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let loc = res.longitude + "," + res.latitude;
        let locsto = wx.getStorageSync("userLocation");
        if (!locsto) wx.setStorageSync("userLocation", loc);
        that.setData({ "mapInfo.longitude": res.longitude, "mapInfo.latitude": res.latitude })
        that.getPoiList(loc, function (data) {
          let p = data[0].regeocodeData.addressComponent.province
          let c = data[0].regeocodeData.addressComponent.city
          let mydata = areas.getProviceItem(p, c)
          wx.setStorageSync("gpsOrientation", mydata)
          that.initAreaText();
          that.getMapInfo();
        });
      }
    })
  },
  getPoiList: function (loc, callback) {
    let that = this;
    amapFun.getRegeo({
      location: loc,
      success: function (data) {
        let pois = data[0].regeocodeData.pois;
        let adcode = data[0].regeocodeData.addressComponent.adcode
        callback ? callback(data) : ""
        that.filtterNullData(pois);
        that.setData({ adcode: adcode })
      },
      fail: function (info) {
        //失败回调
        that.openSetting(function () {
          that.initHistoryCityList();
        })
      }
    })
  },

  filtterNullData: function (result, callback) {
    let loc = wx.getStorageSync("userLocation");
    let len = result.length;
    let res = [];
    let v = vali.v.new();
    for (let i = 0; i < len; i++) {
      let adcode = v.ObjType(result[i].adcode, "array")
      let district = v.ObjType(result[i].district, "array")
      let location = v.ObjType(result[i].location, "array")
      if (!adcode && !district && !location) {
        if (loc) {
          result[i].distance = this.getGreatCircleDistance(loc, result[i].location);
        }
        res.push(result[i])
      }
      if (res.length == 10) break;
    }
    callback ? callback(res) : this.setData({ addressList: res })
  },
  getRad: function (d) {
    return parseFloat(d) * PI / 180.0;
  },
  getGreatCircleDistance: function (l, loc) {
    let arr1 = l.split(",");
    let arr2 = loc.split(",");
    let radLat1 = this.getRad(arr1[0]);
    let radLat2 = this.getRad(arr2[0]);
    let a = radLat1 - radLat2;
    let b = this.getRad(arr1[1]) - this.getRad(arr2[1]);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = (Math.round(s * 10000) / 10000.0).toFixed(2);
    s = (s < 1000) ? parseInt(s) + "米" : (s / 1000).toFixed(1) + "千米";
    return s;

  },
  /**打开设置面板 */
  openSetting: function (e) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        //console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权   
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则将不能为你自动推荐位置',
            success: function (res) {
              if (res.cancel) {
              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })

                      //再次授权，调用getLocationt的API
                      that.userLocFun()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
          return false;
        }
      },
    })
  },
  getKeywordsInputs: function (val, callback) {
    let _this = this;
    amapFun.getInputtips({
      keywords: val,
      location: '',
      success: function (data) {
        if (data) {
          //_this.setData({ addressTips: data.tips.length ? '' : '暂未搜索到相关位置' })
          _this.filtterNullData(data.tips, function (data) {
            callback ? callback(data) : ""
          })
        } else {
          _this.setData({ addressTips: '暂未搜索到相关位置' })
        }
      }
    })
  },
  closeAddressAction: function () {
    wx.navigateBack({ delta: 1 })
  },
  userEnterAddress: function (e) {
    let _this = this;
    let val = e.detail.value;
    this.setData({ addressText: val }) //, showMaplist: false

    let keywords = this.data.keyAutoVal + this.data.addressText;
    this.getKeywordsInputs(keywords, function (data) {
      _this.setData({ addressList: data, showHisTitle: false })
      if (!data.length) _this.setData({ addressTips: "暂无数据" })
    });
    // if (val){
    //   let keywords = this.data.keyAutoVal + this.data.addressText;
    //   this.getKeywordsInputs(keywords,function(data){
    //     _this.setData({ historyCityLists: data })
    //   });
    //   this.setData({ isKeyvalActive: true })
    // }else{
    //   this.initHistoryCityList()
    //   //this.setData({ showMaplist: true,isKeyvalActive:true })
    // }
  },
  // saveInfo: function (info) {
  //   let _this = this;
  //   wx.setStorageSync("userLastPubArea", info);

  // },
  setAddressData: function (e) {
    console.log(e)
    wx.setStorageSync("historyregionone", e.currentTarget.dataset)
    let _this = this;
    let area = this.data.areaText;
    let pname = this.data.keyAutoVal;
    let areaId = parseInt(this.data.areaId);
    let t = e.currentTarget.dataset.title
    let a = e.currentTarget.dataset.adcode
    let l = e.currentTarget.dataset.location
    let d = e.currentTarget.dataset.district
    let hl = {
      title: t,
      adcode: a,
      location: l,
      district: d
    }
    this.checkAdcode(a, function () {
      let prevPage = app.getPrevPage();

      let lastPublishCity = { name: area, ad_name: pname };
      wx.setStorageSync("lastPublishCitys", lastPublishCity);

      prevPage.setData({
        regionone: t,
        "addressData.adcode": a,
        "addressData.location": l,
        "addressData.district": d,
        areaId: areaId, areaText: area,
        showheder:"noshowheder"
      })

      // _this.saveInfo(hl);

      _this.detailHistoryCities(hl);
      _this.initHistoryCityList();

      wx.navigateBack({ delta: 1 })

   
    })

  },
  getAddressList: function () {
    let _this = this;

    app.appRequestAction({
      way: 'POST',
      url: '/publish/get-tips/',
      hideLoading: true,
      params: {
        keywords: _this.data.addressText
      },
      success: function (res) {
        let mydata = res.data;
        if (mydata.status) {
          _this.setData({ addressList: mydata.tips, addressTips: mydata.tips.length ? '' : '暂未搜索到相关位置' })
        } else {
          _this.setData({ addressTips: mydata.info })
        }
      },
      fail: function () {
        let phone = _this.data.pmaphone;
        this.setData({ addressTips: `接口出错，请联系客服电话${phone}` })
      }
    })

  },
  initAreaText: function () {
    let _this = this;
    let lastCtiy = wx.getStorageSync("lastPublishCitys");
    let gpsPorvince = wx.getStorageSync("gpsPorvince");
    let gpsloc = wx.getStorageSync("gpsPorvince");
    let defaultwardenryid = wx.getStorageSync("defaultwardenryid");
    let showheder = this.data.showheder
    console.log(lastCtiy)
    console.log(gpsPorvince)
    console.log(gpsloc)
    console.log(gpsloc)
    this.setData({ gpsOrientation: gpsPorvince })

    if (defaultwardenryid && showheder == "showheder"){
      this.setData({ areaText: defaultwardenryid.city, keyAutoVal: defaultwardenryid.ad_name })
    } else if (lastCtiy&& showheder == "noshowheder") {
      this.setData({ areaText: lastCtiy.name, keyAutoVal: lastCtiy.ad_name })
    } else if (gpsloc) {
      this.setData({ areaText: gpsloc.name, keyAutoVal: gpsloc.name + "市" })
    }
  },
  initInputList: function () {
    let list = areas.getInputList(true);
    this.setData({ allAreaLists: list })
  },

  addmap(){
    var that = this
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: "1",
            latitude: res.latitude,
            longitude: res.longitude,
            width: 20,
            height: 20,
            iconPath: "../../../images/gps.png"
          }]
        })
      }
    })
    var myAmapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data)
        // that.setData({
        // })
      }, fail: function (info) {

        console.log(info)
      }
    })
  },

  addmapone() {
    var that = this
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        that.setData({
          latitude:  that.data.latitude,
          longitude:  that.data.longitude,
          markers: [{
            id: "1",
            latitude:that.data.latitude,
            longitude: that.data.longitude,
            width: 20,
            height: 20,
            iconPath: "../../../images/gps.png"
          }]
        })
      }
    })

  },



  aroundmap() {
    var that = this;
    var myAmapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
    let longitude = this.data.longitude
    let latitude = this.data.latitude
    let all = longitude + "," + latitude;
    myAmapFun.getPoiAround({
      location: all,
      success: function (data) {
        let alltude = that.data.longitude + ',' + that.data.latitude;
        for (let i = 0; i < data.poisData.length ; i++){
          let distan = that.getGreatCircleDistance(alltude,data.poisData[i].location)
          data.poisData[i].distance = distan
        }
        that.setData({
          mapaddressList: data.poisData
        })
      }, fail: function (info) {

        console.log(info)
      }
    })

  },
  setAddressmap(e){
    console.log(e)
    var that = this;
    that.setData({
      regionone: e.currentTarget.dataset.title
    })

    wx.setStorageSync("historyregionone", e.currentTarget.dataset)
    wx.navigateBack({ delta: 1 })
  },

  regionchange(e) {
  
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {

      var that = this;
      that.mapCtx = wx.createMapContext("myMap");
      that.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          console.log(res)
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })
          that.addmapone();
          that.aroundmap();
        }
      })
    }
  },
  //定位到自己的位置事件
  my_location: function (e) {
    console.log(e)
    var that = this;
    that.onLoad();
  },
  markertap(eventhandle){
    console.log(eventhandle)
  },
  showheder(options){
    if (options.hasOwnProperty("showheder")){
      this.setData({ showheder: options.showheder })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showheder(options)
    this.initInputList();
    areas.getInputList();
    this.getAreaData();
    this.initHistoryLoc();
    this.initAreaText();
    this.initHistoryCityList();
    this.getMapInfo();
    this.openSetting();
    this.addmap();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },
  updated(){
    this.aroundmap()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
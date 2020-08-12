const app = getApp();
let areas = require("../../../utils/area.js");
let vali = require("../../../utils/v.js");
const PI = Math.PI;
let EARTH_RADIUS = 6378137.0;
const Amap = require("../../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
Page({

  /**
   * showCity
   * 
   */
  data: {
    nodataImg: app.globalData.apiImgUrl + "nodata.png",
    addressList: [],
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
    showHisTitle:false,
    areaInputFocus:false,
    infoId:"",
    showfor:"noshowfor",
    showmap:"noshowmap"
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
    this.setData({ showMaplist: true, addressText: "",showHisTitle:false })
    this.getMapInfo();
  },
  mapInputFocus: function (e) {
    let val = e.detail.value;
    if(val) return false;
    this.initHistoryCityList()
    this.setData({ showHisTitle:true })
    
  },
  // addressList
  initHistoryLoc: function () { 
    let h = wx.getStorageSync("locationHistory");
    let p = wx.getStorageSync("gpsPorvince");
    
    
    if (h) this.setData({ locationHistory: h })
    if (p) this.setData({ gpsOrientation: p })
  },
  detailHistoryCities: function (item) {
    let hc = wx.getStorageSync("historyCityLists");
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
      wx.setStorageSync("historyCityLists", hc)
    } else {
      wx.setStorageSync("historyCityLists", [item])
    }
  },
  initHistoryCityList: function () {
    let hc = wx.getStorageSync("historyCityLists");
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
      this.setData({ addressTips:"暂无历史记录" })
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
    let mydata = { "name": area, "id": id, "ad_name": pname, "pid": pid };
    this.setData({ areaId: parseInt(id), areaText: area, showHisTitle: false, keyAutoVal: pname, addressText: "" })
    this.closeArea();
    app.setStorageAction(id, mydata, true)
    let prevPage = app.getPrevPage();
    prevPage.setData({ 
      areaId: parseInt(id), areaText: area, showHisTitle: false, keyAutoVal: pname, addressText: ""
    })
    this.initHistoryLoc();
    this.getKeywordsInputs(pname, function (data) {
      _this.setData({ addressList: data })
    })

    //切换城市直接保存
    let lastPublishCity = { name: area, ad_name: pname };
    wx.setStorageSync("lastPublishCity", lastPublishCity);
  },
  checkAdcode: function (adcode, callback) {
    let _this = this;
    app.appRequestAction({
      way: 'POST',
      url: 'publish/checking-adcode/',
      params: {
        adcode: adcode
      },
      success: function (res) {
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
    // console.log(this.data.keyAutoVal)
    console.log('---ok---')
    console.log(this.data.keyAutoVal)
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
        that.openSetting(function(){
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
  closeAddressAction:function(){
    wx.navigateBack({ delta:1 })
  },
  userEnterAddress: function (e) {
    let _this = this;
    let val = e.detail.value;
    this.setData({ addressText: val }) //, showMaplist: false

    let keywords = this.data.keyAutoVal + this.data.addressText;
    this.getKeywordsInputs(keywords, function (data) {
      _this.setData({ addressList: data,showHisTitle:false })
      if (!data.length) _this.setData({ addressTips:"暂无数据" })
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
  saveRecruitInfo:function(info){
    let _this = this;
    wx.setStorageSync("userLastPubArea", info);
    
  },
  setAddressData: function (e) {
    let defaultname = wx.getStorageSync("locationHistory")[0]
    wx.setStorageSync('defaultname', defaultname)
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
      wx.setStorageSync("lastPublishCity", lastPublishCity);

      prevPage.setData({
        "addressData.title": t,
        "addressData.adcode": a,
        "addressData.location": l,
        "addressData.district": d,
      })

      prevPage.userSetAreaInfo()

      _this.saveRecruitInfo(hl);

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
        this.setData({ addressTips: '接口出错，请联系客服电话400-838-1888' })
      }
    })

  },
  initAreaText: function () {
    //获取缓存中默认的地理位置信息
    let defaultname = wx.getStorageSync("defaultname");
    //左后一次选择的城市
    let lastCtiy = wx.getStorageSync("lastPublishCity");
    //获取gps定位的城市
    let gpsPorvince = wx.getStorageSync("gpsPorvince");
    let gpsloc = wx.getStorageSync("gpsPorvince");
    this.setData({ gpsOrientation: gpsPorvince });
    let infoId = this.data.infoId;
    let showfor = this.data.showfor;
    let showmap = this.data.showmap;

    if (defaultname && showfor == "showfor"){
      this.setData({ areaText: defaultname.name, keyAutoVal: defaultname.name + "市" })
    } else if (lastCtiy && lastCtiy.hasOwnProperty('name') && !infoId ||showfor == "noshowfor" ) {
      this.setData({ areaText: lastCtiy.name , keyAutoVal: lastCtiy.ad_name })
    } else if (gpsloc) {
      this.setData({ areaText: gpsloc.name, keyAutoVal: gpsloc.name + "市" })
    }
  },
  initInputList: function () {
    let list = areas.getInputList(true);
    this.setData({ allAreaLists: list })
  },
  getinfoId(options){
    if (options.hasOwnProperty("infoId")){
      this.setData({ infoId: options.infoId })
    }
    if (options.hasOwnProperty("showfor")){
     
      this.setData({ showfor: options.showfor })
    }
    if (options.hasOwnProperty("showmap")) {
      this.setData({ showmap: options.showmap })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfoId(options)
    this.initInputList();
    areas.getInputList();
    this.getAreaData();
    this.initHistoryLoc();
    this.initAreaText();
    this.initHistoryCityList();
    this.getMapInfo();
    this.openSetting();
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
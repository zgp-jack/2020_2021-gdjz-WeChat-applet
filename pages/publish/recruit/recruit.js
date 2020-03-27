// 
const app = getApp();
let vali = require("../../../utils/v.js");
let areas = require("../../../utils/area.js");
const tmplId = require("../../../utils/temp_ids.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: true,
    nodataImg: app.globalData.apiImgUrl + "nodata.png",
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    serverPhone: app.globalData.serverPhone,
    options: {},
    cardInfo: {
      username: "",
      title: "",
      workType: [],
      workTypeIds: [],
      workTypenum: 3,
      cities: [],
      provinceId: "",
      cityId: "",
      memberTel: "",
      cardTel: "",
      code: "",
      content: "",
      imgs: [],
      imgnum: 3,
    },
    areaProvince: [],
    provinceIndex: 0,
    areaCitys: [],
    cityIndex: 0,
    areaText: "",
    userPhone: "",
    infoId: "",
    showWorkType: false,
    showTextarea: true,
    showUploads: false,
    codeTips: "获取验证码",
    status: 1,
    textareaActive: false,
    textareaTips: "",
    pindex: 0,
    cindex: 0,
    tindex: 0,
    objectAreaData: [],
    adcode: "",
    county_id: "",
    addressList: [],
    addressConut: 0,
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
    historyCityLists: [],
    isKeyvalActive: false,
    allAreaLists: [],
    nAreaLists: [],
    isAllAreas: true,
    showInputList: false,
    searchInputVal: "",
    strlen: 0,
    resson:"",
    display: "none",
    default_search_name:"",
    showfor:"showfor",
    showmap:"noshowmap",
    model:{},
    is_checkCons:""
  },

  userRegMap: function (e) {
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      var that = this;
      this.mapCtx = wx.createMapContext("mymap");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          let longitude = res.longitude;
          let latitude = res.latitude;
          let loc = res.longitude + "," + res.latitude;
          that.setData({
            "mapInfo.longitude": longitude,
            "mapInfo.latitude": latitude
          })
          that.getPoiList(loc, function (data) {
            let city = data[0].regeocodeData.addressComponent.city
            that.setData({ areaText: city })
          });
        }
      })
    }
  },
  userTapAddress: function () {
    let default_name = this.data.default_search_name;
    let infoId = this.data.infoId;
    let showfor = this.data.showfor;
    let showmap = this.data.showmap;
   
    if (default_name != ""){
      wx.setStorageSync("defaultname", default_name)
    }else{
      wx.setStorageSync("defaultname",false)
    }
    wx.navigateTo({
      url: `/pages/publish/pmap/pmap?infoId=${infoId}&showfor=${showfor}&showmap=${showmap}`,
    })
  },
  initPickerData: function () {
    let pickerData = [];
    let p = this.initAllProvice();
    let c = this.getCityList();
    let t = this.getTownList();
    pickerData.push(p, c, t);
    this.setData({ objectAreaData: pickerData })
  },
  initAllProvice: function () { //获取所有省份
    let arr = app.arrDeepCopy(areas.getAreaArr);
    let provice = [];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let data = { id: arr[i].id, pid: arr[i].pid, name: arr[i].name }
      provice.push(data)
    }
    return provice;
  },
  getCityList: function () {
    let i = this.data.pindex;
    let arr = app.arrDeepCopy(areas.getAreaArr);
    let cdata = arr[i].children;
    let len = cdata.length;
    let city = [];
    for (let j = 0; j < len; j++) {
      let data = { id: cdata[j].id, pid: cdata[j].pid, name: cdata[j].name }
      city.push(data)
    }
    return city;
  },
  getTownList: function () {
    let arr = app.arrDeepCopy(areas.getAreaArr);
    let i = this.data.pindex;
    let j = this.data.cindex;
    let _data = arr[i].children[j];
    
    return _data.has_children ? _data.children : [{ id: _data.id, pid: _data.pid, name: _data.name }];
  },
  bindPickerColumnChange: function (e) {
    let column = e.detail.column;
    let value = e.detail.value;
    if (column == 0) {
      this.setData({ pindex: value })
    } else if (column == 1) {
      this.setData({ cindex: value })
    } else {
      this.setData({ tindex: value })
    }

    this.initPickerData();
  },
  bindMultiPickerChange: function (e) {
    let arrdata = app.arrDeepCopy(areas.getAreaArr);
    let arr = e.detail.value;
    let data = arrdata[arr[0]].children[arr[1]];
    let mydata = (data.has_children) ? data.children[arr[2]] : data
    
  },

  bindPickerChange: function (e) {
    this.setData({
      "cardInfo.teamId": parseInt(e.detail.value) + 1
    })
  },
  userClickItem: function (e) {
    let _type = e.currentTarget.dataset.type;
    let _id = e.currentTarget.dataset.id;
    let _check = e.currentTarget.dataset.check;
    let _index = parseInt(e.currentTarget.dataset.index);
    let _key = parseInt(e.currentTarget.dataset.key);
    if (_type == "workType") {
      if (_check) {
        let _arr = this.delArrItems(this.data.cardInfo.workTypeIds, _id);
        let _newarr = this.resetArrItems(this.data.cardInfo.workType, _index, _key, false);
        this.setData({
          "cardInfo.workTypeIds": _arr,
          "cardInfo.workType": _newarr
        })
      } else {
        if (this.data.cardInfo.workTypeIds.length >= this.data.cardInfo.workTypenum) {
          wx.showModal({
            title: '温馨提示',
            content: '所需工种最多选择' + this.data.cardInfo.workTypenum + '个',
            showCancel: false,
            success(res) { }
          })
          return false;
        }
        let _arr = this.addArrItems(this.data.cardInfo.workTypeIds, _id);
        let _newarr = this.resetArrItems(this.data.cardInfo.workType, _index, _key, true);
        this.setData({
          "cardInfo.workTypeIds": _arr,
          "cardInfo.workType": _newarr
        })
      }
    }
  },
  delArrItems: function (_arr, _id) {
    let myarr = app.arrDeepCopy(_arr);
    for (var i = 0; i < myarr.length; i++) {
      if (myarr[i] == _id) myarr.splice(i, 1);
    }
    return myarr;
  },
  addArrItems: function (_arr, _id) {
    let myarr = app.arrDeepCopy(_arr);
    myarr.push(_id);
    return myarr;
  },

  judgecommit(mydata, infoId){
    let _this = this;
    let cardInfo = _this.data.cardInfo;
    let userInfo = wx.getStorageSync("userInfo");
    let cardImgs = _this.getUserCardImgs();
    let model = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      type: "job",
      infoId: infoId,
      user_mobile: mydata.model.user_mobile || mydata.memberInfo.tel,
      title: mydata.model.title ? mydata.model.title : "",
      user_name: mydata.model.user_name ? mydata.model.user_name : "",
      classifies: mydata.selectedClassifies ? mydata.selectedClassifies : [],
      detail: mydata.model.detail ? mydata.model.detail : "",
      code: cardInfo.code,
      images: cardImgs,
      province_id: mydata.model.province_id ? mydata.model.province_id : "",
      city_id: mydata.model.city_id ? mydata.model.city_id : "",
      address: mydata.model.address ? mydata.model.address + "@@@@@" : "",
      location: mydata.model.location ? mydata.model.location : "",
      adcode: "",
      county_id: mydata.model.county_id ? mydata.model.county_id : "",
    }
    _this.setData({
      model: model
    })

  },
  resetArrItems: function (_arr, _index, _key, _bool) {
    let myarr = app.arrDeepCopy(_arr);
    (_key < 0) ? myarr[_index].is_check = _bool : myarr[_index].children[_key].is_check = _bool;
    return myarr;
  },
  userDoUploads: function () {
    this.setData({
      showUploads: !this.data.showUploads
    })
  },
  initUserCardinfo: function (options) {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    let infoId = (options.hasOwnProperty("id")) ? options.id : "";
    if (infoId) {
      wx.setNavigationBarTitle({
        title: '修改招工'
      })
    }
    this.setData({ userInfo: userInfo });
    app.appRequestAction({
      //url: "publish/view-message/",
      url: "publish/new-job/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        infoId: infoId,
        type: "job"
      },
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          console.log(mydata)
          
          _this.setData({
            infoId: infoId,
            userPhone: mydata.model.user_mobile || mydata.memberInfo.tel,
            "cardInfo.username": mydata.model.user_name ? mydata.model.user_name : "",
            "cardInfo.title": mydata.model.title ? mydata.model.title : "",
            "cardInfo.workType": mydata.classifyTree,
            "cardInfo.workTypeIds": mydata.selectedClassifies ? mydata.selectedClassifies : [],
            "cardInfo.workTypenum": parseInt(mydata.typeTextArr.maxClassifyCount),
            //"cardInfo.cities": mydata.areaTree,
            "cardInfo.provinceId": mydata.model.province_id ? mydata.model.province_id : "",
            "cardInfo.cityId": mydata.model.city_id ? mydata.model.city_id : "",
            "cardInfo.memberTel": mydata.memberInfo.tel,
            "cardInfo.cardTel": mydata.model.user_mobile,
            "cardInfo.content": mydata.model.detail ? mydata.model.detail : "",
            strlen: mydata.model.detail ? mydata.model.detail.length : 0,
            "cardInfo.imgs": mydata.view_image,
            "cardInfo.imgnum": parseInt(mydata.typeTextArr.maxImageCount),
            showUploads: (mydata.view_image.length > 0) ? true : false,
            textareaTips: mydata.placeholder,
            "addressData.title": mydata.model.address ? mydata.model.address : "",
            "addressData.location": mydata.model.location ? mydata.model.location : "",
            county_id: mydata.model.county_id ? mydata.model.county_id : "",
            resson: mydata.model.hasOwnProperty("check_fail_msg") ? mydata.model.check_fail_msg:"",
            default_search_name: mydata.default_search_name ? mydata.default_search_name:""
          })
          _this.judgecommit(mydata,infoId)


          
          if (!infoId) {
            let lastArea = wx.getStorageSync("userLastPubArea");
            if (lastArea) _this.setData({ addressData: lastArea })
          }
          if (options.is_check == "0") {
            _this.setData({
              showModal:true,
              showTextarea:false,
              display:"block",
              is_checkCons: "0"
            })
          }
          // setTimeout(function(){
          //     _this.initAreaPicker();
          // },0)
        } else {
          app.showMyTips(mydata.errmsg);
        }
      }
    })
  },
  vertify() {
    this.setData({
      showModal: false,
      display: "none",
      showTextarea:true
    })
  },
  initAreaPicker: function () {
    let _arr = app.arrDeepCopy(this.data.cardInfo.cities);
    let pid = this.data.cardInfo.provinceId;
    let pIndex = 0;
    let _areaArr = [];
    for (let i = 0; i < _arr.length; i++) {
      if (_arr[i].id == pid) pIndex = i;
      let _data = {
        id: _arr[i].id,
        has_children: _arr[i].has_children,
        name: _arr[i].name
      }
      _areaArr.push(_data)
    }

    this.setData({
      areaProvince: _areaArr,
      provinceIndex: pIndex,
    })
    this.initFirstPicker();
    this.initCityPicker(pIndex);
  },
  initFirstPicker: function () {
    let _this = this;
    let _id = this.data.cardInfo.cityId;
    let arr = this.data.cardInfo.cities;
    let _index = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].has_children == "1") {
        let _data = arr[i].children;
        for (let j = 0; j < _data.length; j++) {
          if (_data[j].id == _id) {
            _this.setData({ cityIndex: j })
          }
        }
      }
    }
    setTimeout(function () {
      _this.getAreaText();
    }, 0)
  },
  getAreaText: function () {
    this.setData({
      areaText: (this.data.areaProvince[this.data.provinceIndex].name + ((this.data.areaProvince[this.data.provinceIndex].id == this.data.areaCitys[this.data.cityIndex].id) ? "" : ("-" + this.data.areaCitys[this.data.cityIndex].name)))
    })
  },
  initCityPicker: function (_index) {
    let _arr = app.arrDeepCopy(this.data.cardInfo.cities);
    let _newdata = {};
    let cityArr = [];
    if (_arr[_index].has_children == "1") {
      let _newarr = _arr[_index].children;
      for (let j = 0; j < _newarr.length; j++) {
        _newdata = {
          id: _newarr[j].id,
          pid: _newarr[j].pid,
          name: _newarr[j].name
        }
        cityArr.push(_newdata);
      }
    } else {
      _newdata = {
        id: _arr[_index].id,
        pid: _arr[_index].pid,
        name: _arr[_index].name
      }
      cityArr.push(_newdata);
    }
    this.setData({
      areaCitys: cityArr
    })
  },
  userChangeWorktype: function () {
    this.setData({
      showWorkType: true,
      showTextarea: false
    })
  },
  userSureWorktype: function () {
    this.setData({
      showWorkType: false,
      showTextarea: true
    })
  },
  getTextareaFocus: function () {
    this.setData({
      textareaActive: true
    })
  },
  userSureWorkProvince: function () {
    this.setData({
      showWorkProvince: false,
      showTextarea: true
    })
  },
  userEnterNewtel: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  userEditPhoneCode: function (e) {
    this.setData({
      "cardInfo.code": e.detail.value
    })
  },
  userGetCode: function () {
    let _this = this;
    let phone = this.data.userPhone;
    let userInfo = this.data.userInfo;
    let status = this.data.status;
    if (!status) return false;
    let v = vali.v.new();
    if (!v.isMobile(phone)) {
      app.showMyTips("手机号输入有误！");
      return false;
    }
    this.setData({ status: 0 });
    app.appRequestAction({
      title: "正在获取验证码",
      url: "index/get-code/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        tel: phone,
        sendType: "have"
      },
      success: function (res) {
        let mydata = res.data;
        app.showMyTips(mydata.errmsg);
        if (mydata.errcode == "ok") {
          let _time = mydata.refresh;
          _this.initCountDown(_time);
        }
      },
      fail: function () {
        _this.setData({ status: 1 });
        wx.showToast({
          title: '网络错误，获取失败！',
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  initCountDown: function (_time) {
    let _t = parseInt(_time);
    let _this = this;
    this.setData({
      status: 0,
      codeTips: _t + "秒后重试"
    });
    let timer = setInterval(function () {
      _t--;
      if (_t == 0) {
        clearInterval(timer);
        _this.setData({
          status: 1,
          codeTips: "获取验证码"
        })
        return false;
      }
      _this.setData({ codeTips: _t + "秒后重试" })
    }, 1000)
  },
  userPublishCard: function () {
    let _this = this;
    let userInfo = this.data.userInfo;
    let cardInfo = this.data.cardInfo;
    let phone = this.data.userPhone;
    let infoId = this.data.infoId;
    let lastPublishCity = { name: this.data.areaText, ad_name: this.data.keyAutoVal };
    let v = vali.v.new();
    if (!v.isRequire(cardInfo.title, 3) || !v.isChinese(cardInfo.title) || (cardInfo.title).trim().length < 3) {
      app.showMyTips("请正确输入3~12字中文标题");
      return false;
    }
    if (!cardInfo.workTypeIds.length) {
      app.showMyTips("请选择您的所需工种！");
      return false;
    }
    // if (cardInfo.provinceId == "") {
    //     app.showMyTips("请选择您的地区！");
    //     return false;
    // }

    if (_this.data.addressData.adcode == "" && cardInfo.provinceId == "") {
      app.showMyTips("请输入您的地区！");
      return false;
    }
    if (!v.regStrNone(cardInfo.username) || !v.allChinese(cardInfo.username) || (cardInfo.username).trim().length<2) {
      app.showMyTips("请正确输入2~6字中文姓名！");
      return false;
    }
    if (!v.isMobile(phone)) {
      app.showMyTips("手机号输入有误！");
      return false;
    }

    if ((phone != cardInfo.memberTel) && (phone != cardInfo.cardTel)) {
      if (!v.isRequire(cardInfo.code, 4)) {
        app.showMyTips("请输入正确的验证码！");
        return false;
      }
    }
    if (!v.regStrNone(cardInfo.content) || !v.isChinese(cardInfo.content) || (cardInfo.content).trim().length < 15) {
      app.showMyTips("请正确输入15~500字招工详情");
      return false;
    }
    let cardImgs = _this.getUserCardImgs();
    let dataJson = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      type: "job",
      infoId: infoId,
      user_mobile: phone,
      title: cardInfo.title,
      user_name: cardInfo.username,
      classifies: cardInfo.workTypeIds,
      detail: cardInfo.content,
      //provinces: cardInfo.cityIds ? cardInfo.cityIds : [],
      code: cardInfo.code,
      images: cardImgs,
      province_id: cardInfo.provinceId,
      city_id: (cardInfo.provinceId == cardInfo.cityId) ? "" : cardInfo.cityId,
      address: _this.data.addressData.title + "@@@@@" + _this.data.addressData.district,
      location: _this.data.addressData.location ? _this.data.addressData.location : "",
      adcode: _this.data.addressData.adcode,
      county_id: _this.data.county_id
    };

     
    if (JSON.stringify(_this.data.model) == JSON.stringify(dataJson) && _this.data.is_checkCons=="0"){
      let reson = _this.data.resson
      wx.showModal({
        title: '审核失败',
        content: reson,
        showCancel: false,
        success: function (res) { }
      })
      return false;
    }
    app.appRequestAction({
      title: "信息发布中",
      // url: "publish/publish-msg/",
      url: "publish/save-job/",
      way: "POST",
      mask: true,
      failTitle: "网络出错，发布失败！",
      params: dataJson,
      success: function (res) {
        let mydata = res.data;
        if(mydata.errcode == "ok"){
          _this.subscribeToNews(mydata)
        } else if (mydata.errcode == "auth_forbid") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            cancelText: '取消',
            confirmText: '去实名',
            success(res) {
              if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.confirm) {
                let backtwo = "backtwo"
                wx.redirectTo({
                  url: `/pages/realname/realname?backtwo=${backtwo}`
                })
              }
            }
          })
          return
        } else if (mydata.errcode == "member_forbid") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            cancelText: '取消',
            confirmText: '联系客服',
            success(res) {
              if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: _this.data.serverPhone
                });
              }
            }
          })
          return
        }else{
          wx.showModal({
            title: '温馨提示',
            content: mydata.errmsg,
            showCancel: false,
            confirmText:'知道了'
          })
        }
        
      }
    })
  },
  
    
  subscribeToNews: function(mydata) {
    app.subscribeToNews("recruit",function(){
      wx.showModal({
        title: '恭喜您',
        content: mydata.errmsg,
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          wx.reLaunch({ url: '/pages/published/published' })
        }
      })
    })
  },
  userEnterTitle: function (e) {
    this.setData({
      "cardInfo.title": e.detail.value
    })
  },
  userEnterUsername: function (e) {
    this.setData({
      "cardInfo.username": e.detail.value
    })
  },
  userEnterContent: function (e) {
    this.setData({
      "cardInfo.content": e.detail.value,
      strlen: e.detail.value.length
    })
  },
  delCardImg: function (e) {
    let _index = parseInt(e.currentTarget.dataset.index);
    let _arr = app.arrDeepCopy(this.data.cardInfo.imgs);
    _arr.splice(_index, 1);
    this.setData({
      "cardInfo.imgs": _arr
    })
  },
  userUploadCardImg: function (e) {
    let _this = this;
    let _type = parseInt(e.currentTarget.dataset.type);
    let _index = parseInt(e.currentTarget.dataset.index);
    app.userUploadImg(function (imgRes, mydata) {
      wx.hideLoading();
      wx.showToast({
        title: mydata.errmsg,
        icon: "none",
        duration: 2000
      })
      let _data = {
        url: mydata.url,
        httpurl: imgRes.tempFilePaths[0]
      }
      let arr = _this.userChangeImgItem(_this.data.cardInfo.imgs, _index, _data, _type);
      _this.setData({
        "cardInfo.imgs": arr
      })
    })

  },
  userChangeImgItem: function (_arr, _index, _data, _type) {
    let arr = app.arrDeepCopy(_arr);
    (_type == 0) ? arr.push(_data) : arr[_index] = _data;
    return arr;
  },
  getUserCardImgs: function () {
    let arr = app.arrDeepCopy(this.data.cardInfo.imgs);
    let _arr = [];
    for (let i = 0; i < arr.length; i++) {
      _arr.push(arr[i].url);
    }
    return _arr;
  },
  provincePickerChange: function (e) {
    let _this = this;
    let pId = parseInt(e.detail.value[0]);
    let cId = parseInt(e.detail.value[1]);
    this.setData({
      "cardInfo.provinceId": _this.data.areaProvince[pId].id,
      "cardInfo.cityId": _this.data.areaCitys[cId].id,
      provinceIndex: pId,
      cityIndex: cId
    })
    this.getAreaText();
  },
  provincePickerScorllChange: function (e) {
    let val = parseInt(e.detail.value);
    let col = parseInt(e.detail.column);
    let pi = parseInt(this.data.provinceIndex);
    if (col == 0) {
      this.initCityPicker(val);
    }
  },
  bindGetUserInfo: function (e) {
    let that = this;
    app.bindGetUserInfo(e, function (res) {
      app.mini_user(res, function (res) {
        app.api_user(res, function (res) {
          let uinfo = res.data;
          if (uinfo.errcode == "ok") {
            let userInfo = {
              userId: uinfo.data.id,
              token: uinfo.data.sign.token,
              tokenTime: uinfo.data.sign.time,
            }
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            that.setData({ userInfo: userInfo });
            let options = that.data.options;
            that.initUserCardinfo(options);
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  returnPrevPage: function () {
    wx.navigateBack({ delta: 1 })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.initPickerData();
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      this.initUserCardinfo(options);
    } else {
      this.setData({ userInfo: false, options: options })
    }
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

})

// pages/publish/card/card.js
let vali = require("../../../utils/v.js");
let areas = require("../../../utils/tas.js");
const Amap = require("../../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({ key: '20f12aae660c04de86f993d3eff590a0' });
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: { 
        userInfo: {},
        cardInfo: {
            username: "",
            title: "",
            workType: [],
            workTypeIds: [],
            workTypenum: 3,
            cities: [],
            provinceId:"",
            cityId: "",
            memberTel: "",
            cardTel: "",
            code: "",
            content: "",
            imgs: [],
            imgnum: 3,
        },
        areaProvince:[],
        provinceIndex:0,
        areaCitys:[],
        cityIndex:0,
        areaText:"",
        userPhone: "",
        infoId: "",
        showWorkType: false,
        showTextarea: true,
        showUploads: false,
        codeTips: "获取验证码",
        status: 1,
        textareaActive: false,
        textareaTips: "",
        addressActive:false,
        addressList:[],
        addressConut:0,
        addressText:'',
        addressData:{
          title:"",
          adcode:"",
          location:"",
        },
      addressTips:"请先输入您的详细地址",
      pindex: 0,
      cindex: 0,
      tindex: 0,
      objectAreaData: [],
      adcode: "", 
      county_id:""
    },

  checkAdcode:function(adcode,callback){
    let _this = this;
    app.appRequestAction({
      way: 'POST',
      url: 'publish/checking-adcode/',
      params: {
        adcode: adcode
      },
      success: function (res) {
        if (res.data.errcode == "fail"){
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel:false,
            complete:function(){
              _this.userTapAddress();
            }
          })
        }else{
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
    amapFun.getRegeo({
      success: function (data) {
        let pois = data[0].regeocodeData.pois;
        let adcode = data[0].regeocodeData.addressComponent.adcode
        that.filtterNullData(pois);
        that.setData({
          adcode: adcode
        })
      },
      fail: function (info) {
        //失败回调
        that.openSetting({ setting: 0 })
      }
    })
    
  },
  filtterNullData:function (result){
    let len = result.length;
    let res = [];
    let v = vali.v.new();
    for (let i = 0; i<len ;i++){
      let adcode = v.ObjType(result[i].adcode, "array")
      let district = v.ObjType(result[i].district, "array")
      let location = v.ObjType(result[i].location, "array")
      if (!adcode && !district && !location) res.push(result[i])
    }
    this.setData({ addressList: res })
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
                      that.getMapInfo()
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
  getKeywordsInputs:function(){
    let _this = this;
    let keywords = this.data.addressText;
    amapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function (data) {

        //console.log(data)
        if (data) {
          _this.setData({ addressTips: data.tips.length ? '' : '暂未搜索到相关位置' })
          _this.filtterNullData(data.tips)
        } else {
          _this.setData({ addressTips: '暂未搜索到相关位置' })
        }
      }
    })
  },
  userTapAddress:function(){
    this.openSetting();
    this.setData({ addressActive: true, showTextarea:false })
  },
  closeAddressAction:function(){
    this.setData({ addressActive: false, showTextarea: true })
  },
  userEnterAddress:function(e){
    this.setData({ addressText:e.detail.value })
    this.getKeywordsInputs();
  },
  setAddressData:function(e){
    let _this = this;
    let t = e.currentTarget.dataset.title
    let a = e.currentTarget.dataset.adcode
    let l = e.currentTarget.dataset.location
    this.checkAdcode(a,function(){
      _this.setData({
        "addressData.title": t,
        "addressData.adcode": a,
        "addressData.location": l,
      })
      _this.closeAddressAction();
    })
    
  },
  getAddressList:function(){
    let _this = this;

    app.appRequestAction({
      way:'POST',
      url:'/publish/get-tips/',
      hideLoading:true,
      params:{
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
        this.setData({ addressTips: '接口出错，请联系客服电话400-833-1578' })
      }
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
    console.log(_data);
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
    console.log(mydata)
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
                title: '修改招工信息'
            })
        }
        this.setData({ userInfo: userInfo });
        app.appRequestAction({
            //url: "publish/view-message/",
            url:"publish/new-job/",
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
                        "cardInfo.imgs": mydata.view_image,
                        "cardInfo.imgnum": parseInt(mydata.typeTextArr.maxImageCount),
                        showUploads: (mydata.view_image.length > 0) ? true : false,
                        textareaTips: mydata.placeholder,
                      "addressData.title": mydata.model.address ? mydata.model.address : "",
                      "addressData.location": mydata.model.location ? mydata.model.location : "",
                      county_id: mydata.model.county_id ? mydata.model.county_id : ""
                    })
                    // setTimeout(function(){
                    //     _this.initAreaPicker();
                    // },0)
                } else {
                    app.showMyTips(mydata.errmsg);
                }
            }
        })
    },
    initAreaPicker:function(){
        let _arr = app.arrDeepCopy(this.data.cardInfo.cities);
        let pid = this.data.cardInfo.provinceId;
        let pIndex = 0;
        let _areaArr = [];
        for(let i = 0;i<_arr.length;i++){
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
    initFirstPicker:function(){
        let _this = this;
        let _id = this.data.cardInfo.cityId;
        let arr = this.data.cardInfo.cities;
        let _index = 0;
        for (let i = 0; i < arr.length;i++){
            if(arr[i].has_children == "1"){
                let _data = arr[i].children;
                for (let j = 0; j < _data.length;j++){
                    if (_data[j].id == _id){
                        _this.setData({  cityIndex:j })
                    }
                }
            }
        }
        setTimeout(function () {
            _this.getAreaText();
        }, 0)
    },
    getAreaText:function(){
        this.setData({
            areaText: (this.data.areaProvince[this.data.provinceIndex].name + ((this.data.areaProvince[this.data.provinceIndex].id == this.data.areaCitys[this.data.cityIndex].id) ? "" : ("-" + this.data.areaCitys[this.data.cityIndex].name)))
        })
    },
    initCityPicker:function(_index){
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
    getTextareaFocus:function(){
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
    userEditPhoneCode:function(e){
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
        let v = vali.v.new();
        if (!v.regStrNone(cardInfo.title)) {
            app.showMyTips("请输入招工标题！");
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
        if (!v.regStrNone(cardInfo.username)) {
            app.showMyTips("请输入正确的联系人姓名！");
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
        if (!v.regStrNone(cardInfo.content)) {
            app.showMyTips("请输入招工详情");
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
            city_id: (cardInfo.provinceId == cardInfo.cityId) ? "" :cardInfo.cityId,
            address: _this.data.addressData.title,
            location: _this.data.addressData.location,
            adcode: _this.data.addressData.adcode,
            county_id: _this.data.county_id
        };
        app.appRequestAction({
            title: "正在发布招工信息",
            // url: "publish/publish-msg/",
            url:"publish/save-job/",
            way: "POST",
            mask: true,
            failTitle: "网络出错，发布失败！",
            params: dataJson,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    wx.showModal({
                        title: '恭喜您',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function (res) {
                            wx.reLaunch({
                                url: '/pages/published/published',
                            })
                        }
                    })
                } else {
                    app.showMyTips(mydata.errmsg);
                }
            }
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
            "cardInfo.content": e.detail.value
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
    provincePickerChange:function(e){
        let _this = this;
        let pId = parseInt(e.detail.value[0]);
        let cId = parseInt(e.detail.value[1]);
        this.setData({
            "cardInfo.provinceId": _this.data.areaProvince[pId].id,
            "cardInfo.cityId": _this.data.areaCitys[cId].id,
            provinceIndex: pId,
            cityIndex:cId
        })
        this.getAreaText();
    },
    provincePickerScorllChange:function(e){
        let val = parseInt(e.detail.value);
        let col = parseInt(e.detail.column);
        let pi = parseInt(this.data.provinceIndex);
        if(col == 0){
            this.initCityPicker(val);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getMapInfo()
      //this.initPickerData();
        this.initUserCardinfo(options);
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
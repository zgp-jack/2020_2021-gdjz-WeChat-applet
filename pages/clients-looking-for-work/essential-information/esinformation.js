// vertifynum verify textareavalue app.globalData.showperfection textareavalue userTapAddress
var amapFile = require('../../../utils/amap-wx.js');
let areas = require("../../../utils/area.js");
let v = require("../../../utils/v.js");
let remain = require("../../../utils/remain.js");
let reminder = require("../../../utils/reminder.js");
const app = getApp();
Page({

  /** 
   * 页面的初始数据 textareavalue  typeworkarray perfection gender submitinformation completemore GPSsubmit           GPSsubmit userLocation 
   */

  data: {
    sucessful: app.globalData.apiImgUrl + "lpy/sucess.png",
    array: [],
    arrayone: [],
    nationalarray: [],
    nationalarrayone: [],
    typeworkarray: [],
    complexwork: [],
    complexworkid: [],
    workIndexvalue: '请选择工种',
    showWorkType: false,
    pindex: 0,
    cindex: 0,
    otextareavalue: "",
    otextareavaluel: 0,
    oadcode: "",
    provinceaddress: "",
    cityaddress: "",
    longitude: "",
    latitude: "",
    provinceid: "",
    wardenryid: "",
    sex: "",
    nation: "",
    verify: "",
    name: "",
    telephone: "",
    tele: false,
    codeTips: "获取验证码",
    status: 1,
    nowDate: "",
    perfection: false,
    regionreal: "",
    beforeDate: "",
    emdDate: "",
    regionone: false,
    areadata:"",
    showheder:"showheder",
    model:{},
    checkonef:"",
    note:"",
    selectCityData: [],
    selectCityName: [],
    selectCityId:[],
    workage: 1,
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
    constituttion: 1,
    judge: false,
    detailevaluation: [],
    evaluation: [],
    labelnum: [],
    teamsnumber: "",
    multiIndexvalue: "",
    multiIndexsuan: [],
    provicemore: [],
    model:"",
    checkonef:"",
    note:"",
    editType:'',//是编辑还是完善
    introinfo:{},//找活名片资料
    introdetail:{},//人员构成资料
    defaultCityPicker:[],
    indexperson:0,
    selectAllData:[],
    isIos:false,
    isShowPicker:false
  },
  // 点击隐藏键盘
  hiddenKeyBoard: function () {
    wx.hideKeyboard()
  },
  // getbirth() {
  //   var date = new Date();
  //   var year = date.getFullYear();
  //   var month = date.getMonth() + 1;
  //   var day = date.getDate();
  //   if (month < 10) {
  //     month = "0" + month;
  //   }
  //   if (day < 10) {
  //     day = "0" + day;
  //   }
  //   var nowDate = year + "-" + month + "-" + day;
  //   this.setData({
  //     nowDate: nowDate
  //   });
  // },
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
      _this.setData({
        codeTips: _t + "秒后重试"
      })
    }, 1000)
  },
  verify(e) {
    this.setData({
      verify: e.detail.value
    })
  },
  name(e) {
    let value = e.detail.value
    this.setData({
      name: value
    })
  },
  sex: function (e) {
    this.setData({
      indexsex: ~~e.detail.value
    })
    this.setData({
      sex: this.data.arrayone[~~e.detail.value].id
    })
  },
  nation(e) {
    this.setData({
      nationindex: e.detail.value,
      nation: this.data.nationalarrayone[e.detail.value].mz_id
    })
  },
  birthday(e) {

    this.setData({
      birthday: e.detail.value
    })
  },
  telephone(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  GPSsubmit: function () {
    this.openSetting()
  },
  teamsnum(e) { //队伍人数的额选择
    this.setData({
      teamsnumber: e.detail.value
    })
  },
  getLocation: function () { //定位获取
    if (app.globalData.gpsdetail) {
      app.globalData.gpsdetail = false
      app.showMyTips("获取位置中...");
      var _this = this;
      var myAmapFun = new amapFile.AMapWX({
        key: app.globalData.gdApiKey
      }); //key注册高德地图开发者
      myAmapFun.getRegeo({
        success: function (data) {
          
          console.log(data)
          _this.setData({
            regionone: data[0].name
          });
          app.appRequestAction({
            url: "resumes/check-adcode/",
            way: "GET",
            params: { adcode: data[0].regeocodeData.addressComponent.adcode },
            mask: true,
            failTitle: "操作失败，请稍后重试！",
            success: function (res) {
              console.log(res.data.city)
              if (res.data.errcode == "ok") {
                _this.setData({
                  oadcode: data[0].regeocodeData.addressComponent.adcode,
                  longitude: data[0].longitude + "",
                  latitude: data[0].latitude + "",
                  wardenryid: res.data.city
                });
                let gpsLocation = {
                  province: data[0].regeocodeData.addressComponent.province,
                  city: data[0].regeocodeData.addressComponent.city,
                  adcode: data[0].regeocodeData.addressComponent.adcode,
                  citycode: data[0].regeocodeData.addressComponent.citycode
                }
                let province = areas.getProviceItem(gpsLocation.province, gpsLocation.city)
  
                
                
                app.showMyTips("获取位置成功");
                app.globalData.gpsdetail = true
              }else{

                app.showMyTips("定位失败,请重新定位");
                app.globalData.gpsdetail = true

              }

            },
            fail: function (err) {
              app.showMyTips("定位失败,请重新定位");
              app.globalData.gpsdetail = true
            }
          })

        },
        fail: function (info) {

          app.showMyTips("定位失败,请重新定位");
          app.globalData.gpsdetail = true
        }
      });
    }
  },
  openSetting: function (e) {

    let that = this;
    wx.getSetting({
      success: (res) => {

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
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  },
                  fail:function(res){
                    
                  }
                })
              }
            }
          })
          // return false;
        } else {
          that.getLocation();
        }
      },
    })
  },

  getallcity(){
    let _this =this;
    app.getAreaData(this, function (data) {
      let resdata = app.arrDeepCopy(data)
      _this.setData({
        areadata: resdata
      })
    })
  },
  userTapAddress: function () {
    let defaultwardenryid = this.data.wardenryid;
    let providesss = this.data.provinceid;
    let areadata = this.data.areadata;
    let showheder = this.data.showheder;

    if (defaultwardenryid) {

    
      let allmodity = ""
      for (let i = 0; i < areadata.length; i++) {
        for (let j = 0; j < areadata[i].length; j++) {
          if (areadata[i][j].id == defaultwardenryid) {
            allmodity = areadata[i][j]
          }
        }
      }

      if (allmodity == ""){
        for (let i = 0; i < areadata.length; i++) {
          for (let j = 0; j < areadata[i].length; j++) {
            if (areadata[i][j].id == providesss) {
              allmodity = areadata[i][j]
            }
          }
        }
      }
      wx.setStorageSync("defaultwardenryid", allmodity)


    } else {
      wx.setStorageSync("defaultwardenryid", defaultwardenryid)
    }
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/selectmap/smap?showheder=${showheder}`,
    })
  },
  getlocationdetails() { //所在地区的位置
    let historyregionone = wx.getStorageSync("historyregionone");
    let provincelocal = wx.getStorageSync("provincelocal");

    
    if (historyregionone) {
      
      this.setData({
        regionone: historyregionone.hasOwnProperty("title") ? historyregionone.title : "",
        longitude: historyregionone.hasOwnProperty("location") ? historyregionone.location.split(",")[0] : "",
        latitude: historyregionone.hasOwnProperty("location") ? historyregionone.location.split(",")[1] : "",
      })

      wx.removeStorageSync('historyregionone')
    }
    
    if (provincelocal) {
      this.setData({
        provinceid: provincelocal.hasOwnProperty("province") ? provincelocal.province : "",
        wardenryid: provincelocal.hasOwnProperty("city") ? provincelocal.city : "",
        oadcode: provincelocal.hasOwnProperty("adcode") ? provincelocal.adcode : "",
      })
      wx.removeStorageSync('provincelocal')
    }
  },

  accessprovince() { //大部分piker需要的数据
    let that = this;
    app.appRequestAction({
      url: 'resumes/get-data/',
      way: 'GET',
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        let nationalarray = [];
        let alllabel = [];
        let typeworkarray = [];
        let proficiencyarray = [];
        let compositionarray = [];
        let array = []
        for (let i = 0; i < res.data.nation.length; i++) {
          nationalarray.push(res.data.nation[i].mz_name)
        }
        for (let i = 0; i < res.data.label.length; i++) {
          res.data.label[i].classname = "informationnosave"
        }
        for (let i = 0; i < res.data.prof_degree.length; i++) {
          proficiencyarray.push(res.data.prof_degree[i].name)
        }
        for (let i = 0; i < res.data.type.length; i++) {
          compositionarray.push(res.data.type[i].name)
        }
        for (let i = 0; i < res.data.gender.length; i++) {
          array.push(res.data.gender[i].name)
        }
        that.setData({
          typeworkarray: res.data.occupation
        })


        for (let i = 0; i < that.data.typeworkarray.length; i++) {
          for (let j = 0; j < that.data.typeworkarray[i].children.length; j++) {
            that.data.typeworkarray[i].children[j].is_check = false
          }
        }
        that.setData({
          typeworkarray: that.data.typeworkarray
        })
        that.setData({
          nationalarray: nationalarray,
          nationalarrayone: res.data.nation,
          array: array,
          arrayone: res.data.gender,
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

      }
    })
  },

  userSureWorktype() {
    this.setData({
      showWorkType: false,
      isShowPicker:false
    })
    let all = ""
    for (let i = 0; i < this.data.complexwork.length; i++) {
      all += this.data.complexwork[i] + " "
    }
    if (all == "") {
      all = '请选择工种';
    }
    this.setData({
      workIndexvalue: all
    })
  },

  userClickItem: function (e) {
    let that = this;
    let ce = false;



    for (let i = 0; i < this.data.typeworkarray.length; i++) {
      for (let j = 0; j < this.data.typeworkarray[i].children.length; j++) {
        if (~~this.data.typeworkarray[i].children[j].id === ~~e.currentTarget.dataset.id) {
          for (let q = 0; q < this.data.complexwork.length; q++) {
            if (this.data.complexwork[q] == e.currentTarget.dataset.name) {
              ce = true
            }
          }
          if (this.data.complexwork.length < 3 || ce) {
            for (let k = 0; k < this.data.complexwork.length; k++) {
              if (this.data.complexwork[k] == e.currentTarget.dataset.name) {

                this.data.complexwork.splice(k, 1)
                this.data.complexworkid.splice(k, 1)
                this.data.typeworkarray[i].children[j].is_check = false


                this.setData({
                  typeworkarray: this.data.typeworkarray
                })
                return
              }
            }
            this.data.typeworkarray[i].children[j].is_check = true
            this.data.complexwork.push(e.currentTarget.dataset.name)
            this.data.complexworkid.push(e.currentTarget.dataset.id)
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '工种最多可选' + that.data.complexwork.length + '个',
              showCancel: false,
              success(res) { }
            })
          }
        }
      }
    }
    this.setData({
      typeworkarray: this.data.typeworkarray
    })

  },

  typeworktwo() {
    this.setData({
      showWorkType: true,
      isShowPicker:true
    })
  },
  textareavalue(e) {
    this.setData({
      otextareavalue: e.detail.value
    })
    this.setData({
      otextareavaluel: e.detail.value.length
    })

  },

  getarea() {
    let provinceid = "";
    let wardenryid = ""

    let arr = app.arrDeepCopy(areas.getPublishArea());

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].ad_name == this.data.provinceaddress) {
        provinceid = ~~arr[i].id
        if (arr[i].children.length == 0) {
          wardenryid = ~~arr[i].id
          return
        }
      }
      for (let j = 0; j < arr[i].children.length; j++) {
        if (arr[i].children[j].ad_name == this.data.cityaddress) {
          wardenryid = ~~arr[i].children[j].id
        }
      }
    }

    this.setData({
      provinceid: provinceid,
      wardenryid: wardenryid
    })
  },

  vertifynum() {
    let that = this;
    let status = this.data.status;
    if (!status) return false;
    let userInfo = wx.getStorageSync("userInfo");
    let tele = {}
    Object.assign(tele, userInfo, {
      tel: this.data.telephone - 0,
    })

    app.appRequestAction({
      url: "index/get-code/",
      way: "POST",
      params: tele,
      success: function (res) {
        let mydata = res.data;
        app.showMyTips(mydata.errmsg);
        if (mydata.errcode == "ok") {
          let _time = mydata.refresh;
          that.initCountDown(_time);
          app.globalData.authcode = true;
        }
      },
      fail: function (err) {

        app.showMyTips("验证码发送失败");
      }
    })
  },
  submitinformation() {
    let that = this;
    let information = {}
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) return false;
    let worktype = "";
    let vertifyNum = v.v.new()
    for (let i = 0; i < this.data.complexworkid.length; i++) {
      if (i == this.data.complexworkid.length - 1) {
        worktype += this.data.complexworkid[i]
      } else {
        worktype += this.data.complexworkid[i] + ","
      }
    }
    // 姓名
    if ((this.data.editType == 'bj' || this.data.introinfo.authentication != 2) && (vertifyNum.isNull(this.data.name) || this.data.name.length < 2 || this.data.name.length > 5) || !vertifyNum.isChinese(this.data.name)) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入2~5字纯中文姓名!',
        showCancel: false,
        success(res) { }
      })
      return
    }
    //性别
    if ((this.data.editType == 'bj' || this.data.introinfo.authentication != 2) && vertifyNum.isNull(this.data.sex)) {
      reminder.reminder({ tips: '性别' })
      return
    }
    //民族
    if ((this.data.editType == 'bj' || this.data.introinfo.authentication != 2) && vertifyNum.isNull(this.data.nation)) {
      reminder.reminder({ tips: '民族' })
      return
    }
    //出生日期
    if ((this.data.editType == 'bj' || this.data.introinfo.authentication != 2) && vertifyNum.isNull(this.data.birthday)) {

      reminder.reminder({ tips: '出生日期' })
      return
    }
    //工种
    if ((this.data.editType == 'bj' || this.data.introinfo.occupations.length < 1) && vertifyNum.isNull(worktype)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择您的工种',
        showCancel: false,
        success(res) { }
      })
      return
    }
    //工龄
    let str = /^\d{1,2}$/ig;
    if ((this.data.editType == 'bj' || this.data.introinfo.experience == 0) &&!str.test(this.data.workage)) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入您的工龄',
        showCancel: false,
        success(res) { }
      })
      return
    }

    //期望地区
    if((this.dataeditType == 'bj') && vertifyNum.isNull(this.data.selectCityName)){
      reminder.reminder({ tips: '期望地区' })
      return
    }


    //所在地区
    if ((this.dataeditType == 'bj' || this.data.introinfo.experience == 0) && vertifyNum.isNull(this.data.regionone)) {
      reminder.reminder({ tips: '所在地区' })
      return
    }

    //人员构成
    if ((this.data.editType == 'bj' || !this.data.introdetail.type) && vertifyNum.isNull(this.data.constituttion)) {
      reminder.reminder({ tips: '人员构成' })
      return
    }
    let strone = /^[0-9]{1,4}$/ig;
    if ((this.data.editType == 'bj' || this.data.indexperson !== 0)&&!strone.test(this.data.teamsnumber) && this.data.constituttion != 1 || ~~this.data.teamsnumber - 0 <= 1 && this.data.constituttion != 1) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入您的队伍人数不得少于2人',
        showCancel: false,
        success(res) { }
      })
      return
    }


    //联系电话
    if ((this.data.editType == 'bj' || !this.data.introinfo.tel)&&!vertifyNum.isMobile(this.data.telephone)) {
      wx.showModal({
        title: '温馨提示',
        content: '请正确输入手机号码',
        showCancel: false,
        success(res) { }
      })
      return
    }
    //验证码
    if (this.data.telephone != this.data.tele) {
      if (vertifyNum.isNull(this.data.verify)) {
        wx.showModal({
          title: '温馨提示',
          content: '请正确填写验证码',
          showCancel: false,
          success(res) { }
        })
        return
      }
    }else{
      this.setData({
        verify: ""
      })
    }
    if (!app.globalData.authcode && this.data.telephone != this.data.tele) {
      wx.showModal({
        title: '温馨提示',
        content: '请先获取验证码',
        showCancel: false,
        success(res) { }
      })
      return
    }

    //自我介绍
    if (vertifyNum.isNull(this.data.otextareavalue) || !vertifyNum.isChinese(this.data.otextareavalue)) {
      wx.showModal({
        title: '温馨提示',
        content: '请填写真实自我介绍，5-500字，必须含有汉字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    Object.assign(information, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      code: this.data.verify,
      username: this.data.name,
      tel: this.data.telephone,
      gender: String(this.data.sex),
      nation: String(this.data.nation),
      birthday: this.data.birthday,
      occupations: worktype,
      province: String(this.data.provinceid),
      city: String(this.data.wardenryid),
      introduce: this.data.otextareavalue,
      lat: this.data.latitude,
      lng: this.data.longitude,
      address: this.data.regionone,
      adcode: this.data.oadcode,
      provinces: String(this.data.selectCityId),
      experience: this.data.workage,
      type: String(this.data.constituttion),
      number_people: this.data.teamsnumber
    })
    if (JSON.stringify(information) == JSON.stringify(this.data.model) && this.data.checkonef == '0'){
      wx.showModal({
        title: '温馨提示',
        content: that.data.note,
        showCancel: false,
        success(res) { }
      })
      return
    }
    //完善
    if(this.data.editType == 'ws'){
      let params = {}
      //姓名 性别 民族 出生日期
      if(this.data.introinfo.authentication != 2){
        params.gender = String(this.data.sex)
        params.username = this.data.name
        params.nation = String(this.data.nation)
        params.birthday = this.data.birthday
      }
      //工种
      if(this.data.introinfo.occupations.length < 1){
        params.occupations = worktype
      }
      //工龄
      if(this.data.introinfo.experience == 0){
        params.experience = this.data.workage
      }
      //所在地区
      if(this.data.introinfo.experience == 0){
        params.address = this.data.regionone
      }
      //人员构成
      if(!this.data.introdetail.type) {
       params.type = String(this.data.constituttion)
       params.number_people = this.data.teamsnumber
      }
      //联系电话
      if(!this.data.introinfo.tel) {
        params.tel = this.data.telephone
        code: this.data.verify
      }
      params.introduce = this.data.otextareavalue
      params.userId = userInfo.userId
      params.token = userInfo.token
      params.tokenTime = userInfo.tokenTime
      // params.is_new_introduce = 1
      app.appRequestAction({
        url:'resumes/introduce/',
        way:'POST',
        params:params,
        mask:true,
        failTitle: "操作失败，请稍后重试！",
        success: function (res) {
          if (res.data.errcode == 200) {
            that.subscribeToNews(res)
            app.activeRefresh()
          } else {
            remain.remain({
              tips: res.data.errmsg
            })
          }
        },
        fail: function (err) {
          wx.showModal({
            title: '温馨提示',
            content: '保存失败',
            showCancel: false
          })
        }
      })

    }

    //编辑
    if(this.data.editType == 'bj'){
      app.appRequestAction({
        url: "resumes/add-resume/",
        way: "POST",
        params: information,
        mask: true,
        failTitle: "操作失败，请稍后重试！",
        success: function (res) {

          if (res.data.errcode == 200) {
            that.subscribeToNews(res)
            app.activeRefresh()
          } else {
            remain.remain({
              tips: res.data.errmsg
            })
          }
        },
        fail: function (err) {
          wx.showModal({
            title: '温馨提示',
            content: '保存失败',
            showCancel: false
          })
        }
      })
    }
  },
  subscribeToNews: function(res) {
    let _this = this;
    app.subscribeToNews("resume",function(){
      if (app.globalData.showperfection) {
        _this.setData({
          perfection: true,
        })
      } else {
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },

  judgecommit(introinfo){
    if (this.data.checkonef != "0") return false 
    let worktype = "";
    let nationCons = "";
    let latitude = "";
    let longitude = ""
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) return false;
    for (let i = 0; i < this.data.complexworkid.length; i++) {
      if (i == this.data.complexworkid.length - 1) {
        worktype += this.data.complexworkid[i]
      } else {
        worktype += this.data.complexworkid[i] + ","
      }
    }
    if (introinfo.gender != "") {
        nationCons=introinfo.hasOwnProperty("nation_id") ? introinfo.nation_id : ""
    }
    if (introinfo.location) {
        latitude=introinfo.hasOwnProperty("location") ? introinfo.location.split(",")[1] : ""
        longitude=introinfo.hasOwnProperty("location") ? introinfo.location.split(",")[0] : ""
    }
    let getintrodetail = {    
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      code:"",
      username: introinfo.hasOwnProperty("username") ? introinfo.username : "",
      tel: introinfo.hasOwnProperty("tel") ? introinfo.tel : "",
      gender: introinfo.hasOwnProperty("gender") ? introinfo.gender : "", 
      nation: nationCons,
      birthday: introinfo.hasOwnProperty("birthday") ? introinfo.birthday : "",
      occupations: worktype,
      province: introinfo.hasOwnProperty("province") ? introinfo.province : "",
      city:introinfo.hasOwnProperty("city") ? introinfo.city : "",
      introduce:introinfo.hasOwnProperty("introduce") ? introinfo.introduce : "",
      lat: latitude,
      lng: longitude,
      address: introinfo.hasOwnProperty("current_area_str") ? introinfo.current_area_str : "",
      adcode:"",
    }
    this.setData({
      model: getintrodetail
    })
  },
  getintrodetail() {
     
    let introinfo = wx.getStorageSync("introinfo");

    this.setData({
      name: introinfo.username !== '先生' ? introinfo.username : "",
      indexsex: introinfo.hasOwnProperty("gender") ? introinfo.gender - 1 : "",
      sex: introinfo.hasOwnProperty("gender") ? introinfo.gender : "",
      birthday: introinfo.hasOwnProperty("birthday") ? introinfo.birthday : "",
      complexwork: introinfo.hasOwnProperty("occupations") ? introinfo.occupations : [],
      complexworkid: introinfo.hasOwnProperty("occupations_id") ? introinfo.occupations_id == null ? [] : introinfo.occupations_id.split(",") : [],
      regionone: introinfo.hasOwnProperty("current_area_str") ? introinfo.current_area_str : "",
      provinceid: introinfo.hasOwnProperty("province") ? introinfo.province : "",
      // wardenryid: introinfo.hasOwnProperty("city") ? introinfo.city : "",
      telephone: introinfo.hasOwnProperty("tel") ? introinfo.tel : "",
      tele: introinfo.hasOwnProperty("tel") ? introinfo.tel : "",
      otextareavalue: this.data.editType == 'bj' || this.data.editType == 'dxg' ? introinfo.hasOwnProperty("introduce") ? introinfo.introduce : "" : '',
      otextareavaluel: introinfo.hasOwnProperty("introduce") ? (this.data.editType == 'ws'? 0: introinfo.introduce.length) : 0,
      checkonef: introinfo.hasOwnProperty("check") ? introinfo.check : "",
      note: introinfo.hasOwnProperty("note") ? introinfo.note : "",
      workage: introinfo.hasOwnProperty("experience") && introinfo.experience != 0 ? introinfo.experience : 1,
      selectCityId: introinfo.provinces_id ? introinfo.provinces_id:'',
      indexperson: Number(introinfo.type) ? introinfo.type - 1 : 0,
      constituttion: introinfo.type ? this.data.compositionarrayone[introinfo.type == 0?0:introinfo.type -1].id : this.data.compositionarrayone[0].id + 1,
      teamsnumber: Number(introinfo.number_people) ? introinfo.number_people: introinfo.type ? this.data.compositionarrayone[introinfo.type == 0?0:introinfo.type -1].id : this.data.compositionarrayone[0].id + 1
    })
    if (introinfo.gender != "") {
      this.setData({
        nationindex: introinfo.hasOwnProperty("nation_id") ? introinfo.nation_id - 1 : ""
      })
      this.setData({
        nation: introinfo.hasOwnProperty("nation_id") ? introinfo.nation_id : ""
      })
    }
    if (introinfo.hasOwnProperty("occupations") && introinfo.occupations.length != 0) {
      let workIndexvalue = ""
      for (let i = 0; i < introinfo.occupations.length; i++) {
        workIndexvalue += introinfo.occupations[i] + " "
      }
      this.setData({
        workIndexvalue: workIndexvalue
      })
    }

    if (introinfo.location) {
      this.setData({
        latitude: introinfo.hasOwnProperty("location") ? introinfo.location.split(",")[1] : ""
      })

      this.setData({
        longitude: introinfo.hasOwnProperty("location") ? introinfo.location.split(",")[0] : ""
      })
    }
    this.judgecommit(introinfo)
    if (introinfo.hasOwnProperty("occupations")) {
      for (let i = 0; i < this.data.typeworkarray.length; i++) {
        for (let j = 0; j < this.data.typeworkarray[i].children.length; j++) {
          for (let k = 0; k < introinfo.occupations.length; k++) {
            if (this.data.typeworkarray[i].children[j].name === introinfo.occupations[k]) {
              this.data.typeworkarray[i].children[j].is_check = true
            }
          }
        }
      }
    }
    this.setData({
      typeworkarray: this.data.typeworkarray
    })
    
  },

  completes() {
    app.globalData.showperfection = false;
    wx.navigateBack({
      delta: 1
    })
    app.appRequestAction({
      url: 'resumes/exists/',
      way: 'POST',
      mask: true,
      success: function(res){
        let mydata = res.data
        if(mydata.errcode == "ok"){
          app.globalData.publishFindWork.resumeText = mydata.data.title
          app.globalData.publishFindWork.loginAfter = true
        }
      },
      fail:()=>{
        app.showMyTips('网络错误，加载失败！')
        app.globalData.resumeText = "发布找活"
      }
    })
  },
  completemore() {
    app.globalData.showperfection = false;
    app.globalData.skip = true;

    wx.redirectTo({
      url: '/pages/clients-looking-for-work/work-description/workdescription',
    });
  },
  getbirthall() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    let time = this.data.birthday.split("-");
    let timeone = this.data.birthday.split("-")[0] - 0;
    let timetwo = this.data.birthday.split("-")[1] - 0;
    let timethree = this.data.birthday.split("-")[2] - 0;


    if (year - timeone == 18 && month - timetwo <= 0 && day - timethree < 0 || year - timeone < 18) {
      return false
    }
    return true
  },

  starttimer() {
    let timer = new Date();
    let d = new Date(timer);
    let times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.setData({
      nowDate: times
    })
    let starttime = this.data.nowDate.split("-");
    let starttimeone = this.data.nowDate.split("-")[0] - 0;
    let starttimetwo = this.data.nowDate.split("-")[1];
    let starttimethree = this.data.nowDate.split("-")[2];

    let beforeDate = (starttimeone - 60) + "-" + starttimetwo + "-" + starttimethree;
    let emdDate = (starttimeone - 18) + "-" + starttimetwo + "-" + starttimethree;
    this.setData({
      beforeDate: beforeDate,
      emdDate: emdDate
    })


  },
  showCityPicker(){
    this.selectComponent("#cityPicker").show();
  },

//选择期望地区 点击确定
cityComfirm(e) {
  let select = e.detail.params
  let municipality = app.globalData.municipality
  let selectStr = select.map(item=>{
    let index = municipality.findIndex(i=> i.id == item.fid)
    if (index !== -1) {
      return municipality[index].name + item.name
    }else{
      return item.name
    }
  })

  this.setData({
    selectAllData: select,
    selectCityName:selectStr.join(" | "),
    selectCityId:select.map(item => item.id).join(",")
  })
},

constitute(e) { //人员构成的选择
  this.setData({
    indexperson: e.detail.value,
  })
  if(e.detail.value != 0){
    this.setData({
      constituttion: Number(e.detail.value) + 1,
      teamsnumber: 2
    })
  }else if(e.detail.value == 0){
    this.setData({
      constituttion: Number(e.detail.value) + 1,
      teamsnumber: 1
    })
  }
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


// 调起键盘后再点击picker导致picker在软键盘下面，软键盘并没有收起问题。
hidekeyboard: function () {
  wx.hideKeyboard()
},

//点击清空内容自我介绍
clearIntroduce() {
  this.setData({
    otextareavalue: '',
    otextareavaluel: 0
  })
},
peopleage(e) { //工龄的选择
  if(e.detail.value == '0'){
    this.setData({
      workage: 1
    })
  }else{
    this.setData({
      workage: e.detail.value
    })
  }
  
},
cityClose(e){
  this.setData({
    isShowPicker:false
  })
},
cityShow(e) {
  this.setData({
    isShowPicker:true
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.accessprovince()
    this.getallcity()
    if(options.type){
      this.setData({
        editType:options.type
      });
      //完善资料的时候 自动获取定位
      if(options.type == 'ws'){
        this.GPSsubmit()
      }
    }
    let introinfo = wx.getStorageSync('introinfo')
    let introdetail = wx.getStorageSync('introdetail')
    let provincesidArr = introinfo.provinces_id.split(",")
    let provincestxtArr = introinfo.provinces_txt.split("|")
    let _provincesidArr = []
    if(provincesidArr.length > 1){
      for(let i = 0;i<provincesidArr.length;i++){
        _provincesidArr.push({
          name:provincestxtArr[i],
          id:provincesidArr[i]
        })
      }
    }
    let Phone = wx.getSystemInfoSync();
    if(Phone.platform == 'ios'){
      this.setData({
        isIos:true
      })
    }else{
      this.setData({
        isIos:false
      })
    }


    this.setData({
      introinfo:introinfo,
      selectAllData:provincesidArr.length > 1 ? _provincesidArr:[{id:introinfo.provinces_id,name:introinfo.provinces_txt}],
      introdetail:introdetail,
      selectCityName:introinfo.provinces_txt.replace(/,/g, "|")
    })
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
    this.getlocationdetails()
    this.starttimer()
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
   * 用户点击右上角分享 completes
   */
})
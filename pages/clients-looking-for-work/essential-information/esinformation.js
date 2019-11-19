// vertifynum verify textareavalue app.globalData.showperfection textareavalue userTapAddress
var amapFile = require('../../../utils/amap-wx.js');
let areas = require("../../../utils/area.js");
let v = require("../../../utils/v.js");
let remain = require("../../../utils/remain.js");
let reminder = require("../../../utils/ reminder.js");
const app = getApp();
Page({

  /** 
   * 页面的初始数据 textareavalue  typeworkarray gender submitinformation completemore GPSsubmit
   */

  data: {
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
    regionreal:""
  },
  getbirth() {
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
    var nowDate = year + "-" + month + "-" + day;
    this.setData({
      nowDate: nowDate
    });
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
    this.setData({
      name: e.detail.value
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
    console.log(e.detail.value)
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
  getLocation: function () { //定位获取
    var _this = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.globalData.gdApiKey
    }); //key注册高德地图开发者
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data);
        let oname = data[0].name + ' ' + data[0].desc;
        if (oname.length >= 10) {
          // let onamesplit = oname.slice(0, 10) + '...';
          let onamesplit = oname;
          _this.setData({
            regionone: data[0].name
          });
        } else {
          _this.setData({
            regionone: data[0].name + ' ' + data[0].desc
          });
        }
        _this.setData({
          oadcode: data[0].regeocodeData.addressComponent.adcode,
          longitude: data[0].latitude + "",
          latitude: data[0].longitude + ""
        });
          
      },
      fail: function (info) {
        app.showMyTips("定位失败,请重新定位");
      }
    });
  },
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
                      that.getLocation();
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
        } else {
          that.getLocation();
        }
      },
    })
  },
  userTapAddress: function () {
    wx.navigateTo({
      url: '/pages/clients-looking-for-work/selectmap/smap',
    })
  },
  getlocationdetails() { //所在地区的位置
    let historyregionone = wx.getStorageSync("historyregionone");
    let provincelocal = wx.getStorageSync("provincelocal");
    console.log(historyregionone)
    console.log(provincelocal)
    if (historyregionone) {
      this.setData({
        regionone: historyregionone.title,
        longitude: historyregionone.location.split(",")[0],
        latitude: historyregionone.location.split(",")[1]
      })
      console.log(this.data.longitude)
      // wx.removeStorageSync('historyregionone')
    }
    if (provincelocal) {
      this.setData({
        provinceid: provincelocal.province,
        wardenryid: provincelocal.city,
        oadcode: provincelocal.adcode
      })
    }
  },

  accessprovince() { //大部分piker需要的数据
    let that = this;
    app.appRequestAction({
      url: 'resumes/get-data/',
      way: 'GET',
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        if (res.errMsg == "request:ok") {
          console.log(res)
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
          console.log(that.data.typeworkarray)

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
            arrayone: res.data.gender
          })
          that.getintrodetail()
          console.log(that.data.arrayone)
        }

      },
      fail: function (err) {
        app.showMyTips("请求失败");
      }
    })
  },

  userSureWorktype() {
    this.setData({
      showWorkType: false
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
    console.log(e)
    console.log(e.currentTarget.dataset.id)

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
              content: '所需工种最多选择' + that.data.complexwork.length + '个',
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
    console.log(this.data.complexwork)
  },

  typeworktwo() {
    this.setData({
      showWorkType: true
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
    console.log(tele)
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
    let worktype = "";
    console.log(this.data.complexworkid)
    for (let i = 0; i < this.data.complexworkid.length; i++) {
      if (i == this.data.complexworkid.length - 1) {
        worktype += this.data.complexworkid[i]
      } else {
        worktype += this.data.complexworkid[i] + ","
      }
    }

    let vertifyNum = v.v.new()
    if (!vertifyNum.isMobile(this.data.telephone)) {
      reminder.reminder({ tips: '手机号' })
      return
    }

    if (vertifyNum.isNull(this.data.name) || this.data.name.length < 2 || this.data.name.length >5) {
      wx.showModal({
        title: '温馨提示',
        content: '您输入的姓名为空,或者少于两个字,或者大于五个字',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.sex)) {
      reminder.reminder({ tips: '性别' })
      return
    }
    if (vertifyNum.isNull(this.data.nation)) {
      reminder.reminder({ tips: '民族' })
      return
    }
   
    if(!that.getbirthall()){
      wx.showModal({
        title: '温馨提示',
        content: '输入的年龄不能小于18',
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (vertifyNum.isNull(this.data.birthday)) {

      reminder.reminder({ tips: '出生日期' })
      return
    }
    if (vertifyNum.isNull(worktype)) {
      reminder.reminder({ tips: '工种' })
      return
    }

    if (vertifyNum.isNull(this.data.regionone)) {
      reminder.reminder({ tips: '所在地区' })
      return
    }
    if (vertifyNum.isNull(this.data.otextareavalue)) {
      reminder.reminder({ tips: '自我介绍' })
      return
    }
    // tele != telephone
    if (this.data.telephone != this.data.tele) {
      if (vertifyNum.isNull(this.data.verify)) {
        reminder.reminder({ tips: "验证码" })
        return
      }
    }
    Object.assign(information, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      code: this.data.verify,
      username: this.data.name,
      tel: this.data.telephone,
      gender: this.data.sex,
      nation: this.data.nation,
      birthday: this.data.birthday,
      occupations: worktype,
      province: this.data.provinceid,
      city: this.data.wardenryid,
      introduce: this.data.otextareavalue,
      lat: this.data.latitude,
      lng: this.data.longitude,
      address: this.data.regionone,
      adcode: this.data.oadcode,
    })
    console.log(information)

    app.appRequestAction({
      url: "resumes/add-resume/",
      way: "POST",
      params: information,
      mask: true,
      failTitle: "操作失败，请稍后重试！",
      success: function (res) {
        console.log(res)
        remain.remain({
          tips: res.data.errmsg, callback: function () {
            if (res.data.errmsg == "保存成功") {
              if (app.globalData.showperfection) {
                that.setData({
                  perfection: true,
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          }
        })
      },
      fail: function (err) {
        app.showMyTips("保存失败");
      }
    })
  },

  getintrodetail() {
    console.log(this.data.typeworkarray)
    let introinfo = wx.getStorageSync("introinfo");
    console.log(introinfo)
    this.setData({
      name: introinfo.hasOwnProperty("username") ? introinfo.username : "",
      indexsex: introinfo.hasOwnProperty("gender") ? introinfo.gender - 1 : "",
      sex: introinfo.hasOwnProperty("gender") ? introinfo.gender : "",
      birthday: introinfo.hasOwnProperty("birthday") ? introinfo.birthday : "",
      complexwork: introinfo.hasOwnProperty("occupations") ? introinfo.occupations : [],
      complexworkid: introinfo.hasOwnProperty("occupations_id") ? introinfo.occupations_id.split(",") : [],
      regionone: introinfo.hasOwnProperty("address") ? introinfo.address : "",
      provinceid: introinfo.hasOwnProperty("province") ? introinfo.province : "",
      wardenryid: introinfo.hasOwnProperty("city") ? introinfo.city : "",
      telephone: introinfo.hasOwnProperty("tel") ? introinfo.tel : "",
      tele: introinfo.hasOwnProperty("tel") ? introinfo.tel : "",
      otextareavalue: introinfo.hasOwnProperty("introduce") ? introinfo.introduce : "",
      otextareavaluel: introinfo.hasOwnProperty("introduce") ? introinfo.introduce ?introinfo.introduce.length:0 : 0,
    })

    if (introinfo.gender != "") {
      this.setData({
        nationindex: introinfo.hasOwnProperty("nation_id") ? introinfo.nation_id - 1 : ""
      })
      this.setData({
        nation: introinfo.hasOwnProperty("nation_id") ? introinfo.nation_id : ""
      })
    }
    if (introinfo.hasOwnProperty("occupations")) {
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
        latitude: introinfo.hasOwnProperty("location") ? introinfo.location.split(",")[0] : ""
      })

      this.setData({
        longitude: introinfo.hasOwnProperty("location") ? introinfo.location.split(",")[1] : ""
      })
    }

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
    console.log(year)
    console.log(timeone)
    if (year - timeone == 18 && month - timetwo <= 0 && day - timethree < 0 || year - timeone < 18) {
      return false
    }
    return true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.accessprovince()
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
    this.getbirth()
    // this.getlocationdetails()

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
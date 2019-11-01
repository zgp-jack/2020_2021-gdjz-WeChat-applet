// pages/clients-looking-for-work/essential-information/esinformation.js
var amapFile = require('../../../utils/amap-wx.js');
let areas = require("../../../utils/area.js");
let v = require("../../../utils/v.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    arrayone:[],
    nationalarray:[],
    nationalarrayone: [],
    typeworkarray:[],
    complexwork:[],
    complexworkid: [],
    workIndexvalue: '请选择工种',
    showWorkType: false,
    pindex: 0,
    cindex: 0,
    otextareavalue:"",
    oadcode:"",
    provinceaddress:"",
    cityaddress:"",
    longitude:"",
    latitude:"",
    provinceid:"",
    wardenryid:"",
    sex:"",
    nation:"",
    verify:""
  },
  verify(e){
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
      sex: this.data.arrayone[e.detail.value].id
    })
  },
  nation(e) {
    this.setData({
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
    this.getLocation();
  },
  getLocation: function () {   //定位获取
    var _this = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.globalData.gdApiKey
    }); //key注册高德地图开发者
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data);
        let oname = data[0].name + ' ' + data[0].desc;
        if (oname.length >= 10) {
          let onamesplit = oname.slice(0, 10) + '...';
          _this.setData({
            regionone: onamesplit
          });
        } else {
          _this.setData({
            regionone: data[0].name + ' ' + data[0].desc
          });
        }
      },
      fail: function (info) {
        console.log("getLocation fail");
        wx.showModal({
          title: info.errMsg
        });
        _this.setData({
          result: '获取位置失败！'
        });
      }
    });
  },
  getadcode: function () {   //定位获取
    var _this = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.globalData.gdApiKey
    }); //key注册高德地图开发者
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data)
        _this.setData({
          oadcode: data[0].regeocodeData.addressComponent.adcode
        });
        _this.setData({
          provinceaddress: data[0].regeocodeData.addressComponent.province
        });
        _this.setData({
          cityaddress: data[0].regeocodeData.addressComponent.city
        });
        _this.getarea()
      },
      fail: function (info) {
        console.log("getLocation fail");
        wx.showModal({
          title: info.errMsg
        });
        _this.setData({
          result: '获取位置失败！'
        });
      }
    });
  },
  userTapAddress: function () {
    wx.navigateTo({
      url: '/pages/clients-looking-for-work/selectmap/smap',
    })
  },
  getlocationdetails() {   //所在地区的位置
    let historyregionone = wx.getStorageSync("historyregionone");
    if (historyregionone) {
      this.setData({
        regionone: historyregionone.title,
        longitude: historyregionone.location.split(",")[0],
        latitude: historyregionone.location.split(",")[1]
      })
      wx.removeStorageSync('historyregionone')
    }
  },

  accessprovince() {  //大部分piker需要的数据
    let that = this;
    app.doRequestAction({
      url: 'resumes/get-data/',
      way: 'GET',
      success(res) {
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
          // detailevaluation: res.data.label,
          // proficiencyarray: proficiencyarray,
          // compositionarray: compositionarray,
          array: array,
          arrayone: res.data.gender
        })

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
    if (all == ""){
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
  textareavalue(e){
    this.setData({
      otextareavalue: e.detail.value
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
  submitinformation() {
    let information = {}
    let userInfo = wx.getStorageSync("userInfo");
    let worktype = "";
    console.log(this.data.complexworkid)
    for (let i = 0; i < this.data.complexworkid.length ; i++){
      worktype += this.data.complexworkid[i]+","
    }

    let vertifyNum = v.v.new()
    if (!vertifyNum.isMobile(this.data.telephone)){
         console.log(123)
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
      lat: this.data.longitude,
      lng: this.data.latitude,
      address: this.data.regionone,
      adcode: this.data.oadcode,
    })
    console.log(information)
    // app.doRequestAction({
    //   url: "resumes/add-resume/",
    //   way: "POST",
    //   params: information,
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    this.accessprovince()
    this.getadcode()

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
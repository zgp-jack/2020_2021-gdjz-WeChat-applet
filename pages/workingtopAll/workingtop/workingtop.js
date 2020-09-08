// pages/clients-looking-for-work/finding-top/findingtop.js
const app = getApp();
let v = require("../../../utils/v.js");
let reminder = require("../../../utils/reminder.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    update_integral: 0,
    update_days: 0,
    endtime: "",
    endtimeh: "",
    endtimeone: "",
    shoutime: false,
    showpoint: false,
    day: 2,
    array: [],
    serverPhone: app.globalData.serverPhone,
    userInfo: true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    point: 0,
    daynumber: "48小时（2天）",
    imgDetelte: app.globalData.apiImgUrl + "lpy/delete.png",
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    areaProcrum: [],
    areaCitycrum: [],
    areaAllcrum:[],
    alllength: 0,
    max_province: "",
    province_integral: 0,
    city_integral: 0,
    value: "",
    areaTextIdP: "",
    areaTextIdC: "",
    top_rules: [],
    max_top_days: "",
    newId: "",
    topId: false,
    max_price: 0,
    allprice: 0,
    clocktime: 0,
    showpointnum: 0,
    showpointone: false,
    detailprice: 0,
    special_ids:[],
    rangevalue: 0,
    country_integral:"",
    // 首次置顶显示的置顶到期时间
    firstEndTime:"",
    // top-config返回的服务器时间戳
    serverTime:0,
    // top-config请求的同时记录本地时间戳
    hostTime:"",
    // 初次置顶的默认选中的置顶天数对应的index
    defaultDayIndex: 0 ,
    // 是否审核状态
    isCheck: 0,
    // config请求返回的置顶可选天数
    reqDays:[]
  },

  jumpstickyrule() {
    
    let that = this;
    let max_province = that.data.max_province;
    let max_city = that.data.max_city;

    let specialids = JSON.stringify(that.data.special_ids);
    app.globalData.judge = ""
    wx.navigateTo({
      url: `/pages/workingtopAll/distruction/distruction?max_province=${max_province}&max_city=${max_city}&specialids=${specialids}`,
    })
  },
  callThisPhone: function (e) {
    app.callThisPhone(e);
  },
  jumpdetail() {
    let that = this;
    let allpro = JSON.stringify(that.data.areaProcrum);
    let allcity = JSON.stringify(that.data.areaCitycrum);
    let allall = JSON.stringify([...that.data.areaProcrum,...that.data.areaCitycrum])
    
    let specialids = JSON.stringify(that.data.special_ids);
    let max_province = that.data.max_province;
    let max_city = that.data.max_city;
    wx.navigateTo({
      url: `/pages/workingtopAll/distruction/distruction?max_province=${max_province}&max_city=${max_city}&allpro= ${allpro}&allcity= ${allcity}&specialids=${specialids}&allall=${allall}`,
    })
  },
  bindGetUserInfo: function(e) {
    let that = this;
    app.bindGetUserInfo(e, function(res) {
      app.mini_user(res, function(res) {
        app.api_user(res, function(res) {
          let uinfo = res.data;
          if (uinfo.errcode == "ok") {
            let userInfo = {
              userId: uinfo.data.id,
              token: uinfo.data.sign.token,
              tokenTime: uinfo.data.sign.time,
            }
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            that.setData({
              userInfo: userInfo
            });
            // that.getdetail();
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  dayclocy(e) {
    let that = this;
    let numcity = that.data.city_integral;
    let numprovice = that.data.province_integral;
    let numAll = that.data.country_integral;
    // 获取请求的服务器时间戳
    let serverTime = that.data.serverTime;
    // 获取配置请求时本地主机时间
    let hostTime = that.data.hostTime;
    // 点击当前延期选择天数后的当前本地时间
    let currentTime = new Date().getTime();
    // 计算本地时间差
    let currentTimeDiff = currentTime - hostTime;
    // 最新服务器时间
    let newSeverTime = serverTime + currentTimeDiff;
    // 获取服务端返回的可选择的置顶天数
    let days = that.data.reqDays;
    if (e) {
      // 获取选择的天数
      let detail = days[e.detail.value]
      // 选择对应天数文本框显示内容
      let daynumber = "";
      if ( detail < 4 ) {
        daynumber = (detail * 24) + "小时(" + detail + "天)"
      } else {
        daynumber = detail + "天"
      }
      // 最新的到期时间毫秒+正在置顶结束的时间毫秒
      let all = 86400000 * (detail) + (newSeverTime - 0)
      // 格式化到期时间
      let time = this.getMyDate(all)
      
      that.setData({
        daynumber: daynumber,
        day: detail,
        firstEndTime: time,
      });

      let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length)) * detail
      // point
      that.setData({
        point: price
      });
    } else {
      let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length) );
      that.setData({
        allprice: price
      });
      if (this.data.topId != "undefined" && this.data.allprice > this.data.max_price) {
        let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length)) * that.data.detailprice;
        // point
        
        that.setData({
          point: price
        });

      } else if (this.data.topId == "undefined") {
        let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length)) * that.data.day
        // point
        that.setData({
          point: price
        });
      }
    }



  },
  // areaTextIdP: "",
  // areaTextIdC: "",
  areaId() {
    let that = this;
    let idp = '';
    let idc = '';
    let areaProcrum = this.data.areaProcrum;
    let areaCitycrum = this.data.areaCitycrum;

    for (let i = 0; i < areaProcrum.length; i++) {
      if (i >= areaProcrum.length - 1) {
        idp += areaProcrum[i].id
      } else {
        idp += areaProcrum[i].id + ","
      }
    }
    this.data.areaTextIdP = idp;

    for (let i = 0; i < areaCitycrum.length; i++) {
      if (i >= areaCitycrum.length - 1) {
        idc += areaCitycrum[i].id
      } else {
        idc += areaCitycrum[i].id + ","
      }
    }
    this.data.areaTextIdC = idc;

  },
  submitscop() {
    let that = this;
    // 招工信息的审核状态
    let isCheck = that.data.isCheck
    let day = that.data.max_top_days;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    if (!userInfo || !userUuid) {
      wx.showModal({
        title: '温馨提示',
        content: '网络出错，请稍后重试',
        showCancel: false,
        success(res) {}
      })
      return
    }
    let vertifyNum = v.v.new()


    if (vertifyNum.isNull(this.data.areaProcrum) && vertifyNum.isNull(this.data.areaCitycrum) && vertifyNum.isNull(this.data.areaAllcrum)) {
      reminder.reminder({
        tips: '置顶城市'
      })
      return
    }
    
    if (vertifyNum.isNull(this.data.day)) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择置顶天数',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (that.data.day - 0 > day) {
      app.showMyTips(`最多可置顶${day}天！`);
      return
    }
    let country = ""
    if (that.data.areaAllcrum.length > 0) {
      country = that.data.areaAllcrum[0].id
    }

    that.areaId()
    let detail = {
      mid: userInfo.userId,
      token: userInfo.token,
      time: userInfo.tokenTime,
      uuid: userUuid,
      day: that.data.day,
      is_country: country,
      city_ids: that.data.areaTextIdC,
      province_ids: that.data.areaTextIdP,
      job_id: that.data.newId
    }
    
    app.appRequestAction({
      url: 'job/do-top/',
      way: 'POST',
      params: detail,
      mask: true,
      success: function(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              let that = this;
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
              prevPage.setData({ //修改上一个页面的变量
                refresh: true
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
          return
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
        }else if (mydata.errcode == "member_forbid") {
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
                  phoneNumber: that.data.serverPhone
                });
              }
            }
          })
          return
        }else if (mydata.errcode == "get_integral") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            success(res) {
              if (res.confirm == true) {
                wx.navigateTo({
                  url: `/pages/getintegral/getintegral`,
                })
              }
            }
          })
          return
        }else if(mydata.errcode == "status_error"){
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel:false,
            success(res) {
              if (res.confirm == true) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
          return
        }else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              // wx.navigateBack({
              //   delta: 1
              // })
            }
          })
          return
        }
      },
      fail: function(err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {

          }
        })
      }
    })
  },
  returnPrevPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  authrasution() {
    let userInfo = wx.getStorageSync("userInfo");

    if (!userInfo) {
      this.setData({
        userInfo: false
      })
      return false;
    }

  },
  deletelableA(){
    let that = this;
    let all = this.data.areaAllcrum.length * this.data.country_integral;
    that.setData({
      areaAllcrum: [],
      alllength: that.data.alllength - 1,
      allprice: all
    })
    that.dayclocy()
    if (this.data.clocktime != 0) {
      that.getCityNum()
    }
  },
  deletelableP(e) {
    let that = this;
    let number = e.currentTarget.dataset.index;

    that.data.areaProcrum.splice(number, 1)
    let all = this.data.areaCitycrum.length * this.data.city_integral + this.data.areaProcrum.length * this.data.province_integral;
    that.setData({
      areaProcrum: that.data.areaProcrum,
      alllength: that.data.alllength - 1,
      allprice: all
    })
  
  

    that.dayclocy()
    if (this.data.clocktime != 0) {
      that.getCityNum()
    }
  },
  deletelableC(e) {
    let that = this;
    let number = e.currentTarget.dataset.index;

    that.data.areaCitycrum.splice(number, 1)
    let all = this.data.areaCitycrum.length * this.data.city_integral + this.data.areaProcrum.length * this.data.province_integral;
    
    that.setData({
      areaCitycrum: that.data.areaCitycrum,
      alllength: that.data.alllength - 1,
      allprice: all
    })
    
    that.dayclocy()
    if (this.data.clocktime != 0) {
      that.getCityNum()
    }
  },
  getMoreDay() {
    // let topDay = this.data.max_top_days - 0;
    // let oldArray = [];
    // let newArray = ["15天","30天","60天"]
    // for (let i = 0; i < topDay; i++) {
    //   oldArray.push((i + 1)*24 + "小时"  + '（' + (i + 1) + '天' + '）')
    // }
    // let array = [...oldArray, ...newArray]
    // this.setData({
    //   array: array
    // })
  },
  getAreaData: function (options) {
    if(options.topId != 'undefined'){
      return
    }
    let that = this;
    let city_id = options.city_id;
    let province_id = options.province_id;
    let areadata = wx.getStorageSync("areadata");
    let areaProcrumall = []
    let areaCitycrumall = []
    let areaAllcrumall = []
    if(city_id){
      try{
          areadata.data.forEach((item) => {
            item.forEach((val) => {
              if(city_id == val.id){
                if(val.pid == 1){
                  let areaProcrumone = {
                    id: val.id,
                    index: val.pid - 2 < 0 ? 0 : val.pid - 2,
                    name: val.city,
                    pid: val.pid
                  }
                  areaProcrumall.push(areaProcrumone);
                  throw '123'
                }else if(val.pid == 0){
                  let areaAllcrumone = {
                    id: areadata.data[0][0].id,
                    index: areadata.data[0][0].pid - 2 < 0 ? 0 : areadata.data[0][0].pid - 2,
                    name: areadata.data[0][0].city,
                    pid: areadata.data[0][0].pid
                  }
                  areaAllcrumall.push(areaAllcrumone);
                  throw '125'
                }else{
                  let areaCitycrumone = {
                    id: val.id,
                    index: val.pid - 2 < 0 ? 0 : val.pid - 2,
                    name: val.city,
                    pid: val.pid
                  }
                  areaCitycrumall.push(areaCitycrumone);
                  throw '124'
                }
              }
            })
          })
      }catch(e){

      }
    }
    that.setData({
      areaProcrum: areaProcrumall,
      areaCitycrum: areaCitycrumall,
      areaAllcrum: areaAllcrumall,
      alllength: areaProcrumall.length + areaCitycrumall.length + areaAllcrumall.length
    })
  },
  gettopareas() {
    let that = this;

    if (that.data.topId != "undefined") {

      let userInfo = wx.getStorageSync("userInfo");
      if (!userInfo) return false;
      let userUuid = wx.getStorageSync("userUuid");
      let detail = {
        mid: userInfo.userId,
        token: userInfo.token,
        time: userInfo.tokenTime,
        uuid: userUuid,
        job_id: that.data.newId
      }

      app.appRequestAction({
        url: "job/get-top-areas/",
        way: "POST",
        mask: true,
        params: detail,
        failTitle: "操作失败，请稍后重试！",
        success: function(res) {
          let mydata = res.data;
          if (mydata.errcode == "ok") {
        
            let areaProcrum = mydata.data.top_province;
            let areaProcrumall = []
            let areaCitycrum = mydata.data.top_city
            let areaCitycrumall = []
            let areaAllcrum = mydata.data.top_country
            let areaAllcrumall = []
            let top_province_ids = mydata.data.top_province_ids

            for (let i = 0; i < areaAllcrum.length; i++) {
              let areaAllcrumone = {
                id: areaAllcrum[i].id,
                index: areaAllcrum[i].pid - 2 < 0 ? 0 : areaAllcrum[i].pid - 2,
                name: areaAllcrum[i].name,
                pid: areaAllcrum[i].pid
              }
              areaAllcrumall.push(areaAllcrumone)
            }

            for (let i = 0; i < areaProcrum.length; i++) {
              let areaProcrumone = {
                id: areaProcrum[i].id,
                index: areaProcrum[i].pid - 2 < 0 ? 0 : areaProcrum[i].pid - 2,
                name: areaProcrum[i].name,
                pid: areaProcrum[i].pid
              }
              areaProcrumall.push(areaProcrumone)
            }
            let myarr = []
            for(let i = 0; i < top_province_ids.length; i++){
              let mydata = top_province_ids[i]
              let d = areaProcrumall.find(item => item.id == mydata)
              myarr.push(d)
            }

            for (let i = 0; i < areaCitycrum.length; i++) {
              let areaCitycrumone = {
                id: areaCitycrum[i].id,
                index: areaCitycrum[i].pid - 2 < 0 ? 0 : areaCitycrum[i].pid - 2,
                name: areaCitycrum[i].name,
                pid: areaCitycrum[i].pid
              }
              areaCitycrumall.push(areaCitycrumone)
            }
            

            that.setData({
              areaProcrum: myarr,
              areaCitycrum: areaCitycrumall,
              areaAllcrum: areaAllcrumall,
              alllength: areaProcrumall.length + areaCitycrumall.length + areaAllcrumall.length,
              max_price: mydata.data.max_price,
              endtime: mydata.data.end_time_string,
              endtimeh: (mydata.data.end_time-0)*1000
            })
            
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
    }

  },
  seletedsub() {
    let that = this;
    let day = that.data.max_top_days;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    // 获取请求的服务器时间戳
    let serverTime = that.data.serverTime;
    // 获取配置请求时本地主机时间
    let hostTime = that.data.hostTime;
    // 点击当前延期选择天数后的当前本地时间
    let currentTime = new Date().getTime();
    // 计算本地时间差
    let currentTimeDiff = currentTime - hostTime;
    // 最新服务器时间
    let newSeverTime = serverTime + currentTimeDiff;
    if (!userInfo || !userUuid) {
      wx.showModal({
        title: '温馨提示',
        content: '网络出错，请稍后重试',
        showCancel: false,
        success(res) {}
      })
      return
    }
    let vertifyNum = v.v.new()

    if (vertifyNum.isNull(this.data.areaProcrum) && vertifyNum.isNull(this.data.areaCitycrum) && vertifyNum.isNull(this.data.areaAllcrum)) {
      reminder.reminder({
        tips: '置顶城市'
      })
      return
    }

    that.areaId()
    let country = ""
    if (that.data.areaAllcrum.length>0){
      country = that.data.areaAllcrum[0].id
    }

    that.getAllpoint(newSeverTime)

    let detail = {
      mid: userInfo.userId,
      token: userInfo.token,
      time: userInfo.tokenTime,
      uuid: userUuid,
      is_country: country,
      city_ids: that.data.areaTextIdC,
      province_ids: that.data.areaTextIdP,
      job_id: that.data.newId,
      update_integral: that.data.point,
      update_days: that.data.detailprice
    }
  
    app.appRequestAction({
      url: 'job/change-top-areas/',
      way: 'POST',
      params: detail,
      mask: true,
      success: function(res) {
        console.log(res)
        let mydata = res.data;
        if (mydata.errcode == "ok") {

          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
              prevPage.setData({ //修改上一个页面的变量
                refresh: true
              })

              wx.navigateBack({
                delta: 1
              })
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
                  phoneNumber: that.data.serverPhone
                });
              } 
            }
          })
          return
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
        }else if (mydata.errcode == "get_integral") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            success(res) {
              if (res.confirm == true) {
                wx.navigateTo({
                  url: `/pages/getintegral/getintegral`,
                })
              }
            }
          })
          return
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          return
        }
      },
      fail: function(err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {

          }
        })
      }
    })
  },
  getdetail(options) {
    let that = this;
    app.appRequestAction({
      url: 'job/top-config/',
      way: 'POST',
      success: function(res) {
        let mydata = res.data;

        if (mydata.errcode == "ok") {
          // 处理3天内显示“1天（24小时）”，超过3天显示“4天”
          let array =[]
          let days = mydata.data.days
          for (let i = 0; i < days.length; i++) {
            if (days[i] < 4 ) {
              array.push(days[i] * 24 + "小时"  + '（' + days[i] + '天' + '）')
            }else{
              array.push(days[i] + "天")
            }
          }
          // 默认置顶天数对应的时间
          let index = null
          // 后台默认天数
          let day = mydata.data.default_days
          // 默认天数对应的index下标
          index = days.findIndex((value)=> value == day );
          // 处理默认置顶天数显示内容
          let daynumber = "";
          if ( day < 4 ) {
            daynumber = (day * 24) + "小时(" + day + "天)"
          } else {
            daynumber = day + "天"
          }
          that.setData({
            max_province: mydata.data.max_province-0,
            max_city: mydata.data.max_city-0,
            province_integral: mydata.data.province_integral,
            country_integral: mydata.data.country_integral,
            city_integral: mydata.data.city_integral,
            max_top_days: mydata.data.max_top_days,
            top_rules: mydata.data.top_rules,
            special_ids: mydata.data.special_ids,
            country_integral: mydata.data.country_integral,
            day: mydata.data.default_days-0,
            daynumber: daynumber,
            serverTime: mydata.data.time * 1000,
            // 首次置顶显示的置顶到期时间
            firstEndTime: that.getMyDate(86400000 * mydata.data.default_days + mydata.data.time * 1000),
            // 本地时间戳
            hostTime: new Date().getTime(),
            // 后台返回的置顶选择天数
            array: array,
            // 后台默认置顶天数对应的选择index
            defaultDayIndex: index,
            rangevalue: index,
            // 保存请求返回的可选择置顶天数
            reqDays: days
          })
          if(options.topId == 'undefined'){
            let numcity = mydata.data.city_integral;
            let numprovice = mydata.data.province_integral;
            let numAll = mydata.data.country_integral;
            let all = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length)) * mydata.data.default_days;
            that.setData({
              point: all
            });
          }
          that.getMoreDay()
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {}
          })
          return
        }
      },
      fail: function(err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
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
  getMyDate(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' +
      this.addZero(oMin);
    return oTime;
  },
  addZero(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },

  dayclocyone(e) {
    let that = this;
    let value = e.detail.value
    // 获取请求的服务器时间戳
    let serverTime = that.data.serverTime;
    // 获取配置请求时本地主机时间
    let hostTime = that.data.hostTime;
    if (e && (value - 0 + 1 > 0)) {
     
      let allprice = this.data.max_price
    
      let alllength = (that.data.areaProcrum.length) * that.data.province_integral + (that.data.areaCitycrum.length) * that.data.city_integral + (that.data.areaAllcrum.length) * that.data.country_integral
       // 点击当前延期选择天数后的当前本地时间
      let currentTime = new Date().getTime();
      // 计算本地时间差
      let currentTimeDiff = currentTime - hostTime;
      // 最新服务器时间
      let newSeverTime = serverTime + currentTimeDiff;
       // 获取可选择的置顶天数
       let days = that.data.reqDays
      // 获取选择的天数
      let detail = null
      detail = days[e.detail.value]
      this.setData({
        shoutime: true,
        showpoint: true,
      })
      let all = 86400000 * (detail) + (this.data.endtimeh - 0)
      let time = this.getMyDate(all)
      if (alllength <= allprice) {
        this.setData({
          endtimeone: time,
          detailprice: detail,
          allprice: alllength
        })
        this.getAllpoint(newSeverTime)
      } else {
        this.setData({
          endtimeone: time,
          detailprice: detail,
          allprice: alllength
        })
        this.getAllpoint(newSeverTime)
      }
    }
  },
  deletea() {
    // 获取默认的置顶天数
    let defaultDayIndex = this.data.defaultDayIndex
    this.setData({
      shoutime: false,
      showpoint: false,
      detailprice: 0,
      rangevalue:1,
      rangevalue: defaultDayIndex
    })
    this.getCityNum()
  },
  getNewId(options) {
   
    if (options.hasOwnProperty("id")) {
      this.setData({
        newId: options.id
      })
    }
    if (options.hasOwnProperty("topId")) {
      this.setData({
        topId: options.topId
      })
    }
    if (options.hasOwnProperty("ischeck")) {
      this.setData({
        isCheck: options.ischeck
      })
    }
    this.gettopareas()
  },
  
  getAllpoint(timeItem) {
    
    let shen = this.data.allprice - this.data.max_price;
    
    if (timeItem != 0 && shen>=0) {
      let shennum = shen;
      let time = ((this.data.endtimeh - timeItem) / 3600 / 1000 / 24) * (shennum) + "";
      var str = Math.round(time) - 0 + (this.data.allprice - 0) * (this.data.detailprice - 0);

      if (str==0){
        this.setData({
          showpointone: false
        })
      }
      this.setData({
        point: str,
        showpointnum: Math.round(time) - 0
      })
    }
  },


  getCityNum() {

    if (this.data.topId != "undefined") {
      let all = this.data.areaCitycrum.length * this.data.city_integral + this.data.areaProcrum.length * this.data.province_integral + this.data.country_integral * this.data.areaAllcrum.length;
      
      console.log(all)
      if (all > this.data.max_price) {

        this.setData({
          showpointone: true,
          allprice: all
        })
        this.getAllpoint(this.data.clocktime)
      } else if (all == this.data.max_price){
        this.getAllpoint(this.data.clocktime)
      } else if (all < this.data.max_price){

        this.setData({
          point: (this.data.max_price) * (this.data.detailprice),
        })
        if (this.data.point == 0) {
          this.setData({
            showpointone: false
          })
        }
      }else {
        
        this.setData({
          showpointone: false
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // this.authrasution()
    this.getdetail(options)
    this.getAreaData(options)
    this.getNewId(options)
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
    this.dayclocy()
    this.getCityNum()
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
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // prevPage.setData({ //修改上一个页面的变量
    //   refresh: true
    // })
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
  // onShareAppMessage: function () {

  // }
})
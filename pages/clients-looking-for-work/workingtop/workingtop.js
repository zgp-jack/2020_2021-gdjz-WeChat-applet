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
    day: 0,
    array: [],
    serverPhone: app.globalData.serverPhone,
    userInfo: true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    point: 0,
    daynumber: "",
    imgDetelte: app.globalData.apiImgUrl + "lpy/delete.png",
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
    max_price: 0,
    allprice: 0,//最新单价
    clocktime: 0,
    showpointnum: 0,
    showpointone: false,
    detailprice: 0,//新选择的置顶天数
    rangevalue:0,
    country_integral:0,
    defaultDayIndex:0,
    //从resume-list请求点击马上置顶（首次）带过来的默认置顶区域
    defaultTop:false,
    //从resume-list请求点击修改置顶带过来的置顶数据
    topdata:{},
    special_ids: [],
    //top-config请求是的服务器时间戳
    serverTime:"",
    //top-config请求是的本地时间戳
    hostTime:"",
    //首次置顶的时候显示置顶到期时间输入框内容
    firstEndTime:"",//
  },
  //用户首次置顶或者置顶到期点击‘选择置顶范围’跳转到置顶区域选择界面
  jumpstickyrule() {
    
    let that = this;
    //获取data中最大省
    let max_province = that.data.max_province;
    //获取data中最大城市
    let max_city = that.data.max_city;
    let specialids = JSON.stringify(that.data.special_ids);
    app.globalData.judge = ""
    //跳转到置顶范围选择界面并携带省城市信息
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/distruction/distruction?max_province=${max_province}&max_city=${max_city}&specialids=${specialids}`,
    })
  },
  callThisPhone: function (e) {
    app.callThisPhone(e);
  },
  // 修改置顶下点击“添加更多”跳转到城市选择界面
  jumpdetail() {
    let that = this;
    let allpro = JSON.stringify(that.data.areaProcrum);
    let allcity = JSON.stringify(that.data.areaCitycrum);
    let allall = JSON.stringify([...that.data.areaProcrum,...that.data.areaCitycrum])
    
    let specialids = JSON.stringify(that.data.special_ids);
    let max_province = that.data.max_province;
    let max_city = that.data.max_city;
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/distruction/distruction?max_province=${max_province}&max_city=${max_city}&allpro= ${allpro}&allcity= ${allcity}&specialids=${specialids}&allall=${allall}`,
    })
  },
  // 登录授权
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
  // 初次置顶或者到期后的置顶选择置顶天数的点击事件
  dayclocy(e) {
    // 获取积分规则
    let that = this;
    // 普通城市单价积分
    let numcity = that.data.city_integral;
    // 省或直辖市单价积分
    let numprovice = that.data.province_integral;
    // 全国积分单价
    let numAll = that.data.country_integral;
    // 是否是置顶
    let istop = that.data.topdata.is_top;
    // 是否是第一次置顶
    let hastop = that.data.topdata.has_top;
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
    if (e) {
      // 获取选择的天数
      let detail = null;
      let daynumber = "";
      if (e.detail.value == 10) {
        detail = 15;
        daynumber = "15天";
      }else if(e.detail.value == 11){
        detail = 30;
        daynumber = "30天";
      }else if(e.detail.value == 12){
        detail = 60;
        daynumber = "60天";
      }else if(e.detail.value > 2 && e.detail.value < 9){
        detail = e.detail.value - 0 + 1;
        daynumber = `${detail}天`;
      }else{
        detail = e.detail.value - 0 + 1
      }
      // 最新的到期时间毫秒+正在置顶结束的时间毫秒
      let all = 86400000 * (detail) + (newSeverTime - 0)
      // 格式化到期时间
      let time = this.getMyDate(all)
      // 获取选择的置顶天数并设置到data中
      that.setData({
        daynumber: e.detail.value < 3 ? (detail * 24) + "小时(" + detail + "天)" : daynumber,
        day: detail,
        firstEndTime: time
      });
    // 计算出需要的积分
      let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length)) * detail
    // 将积分设置到data中
      that.setData({
        point: price
      });
    // 没有选择置顶天数
    } else {
    // 选择置顶区域后基础天数积分总数
      let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length) );
      that.setData({
        allprice: price
      });
      if (istop == 1 && this.data.allprice > this.data.max_price) {
        let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length)) * that.data.detailprice;
        that.setData({
          point: price
        });
      } 
      else if (istop == 2 || hastop == 0) {
        let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length) + numAll * (that.data.areaAllcrum.length)) * that.data.day
        that.setData({
          point: price
        });
      }
    }
  },
  // 置顶数据保存前提取全国、省、直辖市、市的区域id
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
  // 初次置顶或者到期后置顶的提交
  submitscop() {
    let that = this;
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
    let country = 0
    if (that.data.areaAllcrum.length > 0) {
      country = 1
    }

    that.areaId()
    let detail = {
      mid: userInfo.userId,
      token: userInfo.token,
      time: userInfo.tokenTime,
      uuid: userUuid,
      days: that.data.day,
      is_country: country,
      city_ids: that.data.areaTextIdC,
      province_ids: that.data.areaTextIdP,
    }
    app.appRequestAction({
      url: 'resumes/do-top-v2/',
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
        } else {
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
  // 删除全国
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
  // 删除省或者直辖市
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
  // 删除城市
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
  // 初始化点击置顶时间的选择框数据
  getMoreDay() {
    // let topDay = this.data.max_top_days - 0;
    // let oldArray = [];
    // let newArray = ["15天","30天","60天"]
    // for (let i = 0; i < topDay; i++) {
    //   oldArray.push((i + 1)*24 + "小时(" + (i+1) + "天)")
    // }
    // let array = [...oldArray, ...newArray]
    // this.setData({
    //   array: array
    // })
  },
  // 初始化已经置顶的置顶数据
  gettopareas() {
    let that = this;
    let hastop= this.data.topdata.has_top;
    let istop = this.data.topdata.is_top;
    let area = wx.getStorageSync('areadata')
    // 判断是否是置顶中的修改置顶
    if (hastop && istop == 1) {
      //判断是否有授权登录用户信息
      let userInfo = wx.getStorageSync("userInfo");
      //没有用户信息直接返回
      if (!userInfo) return false;
      //获取置顶区域的信息
      let areaProcrum = that.data.topdata.top_provinces_str;
      let areaCitycrum = that.data.topdata.top_citys_str;
      let isCountry = that.data.topdata.is_country;
      let max_price = parseInt(that.data.topdata.max_price);
      let areaAllcrum = [];
      let areaItem = area.data[0][0];
      areaItem.name = areaItem.city;
      if (isCountry == 1) {
       areaAllcrum = areaItem
      }
      let alllength = areaProcrum.length + areaCitycrum.length + areaAllcrum.length;
      let endtime = that.data.topdata.end_time_str;
      let endtimeh = (that.data.topdata.end_time-0)*1000;
      that.setData({
        areaProcrum: areaProcrum,
        areaCitycrum: areaCitycrum,
        areaAllcrum: areaAllcrum,
        alllength: alllength,
        endtime: endtime,
        endtimeh: endtimeh,
        max_price:max_price,
      })
    }
  },
  // 修改的提交置顶
  seletedsub() {
    let that = this;
    let day = that.data.max_top_days;
    // 获取请求的服务器时间戳
    let serverTime = that.data.serverTime;
    // 获取配置请求时本地主机时间
    let hostTime = that.data.hostTime;
    // 点击当前确定置顶的当前本地时间
    let currentTime = new Date().getTime();
    // 计算本地时间差
    let currentTimeDiff = currentTime - hostTime;
    // 最新服务器时间
    let newSeverTime = serverTime + currentTimeDiff;
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

    that.areaId()
    let country = 0
    if (that.data.areaAllcrum.length>0){
      country = 1
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
      update_integral: that.data.point,
      update_days: that.data.detailprice
    }
  
    app.appRequestAction({
      url: 'resumes/update-top-resume/',
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
  // 获取置顶配置信息
  getdetail() {
    let that = this;
    let areaAllcrum = that.data.areaAllcrum;
    let areaProcrum =  that.data.areaProcrum;
    let areaCitycrum = that.data.areaCitycrum;
    let day = that.data.day;
    let istop = that.data.topdata.is_top;
    let hastop = that.data.topdata.has_top;
    app.appRequestAction({
      url: 'resumes/top-config/',
      way: 'POST',
      params: {interface_version:"v2"},
      success: function(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          let max_province = mydata.data.max_province-0;
          let max_city = mydata.data.max_city-0;
          let province_integral = mydata.data.province_integral -0;
          let country_integral = mydata.data.country_integral-0;
          let city_integral = mydata.data.city_integral-0;
          let top_rules = mydata.data.top_rules;
          let max_top_days = mydata.data.max_top_days-0;
          let special_ids = mydata.data.special_ids;
          let serverTime = mydata.data.time -0;
          let day = mydata.data.default_days-0;
          let daynumber = (day * 24) + "小时(" + day + "天)";
          let firstEndTime = that.getMyDate(86400000 * day + serverTime * 1000) 
          if (hastop == 0 || istop == 2) {
            let point = (areaProcrum.length * province_integral + areaCitycrum.length * city_integral + areaAllcrum.length * country_integral) * day;
            that.setData({
              point: point
            })
          }
          let array =[]
          let days = mydata.data.days
          for (let i = 0; i < days.length; i++) {
            if (i < 3 ) {
              array.push(days[i] * 24 + "小时"  + '（' + days[i] + '天' + '）')
            }else{
              array.push(days[i] + "天")
            }
          }
          let index = null
          if (day < 11){
            index = day -1
          }else if (day == 15){
            index = 10
          }else if (day == 30){
            index = 11
          }else if (day == 60){
            index = 12
          }
          that.setData({
            //最大省份数
            max_province: max_province,
            //最大城市数
            max_city: max_city,
            //置顶省份消耗积分
            province_integral: province_integral,
            //置顶区县消耗积分
            country_integral: country_integral,
            //置顶城市消耗积分
            city_integral: city_integral,
            //最大置顶天数
            max_top_days: max_top_days,
            //置顶规则
            top_rules: top_rules,
            special_ids: special_ids,
            // 服务器时间戳
            serverTime: serverTime * 1000,
            // 本地时间戳
            hostTime: new Date().getTime(),
            // 默认选择天数
            day: day,
            // 默认天数下选择框显示内容
            daynumber: daynumber,
            // 首次置顶显示的置顶到期时间
            firstEndTime: firstEndTime,
            // 置顶时间选择数组
            array: array,
            defaultDayIndex: index,
            rangevalue: index

          })
          // 初始化选择置顶天数的下拉列表
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
  // 获取指定格式的时间
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
  // 如果分钟小于10就添加一个0
  addZero(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  // 延长修改置顶日期的点击事件
  dayclocyone(e) {
    let that = this;
    // 获取请求的服务器时间戳
    let serverTime = that.data.serverTime;
    // 获取配置请求时本地主机时间
    let hostTime = that.data.hostTime;
    // 存在点击事件
    if (e && (e.detail.value - 0 + 1 > 0)) {
      // 上次的置顶单价（基本单位天）
      let allprice = this.data.max_price
      // 现在新置顶的单价
      let alllength = (that.data.areaProcrum.length) * that.data.province_integral + (that.data.areaCitycrum.length) * that.data.city_integral + (that.data.areaAllcrum.length) * that.data.country_integral
      // 点击当前延期选择天数后的当前本地时间
      let currentTime = new Date().getTime();
      // 计算本地时间差
      let currentTimeDiff = currentTime - hostTime;
      // 最新服务器时间
      let newSeverTime = serverTime + currentTimeDiff;
      // 获取选择的天数
      let detail = null
      if (e.detail.value == 10) {
        detail = 15
      }else if(e.detail.value == 11){
        detail = 30
      }else if(e.detail.value == 12){
        detail = 60
      }else{
        detail = e.detail.value - 0 + 1
      }
      // 点击延长或者修改显示“最新到期时间”与“积分”框
      this.setData({
        shoutime: true,
        showpoint: true,
      })
      // 最新的到期时间毫秒+正在置顶结束的时间毫秒
      let all = 86400000 * (detail) + (this.data.endtimeh - 0)
      // 格式化到期时间
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
    this.setData({
      shoutime: false,
      showpoint: false,
      detailprice: 0,
      rangevalue:1
    })
    this.getCityNum()
  },
  // 获取找活列表url传过来的值并保存到data中
  getNewId(options) {
    if (options.hasOwnProperty("topdata")) {
      this.setData({
        topdata: JSON.parse(options.topdata)
      })
    }
    if (options.hasOwnProperty("defaulttop")) {
      this.setData({
        defaultTop: JSON.parse(options.defaulttop)
      })
    }
    // 初始化置顶状态下的数据
    this.gettopareas()
  },
  getAllpoint(timeItem) {
    // 积分单价差
    let shen = this.data.allprice - this.data.max_price;
    
    if (timeItem != 0 && shen>=0) {
      let shennum = shen;
      // let shenmiao = this.changeTwoDecimal(shennum)
      
      // 计算置顶积分总差额
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

  // 修改添加置顶城市的价格计算
  getCityNum() {
    if (this.data.topdata.is_top == 1) {
      let all = this.data.areaCitycrum.length * this.data.city_integral + this.data.areaProcrum.length * this.data.province_integral + this.data.country_integral * this.data.areaAllcrum.length;
      console.log("all",all)
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
   //获取找活置顶的省份城市选择界面
  getDefaultArea: function(areaId) {
    console.log("areaId",areaId)
    //获取本地缓存区域信息
    let areadata = wx.getStorageSync("areadata");
    //如果本地有缓存区域信息
    let _this = this;
    //定义默认的置顶区域
    let defaultTop = []
    if (areadata) {
    //深拷贝区域信息
      let mydata = app.arrDeepCopy(areadata)  
      let areaData = mydata.data
      // 遍历找到符合条件的区域信息
      for (let i = 0; i < areaData.length; i++) {
        let item = areaData[i]
        for (let j = 0; j < item.length; j++) {
          if (item[j].id == areaId) {
            let areaArry = item[j];
            areaArry.name = item[j].city;
            areaArry.index = i;
            defaultTop.push(areaArry);
          }
        }
      }
      if (defaultTop.length > 1) {
        defaultTop.splice(0,1)
      }
      console.log("defaultTop",defaultTop)
      let pid = defaultTop[0].pid
      if (pid == 0) {
        this.setData({
          areaAllcrum:defaultTop,
          alllength:defaultTop.length,
        })
      } else if(pid == 1) {
        this.setData({
          areaProcrum: defaultTop,
          alllength:defaultTop.length,
        })
      }else{
        this.setData({
          areaCitycrum: defaultTop,
          alllength:defaultTop.length,
        })
      }
        return false
      }
    //如果没有缓存信息将通过app中方法获取区域数据
    app.getAreaData(this, function(data) {
      let resdata = app.arrDeepCopy(data)
      let areaData = resdata.data
      // 遍历找到符合条件的区域信息
      for (let i = 0; i < areaData.length; i++) {
        let item = areaData[i]
        for (let j = 0; j < item.length; j++) {
          if (item[j].id == areaId) {
            let areaArry = item[j];
            areaArry.name = item[j].city;
            areaArry.index = i;
            defaultTop.push(areaArry)
          }
        }
      }
      let pid = defaultTop.pid
      if (pid == 0) {
        this.setData({
          areaAllcrum:defaultTop,
          alllength:defaultTop.length,
        })
      } else if(pid == 1) {
        this.setData({
          areaProcrum: defaultTop,
          alllength:defaultTop.length,
        })
      }else{
        this.setData({
          areaCitycrum: defaultTop,
          alllength:defaultTop.length,
        })
      }
    });
  },
 //初次置顶的时候置顶天数默认2天
 initTopData:function(){
  let hastop = this.data.topdata.has_top
  let istop = this.data.topdata.is_top
  let defaultTop = this.data.defaultTop
  //如果时初次置顶或者置顶到期，置顶地区默认找活名片地区
  if(hastop == 0 || istop == 2){
    this.getDefaultArea(defaultTop)
  }
  //初始化默认置顶时间为两天
  this.setData({
    defaultDayIndex:1,
    rangevalue:1
  });

 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取url带过来的数据
    this.getNewId(options)
    // 初始化置顶城市与置顶天数
    this.initTopData()
    this.getdetail()
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
    //计算消耗积分
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
    console.log("pages",pages)
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
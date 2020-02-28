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
    point: 0,
    daynumber: "",
    imgDetelte: app.globalData.apiImgUrl + "lpy/delete.png",
    areaProcrum: [],
    areaCitycrum: [],
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
    rangevalue:0
  },

  jumpstickyrule() {
    console.log(123)
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
    console.log(allall)
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
    console.log(e)
    let that = this;
    let numcity = that.data.city_integral;
    let numprovice = that.data.province_integral;
    if (e) {

      let day = e.detail.value - 0 + 1;
      console.log(day)
      that.setData({
        daynumber: day + "天",
        day: day
      });

      let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length)) * day
      // point
      that.setData({
        point: price
      });
    } else {
      console.log(numcity)
      console.log(numprovice)
      console.log(that.data.areaCitycrum.length)
      console.log(that.data.areaProcrum.length)
      console.log(this.data.allprice)
      let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length));
      that.setData({
        allprice: price
      });
      if (this.data.topId != "undefined" && this.data.allprice > this.data.max_price) {
        let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length)) * that.data.detailprice;
        // point
        console.log(34232432432)
        that.setData({
          point: price
        });

      } else if (this.data.topId == "undefined") {
        let price = (numcity * (that.data.areaCitycrum.length) + numprovice * (that.data.areaProcrum.length)) * that.data.day
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


    if (vertifyNum.isNull(this.data.areaProcrum) && vertifyNum.isNull(this.data.areaCitycrum)) {
      reminder.reminder({
        tips: '置顶城市'
      })
      return
    }
    console.log(that.data.value)
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

    that.areaId()
    let detail = {
      mid: userInfo.userId,
      token: userInfo.token,
      time: userInfo.tokenTime,
      uuid: userUuid,
      day: that.data.day,
      city_ids: that.data.areaTextIdC,
      province_ids: that.data.areaTextIdP,
      job_id: that.data.newId
    }
    console.log(detail)
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
  
    console.log(that.data.alllength)

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
    console.log(all)
    that.setData({
      areaCitycrum: that.data.areaCitycrum,
      alllength: that.data.alllength - 1,
      allprice: all
    })
    console.log(that.data.alllength)
    that.dayclocy()
    if (this.data.clocktime != 0) {
      that.getCityNum()
    }
  },
  getMoreDay() {
    let topDay = this.data.max_top_days - 0;
    let array = []
    for (let i = 0; i < topDay; i++) {
      array.push(i + 1 + "天")
    }
    this.setData({
      array: array
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
            console.log(mydata)
            let areaProcrum = mydata.data.top_province;
            let areaProcrumall = []
            let areaCitycrum = mydata.data.top_city
            let areaCitycrumall = []

            for (let i = 0; i < areaProcrum.length; i++) {
              let areaProcrumone = {
                id: areaProcrum[i].id,
                index: areaProcrum[i].pid - 2 < 0 ? 0 : areaProcrum[i].pid - 2,
                name: areaProcrum[i].name,
                // pid: areaProcrum[i].pid
              }
              areaProcrumall.push(areaProcrumone)
            }

            for (let i = 0; i < areaCitycrum.length; i++) {
              let areaCitycrumone = {
                id: areaCitycrum[i].id,
                index: areaCitycrum[i].pid - 2 < 0 ? 0 : areaCitycrum[i].pid - 2,
                name: areaCitycrum[i].name,
                // pid: areaCitycrum[i].pid
              }
              areaCitycrumall.push(areaCitycrumone)
            }

            that.setData({
              areaProcrum: areaProcrumall,
              areaCitycrum: areaCitycrumall,
              alllength: areaProcrumall.length + areaCitycrumall.length,
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

    if (vertifyNum.isNull(this.data.areaProcrum) && vertifyNum.isNull(this.data.areaCitycrum)) {
      reminder.reminder({
        tips: '置顶城市'
      })
      return
    }
    console.log(that.data.detailprice)


    that.areaId()


    let detail = {
      mid: userInfo.userId,
      token: userInfo.token,
      time: userInfo.tokenTime,
      uuid: userUuid,

      city_ids: that.data.areaTextIdC,
      province_ids: that.data.areaTextIdP,
      job_id: that.data.newId,
      update_integral: that.data.point,
      update_days: that.data.detailprice
    }
    console.log(detail)
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
              console.log(res)

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
  getdetail() {
    let that = this;
    app.appRequestAction({
      url: 'job/top-config/',
      way: 'POST',
      success: function(res) {
        let mydata = res.data;

        if (mydata.errcode == "ok") {
          that.setData({
            max_province: mydata.data.max_province,
            max_city: mydata.data.max_city,
            province_integral: mydata.data.province_integral,
            country_integral: mydata.data.country_integral,
            city_integral: mydata.data.city_integral,
            max_top_days: mydata.data.max_top_days,
            top_rules: mydata.data.top_rules,
            special_ids: mydata.data.special_ids
          })

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
    if (e && (e.detail.value - 0 + 1 > 0)) {
      let detail = e.detail.value - 0 + 1
      this.setData({
        shoutime: true,
        showpoint: true
      })
      console.log(this.data.endtimeh)
      let all = 86400000 * (detail) + (this.data.endtimeh - 0)
      let time = this.getMyDate(all)
      console.log(time)

      let allprice = this.data.max_price
      console.log(allprice)
      let alllength = (that.data.areaProcrum.length) * that.data.province_integral + (that.data.areaCitycrum.length) * that.data.city_integral
  
      if (alllength <= allprice) {
        this.setData({
          endtimeone: time,
          point: allprice * detail,
          detailprice: detail
        })
      } else {
        this.setData({
          endtimeone: time,
          point: alllength * detail + that.data.showpointnum,
          detailprice: detail
        })
      }

    }
  },
  deletea() {
    this.setData({
      shoutime: false,
      showpoint: false,
      detailprice: 0,
      rangevalue:0
    })
    this.getCityNum()
  },
  getNewId(options) {
    console.log(options)
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
    // if (options.hasOwnProperty("endtime")) {
    //   this.setData({
    //     endtime: options.endtime
    //   })
    // }
    // if (options.hasOwnProperty("endtimeh")) {
    //   this.setData({
    //     endtimeh: options.endtimeh
    //   })
    // }
    this.gettopareas()
  },
  // changeTwoDecimal(x) {
  //   var f_x = parseFloat(x);
  //   if (isNaN(f_x)) {

  //     return false;
  //   }
  //   f_x = Math.round(f_x * 100) / 100;



  //   return f_x;
  // },
  getAllpoint() {
    console.log(this.data.allprice)
    let shen = this.data.allprice - this.data.max_price;
    console.log(shen)
    if (this.data.clocktime != 0 && shen>=0) {
      let shennum = shen;
      // let shenmiao = this.changeTwoDecimal(shennum)
      console.log(this.data.endtimeh)
      console.log(this.data.clocktime)
      let time = ((this.data.endtimeh - this.data.clocktime) / 3600 / 1000 / 24) * (shennum) + "";
      console.log(time)
      console.log(this.data.allprice)
      console.log(this.data.detailprice)
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
      let all = this.data.areaCitycrum.length * this.data.city_integral + this.data.areaProcrum.length * this.data.province_integral;
      console.log(all)
      console.log(this.data.max_price)
      if (all > this.data.max_price) {

        this.setData({
          showpointone: true,
          allprice: all
        })
        this.getAllpoint()
      } else if (all == this.data.max_price){
        this.getAllpoint()
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
        console.log(212)
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
    this.getdetail()
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
    console.log("fdsdfsdfdsdf")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({ //修改上一个页面的变量
      refresh: true
    })
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
// pages/clients-looking-for-work/the-sticky-rule/stickyrule.js
const app = getApp();
let v = require("../../../utils/v.js");
let reminder = require("../../../utils/reminder.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgDetelte: app.globalData.apiImgUrl + "lpy/delete.png",
    areaText: [],
    areadata: [],
    maxnumber: "",
    modify: "",
    areaTextId: "",
    firstprovincenum:""
  },
  changeAreaData() {
    let that = this;
    for (let i = 0; i < that.data.areadata.length; i++) {
      that.data.areadata[i].selected = 1
    }
    that.setData({
      areadata: that.data.areadata
    })


  },
  getAreaData(options) {
    let that = this;
    app.appRequestAction({
      url: 'resumes/top-areas/',
      way: 'POST',
      success: function (res) {
        let mydata = res.data;

        if (mydata.errcode == "ok") {

          that.setData({
            areadata: mydata.data.provinces
          })
          that.changeAreaData()
          that.modifyArea(options)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) { }
          })
          return
        }
      },
      fail: function (err) {
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
  chooseThisCtiy(e) {
    let that = this;
    // console.log(that.data.maxnumber)

    let num = e.currentTarget.dataset.id.id;


    if (that.data.areadata[num - 2].selected == 1) {
      if (that.data.areaText.length >= that.data.maxnumber) {
        wx.showModal({
          title: '温馨提示',
          content: `最多可选择${that.data.maxnumber}个省份置顶`,
          showCancel: false,
          success(res) { }
        })
        return
      }
      that.data.areadata[num - 2].selected = 2;
      that.setData({
        areadata: that.data.areadata
      })
      that.data.areaText.push(that.data.areadata[num - 2])
      that.setData({
        areaText: that.data.areaText
      })
      // if (that.data.areaText.length > 2) {
      //   that.setData({
      //     scrollLeft: "120" + ((that.data.areaText.length - 2) * 40)
      //   })
      // }


    } else {
      let j = ''
      that.data.areadata[num - 2].selected = 1;
      that.setData({
        areadata: that.data.areadata
      })
      for (let i = 0; i < that.data.areaText.length; i++) {
        if (that.data.areaText[i].id == num) {
          j = i
        }
      }
      that.data.areaText.splice(j, 1)
      that.setData({
        areaText: that.data.areaText
      })
    }
  },

  // deletelable(e) {

  //   let that = this;

  //   let num = e.currentTarget.dataset.id.id;
  //   let number = e.currentTarget.dataset.index;
  //   that.data.areadata[num - 2].selected = 1;
  //   that.setData({
  //     areadata: that.data.areadata
  //   })
  //   that.data.areaText.splice(number, 1)
  //   that.setData({
  //     areaText: that.data.areaText
  //   })
  // },
  areaId() {

    let id = '';
    let areaText = this.data.areaText;
    for (let i = 0; i < areaText.length; i++) {
      if (i >= areaText.length - 1) {
        id += areaText[i].id
      } else {
        id += areaText[i].id + ","
      }
    }
    this.data.areaTextId = id;
    
  },
  seleted() {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    let vertifyNum = v.v.new()
    if (!userInfo || !userUuid) return false;

    if (vertifyNum.isNull(this.data.areaText)) {
      reminder.reminder({ tips: '置顶城市' })
      return
    }
    that.areaId()

    if (that.data.modify == "modify") {
      // if (this.data.areaText.length > this.data.firstprovincenum - 0) {
      //   wx.showModal({
      //     title: '温馨提示',
      //     content: '您置顶的城市的数量不能超过第一次置顶城市的数量',
      //     showCancel: false,
      //     success(res) {
      //     }
      //   })
      //   return
      // }

      let detail = {
        mid: userInfo.userId,
        token: userInfo.token,
        time: userInfo.tokenTime,
        uuid: userUuid,
        citys: 0,
        provinces: that.data.areaTextId
      }
      app.appRequestAction({
        url: 'resumes/change-top-areas/',
        way: 'POST',
        params: detail,
        mask: true,
        success: function (res) {
          let mydata = res.data;

          if (mydata.errcode == "ok") {
 
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
        fail: function (err) {
          wx.showModal({
            title: '温馨提示',
            content: `您的网络请求失败`,
            showCancel: false,
            success(res) {
            }
          })
        }
      })

    } else {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({                                      //修改上一个页面的变量
        areaTextcrum: that.data.areaText
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },

  modifyArea(options) {

    let that = this;

    if (options.hasOwnProperty("area")) {
      let data = JSON.parse(options.area)
      that.setData({
        areaText: data
      })

      for (let i = 0; i < data.length; i++) {
        let num = data[i].id;
        that.data.areadata[num - 2].selected = 2;
        that.setData({
          areadata: that.data.areadata
        })
      }
    }
    if (options.hasOwnProperty("maxnumber")) {
      that.setData({
        maxnumber: options.maxnumber
      })
    }
    if (options.hasOwnProperty("modify")) {
      that.setData({
        modify: options.modify
      })
    }
    if (options.hasOwnProperty("firstprovincenum")) {
      that.setData({
        maxnumber: options.firstprovincenum
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getAreaData(options);

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

})
// pages/publish/issue/index.js
let v = require('../../../utils/v');
// let restful = require('../../utils/restful')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:true,
    content: '',
    phone: '',
    showTel: false,
    request:false
  },
  checkType: function (obj, _type) {
    var _re = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    if (_type == undefined) return _re;
    if (_re == _type) return true;
    return false;
  },
  enterContent: function (e) {
    let u = wx.getStorageSync('userInfo')
    let val = e.detail.value;
    let fastData = wx.getStorageSync('fastData')
    this.setData({
      content: val
    })
    wx.setStorageSync("fastData",{
      phone:this.data.phone
    })
    let content = val.replace(/\s+/g, "");
    if (u) {
      this.setData({
        phone:app.globalData.publish.phone
      })
    } else {
      let _partten = /1[3-9]\d{9}/g;
      let phone = content.match(_partten);
      let regx = /[\u4E00-\u9FA5]+/g;
      console.log(content.length)
      if ( content.length > 2 && regx.test(content)) {
        this.setData({
          showTel: true,
        });
      }
      if (this.checkType(phone, 'array')) {
        let tel = phone[0];
        this.setData({
          showTel: true,
          phone: tel
        });
        wx.setStorageSync("fastData",{
          phone:tel
        })
      }
      }
  },
  enterPhone: function (e) {
    let that = this
    wx.setStorageSync("fastData",{
      phone:e.detail.value,
    })
    this.setData({
      phone: e.detail.value
    })
  },
  contentBlur: function (e) {
    let that = this
    wx.setStorageSync("fastData",{
      phone:that.data.phone
    })
    if (this.data.phone) {
      this.setData({
        showTel: true
      })
    }
  },
  publishRecurit: function () {
    console.log("phone",this.data.phone)
    let vali = v.v.new();
    let {
      content,
      phone
    } = this.data
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '请输入招工详情。',
        showCancel: false
      })
      return false;
    }
    if (content.length < 3 || content.length > 500) {
      wx.showModal({
        title: '提示',
        content: '请正确输入3~500字招工详情。',
        showCancel: false
      })
      return false;
    }
    if (!vali.isChinese(content) && (content.length > 2)) {
      wx.showModal({
        title: '提示',
        content: '请正确输入3~500字招工详情,必须含有汉字。',
        showCancel: false
      })
      return false
    }
    if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入联系电话。',
        showCancel: false
      })
      return false
    }
    if (phone && !vali.isMobile(phone)) {
      wx.showModal({
        title: '提示',
        content: '请正确输入11位联系电话。',
        showCancel: false
      })
      return false;
    }
    app.appRequestAction({
      url: 'fast-issue/issue/',
      params: {
        content,
        phone
      },
      way: 'POST',
      success: function (res) {
        if (res.data.errcode == "ok") {
          let mydata = res.data.data
          app.globalData.fastToken = mydata.token
          if (mydata.checked) {
            wx.navigateTo({
              url: '/pages/fast/area/area?token=' + mydata.token,
            })
          } else {
            wx.navigateTo({
              url: '/pages/fast/code/code?token=' + mydata.token + '&tel=' + phone,
            })
          }
        }
        if (res.data.errcode == "unusable") {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: true,
            cancelColor: "#797979",
            cancelText: "知道了",
            confirmText: "联系客服",
            confirmColor: "#009CFF",
            success: function (res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: app.globalData.serverPhone
                })
              }
            }
          })
        }
        if (res.data.errcode !== "unusable" && res.data.errcode !== "ok") {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
      }
    })
  },
  clearContent: function () {
    this.setData({
      content: ''
    })
  },
  //获取用户信息并将电话信息存入缓存和globalData
  getUserInfo:function () {
    let _this = this;
    let u = wx.getStorageSync('userInfo')
    _this.setData({
      userInfo: u ? u : false,
    })
    let postData = {...u,type: 'job'}
    app.appRequestAction({
    url: 'publish/new-mate-job/',
    way: 'POST',
    mask: true,
    params:postData,
    success:function(res){
      let mydata = res.data
      console.log("mydata",mydata)
      if(mydata.errcode == "ok"){
        let tel = mydata.memberInfo.tel || ''
        _this.setData({
          phone:tel,
          showTel: true
        })
        wx.setStorageSync('fastData', {
          phone:mydata.memberInfo.tel,
        })
        app.globalData.publish.userPhone = mydata.memberInfo.tel
        }else{
          wx.showModal({
          title:'提示',
          content: mydata.errmsg,
          showCancel: false,
          success:function(){
            let pages = getCurrentPages()
            let prePage = pages[pages.length -2]
            if(prePage){
                wx.navigateBack()
              }else{
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
      }
    })
  },
  initClipboardData: function () {
    let _this = this;
    let u = wx.getStorageSync('userInfo')
    let fastData = wx.getStorageSync('fastData')
    if (u) {
      if (!fastData) {
        _this.getUserInfo()
      } else {
        if (!app.globalData.publish.userPhone) {
          _this.getUserInfo()
        }else{
          console.log(app.globalData.publish.userPhone)
          if (fastData.phone.length != 0) {
            console.log("我采集了数据")
            _this.setData({
              phone:fastData.phone,
              showTel:true
            })
          } else {
            console.log()
            _this.setData({
              phone:app.globalData.publish.userPhone,
              showTel:true
            })
          }
        }
      }
    }
  },
  startRecord: function () {
    restful.startRecord()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initClipboardData()
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
    let pages = getCurrentPages();

    let path = pages[1].__displayReporter.showReferpagepath
    console.log("path", pages)
    path = path.slice(0, -5)
    if (path == "pages/fast/tips/tips" || path == "pages/fast/area/area") {
      this.selectComponent("#issueok").show()
    }
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
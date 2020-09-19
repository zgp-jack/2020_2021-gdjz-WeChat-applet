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
    request:false,
    //对电话输入框填写东西后是否需要匹配
    isRule:true,
    imageUrl: app.globalData.apiImgUrl +"new-publish-title-t-icon.png"
  },
  checkType: function (obj, _type) {
    var _re = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    if (_type == undefined) return _re;
    if (_re == _type) return true;
    return false;
  },
  // 设置缓存保留已填写信息
  setEnterInfo: function (name, data) {
    let regx = /1[3-9]\d{9}/g
    let key = 'jiSuData'
    let jiSuData = wx.getStorageSync(key)
    if (name === "phone") {
      if (regx.test(data)) {
        if (jiSuData) {
          jiSuData[name] = data
        } else {
          jiSuData = {}
          jiSuData[name] = data
        }
      } else {
        if (jiSuData) {
          jiSuData[name] = ""
        }
      }
    } else {
      if (jiSuData) {
        jiSuData[name] = data
      } else {
        jiSuData = {}
        jiSuData[name] = data
      }
    }
    wx.setStorageSync(key, jiSuData)
  },
  enterContent: function (e) {
    // let phone = this.data.phone
    let isRule = this.data.isRule
    let userPhone = app.globalData.publish.userPhone
    let u = wx.getStorageSync('userInfo')
    let val = e.detail.value;
    let jiSuData = wx.getStorageSync('jiSuData')
    this.setData({
      content: val
    })
    let content = val.replace(/\s+/g, "");
    this.setEnterInfo("detail",content)
    let _partten = /1[3-9]\d{9}/g;
    let phone = content.match(_partten);
    if (phone) {
      if (this.checkType(phone, 'array')) {
        let tel = phone[0];
        if (u) {
          if (phone == userPhone) {
            this.setData({
              showTel:false,
              phone:tel
            })
            this.setEnterInfo("phone",tel)
          }else {
            this.setData({
              showTel: true,
              phone:tel
            })
            this.setEnterInfo("phone",tel)
          }
        }else{
          if (isRule) {
            this.setData({
              showTel: true,
              phone:tel
            })
            this.setEnterInfo("phone",tel)
          }else{
            this.setEnterInfo("phone",tel)
          }
        }
      }
    }else{
      if (!u) {
        if (isRule) {
          this.setData({
            phone:""
          })
          this.setEnterInfo("phone","")
        }else{
          this.setEnterInfo("phone","")
        }
      }else{
        this.setEnterInfo("phone","")
      }
    }
  },
  enterPhone: function (e) {
    let value = e.detail.value
    this.setData({
      phone: value,
      isRule:false
    })
    // let _partten = /1[3-9]\d{9}/g;
    // let u = wx.getStorageSync('userInfo')
    // if (!u) {
    //   if(!_partten.test(value)) {
    //     this.setData({
    //       phone:""
    //     })
    //   }
    // }
  },
  publishRecurit: function () {
    let that = this
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
      this.setData({
        showTel:true
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
    if (phone == "18349296434") {
      wx.showModal({
        title: '提示',
        content: '该手机号暂不支持发布招工信息，请重新输入。',
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
            that.setEnterInfo("detail",'')
            that.setEnterInfo("phone",'')
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
            cancelText: "知道了",
            confirmText: "联系客服",
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
    let jiSuData = wx.getStorageSync("jiSuData")
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
      if(mydata.errcode == "ok"){
        let tel = mydata.memberInfo.tel || ''
        app.globalData.publish.userPhone = tel
        if (jiSuData.phone) {
          if(tel == jiSuData.phone){
            _this.setData({
              phone:jiSuData.phone,
              showTel:false
            })
          }else{
            _this.setData({
              phone:jiSuData.phone
            })
          }
        }else{
          _this.setData({
            phone:tel
          })
        }
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
    //获取本地缓存用户信息
    let u = wx.getStorageSync('userInfo')
    //获取本地缓存的快速发布信息
    let jiSuData = wx.getStorageSync('jiSuData')
    //获取globalData中的用户手机号码
    let userPhone = app.globalData.publish.userPhone
    //判断用户是否授权登录
    //如果用户授权
    if (u) {
    //判断是否已经获取到用户信息手机号码
    //如果已经有用户手机号码信息就读取缓存用户手机号信息
      if (userPhone) {
    //判断如果存在jiSuData信息
        if (jiSuData) {
          let content = jiSuData.detail
          let phone = jiSuData.phone
          if (phone) {
            if (userPhone == phone) {
              _this.setData({
                showTel: false,
                phone: phone,
                content: content
              })
            }else{
              _this.setData({
                showTel:true,
                phone:phone,
                content: content
              })
            }
          }else{
            _this.setData({
              showTel: false,
              phone: userPhone,
              content: content
            })
          }
        }else{
          _this.setData({
            showTel: false,
            phone: userPhone,
          })
        }
      }else{
        _this.getUserInfo()
        let userTel = app.globalData.publish.userPhone
        //判断如果存在jiSuData信息
        if (jiSuData) {
          let content = jiSuData.detail
          let phone = jiSuData.phone
          if (phone) {
            if (userPhone == phone) {
              _this.setData({
                showTel: false,
                phone: phone,
                content: content
              })
            }else{
              _this.setData({
                showTel:true,
                phone:phone,
                content: content
              })
            }
          }else{
            _this.setData({
              showTel: false,
              phone: userPhone,
              content: content
            })
          }
        }else{
          _this.setData({
            showTel: false,
            phone: userPhone,
          })
        }
      }
    }else{
    //如果用户没有授权
      if (jiSuData) {
        let content = jiSuData.detail
        let phone = jiSuData.phone
        this.setData({
          content: content || "",
          phone: phone || ""
        })
        if (phone) {
          _this.setData({
            showTel:true
          })
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
    let index = pages.length - 1
    let path = pages[index].__displayReporter.showReferpagepath
    path = path.slice(0, -5)
    if (path == "pages/fast/tips/tips") {
      this.selectComponent("#issueok").show()
    }
    if (path == "pages/fast/area/area") {
      this.selectComponent("#detaintip").show()
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

  },
  onShareTimeline:function () {
    let commonShareTips = app.globalData.commonShareTips;
    let commonShareImg = app.globalData.commonShareImg;
    return {
      title: commonShareTips,
      imageUrl: commonShareImg
    }
  }
})
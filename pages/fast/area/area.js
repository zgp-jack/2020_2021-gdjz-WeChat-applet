const app = getApp();
let areas = require("../../../utils/area");
let area = app.arrDeepCopy(areas.getAreaArr)
area.splice(0,1)
const Amap = require("../../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaId:0,
    //选择具体地理位置信息详细数据
    addressData: {
      //地址大标题
      title: '',
      //经纬度
      location: '',
      adcode: '',
      //详细地理位置信息
      district: ''
    },
    //保存onload传过来的token
    token: '',
    //用户信息
    userInfo:{},
    imageUrl: app.globalData.apiImgUrl +"new-publish-title-t-icon.png"
  },
  mini_user: function(session_key){
    let { token,areaId } = this.data;
    let location = this.data.addressData.location
    let adName = this.data.addressData.title
    let address = this.data.addressData.district
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log("scope.userInfo",res)
        if (!res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            fail: () => {
              wx.openSetting({})
            },
            success: (res) => {
              /**获取encryptdata **/
              that.api_user(session_key,(res) =>{
                let uinfo = res.data;
                if (uinfo.errcode == "ok") {
                  let userInfo = {
                    userId: uinfo.data.id,
                    token: uinfo.data.sign.token,
                    tokenTime: uinfo.data.sign.time,
                  }
                  that.setData({
                    userInfo: userInfo
                  })
                  app.globalData.userInfo = userInfo;
                  wx.setStorageSync('userInfo', userInfo)
                  app.appRequestAction({
                    title: "发布中",
                    mask: true,
                    failTitle: "网络错误，保存失败！",
                    url: "fast-issue/set-area/",
                    way: "POST",
                    params: {
                      token: token,
                      area_id: areaId,
                      location: location,
                      ad_name: adName,
                      address: address
                    },
                    success: function (res) {
                      let mydata = res.data;
                      app.appRequestAction({
                        title: "发布中",
                        mask: true,
                        failTitle: "网络错误，保存失败！",
                        url: "fast-issue/to-job/",
                        way: "POST",
                        params: {
                          token: token,
                        },
                        success:function (res) {
                          if(res.data.errcode == "ok"){
                            wx.redirectTo({
                              url: '/pages/fast/tips/tips?token='+token,
                            })
                          }else{
                            app.showMyTips(mydata.errmsg);
                          }
                        }
                      })
                    }
                  })
                } else {
                  app.showMyTips(uinfo.errmsg);
                }
            })}
          })
        } else {
          /**获取encryptdata **/
          console.log("我打印了2")
          that.api_user(session_key,(res) =>{
            let uinfo = res.data;
            if (uinfo.errcode == "ok") {
              let userInfo = {
                userId: uinfo.data.id,
                token: uinfo.data.sign.token,
                tokenTime: uinfo.data.sign.time,
              }
              that.setData({
                userInfo: userInfo
              })
              app.globalData.userInfo = userInfo;
              wx.setStorageSync('userInfo', userInfo)
              app.appRequestAction({
                title: "发布中",
                mask: true,
                failTitle: "网络错误，保存失败！",
                url: "fast-issue/set-area/",
                way: "POST",
                params: {
                  token: token,
                  area_id: areaId,
                  location: location,
                  ad_name: adName,
                  address: address
                },
                success: function (res) {
                  let mydata = res.data;
                  app.appRequestAction({
                    title: "发布中",
                    mask: true,
                    failTitle: "网络错误，保存失败！",
                    url: "fast-issue/to-job/",
                    way: "POST",
                    params: {
                      token: token,
                    },
                    success:function (res) {
                      if(res.data.errcode == "ok"){
                        wx.redirectTo({
                          url: '/pages/fast/tips/tips?token='+token,
                        })
                      }else{
                        app.showMyTips(mydata.errmsg);
                      }
                    }
                  })
                }
              })
            } else {
              app.showMyTips(uinfo.errmsg);
            }
        })
          //that.api_user(session_key)
        }
      }
    })
  },
  api_user:function(session_key, callback){
    let that = this;
    wx.getUserInfo({
      success: (res) => {
        let encryptedData = res.encryptedData
        let iv = res.iv
        var params = new Object()
        let _source = wx.getStorageSync("_source");

        let fastId = wx.getStorageSync("fastId");
        let fastTel = wx.getStorageSync("fastTel");
        let fastJobId = wx.getStorageSync("fastJobId") ? wx.getStorageSync("fastJobId") : "";
        if (fastId && fastTel) {
          params.fastId = fastId;
          params.phone = fastTel;
        }
        params.fast_job_id = fastJobId;

        params.session_key = session_key
        params.encryptedData = encryptedData
        params.iv = iv
        params.refid = app.globalData.refId
        params.source = _source ? _source : "";
        params.wechat_token = app.globalData.requestToken
        //发起请求  
        wx.request({
          url: app.globalData.apiRequestUrl + '/user/make-user/',
          data: params,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            let uinfo = res.data;
            if (uinfo.errcode == "ok") {
              let userInfo = {
                userId: uinfo.data.id,
                token: uinfo.data.sign.token,
                tokenTime: uinfo.data.sign.time,
              }
              app.getUserUuid(userInfo)
              callback(res)
            }
            // 授权用户执行操作
            wx.hideToast();
          },

        })

      }
    })
  },
  //未登录状态下，确定地址后获取用户信息和授权
  bindGetUserInfo:function (e) {
    let { token,areaId } = this.data;
    let location = this.data.addressData.location
    let adName = this.data.addressData.title
    let address = this.data.addressData.district
    let that = this;
    if (e.detail.userInfo) {
      wx.showToast({
        title: '正在授权',
        icon: 'loading',
        duration: 5000
      });
      app.globalData.userInfo = e.detail.userInfo; //设置用户信息 
      // 登录 获取在我们这里user_id
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发起网络请求
            wx.request({
              url: app.globalData.apiRequestUrl + 'user/user-info/',
              data: {
                code: res.code,
                wechat_token: app.globalData.requestToken
              },
              success: function (resdata) {
                var session_key = resdata.data.session_key
                that.mini_user(session_key)
              },
              fail: function (error) {
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }else{
      app.appRequestAction({
        title: "发布中",
        mask: true,
        failTitle: "网络错误，保存失败！",
        url: "fast-issue/set-area/",
        way: "POST",
        params: { 
          token: token,
          area_id: areaId,
          location: location,
          ad_name: adName,
          address: address
        },
        success: function (res) {
          let mydata = res.data;
          if (mydata.errcode == "ok") {
            wx.redirectTo({
              url: '/pages/fast/tips/tips?token=' + token,
            })
          }else{
            app.showMyTips(mydata.errmsg);
            }}
        })
    }
  },
  //确定地址招工发布
  sureAreaAction:function(e){
      console.log("areaId",this.data.areaId)
      let { token,areaId } = this.data;
      if(!areaId){
        wx.showModal({
          title: '提示',
          content: "请选择招工所在地。",
          showCancel: false
        })
        return
      }
  },
  //点击选择招工发布地址都地址详情界面
  showWorkArea: function () {
    wx.navigateTo({
      url: '/pages/fast/detailarea/detailarea?showfor=showfor&showmap=showmap'
    })
  },
  // 设置缓存保留已填写信息
  setEnterInfo: function (name, data) {
    let key = 'fastData'
    let fastData = wx.getStorageSync(key)
    if (fastData) {
      fastData[name] = data
    } else {
      fastData = {}
      fastData[name] = data
    }
    wx.setStorageSync(key, fastData)
  },
  //点击地址详情页的详细地址设置到fastData缓存数据中
  userSetAreaInfo: function () {
    let val = this.data.addressData
    //调用函数设置缓存
    this.setEnterInfo('area', val)
  },
  //初始化位置信息
  initArea:function () {
  //获取地理定位的位置缓存信息  
    let gpsPorvince = wx.getStorageSync('gpsPorvince')
  //获取区域数组的北京数据
    let defaultPosition = areas.getAreaArr[1]
  //获取缓存的fastData数据
    let fastData = wx.getStorageSync('fastData')
  //判断是否有授权获取地理位置信息，没有则获取默认位置北京
    let position = gpsPorvince?gpsPorvince:defaultPosition
  //生成需要缓存locationHistory数据
    let id = parseInt(position.id) 
    let pid = parseInt(position.pid)
    let name = position.name
    let adName = position.ad_name
    let defaultname = {
      id: id,
      pid: pid,
      name: name,
      ad_name: adName
    }
  //设置到defaultname缓存数据中
    wx.setStorageSync('defaultname', defaultname)
  //调用app中方法设置到locationHistory缓存数据中
    app.setStorageAction(id, defaultname, true)
  //如果缓存fastData中有选择的详细区域信息则将数据存到data的addressData中
  //初始化时将fastData中的城市信息id存入到data中
    if (fastData) {
      if (fastData.area) {
        this.setData({
          addressData: fastData.area,
        })
      }
      if (fastData.defaultname) {
        this.setData({
          areaId: fastData.defaultname.id,
        })
      }
    }
  //如果缓存fastData中有选择过的区域信息则将区域信息压入缓存locationHistory中和缓存defaultname中
    if (fastData.defaultname) {
      wx.setStorageSync('defaultname', fastData.defaultname)//标记
  //生成需要缓存locationHistory数据
      let id = parseInt(fastData.defaultname.id) 
      let pid = parseInt(fastData.defaultname.pid)
      let name = fastData.defaultname.name
      let adName = fastData.defaultname.ad_name
      let defaultname = {
        id: id,
        pid: pid,
        name: name,
        ad_name: adName
      }
  //调用app中方法设置到locationHistory缓存数据中
      app.setStorageAction(id, defaultname, true)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: options.token
    })
    //初始化用户位置信息
    this.initArea()
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
  onShareAppMessage: function () {

  }
})
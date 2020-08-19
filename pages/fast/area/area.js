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
    areaId:"",
    id:0,
    areapicker: [],
    index: [0,0],
    mindex: [0,0],
    addressData: {
      title: '',
      location: '',
      adcode: '',
      district: ''
    },
    token: '',
    userInfo:{},
    imageUrl: app.globalData.apiImgUrl +"new-publish-title-t-icon.png"
  },
  initLocArea:function(){
    //获取手机本地缓存地理位置信息
    let province = wx.getStorageSync('gpsPorvince')
    //获取所有省的信息
    let allProvince = this.getProvinceLists()
    //判断如果有本地缓存地理位置信息
    if(province){
    //本地地理位置信息与所有省份信息相同对应的allProvince的index
    let index = allProvince.findIndex(item => item.id == province.pid)
    //本地地理位置信息具体信息
      let item = allProvince[index]
    //记录本地位置信息到data中
      this.setData({
        id: province.id,
        areatext: item.name + '-' + province.name,
        index:[index,0],
        "mindex[0]":index
      })
      //获取所有城市信息
      let cities = this.getCityLists()
    //从城市列表中匹配与本地位置对应的index
      let ci = cities.findIndex(item=>item.id == province.id)
      this.setData({
        "index[1]": ci,
        "mindex[1]": ci
      })
      let areapicker = [allProvince,cities]
      this.setData({
        areapicker
      })
    }else{
      //获取所有城市信息
      let cities = this.getCityLists()
      let areapicker = [allProvince,cities]
      this.setData({
        areapicker
      })
    }
  },
  initAreaData:function(){
    let _this = this;
    let province = wx.getStorageSync('gpsOrientation')
    if(province){
      this.initLocArea()
    }else{
      amapFun.getRegeo({
        success: function (data) {
          let gpsLocation = {
            province: data[0].regeocodeData.addressComponent.province,
            city: data[0].regeocodeData.addressComponent.city,
            adcode: data[0].regeocodeData.addressComponent.adcode,
            citycode: data[0].regeocodeData.addressComponent.citycode
          }
          areas.getProviceItem(gpsLocation.province, gpsLocation.city)
          _this.initLocArea()
        },
        fail:function(){
          _this.setData({
            id: 0,
            areatext: ""
          })
          _this.initLocArea();
        }
      })
    }
  },
  getProvinceLists:function(){
    let len = area.length
    //省信息数组
    let arr = []
    for(let i = 0;i< len; i++){
      let data = area[i]
      arr.push({id:data.id,pid:data.pid,name:data.name})
    }
    return arr;
  },
  getCityLists:function(){
    //获取省的信息
    let index = this.data.mindex[0]
    let arr = []
    //获取省
    let data = area[index]
    //是否是直辖市
    let has = data.has_children
    if(has){
    //如果不是直辖市
    //市长度
      let len = data.children.length
      for(let i = 1; i< len;i++){
    //获取每一个市的具体信息
        let cdata = data.children[i]
    //市的数据保存到arr
        arr.push({id:cdata.id,pid:cdata.pid,name:cdata.name})
      }
    }else{
    //是直辖市，直接存储直辖市信息
      arr.push({id:data.id,pid:data.pid,name:data.name})
    }
    return arr;
  },
  getAreaText:function(){
    let index = this.data.index
    let areapicker = this.data.areapicker
    let ptext = areapicker[0][index[0]].name
    let ctext = areapicker[1][index[1]].name
    let id = areapicker[1][index[1]].id
    let text = ''
    if(ptext == ctext){
      text = ptext
    }else{
      text = ptext + '-' + ctext
    }
    this.setData({
      areatext: text,
      id:id
    })
  },
  bindMultiPickerColumnChange:function(e){
    let val = e.detail.value
    if(e.detail.column === 0){
      this.setData({
        "mindex[0]": val
      })
      let cities = this.getCityLists();
      let data = this.data.areapicker
      data[1] = cities
      this.setData({
        "areapicker": data
      })
    }
  },
  bindPickerChange:function(e){
    let data = e.detail.value
    let mydata = this.data.areapicker[1]
    let id = mydata[data[1]].id
    this.setData({
      id: id,
      index: data
    })
    this.getAreaText()
  },
  mini_user: function(session_key){
    let { token,id } = this.data;
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
              console.log("我打印了1")
              
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
                      area_id: id
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
                  area_id: id
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
    let { token,id } = this.data;
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
          area_id: id
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
  //招工发布
  sureAreaAction:function(e){
      console.log("areaId",this.data.areaId)
      return
      let { token,id } = this.data;
      if(!id){
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
  //点击地址详情页的详细地址设置当前页面的地址栏的地址信息
  userSetAreaInfo: function () {
    let val = this.data.addressData
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
    let defaultname = gpsPorvince?gpsPorvince:defaultPosition
    wx.setStorageSync('defaultname', defaultname)
    let locationHistory = wx.getStorageSync('locationHistory')
    if (locationHistory) {
      locationHistory.unshift(defaultname)
      wx.setStorageSync('locationHistory', locationHistory)
    } else {
      let locationHistory = []
      locationHistory.unshift(defaultname)
      wx.setStorageSync('locationHistory', locationHistory)
    }
    if (fastData.area) {
      this.setData({
        addressData: fastData.area
      })
    }
    if (fastData.defaultname) {
      wx.setStorageSync('defaultname', fastData.defaultname)//标记
      let locationHistory = wx.getStorageSync('locationHistory')
      if (locationHistory) {
        locationHistory.unshift(fastData.defaultname)
        wx.setStorageSync('locationHistory', locationHistory)
      } else {
        let locationHistory = []
        locationHistory.unshift(fastData.defaultname)
        wx.setStorageSync('locationHistory', locationHistory)
      }
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: options.token
    })
    this.initAreaData()
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
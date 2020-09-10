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
    imageUrl: app.globalData.apiImgUrl +"new-publish-title-t-icon.png",
    // 上传图片的切换按钮
    switch:false,
    // 上传图片的logo
    upload: app.globalData.apiImgUrl + 'mini-new-publish-upload-img.png',
    // 已经上传图片数组
    imgs:[],
    // 工种选择文本
    showClassifyText:"",
    imglen:0,
    maxNum:3
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
    console.log("location detail",areaId,location,adName,address)
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
    let key = 'jiSuData'
    let jiSuData = wx.getStorageSync(key)
    if (jiSuData) {
      jiSuData[name] = data
    } else {
      jiSuData = {}
      jiSuData[name] = data
    }
    wx.setStorageSync(key, jiSuData)
  },
  //点击地址详情页的详细地址设置到jiSuData缓存数据中
  userSetAreaInfo: function () {
    let val = this.data.addressData
    //调用函数设置缓存
    this.setEnterInfo('area', val)
  },
  //初始化位置信息
  initArea:function () {
    let _this = this
  //获取地理定位的位置缓存信息  
    let gpsPorvince = wx.getStorageSync('gpsPorvince')
    let userLocation = wx.getStorageSync('userLocation')
    //获取缓存的jiSuData数据
    let jiSuData = wx.getStorageSync('jiSuData')
    if (!jiSuData || (jiSuData && !jiSuData.area)) {
      if (userLocation) {
        amapFun.getRegeo({
          location: userLocation,
          success: function (data) {
            console.log("positiondata",data)
            _this.setData({
              "addressData.title":data[0].regeocodeData.addressComponent.neighborhood.name,
              "addressData.location":userLocation,
              "addressData.adcode":data[0].regeocodeData.addressComponent.adcode,
              "addressData.district":data[0].regeocodeData.formatted_address,
              areaId:gpsPorvince.id
            })
          },
          fail: function (info) {
            //失败回调
            // that.openSetting(function(){
            //   that.initHistoryCityList();
            // })
          }
        })
      }
    }
  //获取区域数组的北京数据
    let defaultPosition = areas.getAreaArr[1]
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
    if(!jiSuData){
      wx.setStorageSync('defaultname', defaultname)
      app.setStorageAction(id, defaultname, true)
      return false;
    } else {
      if(jiSuData.detail){
        _this.setData({ content:jiSuData.detail })
      }
      if (jiSuData.area) {
        _this.setData({
          addressData: jiSuData.area
        })
      }
      if (jiSuData.defaultname) {
        wx.setStorageSync('defaultname', jiSuData.defaultname)//标记
        //生成需要缓存locationHistory数据
          let id = parseInt(jiSuData.defaultname.id) 
          let pid = parseInt(jiSuData.defaultname.pid)
          let name = jiSuData.defaultname.name
          let adName = jiSuData.defaultname.ad_name
          let defaultname = {
            id: id,
            pid: pid,
            name: name,
            ad_name: adName
          }
        //调用app中方法设置到locationHistory缓存数据中
          app.setStorageAction(id, defaultname, true)
          this.setData({
            areaId: jiSuData.defaultname.id,
          })
        }
      }
  },
  // 点击切换上传图片按钮,并显示或隐藏上传图片区域
  switchClick: function () {
    this.setData({
      switch: !this.data.switch
    })
  },
  // 上传图片到服务器
  uploadImageSever: function (imagesFiles,callback){
    // 上传成功图片数量
    let upLoadCount = 0;
    // 上传失败图片数量
    let failCount = 0;
    // 上传图片成功后的图片地址数组
    let imagesArry = [];
    wx.showToast({
      title: '图片上传中',
      icon: 'loading',
      mask: true
    })
    // 遍历上传的图片本地路径数组
    imagesFiles.forEach((image) => {
      // 校验上传图片文件格式
      let res = app.valiImgRules(image.path)
      // 如果图片格式正确
      if (res) {
        // 调用上传图片接口
        wx.uploadFile({
          filePath: image.path,
          name: 'file',
          url: app.globalData.apiUploadImg,
          success: function (res){
            // 服务器返回数据
            let mydata = JSON.parse(res.data);
            // 如果上传成功
            if (mydata.errcode === "ok") {
              // 上传图片成功计数
              upLoadCount += 1;
              // 将服务器返回的数据保存到imagesArry
              imagesArry.push({
                httpurl: mydata.httpurl,
                url: mydata.url
              })
              callback(upLoadCount,imagesArry,failCount)
            }else{
              // 上传图片失败计数
              upLoadCount += 1
              failCount += 1
              callback(upLoadCount,imagesArry,failCount)
            }
          },
          fail: function () {
            // 上传图片失败计数
            upLoadCount += 1
            failCount += 1
            callback(upLoadCount,imagesArry,failCount)
          }
        })
      }else{
        // 上传图片格式不对计数
        upLoadCount += 1
        failCount += 1
        callback(upLoadCount,imagesArry,failCount)
      }
    })
  },
  // 点击上传图片按钮上传图片
  userUploadImg: function (num) {
    let that = this;
    // 上传图片加载loading
    wx.showLoading({
      title: '正在上传图片',
    })
    // 选择上传图片
    wx.chooseImage({
      // 上传图片数量
      count: num || 0,
      // 压缩
      sizeType: ['compressed'],
      // 从相册选择还是拍照
      sourceType: ['album', 'camera'],
      // 上传成功回调
      success: function (res){
        if (res.errMsg === "chooseImage:ok") {
          // 上传图片到服务器（res.tempFiles本地图片路径）
          that.uploadImageSever(res.tempFiles,function (upLoadCount,imagesArry,failCount) {
            // 图片全部上传完成隐藏上传loading效果
          if (res.tempFiles.length === upLoadCount) {
            wx.hideToast();
            wx.hideLoading();
            that.setData({
              imgs:imagesArry
            })
            // 如果有上传失败图片给出对应提示
            if (failCount) {
              wx.showModal({
                title: '提示',
                content: `有${failCount}图片上传失败，请重新上传`,
                showCancel: false,
              })
            }
          }
          })
        }
      },
      fail: function (){
        // 图片上传失败提示
        app.showMyTips('图片上传失败，请重新上传')
        // 隐藏loading
        wx.hideLoading()
      }
    })
  },
  // 点击所需工种显示工种选择
  showWorkTypePicker: function () {
    //用户在点击一次工种选择框后，便不再自动匹配详情内容
    app.globalData.isRuleClass = true
    // 避免用户选择之后取消，所以对数据进行一次备份
    this.setData({
      // rchildClassifies: JSON.parse(JSON.stringify(this.data.childClassifies)),
      // rrulesClassifyids: JSON.parse(JSON.stringify(this.data.rulesClassifyids)),
      // ruserClassifyids: JSON.parse(JSON.stringify(this.data.userClassifyids)),
      // rclassifies: JSON.parse(JSON.stringify(this.data.classifies)),
      // rpindex: this.data.pindex,
      showPicker: true,
    })
  },
  // 点击取消关闭工种选择
  cancelWorkTypePicker: function () {
    this.setData({
      showPicker: false,
      // pindex: this.data.rpindex,
      // userClassifyids: JSON.parse(JSON.stringify(this.data.ruserClassifyids)),
      // rulesClassifyids: JSON.parse(JSON.stringify(this.data.rrulesClassifyids)),
      // childClassifies: JSON.parse(JSON.stringify(this.data.rchildClassifies)),
      // classifies: JSON.parse(JSON.stringify(this.data.rclassifies)),
    })
    // this.getWorkText()
  },
  // 点击工种选择确定按钮
  sureWorkTypePicker: function () {
    this.setData({
      showPicker: false
    })
    // this.getWorkText()
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
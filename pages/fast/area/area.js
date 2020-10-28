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
    //一次最多可以选取9张
    maxNum:3,
    // 最大图片数量
    maxImgNum: 0,
    // 最大工种数量
    maxWorkNum: 0,
    // 不匹配库
    notMateData: [],
    // 匹配库
    mateData: [],
    // 工种字段
    classifies: [],
    // 选择一级工种index
    pindex: 0,
    // 子类工种数据
    childClassifies:[],
    // 根据详情匹配的工种数据
    rulesClassifyids: [],
    // 用户选择的工种数据
    userClassifyids: [],
    // 所需工种显示的工种文本信息
    showClassifyText: "",
    // 选择或者匹配的工种id数组
    selectedClassifies: [],
    rrulesClassifyids: [], // 备份
    ruserClassifyids: [], // 备份
    rchildClassifies: [], // 备份
    rclassifies: [], //备份
  },
  mini_user: function(session_key){
    let swithStatus = this.data.switch
    let { token,areaId } = this.data;
    let location = this.data.addressData.location
    let adName = this.data.addressData.title
    let address = this.data.addressData.district
    let trades = this.data.selectedClassifies.join(",");
    let imagsArry = []
    if (swithStatus) {
      this.data.imgs.forEach(function (item,index) {
        imagsArry.push(item.url)
      })
    }
    let imags = imagsArry.join(",")
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
                    url: "fast-issue/complete/",
                    way: "POST",
                    params: {
                      token: token,
                      area_id: areaId,
                      location: location,
                      ad_name: adName,
                      address: address,
                      trades: trades,
                      images: imags
                    },
                    success: function (res) {
                      //发布成功后，清除缓存数据中的detail、rulesClassifyids、userClassifyids、imgs
                      let jiSuData = wx.getStorageSync('jiSuData')
                      if (jiSuData) {
                        jiSuData.detail = ''
                        jiSuData.rulesClassifyids = []
                        jiSuData.userClassifyids = []
                        jiSuData.imgs = []
                        jiSuData.phone = ''
                        wx.setStorageSync('jiSuData', jiSuData)
                      }
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
                            let tip_data = JSON.stringify(res.data.data)
                            wx.reLaunch({
                              url: '../../published/recruit/list?tip_data='+tip_data,
                            })
                          }else{
                            app.showMyTips(mydata.errmsg);
                          }
                        }
                      })
                    }
                  })
                } else if (uinfo.errcode == "member_shielding") {
                  wx.showModal({
                    content: uinfo.errmsg,
                    cancelText: "知道了",
                    confirmText: "联系客服",
                    success: function (res) {
                      if (res.confirm) {
                        wx.makePhoneCall({
                          phoneNumber: uinfo.service_tel,
                        })
                      }
                    }
                  })
                }else {
                  app.showMyTips(uinfo.errmsg);
                }
            })}
          })
        } else {
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
                url: "fast-issue/complete/",
                way: "POST",
                params: {
                  token: token,
                  area_id: areaId,
                  location: location,
                  ad_name: adName,
                  address: address,
                  trades: trades,
                  images: imags
                },
                success: function (res) {
                  //发布成功后，清除缓存数据中的detail、rulesClassifyids、userClassifyids、imgs
                  let jiSuData = wx.getStorageSync('jiSuData')
                  if (jiSuData) {
                    jiSuData.detail = ''
                    jiSuData.rulesClassifyids = []
                    jiSuData.userClassifyids = []
                    jiSuData.imgs = []
                    jiSuData.phone = ''
                    wx.setStorageSync('jiSuData', jiSuData)
                  }
                  let mydata = res.data;
                  if(res.data.errcode !== 'discard'){//判断是否已经审核失败
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
                          // wx.redirectTo({
                          //   url: '/pages/fast/tips/tips?token='+token,
                          // })
                          //已授权 登陆跳转
                          let tip_data = JSON.stringify(res.data.data)
                          wx.reLaunch({
                            url: '../../published/recruit/list?tip_data='+tip_data,
                          })
                        }else{
                          app.showMyTips(mydata.errmsg);
                        }
                      }
                    })
                  }else {
                    wx.showModal({
                      title:'提示',
                      showCancel:false,
                      content:mydata.errmsg,
                      success(e){
                        if(e.confirm){
                          wx.reLaunch({
                            url: '../../published/recruit/list',
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else if (uinfo.errcode == "member_shielding") {
              wx.showModal({
                content: uinfo.errmsg,
                cancelText: "知道了",
                confirmText: "联系客服",
                success: function (res) {
                  if (res.confirm) {
                    wx.makePhoneCall({
                      phoneNumber: uinfo.service_tel,
                    })
                  }
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
            } else if (uinfo.errcode == "member_shielding") {
              wx.showModal({
                content: uinfo.errmsg,
                cancelText: "知道了",
                confirmText: "联系客服",
                success: function (res) {
                  if (res.confirm) {
                    wx.makePhoneCall({
                      phoneNumber: uinfo.service_tel,
                    })
                  }
                }
              })
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
    let switchStatus = this.data.switch;
    let { token,areaId } = this.data;
    let location = this.data.addressData.location;
    let adName = this.data.addressData.title;
    let address = this.data.addressData.district;
    let trades = this.data.selectedClassifies.join(",");
    let imagsArry = []
    if (switchStatus) {
      this.data.imgs.forEach(function (item) {
        imagsArry.push(item.url)
      })
    }
    let imags = imagsArry.join(",")
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
        },
      })
    }else{
      app.appRequestAction({
        title: "发布中",
        mask: true,
        failTitle: "网络错误，保存失败！",
        url: "fast-issue/complete/",
        way: "POST",
        params: { 
          token: token,
          area_id: areaId,
          location: location,
          ad_name: adName,
          address: address,
          trades: trades,
          images: imags
        },
        success: function (res) {
          let mydata = res.data;
          if (mydata.errcode == "ok") {
            wx.redirectTo({
              url: '/pages/fast/tips/tips?token=' + token+'&id='+that.data.thisDataId,
            })
            //发布成功后，清除缓存数据中的detail、rulesClassifyids、userClassifyids、imgs、phone
            let jiSuData = wx.getStorageSync('jiSuData')
            if (jiSuData) {
              jiSuData.detail = ''
              jiSuData.rulesClassifyids = []
              jiSuData.userClassifyids = []
              jiSuData.imgs = []
              jiSuData.phone = ''
              wx.setStorageSync('jiSuData', jiSuData)
            }
            //发布成功更新活跃状态
            app.activeRefresh()
          }else{
            app.showMyTips(mydata.errmsg);
            }}
        })
    }
  },
  //确定地址招工发布
  sureAreaAction:function(){
      let { areaId } = this.data;
      let userClassifyids = this.data.userClassifyids;
      let rulesClassifyids = this.data.rulesClassifyids;
      if (!areaId) {
        wx.showModal({
          title: '提示',
          content: "请选择招工城市。",
          showCancel: false
        })
        return false
      }
      let works = [...userClassifyids, ...rulesClassifyids]
      works.splice(5)
      if (!works.length) {
        wx.showModal({
          title: '提示',
          content: '请选择工种。',
          showCancel: false
        })
        return false
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
            let title = Array.isArray(data[0].regeocodeData.addressComponent.neighborhood.name)?data[0].desc:data[0].regeocodeData.addressComponent.neighborhood.name;
            _this.setData({
              "addressData.title":title,
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
    wx.setStorageSync('defaultname', defaultname)
    if(!jiSuData){
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
    // 上传图片数量
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
              // 上传图片计数
              upLoadCount += 1;
              // 将服务器返回的数据保存到imagesArry
              imagesArry.push({
                httpurl: mydata.httpurl,
                url: mydata.url
              })
              callback(upLoadCount,imagesArry,failCount)
            }else{
              // 上传图片计数
              upLoadCount += 1
              failCount += 1
              callback(upLoadCount,imagesArry,failCount)
            }
          },
          fail: function () {
            // 上传图片计数
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
  // 点击图片查看大图
  previewImage: function (e) {
    // 点击图片url
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, 
      urls: [url] 
    })
  },   
  // 点击上传图片
  userUploadImg: function () {
    let num = this.data.maxNum - this.data.imglen
    this.multiImageUpload(num)
  },
  // 点击上传图片按钮上传图片
  multiImageUpload: function (num) {
    let that = this;
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
            let imgs = [...that.data.imgs, ...imagesArry]
            that.setData({
              imgs:imgs,
              imglen: imgs.length
            })
            that.setEnterInfo('imgs', imgs)
            // 如果有上传失败图片给出对应提示
            if (failCount) {
              wx.showModal({
                title: '提示',
                content: `有${failCount}张图片上传失败，请重新上传`,
                showCancel: false,
              })
            }
          }
          })
        }
      }
    })
  },
  // 删除图片
  delImgAction: function (e) {
    let i = e.currentTarget.dataset.index
    let imgs = this.data.imgs
    imgs.splice(i, 1)
    this.setData({
      imgs: imgs,
      imglen: imgs.length
    })
    this.setEnterInfo('imgs', imgs)
  },
  // 点击所需工种显示工种选择
  showWorkTypePicker: function () {
    // 避免用户选择之后取消，所以对数据进行一次备份
    this.setData({
      rchildClassifies: JSON.parse(JSON.stringify(this.data.childClassifies)),
      rrulesClassifyids: JSON.parse(JSON.stringify(this.data.rulesClassifyids)),
      ruserClassifyids: JSON.parse(JSON.stringify(this.data.userClassifyids)),
      rclassifies: JSON.parse(JSON.stringify(this.data.classifies)),
      rpindex: this.data.pindex,
      showPicker: true,
    })
  },
  // 点击取消关闭工种选择
  cancelWorkTypePicker: function () {
    this.setData({
      showPicker: false,
      pindex: this.data.rpindex,
      userClassifyids: JSON.parse(JSON.stringify(this.data.ruserClassifyids)),
      rulesClassifyids: JSON.parse(JSON.stringify(this.data.rrulesClassifyids)),
      childClassifies: JSON.parse(JSON.stringify(this.data.rchildClassifies)),
      classifies: JSON.parse(JSON.stringify(this.data.rclassifies)),
    })
    this.getWorkText()
  },
  // 点击工种选择确定按钮
  sureWorkTypePicker: function () {
    this.setData({
      showPicker: false
    })
    this.getWorkText()
  },
  // 初始化获取工种数据
  initWorkType: function () {
    return new Promise((resolve, reject) => {
      // 获取缓存用户信息
      let u = wx.getStorageSync('userInfo')
      this.setData({
        userInfo: u ? u : false
      })
      // 发送请求数据
      let postData = {
        ...u,
        type: 'job'
      }
      // 获取匹配库信息请求
      app.appRequestAction({
        url: "publish/new-mate-job/",
        way: 'POST',
        mask: true,
        params: postData,
        success: function (res) {
          let mydata = res.data
          if (mydata.errcode === "ok") {
            resolve(mydata)
          }else{
            reject(mydata)
          }
        }
      })
    })
  },
  // 初始化加载工种数据
  initWorkTypeData: function () {
    this.initWorkType().then(resolve => {
      // 最大图片数量
      let maxImgNum = resolve.typeTextArr.maxImageCount;
      // 最大工种数量
      let maxWorkNum = resolve.typeTextArr.maxClassifyCount;
      // 不匹配库
      let notMateData = resolve.not_mate_data;
      // 匹配库
      let mateData = resolve.mate_data;
      // 工种字段
      let classifies = resolve.classifyTree;
      // 返回的数据对象
      let mateDatas = {maxImgNum,maxWorkNum,notMateData,mateData,classifies}
      // 保存到data中
      this.setData({  maxImgNum ,maxWorkNum ,notMateData ,mateData ,classifies,})
      this.initChildWorkType()
      return mateDatas
    },reason => {
      wx.showModal({
        title: '提示',
        content: reason.errmsg,
        showCancel: false,
        success: function () {
          let pages = getCurrentPages()
          let prePage = pages[pages.length - 2]
          if (prePage) {
            wx.navigateBack()
          } else {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        }
      })
    }).then(resolve => {
      this.mateClassifyIdsFun(resolve)
    })
  },
  // 初始化子类工种信息和选中状态
  initChildWorkType: function () {
    // 父级工种index
    let index = this.data.pindex;
    // 匹配工种字段
    let rids = this.data.rulesClassifyids;
    // 用户选择工种字段
    let uids = this.data.userClassifyids;
    // 获取父级工种对应的子类工种信息
    let data = JSON.parse(JSON.stringify(this.data.classifies[index].children))
    // 循环遍历子类工种数据与自动匹配和选择工种数据进行对比相同就将对应工种数据变成选中状态
    for (let i = 0; i < data.length; i++) {
      if (rids.findIndex(item => item.id == data[i].id) !== -1) {
        data[i].checked = true
      } else {
        if (uids.findIndex(item => item.id == data[i].id) !== -1) {
          data[i].checked = true
        } else {
          data[i].checked = false
        }
      }
    }
    // 设置父类对应子类工种数据
    this.setData({
      childClassifies: data
    })
  },
  // 选择一级工种信息
  userCheckPindex: function (e) {
    // 一级工种index
    let index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      pindex: index
    })
    // 初始化子类工种信息
    this.initChildWorkType()
  },
  // 用户选择工种
  userCheckWorkType: function (e) {
    // 获取最大工种数量
    let num = this.data.maxWorkNum
    // 选择工种id
    let id = e.currentTarget.dataset.id
    // 工种选择状态
    let checked = e.currentTarget.dataset.checked
    // 工种名称
    let name = e.currentTarget.dataset.name
    // 已经匹配的工种数据
    let rulesClassifyids = this.data.rulesClassifyids
    // 已经选择的工种数据
    let userClassifyids = this.data.userClassifyids
    // 全部工种数据
    let data = JSON.parse(JSON.stringify(this.data.classifies))
    // 选择的父类工种index
    let pindex = this.data.pindex
    // 如果是选中状态
    if (checked) {
      // 匹配的工种找到对应的工种然后删除并将对应的选中数量减1
      let ri = rulesClassifyids.findIndex(item => item.id == id)
      if (ri !== -1) {
        rulesClassifyids.splice(ri, 1)
        data[pindex].num = data[pindex].num - 1
      } else {
       // 选择的工种找到对应的工种然后删除并将对应的选中数量减1
        let ui = userClassifyids.findIndex(item => item.id == id)
        userClassifyids.splice(ui, 1)
        data[pindex].num = data[pindex].num - 1
      }
      // 重新设置选择工种数据
      this.setData({
        classifies: data
      })
    } else {
      // 从未选中状态到选中状态
      // 检查选择工种数量
      let len = rulesClassifyids.length + userClassifyids.length
      // 大于规定数量给出提示
      if (len >= num) {
        app.showMyTips('工种最多可以选择' + num + '个')
        return false
      }
      // 没有超过要求数量添加到用户选择工种数组中
      userClassifyids.push({
        id: id,
        name: name
      })
      // 找到选择工种对应的一级工种的num加1
      let cnum = data[pindex].num || 0
      data[pindex].num = cnum + 1
      // 重新设置选择的工种数据和所有工种数据
      this.setData({
        userClassifyids: userClassifyids,
        classifies: data
      })
    }
    // 将选择的工种数据与匹配的工种数据存入缓存
    this.setEnterInfo('userClassifyids', userClassifyids)
    this.setEnterInfo('rulesClassifyids', rulesClassifyids)
    // 初始化子类工种的数据与选中状态
    this.initChildWorkType()
  },
  // 根据详情匹配工种
  mateClassifyIdsFun: function (resolve) {
    wx.showLoading({
      title: '匹配中',
      icon: 'none',
      mask: true
    })
    let jiSuData = wx.getStorageSync('jiSuData')
    if (jiSuData.imgs) {
      this.setData({
        imgs: jiSuData.imgs,
        imglen: jiSuData.imgs.length,
        switch: jiSuData.imgs.length ? true : false
      })
    }
    this.setData({
      userClassifyids: jiSuData.userClassifyids || [],
      rulesClassifyids: jiSuData.rulesClassifyids || [],
    })
    //用户根据所需工作自行选择工种
    let uids = JSON.parse(JSON.stringify(this.data.userClassifyids))
    //获取招工详情的内容
    let content = wx.getStorageSync('jiSuData').detail
    //所需工种最大选择数
    let maxWorkNum = resolve.maxWorkNum
    //不匹配的数据
    let notRules = resolve.notMateData;
    //不匹配数据长度
    let notLen = notRules.length;
    //获取data中匹配数据
    let needRules = resolve.mateData;
    //匹配数据长度
    let needLen = needRules.length;
    // 不需要的数据
    let notArr = [];
    // 需要的数据
    let needArr = [];
    // 如果没有详情内容直接返回
    if (!content) {
      this.countWorkNum()
      this.initChildWorkType()
      this.getWorkText()
      wx.hideLoading()
      return false;
    }
    // 不需要匹配的关键词
    for (let i = 0; i < notLen; i++) {
      if (content.indexOf(notRules[i].keywords) !== -1) {
        let id = notRules[i].occupation_id;
        if (notArr.findIndex(item => item.id == id) == -1) {
          notArr.push({
            id: id,
            name: notRules[i].name
          })
        }
      }
    }
    // 匹配关键词并且该关键词没有匹配过放入匹配数组中
    for (let i = 0; i < needLen; i++) {
      if (content.indexOf(needRules[i].keywords) !== -1) {
        let id = needRules[i].occupation_id;
        if (needArr.findIndex(item => item.id == id) == -1) {
          needArr.push({
            id: id,
            name: needRules[i].name
          })
        }
      }
    }
    // 过滤不匹配关键词将不匹配的关键词从匹配到的关键词删除
    for (let i = 0; i < notArr.length; i++) {
      let id = notArr[i].id;
      let index = needArr.findIndex(item => item.id == id)
      if (index !== -1) {
        needArr.splice(index, 1)
        }
      }
    // 如果用户选择的工种等于规定最大长度将匹配的数据置空
    // 否则将匹配的数据长度等于总长度减去用户选择的长度
    let uidsLen = uids.length
    if(uidsLen >= maxWorkNum){
      this.setData({
        rulesClassifyids: []
      })
    }else{
      let needLen = maxWorkNum - uidsLen
      needArr.splice(needLen)
      this.setData({
        rulesClassifyids: needArr
      })  
      this.setEnterInfo('rulesClassifyids',needArr)
    }
    this.countWorkNum()
    this.initChildWorkType()
    this.getWorkText()
    wx.hideLoading()
  },
  // 匹配的工种数量
  countWorkNum: function () {
    //根据详情匹配工种字段
    let rulesClassifyids = JSON.parse(JSON.stringify(this.data.rulesClassifyids))
    //用户选择工种字段
    let userClassifyids = JSON.parse(JSON.stringify(this.data.userClassifyids))
    //匹配工种字段与用户选择工种字段组成一个数组
    rulesClassifyids = [...rulesClassifyids, ...userClassifyids]
    //返回所有工种字段id数组
    rulesClassifyids = rulesClassifyids.map(item => item.id)
    //rulesClassifyids数组长度
    let ruleLen = rulesClassifyids.length
    let classifyids = this.data.classifies
    //所有工种数组长度
    let len = classifyids.length
    //如果既没有选择工种也没有匹配工种那么就将num置为0
    if (!ruleLen) {
      classifyids.forEach(function(item){
        if (item.num) {
          item.num = 0
        }
      })
    }
    //记录选择或者详情匹配工种的数量
    for (let i = 0; i < len; i++) {
      let data = classifyids[i].children
      let inum = 0
      for(let j = 0;j<data.length;j++){
        let has = rulesClassifyids.indexOf(data[j].id)
        if(has !== -1){
          inum++
        }
        classifyids[i].num = inum
      }
    }
    this.setData({
      classifies: classifyids
    })
  },
  // 所需工种显示工种文本信息
  getWorkText: function () {
    let list = this.data.userClassifyids.concat(this.data.rulesClassifyids)
    //记录选中工种的id并存入this.data.selectedClassifies中
    let selectWorkType = list.map(function (item,index) {
      return item.id
    })
    // 获取数组的前5个
    list.splice(5)
    // 获取工种名称数组
    list = list.map(item => item.name)
    this.setData({
      // 拼接工种字符串与
      showClassifyText: list.join(','),
      selectedClassifies: selectWorkType
    })
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
    // 初始化工种信息
    this.initWorkTypeData()

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
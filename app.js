const tmplId = require("./utils/temp_ids.js");
App({

  onLaunch: function (e) {

  },
  globalData: {
    joingroup: false,
    copywechat: '',
    notice:[],
    member_less_info:{},
    callphone: '',
    procity: 0,
    version: "1.0.7",
    complaincontent: '投诉内容不能少于5个字，必须含有汉字',
    areaIs: false,
    topshow: false,
    isauthuuid: false,
    previewboss: true,
    collectstatus: true,
    praisestatus: true,
    authcode: false,
    gpsdetail: true,
    previewshou: true,
    previewpre: true,
    previewproject: true,
    previewskill: true,
    allexpress: true,
    allskill: true,
    skip: false,
    perfection: false,
    showperfection: false,
    showdetail: false,
    requestToken: "jizhao",
    unitid: "adunit-80f40e8b4f60c3f6",
    serverPhone: "400-838-1888",
    userInfo: null,
    refId: "",
    fixedGetIntegral: "http://cdn.yupao.com/miniprogram/images/fixed-getintegr6al.png?t=" + new Date().getTime(),
    fixedDownApp: "http://cdn.yupao.com/miniprogram/images/fixed-downloadapp.png?t=" + new Date().getTime(),
    fixedPublishImg: "http://cdn.yupao.com/miniprogram/images/fixed-publishrecruit.png?t=" + new Date().getTime(),
    commonShareImg: "http://cdn.yupao.com/miniprogram/images/minishare.png?t=" + new Date().getTime(),
    commonDownloadApp: "http://cdn.yupao.com/miniprogram/images/download.png?t=" + new Date().getTime(),
    commonJixieAd: "http://cdn.yupao.com/miniprogram/images/list-ad-newjixie.png?t=" + new Date().getTime(),
    // apiRequestUrl: "http://miniapi.kkbbi.com/",
    apiRequestUrl: "https://miniapi.zhaogong.vrtbbs.com/",
    // apiRequestUrl: "https://newyupaomini.54xiaoshuo.com/",
    // apiRequestUrl: "https://miniapi.zhaogong.vrtbbs.com/",
    // apiRequestUrl: "https://newyupaomini.54xiaoshuo.com/",
    apiUploadImg: "https://newyupaomini.54xiaoshuo.com/index/upload/",
    apiUploadImgphoto: "https://newyupaomini.54xiaoshuo.com/index/authid-card/",
    apiImgUrl: "http://cdn.yupao.com/miniprogram/images/",
    commonShareTips: "全国建筑工地招工平台",
    isFirstLoading: true,
    inviteSource: "712790d9629c6dcea00e3f5bff60132b",
    allTypes: false,
    userTimes: 1,
    userShareData: {
      today: "",
      tomorrow: ""
    },
    //验证用户
    appNetTime: parseInt(new Date().getTime() / 1000),
    userGapTime: 0,
    //第一次进入 引导添加到我的小程序
    firstJoin: true,
    showFastIssue: {
      show: 0,
      request: false
    },
    gdApiKey: "20f12aae660c04de86f993d3eff590a0",
    areaDataNum: 1,
    hotAreaData: {
      data: [],
      use: false
    },
    firstSaveUserLoginLog: false,
    userSeeVideoTimes: {
      ok: false,
      times: 0
    },
    userSeeVideoTips: '抱歉，您今日领取次数已达上限，休息一下明天再来吧。',
    //极速发布与快速发布方式快。速发布（fast_add_job）普通发布（ordinary_add_job）发布方式请求次数，只需请求一次
    publish: {
      loginBefore: false,
      loginAfter: false,
      logoutWay: "",
      loginWay: "",
      userPhone: ""
    },
    //极速发布点击所需工种后是否根据招工详情自动匹配，点击所属工种后不再匹配
    isRuleClass: false,
    //首次从未授权状态到授权状态读取用户信息的手机号
    isRedPhone: true,
    fastToken: "",
    //找活显示内容
    publishFindWork:{
      resumeText:"",
      loginBefore: false,
      loginAfter: false,
      logoutWay: "",
      loginWay: "",
    },
    getNotice:{
      loginBefore:false,
      loginAfter:false
    },
    // 是否当前第一次刷新找活名片 0 否 1 是
    dayFirstRefresh: 0,
    municipality: [{id:'2',name:'北京'},{id:'25',name:'上海'},{id:'27',name:'天津'},{id:'32',name:'重庆'}],//快速发布找活名片直辖市
    exists:'',//是否有找活名片
  },
  //是否为极速发布与快速发布请求,快速发布与极速发布跳转
  initJobView: function () {
    let userInfo = wx.getStorageSync("userInfo");
    let that = this
    if (userInfo) {
      console.log("login")
      let flag = JSON.parse(JSON.stringify(that.globalData.publish))
      if (!flag.loginAfter) {
        that.appRequestAction({
          url: 'index/get-job-view/',
          success(res) {
            let publishMethod = res.data.add_job_type
            that.globalData.publish.loginWay = publishMethod
            that.globalData.publish.loginAfter = true
            let url = publishMethod == "fast_add_job" ? '/pages/fast/issue/index' : '/pages/issue/index/index'
            wx.navigateTo({
              url: url
            })
          },
          fail: function () {
            wx.navigateTo({
              url: '/pages/issue/index/index'
            })
          }
        })
      } else {
        let way = that.globalData.publish.loginWay
        let url = way == "fast_add_job" ? '/pages/fast/issue/index' : '/pages/issue/index/index'
        wx.navigateTo({
          url: url
        })
      }
    } else {
      console.log("loginout")
      let flag = JSON.parse(JSON.stringify(that.globalData.publish))
      if (!flag.loginBefore) {
        that.appRequestAction({
          url: 'index/get-job-view/',
          success(res) {
            let publishMethod = res.data.add_job_type
            that.globalData.publish.logoutWay = publishMethod
            that.globalData.publish.loginBefore = true
            let url = publishMethod == "fast_add_job" ? '/pages/fast/issue/index' : '/pages/issue/index/index'
            wx.navigateTo({
              url: url
            })
          },
          fail: function () {
            wx.navigateTo({
              url: '/pages/issue/index/index'
            })
          }
        })
      } else {
        let way = this.globalData.publish.logoutWay
        let url = way == "fast_add_job" ? '/pages/fast/issue/index' : '/pages/issue/index/index'
        wx.navigateTo({
          url: url
        })
      }
    }
  },
  initUserInfo: function (e) {
    let tpage = e.path;

    //不需要校验的路由名单
    let pages = ["pages/index/index", "pages/fast-issue/index/index"];
    let rs = pages.join("|");
    let re = new RegExp("^(" + rs + ")(.*?)");
    let isIndex = (tpage.match(re) != null);
    let userInfo = wx.getStorageSync("userInfo");


    if (!userInfo) {
      if (!isIndex) {
        wx.showModal({
          title: '温馨提示',
          content: '系统检测到您并未登录，您需要登录后才能继续操作',
          showCancel: false,
          success: function (e) {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        })
      }
    }
  },
  getUserShareJson: function () {
    let userInfo = wx.getStorageSync("userInfo");
    let _path = userInfo ? '/pages/index/index?refid=' + userInfo.userId + "&source=" + this.globalData.inviteSource : '/pages/index/index';
    let _json = {
      title: this.globalData.commonShareTips,
      path: _path,
      imageUrl: this.globalData.commonShareImg,
    }
    return _json;
  },
  stopThisAction: function () {
    return false;
  },

  initSystemInfo: function (callback) {
    wx.getSystemInfo({
      success: function (res) {
        callback(res);
      },
      fail: function (res) {
        callback(false);
      }
    })
  },
  doRequestAction: function (_options) {
    let userUuid = wx.getStorageSync("userUuid");
    let userInfo = wx.getStorageSync("userInfo")
    userUuid = userUuid ? userUuid : ""
    if (_options.hasOwnProperty("params")) {
      _options.params.wechat_token = this.globalData.requestToken;
    } else {
      _options.params = {
        wechat_token: this.globalData.requestToken
      }
    }
    let header = {
      uuid: userUuid,
      'content-type': 'application/x-www-form-urlencoded',
      version: this.globalData.version
    }
    if (userInfo) {
      header.mid = userInfo.userId,
        header.token = userInfo.token,
        header.time = userInfo.tokenTime
    }

    let _this = this;
    wx.request({
      method: _options.hasOwnProperty("way") ? _options.way : 'GET',
      url: _options.hasOwnProperty("url") ? (_this.globalData.apiRequestUrl + _options.url) : _this.globalData.apiRequestUrl,
      data: _options.hasOwnProperty("params") ? _options.params : {},
      header: header,
      success(res) {
        if (res.statusCode == 200 || res.statusCode == 304) {
          if (res.data.errcode == "member_shielding") {
            wx.showModal({
              content: res.data.errmsg,
              cancelText: "知道了",
              confirmText: "联系客服",
              success: function (result) {
                if (result.confirm) {
                  wx.makePhoneCall({
                    phoneNumber: res.data.service_tel,
                  })
                }
              }
            })
            wx.hideLoading();
          }else{
            _options.hasOwnProperty("success") ? _options.success(res) : "";
          }
        } else {
          _options.hasOwnProperty("fail") ? _options.fail(res) : "";
        }
      },
      fail(err) {
        _options.hasOwnProperty("fail") ? _options.fail(err) : "";
      }
    })
  },
  appRequestAction: function (_options) {
    let userUuid = wx.getStorageSync("userUuid");
    let userInfo = wx.getStorageSync("userInfo")
    userUuid = userUuid ? userUuid : ""
    if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
      wx.showLoading({
        title: _options.hasOwnProperty("title") ? _options.title : '数据加载中',
        mask: _options.hasOwnProperty("mask") ? _options.mask : false
      })
    }

    if (_options.hasOwnProperty("params")) {
      _options.params.wechat_token = this.globalData.requestToken;
    } else {
      _options.params = {
        wechat_token: this.globalData.requestToken
      }
    }
    let header = {
      uuid: userUuid,
      'content-type': 'application/x-www-form-urlencoded',
      version: this.globalData.version
    }
    if (_options.hasOwnProperty("header")) {
      header = {
        ...header,
        ..._options.header
      }
    }

    if (userInfo) {
      header.mid = userInfo.userId,
        header.token = userInfo.token,
        header.time = userInfo.tokenTime
    }

    let _this = this;

    let url = _options.hasOwnProperty("url") ?  _this.globalData.apiRequestUrl +_options.url : _this.globalData.apiRequestUrl

    // let url = _options.url;

    wx.request({
      method: _options.hasOwnProperty("way") ? _options.way : 'GET',
      url: url,
      data: _options.hasOwnProperty("params") ? _options.params : {},
      header: header,
      success: function (res) {
        if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
          wx.hideLoading();
        }
        if (res.statusCode == 200 || res.statusCode == 304) {
          if (res.data.errcode == "member_shielding") {
            wx.showModal({
              content: res.data.errmsg,
              cancelText: "知道了",
              confirmText: "联系客服",
              success: function (result) {
                if (result.confirm) {
                  wx.makePhoneCall({
                    phoneNumber: res.data.service_tel,
                  })
                }
              }
            })
          } else {
            _options.hasOwnProperty("success") ? _options.success(res) : "";
          } 
        } else {
          if (_options.hasOwnProperty("fail")) {
            _options.fail(res)
          } else {
            let _title = _options.hasOwnProperty("failTitle") ? _options.failTitle : '网络错误，数据加载失败！';
            _this.showMyTips(_title);
          }
        }

      },
      fail: function (err) {
        if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
          wx.hideLoading();
        }
        if (_options.hasOwnProperty("fail")) {
          _options.fail(err)
        } else {
          let _title = _options.hasOwnProperty("failTitle") ? _options.failTitle : '网络错误，数据加载失败！';
          _this.showMyTips(_title);
        }
      },
      complete: function () {
        if ((_options.hasOwnProperty("hideLoading") && !_options.hideLoading) || (!_options.hasOwnProperty("hideLoading"))) {
          wx.hideLoading();
        }
        _options.hasOwnProperty("complete") ? _options.complete() : "";
      }
    })
  },


  bindGetUserInfo: function (e, callback) {
    //如果选择授权 则含有用户信息 
    var that = this
    if (e.detail.userInfo) {
      console.log(e)
      wx.showToast({
        title: '正在授权',
        icon: 'loading',
        duration: 5000
      });
      that.globalData.userInfo = e.detail.userInfo; //设置用户信息 
      // 登录 获取在我们这里user_id
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发起网络请求
            wx.request({
              url: that.globalData.apiRequestUrl + 'user/user-info/',
              data: {
                code: res.code,
                wechat_token: that.globalData.requestToken

              },
              success: function (resdata) {

                //获取到session_key 解密 
                var session_key = resdata.data.session_key
                callback(session_key)
                //that.mini_user(session_key)
              },
              fail: function (error) {

              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else {
      console.log(e)
      console.log('拒绝授权')
    }
  },
  mini_user: function (session_key, callback) {
    var that = this
    wx.getSetting({
      success: (res) => {

        if (!res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            fail: () => {
              wx.openSetting({})
            },
            success: (res) => {
              /**获取encryptdata **/
              callback(session_key)
              //that.api_user(session_key);
            }
          })
        } else {
          /**获取encryptdata **/
          callback(session_key)
          //that.api_user(session_key)
        }
      }
    })
  },
  api_user(session_key, callback) {
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
        params.refid = this.globalData.refId
        params.source = _source ? _source : "";
        params.wechat_token = that.globalData.requestToken
        //发起请求  
        wx.request({
          url: that.globalData.apiRequestUrl + '/user/make-user/',
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
              that.getUserUuid(userInfo)
            }
            callback(res)
            // 授权用户执行操作
            wx.hideToast();
          },

        })

      }
    })
  },
  getUserUuid: function (uinfo) {

    let userUuid = wx.getStorageSync("userUuid");
    if (userUuid) return false
    let userinfo = uinfo ? uinfo : wx.getStorageSync("userInfo");
    if (!userinfo) return false;
    if (this.globalData.isauthuuid) return false;
    this.globalData.isauthuuid = true
    let that = this;
    this.appRequestAction({
      url: "user/get-uuid/",
      way: "POST",
      params: userinfo,
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          let uuid = mydata.data.uuid;
          wx.setStorageSync("userUuid", uuid)
        }
      },
      complete: function () {
        if (that.globalData.isauthuuid) {
          that.globalData.isauthuuid = false
        }
      }
    })

  },

  callThisPhone: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  showMyTips: function (_msg) {
    setTimeout(function () {
      wx.showToast({
        title: _msg,
        icon: 'none',
        duration: 2000,
        success: function () {}
      })
    }, 1)

  },
  detailUpimg: function (type, res, callback, _type,allnum) {//allnum选中图片的数量
    wx.showLoading({
      title: '正在上传图片'
    });
    let userInfo = wx.getStorageSync("userInfo");
    let _this = this;
    let imgRes = res.tempFilePaths ? res.tempFilePaths[0] : res;
    wx.showToast({
      title: '图片上传中',
      icon: 'loading',
      duration: 8000000,
      mask: true
    })
    wx.uploadFile({
      url: type == 1 || _type == "sc" ? _this.globalData.apiUploadImg : _this.globalData.apiUploadImgphoto,
      filePath: imgRes,
      header: {
        userid: userInfo.userId
      },
      name: 'file',
      success(res) {
        if(res.statusCode == 200 && res.data){
          let mydata = JSON.parse(res.data);
          if (mydata.errcode == "ok") {
            wx.hideToast()
            callback ? callback(imgRes, mydata, allnum , 'ok') : "";
          }else {
            wx.hideToast();
            callback ? callback(imgRes, null, allnum) : "";
          }
        }else{
          wx.hideToast();
          callback ? callback(imgRes, null, allnum) : "";
        }
      },
      fail: function (err) {
        wx.hideToast();
        callback ? callback(imgRes, null, allnum) : "";
        wx.showToast({
          title: "网络错误，上传失败！",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  valiImgRules: function (img) {
    let r = /\.\w+$/;
    let types = ['bmp', 'jpg', 'png', 'gif', 'jpeg'];
    let type = img.match(r)
    if (type) {
      let str = type[0].substr(1, type[0].length)
      str = str.toLowerCase()
      let ok = types.find(item => item === str)
      return ok ? true : false
    }
    return false
  },
  userUploadImg: function (callback,num) {
    let _this = this;
    wx.chooseImage({
      //2020-9-10-王帅-新增参数 每次最大上传数量 默认1张
      count: num?num:1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        if (res.errMsg == "chooseImage:ok") {
          //多张循环上传
          res.tempFiles.forEach((image)=> {
            //判断图片格式是否正确
            let img = image.path
            let ok = this.valiImgRules(img)
            if (ok) {
              //上传
              _this.detailUpimg(1, img, callback,null,res.tempFiles.length);
            } else {
              wx.hideLoading()
              _this.showMyTips('图片格式不正确,请重新选择')
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
      }
    })
  },
  cameraAndAlbum: function (callback, _type) {
    let that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) { //0是拍照
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: function (res) {
              let img = res.tempFiles[0].path
              let ok = that.valiImgRules(img)
              if (ok) {
                that.detailUpimg(2, res, callback, _type);
              } else {
                wx.hideLoading()
                that.showMyTips('图片格式不正确,请重新选择')
              }
            },
          })
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (res) {
              let img = res.tempFiles[0].path
              let ok = that.valiImgRules(img)
              if (ok) {
                that.detailUpimg(2, res, callback, _type);
              } else {
                wx.hideLoading()
                that.showMyTips('图片格式不正确,请重新选择')
              }
            },
          })
        }
      }
    })


  },
  arrDeepCopy: function (source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
      sourceCopy[item] = typeof source[item] === 'object' ? this.arrDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
  },
  returnPrevPage: function (_msg) {
    wx.showModal({
      title: '温馨提示',
      content: _msg,
      showCancel: false,
      success: function () {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  jumpThisLink: function (e) {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let _page = "/" + currentPage.route
    let _url = e.currentTarget.dataset.url;
    if (_url == _page) return false;
    this.activeRefresh()
    let _type = e.currentTarget.dataset.type;
    (_type == "1") ? wx.reLaunch({
      url: _url
    }): wx.navigateTo({
      url: _url
    });
  },
  getListsAllType: function (_callback) {
    let _this = this;
    this.appRequestAction({
      url: "index/index-search-tree/",
      way: "GET",
      hideLoading: true,
      failTitle: "数据加载失败，请重新进入小程序",
      success: function (res) {

        let mydata = res.data;
        if (mydata.errcode == "ok") {
          _this.globalData.allTypes = mydata.data;
          _callback(mydata.data);
        } else {
          _this.showMyTips(mydata.errmsg);
        }
      }
    })
  },
  valiDateIsToday: function () {
    let myDate = new Date();
    let _y = myDate.getFullYear();
    let _m = parseInt((myDate.getMonth() + 1)) < 10 ? "0" + parseInt((myDate.getMonth() + 1)) : parseInt((myDate.getMonth() + 1));
    let _d = parseInt(myDate.getDate()) < 10 ? "0" + myDate.getDate() : myDate.getDate();
    let _ymd = _y + "-" + _m + "-" + _d;
    return _ymd;
  },
  initUserShareTimes: function () {
    let _this = this;
    let userinfo = wx.getStorageSync("userInfo");
    this.appRequestAction({
      url: "integral/init-share/",
      way: "POST",
      title: "正在初始化数据",
      hideLoading: true,
      params: userinfo,
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          _this.globalData.userTimes = parseInt(mydata.lessNumber);
        }
      }
    })
  },
  userShareAction: function (callback) {
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) return false;
    this.userShareTotal();
    let _this = this;
    let _time = 1000;
    if (this.globalData.userTimes == 0) {
      let _td = this.valiDateIsToday(); //today
      let _t = wx.getStorageSync("_st"); //shareTime
      if (_t != _td) {
        wx.setStorageSync("_st", _td);
        setTimeout(function () {
          callback('share');
        }, _time)
      }
      return false;
    }
    if (!userInfo) return false;
    this.appRequestAction({
      url: "integral/share-integral/",
      way: "POST",
      params: userInfo,
      hideLoading: true,
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          _this.globalData.userTimes = parseInt(_this.globalData.userTimes) - 1;
          let timestamp = Date.parse(new Date());
          let date = new Date(timestamp);
          let year = date.getFullYear();
          let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
          let hours = (date.getHours()) < 10 ? "0" + (date.getHours()) : (date.getHours());
          let min = ((date.getMinutes()) < 10 ? "0" + (date.getMinutes()) : (date.getMinutes()));
          let _data = new Date();
          _data.setTime(_data.getTime() + 24 * 60 * 60 * 1000);
          let tomorrow = _data.getFullYear() + "-" + ((_data.getMonth() + 1 < 10 ? '0' + (_data.getMonth() + 1) : _datagetMonth() + 1)) + "-" + ((_data.getDate()) < 10 ? "0" + (_data.getDate()) : _data.getDate()) + " 00:00";
          let today = year + "-" + month + "-" + day + " " + hours + ":" + min;
          _this.globalData.userShareData.today = today;
          _this.globalData.userShareData.tomorrow = tomorrow;
          setTimeout(function () {
            callback(mydata);
          }, _time)
        }
      }
    })
  },
  pageInitSystemInfo: function (_this) {

    this.initSystemInfo(function (res) {
      if (res) {
        let _ww = res.screenWidth;
        let _wh = res.screenHeight;
        let _bg = _ww * 0.9;
        let _btnh = _bg / 4.695;
        let wordsw = _ww * 0.5;
        let _wordsh = wordsw / 4.21;
        let _shadew = _ww * 0.8;
        let _winw = _ww * 0.9;
        let _winh = _winw / 0.9247;
        let _tipsw = _ww * 0.96;
        _this.setData({
          bgHeight: _bg,
          btnWidth: _btnh,
          wordsHeight: _wordsh,
          wordsWidth: wordsw,
          shadeWidth: _shadew,
          winWidth: _winw,
          winHeight: _winh,
          notimesW: _tipsw
        })
      }
    })
  },
  userShareTotal: function () {
    let userInfo = wx.getStorageSync("userInfo");
    this.doRequestAction({
      url: "user/list-share/",
      way: "POST",
      params: userInfo ? userInfo : {}
    })
  },
  initAdminTime: function (callback) {
    let _this = this;
    this.appRequestAction({
      url: "index/get-init-time/",
      hideLoading: true,
      success: function (res) {
        _this.globalData.appNetTime = res.data.time;
        _this.globalData.userGapTime = _this.globalData.appNetTime - parseInt(new Date().getTime() / 1000);
        callback ? callback() : ""
      },
      fail: function () {}
    })
  },
  initFirstTips: function (_this) {
    let that = this; //app
    let m = this.globalData.firstJoin;
    if (m) {
      _this.setData({
        firstJoin: m
      });
      let t = 5;
      let timer = setInterval(function () {
        t--;
        if (t == 0) {
          _this.setData({
            firstJoin: false
          });
          that.globalData.firstJoin = false;
          clearInterval(timer);
          return false;
        }
      }, 1000)
    }
  },
  isShowFastIssue: function (_this) {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    this.appRequestAction({
      way: "POST",
      url: "fast-issue/fast-log/",
      hideLoading: true,
      params: userInfo,
      success: function (res) {

        let mydata = res.data;
        if (mydata.errcode == "ok") {

          let _log = parseInt(mydata.hasLog);
          that.globalData.showFastIssue.show = _log;
          that.globalData.showFastIssue.request = true;

          _this.setData({
            showFastIssue: that.globalData.showFastIssue
          });
        }
      },
      fail: function () {}
    })
  },
  showDetailInfo: function (e) {
    let userLocation = wx.getStorageSync("userLocation")
    if (!userLocation) {
      userLocation = ""
    } else {
      userLocation = userLocation.split(",").reverse().join(",")
    }

    // let uuid = e.currentTarget.dataset.uuid

    let _this = this;
    // let formId = e.detail.formId;
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;

    let url = (type == "job") ? '/pages/detail/info/info?id=' : `/pages/boss-look-card/lookcard?uuid=${uuid}&location=${userLocation}`
    wx.navigateTo({
      url: url + id
    })

    // if (!uinfo) return false;

    // if (formId == "requestFormId:fail timeout") return false;
    // let day = this.valiDateIsToday();
    // let tempInfo = wx.getStorageSync("tempInfo");
    // if (tempInfo) {
    //   try {
    //     let tday = tempInfo.day;
    //     let times = parseInt(tempInfo.times);
    //     if (tday == day) {
    //       if (times < 1) {
    //         times += 1;
    //         let tempData = {
    //           day: tday,
    //           times: times
    //         }
    //         wx.setStorageSync("tempInfo", tempData)
    //         _this.setTemplateInfo(formId);
    //       }
    //       return false;
    //     } else {
    //       let tempDate = {
    //         day: day,
    //         times: 1
    //       }
    //       wx.setStorageSync("tempInfo", tempDate)
    //       _this.setTemplateInfo(formId);
    //     }
    //   } catch (err) {}
    // } else {
    //   let tempDate = {
    //     day: day,
    //     times: 1
    //   }
    //   wx.setStorageSync("tempInfo", tempDate)
    //   _this.setTemplateInfo(formId);
    // }
  },
  setTemplateInfo: function (formId) {
    let data = wx.getStorageSync("userInfo") || {};
    data.formId = formId
    this.appRequestAction({
      hideLoading: true,
      params: data,
      url: "wechat/save-form/",
      way: "POST"
    })
  },
  valiUserUrl: function (e, user) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: user ? url : '/pages/userauth/userauth'
    })
  },
  gotoUserauth: function () {
    wx.navigateTo({
      url: '/pages/userauth/userauth'
    })
  },
  /**打开设置面板 */
  openSetting: function (callback) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        //console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权   
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则将不能为你自动推荐位置',
            success: function (res) {
              if (res.cancel) {} else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {

                    if (data.authSetting["scope.userLocation"] == true) {

                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })
                      callback ? callback() : ""
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
          return false;
        }
      },
    })
  },
  setStorageAction: function (id, mydata, flag) { //flag='省'
    let maxNum = 3;
    if (id == 1) return false;
    let locationHistory = wx.getStorageSync("locationHistory");
    let gpsPorvince = wx.getStorageSync("gpsPorvince");
    let gpsOrientation = wx.getStorageSync("gpsOrientation");
    let isArr = locationHistory instanceof Array;
    let lid = flag ? (gpsPorvince ? parseInt(gpsPorvince.id) : "") : (gpsOrientation ? parseInt(gpsOrientation.id) : "");
    if (lid == id) return false;
    if (!isArr) {
      wx.setStorageSync("locationHistory", [mydata])
    } else {
      let len = locationHistory.length;
      for (let i = 0; i < len; i++) {
        let fid = parseInt(locationHistory[i].id);
        if (fid == id) {
          locationHistory.splice(i, 1);
          break;
        }
      }
      locationHistory.unshift(mydata);
      locationHistory.splice(maxNum)
      wx.setStorageSync("locationHistory", locationHistory)
    }
  },
  getAreaData: function (_this, callback) {

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let num = this.globalData.areaDataNum;
    let areadata = wx.getStorageSync("areadata");
    if (areadata.hasOwnProperty("num") && (areadata.num == num)) {
      _this.setData({
        areadata: areadata.data
      })
      wx.hideLoading()
      return false;
    }
    this.doRequestAction({
      url: "index/index-area/",
      success: function (res) {
        let mydata = {
          data: res.data,
          num: num
        }
        _this.setData({
          areadata: res.data
        })
        callback ? callback(res.data) : ""
        wx.hideLoading()
        wx.setStorageSync('areadata', mydata)
      }
    });

  },
  // getAreaData: function (_this, options) {
  //   console.log(_this)
  //   wx.showLoading({
  //     title: '加载中',
  //     mask: true
  //   })
  //   console.log(123)
  //   let num = 1;
  //   let areadata = wx.getStorageSync("areadata");
  //   let areadatas = wx.getStorageSync("areadatas");
  //   if (areadata && _this.__route__ != "pages/workingtopAll/distruction/distruction") {
  //     if (areadata.hasOwnProperty("num") && (areadata.num == num)) {
  //       _this.setData({
  //         areadata: areadata.data
  //       })
  //       // if (_this && options){
  //       //   _this.hotcities(options)
  //       // }

  //       wx.hideLoading()
  //       return false;
  //     }
  //   }
  //   if (areadatas && _this.__route__ == "pages/workingtopAll/distruction/distruction") {
  //     if (areadatas.hasOwnProperty("num") && (areadatas.num == num)) {
  //       _this.setData({
  //         areadatas: areadatas.data
  //       })
  //       if (_this && options) {
  //         _this.hotcities(options)
  //       }
  //      console.log(12123213)
  //       wx.hideLoading()
  //       return false;
  //     }
  //   }
  //   this.doRequestAction({
  //     url: "index/index-area/",
  //     success: function (res) {
  //       let mydata = {
  //         data: res.data,
  //         num: num
  //       }
  //       let areadatas = JSON.parse(JSON.stringify(res.data))
  //       areadatas.shift()
  //       console.log(res.data)
  //       _this.setData({
  //         areadata: res.data,
  //         areadatas: areadatas
  //       })
  //       if (_this && options) {
  //         _this.hotcities(options)
  //       }
  //       wx.hideLoading()
  //       wx.setStorageSync('areadata', mydata)
  //       wx.setStorageSync('areadatas', areadatas)
  //     }
  //   });

  // },
  getPrevPage: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    return prevPage;
  },
  commonUserShare: function () {
    let userInfo = wx.getStorageSync("userInfo");
    this.appRequestAction({
      url: "user/user-share/",
      way: "POST",
      params: userInfo ? userInfo : {}
    })
  },
  getUserMsg: function (callback) {
    let _this = this
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) return false;
    _this.initGetIntegralList()
    this.appRequestAction({
      url: "member/original-message/",
      way: "POST",
      hideLoading: true,
      params: {
        terminal_type: _this.terminal_type
      },
      success: function (res) {
        if (res.data.errcode == "ok") {
          _this.globalData.jobNumber = res.data.data.jobNumber
          _this.globalData.msgsNumber = res.data.data.messageNumber
          callback(res.data.data.jobNumber, res.data.data.messageNumber,res.data.data.job_view_count,res.data.data.resume_view_count)
        }
      }
    })
  },
  initGetIntegralList: function () {
    let _this = this;
    _this.initSystemInfo(function (res) {
      if (res && res.platform == "ios") {
        _this.terminal_type = 'ios'
      } else if (res && res.platform != "ios") {
        _this.terminal_type = 'android'
      }
    })
  },
  subscribeToNews: function (type, callback) {
    let userInfo = wx.getStorageSync("userInfo");
    let that = this;
    if (wx.canIUse('requestSubscribeMessage') === true) {
      wx.requestSubscribeMessage({
        tmplIds: [tmplId.tmplId[type].id],
        success(res) {
          callback()
          if (res.errMsg == "requestSubscribeMessage:ok") {
            let status = res[tmplId.tmplId[type].id]
            if (status == "accept") {
              that.appRequestAction({
                url: "leaving-message/add-subscribe-msg/",
                way: "POST",
                mask: true,
                hideLoading: true,
                params: {
                  userId: userInfo.userId,
                  token: userInfo.token,
                  tokenTime: userInfo.tokenTime,
                  type: tmplId.tmplId[type].type
                }
              })
            }
          }
        },
        fail: function () {
          callback()
        }
      })
    } else {
      callback()
    }
  },

  getNoticeInfo: function (userinfo, callback) {
    let loginAfter = this.globalData.getNotice.loginAfter;
    let loginBefore = this.globalData.getNotice.loginBefore;
    let flag = this.globalData.firstSaveUserLoginLog
    if(userinfo &&　userinfo.userId){
      if (!loginAfter) {
        if (userinfo && userinfo.userId) {
          userinfo.record = flag ? 0 : 1
        } else {
          userinfo = {
            record: 0
          }
        }
        let that = this
        this.doRequestAction({
          url: "index/less-search-data/",
          way: "POST",
          params: userinfo,
          success: function (res) {
            let mydata = res.data;
            callback(mydata)
            that.globalData.joingroup = mydata.join_group_config
            that.globalData.copywechat = mydata.wechat.number
            that.globalData.callphone = mydata.phone
            that.globalData.serverPhone = mydata.phone
            that.globalData.notice = mydata.notice
            that.globalData.member_less_info = mydata.member_less_info
            if (userinfo.record) that.globalData.firstSaveUserLoginLog = true
            that.globalData.getNotice.loginAfter = true
          },
          fail: function (err) {
            wx.showToast({
              title: '数据加载失败！',
              icon: "none",
              duration: 3000
            })
          }
        })
      }else{
        let copywechat = this.globalData.copywechat
        let data = {
          notice: this.globalData.notice,
          member_less_info: this.globalData.member_less_info,
          phone: this.globalData.serverPhone,
          wechat: { number: copywechat },
          join_group_config: this.globalData.joingroup,
        }
        callback(data)
      }
    }else{
      if (!loginBefore) {
        if (userinfo && userinfo.userId) {
          userinfo.record = flag ? 0 : 1
        } else {
          userinfo = {
            record: 0
          }
        }
        let that = this
        this.doRequestAction({
          url: "index/less-search-data/",
          way: "POST",
          params: userinfo,
          success: function (res) {
            let mydata = res.data;
            callback(mydata)
            that.globalData.joingroup = mydata.join_group_config
            that.globalData.copywechat = mydata.wechat.number
            that.globalData.callphone = mydata.phone
            that.globalData.serverPhone = mydata.phone
            that.globalData.notice = mydata.notice
            if (userinfo.record) that.globalData.firstSaveUserLoginLog = true
            that.globalData.getNotice.loginBefore = true
          },
          fail: function (err) {
            wx.showToast({
              title: '数据加载失败！',
              icon: "none",
              duration: 3000
            })
          }
        })
      }else{
        let copywechat = this.globalData.copywechat
        let data = {
          notice: this.globalData.notice,
          member_less_info: this.globalData.member_less_info,
          phone: this.globalData.serverPhone,
          wechat: { number: copywechat },
          join_group_config: this.globalData.joingroup,
        }
        callback(data)
      }
    }
    
  },
  valiUserVideoAdStatus: function (callback, flag) {
    let vf = flag || 1
    let _this = this;
    // let userInfo = wx.getStorageSync('userInfo')
    // let userUuid = wx.getStorageSync('userUuid')
    // if(!userInfo) return
    // userInfo.mid = userInfo.userId
    // userInfo.uuid = userUuid
    //userInfo.check_type = vf
    this.appRequestAction({
      url: '/member/get-adv-status/',
      way: 'GET',
      mask: true,
      params: {
        check_type: vf
      },
      success: (res) => {
        let mydata = res.data
        if (mydata.errcode == 'ok') {
          _this.globalData.userSeeVideoTimes = {
            ok: true,
            times: mydata.data.times
          }
        } else if (mydata.errcode == 'to_invited') {
          _this.globalData.userSeeVideoTimes.times = {
            ok: true,
            times: 0
          }
        }
        callback && callback(mydata)
      },
      fail: (err) => {
        _this.showMyTips('网络错误，加载失败')
      }
    })
  },
  userGetTempIntegral: function (flag, callback) {
    let _this = this
    let userInfo = wx.getStorageSync('userInfo')
    let userUuid = wx.getStorageSync('userUuid')
    if (!userInfo) return
    userInfo.mid = userInfo.userId
    userInfo.uuid = userUuid
    userInfo.add_rank = flag || 0
    this.appRequestAction({
      url: '/member/watched-integral/',
      way: 'POST',
      params: userInfo,
      mask: true,
      success: function (res) {
        let mydata = res.data
        wx.showModal({
          title: '提示',
          content: mydata.errmsg || '',
          showCancel: false,
        })
        if (mydata.errcode == "ok") {
          _this.globalData.userSeeVideoTimes.times = mydata.data.times
        } else if (mydata.errcode == "to_invited") {
          _this.globalData.userSeeVideoTimes.times = 0
        }
        callback && callback(mydata)
      },
      fail: () => {
        _this.showMyTips('网络错误，加载失败！')
      }
    })
  },
  // 多图上传
  multiImageUpload: function (num, callback) {

    let _this = this;
    wx.showLoading({
      title: '正在上传图片'
    });
    wx.chooseImage({
      count: num || 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        if (res.errMsg == "chooseImage:ok") {
          _this.multiImageUploading(res.tempFiles, callback);
        } else {
          wx.showModal({
            title: '提示',
            content: '图片上传失败，请重新上传',
            showCancel: false
          })
        }
      },
      fail: function () {
        wx.hideLoading();
      }
    })
  },
  multiImageUploading: function (tempFiles, callback) {
    let len = tempFiles.length
    let start = 0
    let arr = []
    let _this = this;
    wx.showToast({
      title: '图片上传中',
      icon: 'loading',
      mask: true
    })
    for (let i = 0; i < len; i++) {
      let img = tempFiles[i].path
      let ok = this.valiImgRules(img)
      if (ok) {
        wx.uploadFile({
          url: _this.globalData.apiUploadImg,
          filePath: img,
          name: 'file',
          success(res) {
            let mydata = JSON.parse(res.data);
            start += 1
            if (mydata.errcode == "ok") {
              arr.push({
                httpurl: mydata.httpurl,
                url: mydata.url
              })
              if (start == len) {
                wx.hideLoading()
                callback(arr)
              }
            } else {
              wx.hideToast();
              wx.showModal({
                title: '提示',
                content: '图片上传失败，请重新上传',
                showCancel: false,
                success: function () {
                  callback(arr)
                }
              })
            }
          },
          fail: function () {
            start += 1
            wx.hideToast();
            wx.showModal({
              title: '提示',
              content: '图片上传失败，请重新上传',
              showCancel: false,
              success: function () {
                callback(arr)
              }
            })
          }
        })
      } else {
        start += 1
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '图片上传失败，请重新上传',
          showCancel: false,
          success: function () {
            callback(arr)
          }
        })
      }
    }
  },
  //我的找活文本显示内容
  initResume:function(_this,call){
    let userInfo = wx.getStorageSync("userInfo");
    let that = this
    if (userInfo) {
      let flag = JSON.parse(JSON.stringify(that.globalData.publishFindWork))
      if(call){
        that.appRequestAction({
          url: 'resumes/exists/',
          way: 'POST',
          mask: true,
          success: function(res){
            let mydata = res.data
            if(mydata.errcode == "ok"){
              that.globalData.publishFindWork.resumeText = mydata.data.title
              that.globalData.publishFindWork.loginBefore = true
              call ? call(mydata.data.exists) : ''
              _this.setData({
                resumeText:mydata.data.title
              })
            }
          },
          fail:()=>{
            that.showMyTips('网络错误，加载失败！')
            that.globalData.publishFindWork.resumeText = "发布找活"
          }
        })
      }else{
        if (!flag.loginAfter) {
          that.appRequestAction({
            url: 'resumes/exists/',
            way: 'POST',
            mask: true,
            success: function(res){
              let mydata = res.data
              if(mydata.errcode == "ok"){
                that.globalData.publishFindWork.resumeText = mydata.data.title
                that.globalData.publishFindWork.loginAfter = true
                _this.setData({
                  resumeText:mydata.data.title,
                })
                that.globalData.exists = mydata.data.exists
                call ? call(mydata.data.exists) : ''
              }
            },
            fail:()=>{
              that.showMyTips('网络错误，加载失败！')
              that.globalData.resumeText = "发布找活"
            }
          })
        } else {
          _this.setData({
            resumeText:that.globalData.publishFindWork.resumeText
          })
        }
      }
    } else {
      let flag = JSON.parse(JSON.stringify(that.globalData.publishFindWork))
      if(call){
        wx.navigateTo({
          url: '/pages/userauth/userauth'
        })
      }else {
        if (!flag.loginBefore) {
          that.appRequestAction({
            url: 'resumes/exists/',
            way: 'POST',
            mask: true,
            success: function(res){
              let mydata = res.data
              if(mydata.errcode == "ok"){
                that.globalData.publishFindWork.resumeText = mydata.data.title
                that.globalData.publishFindWork.loginBefore = true
                call ? call(mydata.data.exists) : ''
                _this.setData({
                  resumeText:mydata.data.title
                })
              }
            },
            fail:()=>{
              that.showMyTips('网络错误，加载失败！')
              that.globalData.publishFindWork.resumeText = "发布找活"
            }
          })
        } else {
          _this.setData({
            resumeText:that.globalData.publishFindWork.resumeText
          })
        }
      }
    }
  },
  //判断是否有空格或者为空
  isEmpty:function isEmpty(obj){
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if(typeof obj == "undefined" || obj == null || obj == "" || re.test(obj)){
        return true;
    }else{
        return false;
    }
  },
  //更新活跃状态n
  activeRefresh:function(){
    let userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      this.appRequestAction({
        url:'active-time/refresh/',
        way: "POST",
        success:function(res) {
          console.log('活跃状态更新成功')
        }
      })
    }
  },
  // 找活名片刷新成功提示框（当天首次刷新且未置顶 或 非当天首次刷新）弹窗
  showTipBox: function (_this) {
    let tipBox = {//提示框显示信息
      title:"温馨提示",
      showTitle: true,
      showIcon: false,
      showCancel: true,
      confirmColor:'#0099FF',
      cancelColor:'#797979',
      content: [{
        des: '刷新成功!',
        color: '#333',
        text: []
      }
    ],
      confirmText: '确定',
      cancelText: '查看招工信息'
    };
    _this.setData({
      tipBox: tipBox,
      refreshStatus: true,
      boxType: "refreshSuccess",
      boxStatus: 3
    })
    // 刷新成功
    _this.selectComponent("#promptbox").show()
    this.globalData.dayFirstRefresh = 1
    this.activeRefresh()
  },
  // 刷新找活名片未置顶且当天首次刷新
  showFirstBox: function (_this) {
    this.globalData.dayFirstRefresh = 1
    wx.showModal({
      title:'刷新成功',
      content:'置顶找活名片，可让您的名片长期处于刷新状态。',
      confirmColor: '#0097FF',
      cancelColor:'#797979',
      cancelText:'取消',
      confirmText:'去置顶',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "/pages/clients-looking-for-work/workingtop/workingtop",
          })
        }
        if (res.cancel) {
          _this.setData({ boxType: false })
        }
      }
    })
  },

  // 刷新找活名片请求(找工作列表与找活名片使用)
  refreshReq: function (source,_this) {
    // source  1-找活名片编辑页；2-招工列表引导弹窗
    // 积分获取url
    let that = this
    let url = '/pages/getintegral/getintegral';
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) return
    // 用户token
    let token = userInfo.token;
    this.appRequestAction({
      url: 'resumes/refresh/',
      way: 'POST',
      params: {token,source_type:source},
      success: function (res) {
        let mydata= res.data
        if (mydata.errcode === "ok") {
          let currentTime = new Date().getTime();
          let reqDueTime = currentTime + 3000;
          _this.setData({reqDueTime, reqStatus:true})
          if (mydata.data.hasOwnProperty("refresh_status")) {
            _this.setData({refreshStatus})
            let refreshStatus = mydata.data.refresh_status;
            if (refreshStatus === 0) {
              // 该信息处于审核中或审核失败状态
              wx.showModal({
                title: '温馨提示',
                content: '找活名片审核通过后即可刷新',
                showCancel: false,
              })
            }else if(refreshStatus === 1){
              // 该信息处于已找到工作状态
              wx.showModal({
                title: '温馨提示',
                content: '请将工作状态修改为<正在找工作>,审核通过后即可刷新名片',
                showCancel: source === 1? false: true,
                confirmText: source === 1? "确定":"去更改",
                success: function (res) {
                  if (res.confirm) {
                    if (source === 2) {
                      wx.navigateTo({
                        url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
                      })
                    }
                  }
                }
              })
            }else if(refreshStatus === 2){
              // 该用户积分不足
              wx.showModal({
                title: '温馨提示',
                content: '您当前的正式积分不足，是否前往获取积分？',
                cancelText: "否",
                confirmText: "是",
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: url,
                    })
                  }
                }
              })
            }else if(refreshStatus === 3){
              if (source === 2) {
                let tipBox = {//提示框显示信息
                  showTitle: false,
                  showIcon: true,
                  showCancel: false,
                  confirmColor:'#0099FF',
                  cancelColor:'#797979',
                  content: [{
                    des: '刷新成功',
                    color: '#333',
                    text: []
                  }
                ],
                  confirmText: '确定'
                };
                _this.setData({
                  tipBox: tipBox,
                  refreshStatus: true
                })
              }
              // 刷新成功
              _this.selectComponent("#promptbox").show()
              that.activeRefresh()
            }else if(refreshStatus === 4){
              // 刷新失败
              wx.showModal({
                title: '温馨提示',
                content: '刷新失败',
                showCancel: false,
              })
            }
          }
          // 有is_top 字段也代表了刷新成功
          if (mydata.data.hasOwnProperty("is_top")) {
            // 找活名片置顶状态 1 置顶中 0 未置顶
            let isTop = mydata.data.is_top;
            if (isTop) {
              that.showTipBox(_this)
            }else{
              if (that.globalData.dayFirstRefresh) {
                that.showTipBox(_this)  
              }else{
                that.showFirstBox(_this)
              }
            }
          }
        } else {
          wx.showModal({
            title: '温馨提示',
            content: mydata.errmsg,
            showCancel: false,
            success(res) {
             }
          })
        }
      },
      fail: function () {
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

})
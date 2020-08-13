// pages/issue/index/index.js
const app = getApp()
let vali = require("../../../utils/v.js");
let areas = require("../../../utils/area.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"0",
    userInfo: true,
    infoId: '', //
    showPicker: false,
    switch: false,
    upload: app.globalData.apiImgUrl + 'mini-new-publish-upload-img.png',
    del: app.globalData.apiImgUrl + 'new-published-close-icon.png',
    addressData: {
      title: '',
      location: '',
      adcode: '',
      district: ''
    },
    imgs: [],
    maxNum: 3,
    imglen: 0,
    notMateData: [],
    mateData: [],
    classifies: [],
    rclassifies: [],
    childClassifies: [], // 子集工种数据
    rchildClassifies: [], // 备份数据
    rulesClassifyids: [], //匹配出来的
    rrulesClassifyids: [], // 备份
    userClassifyids: [], // 用户点击的
    ruserClassifyids: [], // 备份
    showClassifyText: '', // 展示用文本
    phone: '',
    data: {
      userId: '',
      user_name: '',
      user_mobile: '',
      detail: '',
      code: '',
      city_id: '',
      province_id: '',
      county_id: ''
    },
    pindex: 0,
    maxWorkNum: 5,
    status: true, // 获取验证码是否能被点击
    codeTips: '获取验证码',
    selectedClassifies: [],
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    normalTel: "18349296434",
    placeholder: '请粘贴或输入您要发布的招工信息（如：四川成都找木工，联系电话：18349296434）',
    userEnteredTel: false,
    //电话号码自动根据详情匹配，当点击了联系电话输入框不再进行匹配
    isRulePhone:true,
    //个人中心招工列表点击拒绝的招工修改显示提示框
    showModal:false,
    reason:"",
    model:{}
  },
  // 设置缓存保留已填写信息
  setEnterInfo: function (name, data) {
    let infoId = this.data.infoId
    if (!infoId) {
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
    }
  },
  userEnterPhone: function (e) {
    //如果有用户信息点击了联系电话后不再取个人中心用户信息的手机号码
    let u = wx.getStorageSync('userInfo')
    if(u){
      app.globalData.isRedPhone = false
    }
    let val = e.detail.value
    this.setData({
      "data.user_mobile": val,
      userEnteredTel: true,
      isRulePhone:false
    })
    this.setEnterInfo('phone', val)
  },
  userEnterCode: function (e) {
    this.setData({
      "data.code": e.detail.value
    })
  },
  checkType: function (obj, _type) {
    var _re = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    if (_type == undefined) return _re;
    if (_re == _type) return true;
    return false;
  },
  //输入姓名修改姓名信息
  userEnterName:function (e) {
    let val = e.detail.value
    this.setData({
      "data.user_name": val
    })
  },
  userEnterDetail: function (e) {
    let val = e.detail.value
    this.setData({
      "data.detail": val
    })
    this.setEnterInfo('detail', val)
  },
  userSetAreaInfo: function () {
    let val = this.data.addressData
    this.setEnterInfo('area', val)
  },
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
  userChangeImg: function (e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    app.multiImageUpload(1, function (data) {
      let imgs = _this.data.imgs
      imgs[index] = data[0]
      _this.setData({
        imgs: imgs
      })
      _this.setEnterInfo('imgs', imgs)
    })
  },
  showWorkTypePicker: function () {
    //用户在点击一次工种选择框后，便不再自动匹配详情内容
    app.globalData.isRuleClass = true
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
  sureWorkTypePicker: function () {
    this.setData({
      showPicker: false
    })
    this.getWorkText()
  },
  switchClick: function () {
    this.setData({
      switch: !this.data.switch
    })
  },
  showWorkArea: function () {
    let infoId = this.data.infoId
    wx.navigateTo({
      url: '/pages/issue/area/area?showfor=showfor&showmap=showmap&infoId=' + infoId,
    })
  },
  userUploadImg: function () {
    let that = this
    let num = this.data.maxNum - this.data.imglen
    app.multiImageUpload(num, function (data) {
      let imgs = [...that.data.imgs, ...data]
      that.setData({
        imgs: imgs,
        imglen: imgs.length
      })
      that.setEnterInfo('imgs', imgs)
    })
  },
  initInfo: function () {
    let u = wx.getStorageSync('userInfo')
    // wx.setStorageSync('defaultname', false)//标记
    this.setData({
      userInfo: u ? u : false
    })

    let {
      infoId
    } = this.data
    let postData = {
      ...u,
      infoId: infoId,
      type: 'job'
    }
    let _this = this;
    app.appRequestAction({
      url: 'publish/new-mate-job/',
      way: 'POST',
      mask: true,
      params: postData,
      success: function (res) {
        let mydata = res.data
        if (mydata.errcode == "ok") {
          let tel = mydata.memberInfo.tel || mydata.model.user_mobile
          let username = mydata.memberInfo.username || ''
          _this.setData({
            "data.userId": mydata.memberInfo.id || '',
            "data.user_mobile": tel,
            "data.user_name": username,
            maxNum: mydata.typeTextArr.maxImageCount,
            maxWorkNum: mydata.typeTextArr.maxClassifyCount,
            phone: tel,
            notMateData: mydata.not_mate_data,
            mateData: mydata.mate_data,
            classifies: mydata.classifyTree,
            selectedClassifies: mydata.selectedClassifies,
            // placeholder: mydata.placeholder
          })
          //如果是从个人中心我的招工界面过来的，为修改界面，采集修改数据
          if (infoId) {
            let model = {
              detail:mydata.model.detail,
              address:mydata.model.address,
              province_id:mydata.model.province_id,
              city_id:mydata.model.city_id,
              county_id:mydata.model.county_id,
              selectedClassifies:mydata.selectedClassifies.sort(),
              user_name:mydata.model.user_name,
              user_mobile:mydata.model.user_mobile,
              imgs:mydata.model.view_images || "",
            }
            _this.setData({
              "data.user_mobile":mydata.model.user_mobile,
              "data.user_name": mydata.model.user_name,
              "addressData.title": mydata.model.address,
              "addressData.location": mydata.model.location,
              "data.detail": mydata.model.detail,
              "data.city_id": mydata.model.city_id,
              "data.province_id": mydata.model.province_id,
              "data.county_id": mydata.model.county_id,
              imgs: mydata.view_image,
              imglen: mydata.view_image.length,
              selectedClassifies: mydata.selectedClassifies,
              switch: mydata.view_image.length ? true : false,
              reason:mydata.model.check_fail_msg,
              id:mydata.default_search_name.id,
              //this.data.model为修改界面进入后采集的修改前数据
              model: JSON.stringify(model)
            })
            if (mydata.model.check_fail_msg != "0") {
              wx.showModal({
                title: '审核失败',
                content: "失败原因："+_this.data.reason,
                showCancel:false,
                confirmText:"立即修改",
              })
            }
            wx.setStorageSync('defaultname', mydata.default_search_name)//标记
            let locationHistory = wx.getStorageSync('locationHistory')
            if (locationHistory) {
              locationHistory.unshift(mydata.default_search_name)
              wx.setStorageSync('locationHistory', locationHistory)
            } else {
              let locationHistory = []
              locationHistory.unshift(mydata.default_search_name)
              wx.setStorageSync('locationHistory', locationHistory)
            }
            _this.initSelectedClassifies()
            _this.countWorkNum()
            _this.getWorkText()
            _this.initChildWorkType()
          } else {
            // let gpsPorvince = wx.getStorageSync('gpsPorvince')
            // let defaultPosition = areas.getAreaArr[1]
            let jiSuData = wx.getStorageSync('jiSuData')
            if(!jiSuData){
              // let defaultname = gpsPorvince?gpsPorvince:defaultPosition
              // wx.setStorageSync('defaultname', defaultname)
              let locationHistory = wx.getStorageSync('locationHistory')
              if (locationHistory) {
                locationHistory.unshift(defaultname)
                wx.setStorageSync('locationHistory', locationHistory)
              } else {
                let locationHistory = []
                locationHistory.unshift(defaultname)
                wx.setStorageSync('locationHistory', locationHistory)
              }
              _this.initChildWorkType()
              return false;
            } else {
              let jiSuData = wx.getStorageSync('jiSuData')
              if(jiSuData.detail){
                _this.setData({ "data.detail":jiSuData.detail })
              }
              if (jiSuData.detail) {
                _this.setData({
                  "data.detail": jiSuData.detail
                })
              }
              if (jiSuData.phone) {
                if (u) {
                  if (app.globalData.isRedPhone) {
                    console.log("我进来了")
                    _this.setData({
                      "data.user_mobile": res.data.memberInfo.tel,
                    })
                  }else{
                    _this.setData({
                      "data.user_mobile": jiSuData.phone
                    })
                  }
                }else {
                  _this.setData({
                    "data.user_mobile": jiSuData.phone
                  })
                } 
              }
              if (jiSuData.area) {
                _this.setData({
                  addressData: jiSuData.area
                })
              }
              if (jiSuData.imgs) {
                _this.setData({
                  imgs: jiSuData.imgs,
                  imglen: jiSuData.imgs.length,
                  switch: jiSuData.imgs.length ? true : false
                })
              }
              if (jiSuData.defaultname) {
                wx.setStorageSync('defaultname', jiSuData.defaultname)//标记
                
                let locationHistory = wx.getStorageSync('locationHistory')
                if (locationHistory) {
                  locationHistory.unshift(jiSuData.defaultname)
                  wx.setStorageSync('locationHistory', locationHistory)
                } else {
                  let locationHistory = []
                  locationHistory.unshift(jiSuData.defaultname)
                  wx.setStorageSync('locationHistory', locationHistory)
                }
              }
            }
            
            _this.setData({
              userClassifyids: jiSuData.userClassifyids || [],
              rulesClassifyids: jiSuData.rulesClassifyids || [],
            })
            _this.countWorkNum()
            _this.getWorkText()
          }
          _this.initChildWorkType()
        } else {
          wx.showModal({
            title: '提示',
            content: mydata.errmsg,
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
        }
      }
    })
  },
  vertify() {
    this.setData({
      showModal: false,
    })
  },
  initSelectedClassifies: function () {
    let ids = this.data.selectedClassifies;
    let classifies = JSON.parse(JSON.stringify(this.data.classifies))
    let userClassifyids = this.data.userClassifyids
    for (let i = 0; i < classifies.length; i++) {
      let data = classifies[i].children
      for (let j = 0; j < data.length; j++) {
        let id = data[j].id
        if (ids.indexOf(id) !== -1) {
          userClassifyids.push({
            id: id,
            name: data[j].name
          })
        }
      }
    }
    this.setData({
      userClassifyids: userClassifyids
    })
    this.getWorkText()
  },
  checkType: function (obj, _type) {
    var _re = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    if (_type == undefined) return _re;
    if (_re == _type) return true;
    return false;
  },
  // 匹配电话号码
  matchPhoneFun: function () {
    let content = this.data.data.detail;
    let userEnteredTel = this.data.userEnteredTel
    let tel = this.data.data.user_mobile
    if (!userEnteredTel || !tel) {
      let p = /1[3-9]\d{9}/g;
      let phone = content.match(p);
      if (this.checkType(phone, 'array')) {
        this.setData({
          "data.user_mobile": phone[0]
        })
        this.setEnterInfo("phone",phone[0])
      }
    }
  },
  mateClassifyIdsFun: function () {
    wx.showLoading({
      title: '匹配中',
      icon: 'none',
      mask: true
    })
    //点击联系电话框后，不再根据招工详情进行匹配
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      if (this.data.isRulePhone) {
        this.matchPhoneFun()
    }} 
    //用户根据所需工作自行选择工种
    let uids = JSON.parse(JSON.stringify(this.data.userClassifyids))
    //获取招工详情的内容
    let content = this.data.data.detail;
    //所需工种最大选择数
    let maxWorkNum = this.data.maxWorkNum
    //不匹配的数据
    let notRules = this.data.notMateData;
    //不匹配数据长度
    let notLen = notRules.length;
    //获取data中匹配数据
    let needRules = this.data.mateData;
    //匹配数据长度
    let needLen = needRules.length;
    let notArr = [];
    let needArr = [];
    if (!content) {
      wx.hideLoading()
      return false;
    }
    let infoId = this.data.infoId
    // 匹配地区 标记
    let areaName = this.data.addressData.title
    if(!areaName){
      let areaData = JSON.parse(JSON.stringify(areas.getAreaArr))
      areaData.splice(0,1)
      let areaLen = areaData.length
      let flag = false
      for(let i = 0 ; i < areaLen; i++){
        let rowData = areaData[i]
        let has = rowData.has_children
        if(has){
          let newData = rowData.children
          for(let j = 1 ; j < newData.length; j ++){
            if(content.indexOf(newData[j].name) !== -1){
              console.log(newData[j].name)
              flag = true
              wx.setStorageSync('defaultname', newData[j])
              break
            }
          }
          if(flag){
            break;
          }
        }else{
          if(content.indexOf(rowData.name) !== -1){
            wx.setStorageSync('defaultname', 
            {
              id:rowData.id,
              pid:rowData.pid,
              name:rowData.name,
              letter: rowData.letter
            })
            break
          }
        }
      }
    }
    if(!infoId){
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
    // 需要匹配的关键词
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
    // 过滤不匹配关键词
    for (let i = 0; i < notArr.length; i++) {
      let id = notArr[i].id;
      let index = needArr.findIndex(item => item.id == id)
      if (index !== -1) {
        needArr.splice(index, 1)
        }
      }
    }
    if(infoId){
      let needids = needArr.map(item => item.id)
      for (let i = 0; i < uids.length; i++) {
        let index = needids.indexOf(uids[i].id)
        if (index !== -1) {
          needArr.splice(index, 1)
          needids.splice(index, 1)
        }
      }
    }
    let uidsLen = uids.length
    if (!app.globalData.isRuleClass) {
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
      }
      this.setEnterInfo('rulesClassifyids',needArr)
    }
    this.countWorkNum()
    this.initChildWorkType()
    this.getWorkText()
    wx.hideLoading()
  },
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
    //如果既没有选择工种也没有匹配工种那么就不需要循环统计匹配工种num
    if (!ruleLen) return
    //记录选择或者详情匹配工种的数量
    for (let i = 0; i < len; i++) {
      let data = classifyids[i].children
      let inum = 0
      for(let j = 0;j<data.length;j++){
        let has = rulesClassifyids.indexOf(data[j].id)
        if(has !== -1){
          inum++
          //let num = classifyids[i].num || 0
          // classifyids[i].num = inum
        }
        classifyids[i].num = inum
      }
    }
    this.setData({
      classifies: classifyids
    })
  },
  initChildWorkType: function () {
    let index = this.data.pindex;
    let rids = this.data.rulesClassifyids;
    let uids = this.data.userClassifyids;
    let data = JSON.parse(JSON.stringify(this.data.classifies[index].children))
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
    this.setData({
      childClassifies: data
    })
  },
  userCheckPindex: function (e) {
    let index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      pindex: index
    })
    this.initChildWorkType()
  },
  userCheckWorkType: function (e) {
    let num = this.data.maxWorkNum
    let id = e.currentTarget.dataset.id
    let checked = e.currentTarget.dataset.checked
    let name = e.currentTarget.dataset.name
    let rulesClassifyids = this.data.rulesClassifyids
    let userClassifyids = this.data.userClassifyids
    let data = JSON.parse(JSON.stringify(this.data.classifies))
    let pindex = this.data.pindex
    console.log("classifies",this.data.childClassifies)
    console.log("this.data",this.data)
    if (checked) {
      console.log("e.currentTarget.dataset.id",e.currentTarget.dataset.id)
      let ri = rulesClassifyids.findIndex(item => item.id == id)
      if (ri !== -1) {
        rulesClassifyids.splice(ri, 1)
        data[pindex].num = data[pindex].num - 1
      } else {
        let ui = userClassifyids.findIndex(item => item.id == id)
        userClassifyids.splice(ui, 1)
        data[pindex].num = data[pindex].num - 1
      }
      this.setData({
        classifies: data
      })
    } else {
      let len = rulesClassifyids.length + userClassifyids.length
      if (len >= num) {
        app.showMyTips('工种最多可以选择' + num + '个')
        return false
      }
      userClassifyids.push({
        id: id,
        name: name
      })
      let cnum = data[pindex].num || 0
      data[pindex].num = cnum + 1
      this.setData({
        userClassifyids: userClassifyids,
        classifies: data
      })
    }
    this.setEnterInfo('userClassifyids', userClassifyids)
    this.setEnterInfo('rulesClassifyids', rulesClassifyids)
    this.initChildWorkType()
  },
  getWorkText: function () {
    let list = this.data.userClassifyids.concat(this.data.rulesClassifyids)
    //记录选中工种的id并存入this.data.selectedClassifies中
    let selectWorkType = list.map(function (item,index) {
      return item.id
    })
    list.splice(5)
    list = list.map(item => item.name)
    this.setData({
      showClassifyText: list.join(','),
      selectedClassifies: selectWorkType
    })
  },
  userGetCode: function () {
    let _this = this;
    let phone = this.data.data.user_mobile;
    let status = this.data.status;
    if (!status) return false;
    let v = vali.v.new();
    if (!v.isMobile(phone)) {
      app.showMyTips("手机号输入有误！");
      return false;
    }
    this.setData({
      status: false
    });
    app.appRequestAction({
      title: "正在获取验证码",
      url: "index/send-tel-code/",
      way: "POST",
      params: {
        tel: phone,
        sendType: "have"
      },
      success: function (res) {
        let mydata = res.data;
        app.showMyTips(mydata.errmsg);
        if (mydata.errcode == "ok") {
          let _time = mydata.refresh;
          _this.initCountDown(_time);
        } else {
          _this.setData({
            status: true
          });
        }
      },
      fail: function () {
        _this.setData({
          status: true
        });
        wx.showToast({
          title: '网络错误，获取失败！',
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  initCountDown: function (_time) {
    let _t = parseInt(_time);
    let _this = this;
    this.setData({
      status: false,
      codeTips: _t + "秒后重试"
    });
    let timer = setInterval(function () {
      _t--;
      if (_t == 0) {
        clearInterval(timer);
        _this.setData({
          status: true,
          codeTips: "获取验证码"
        })
        return false;
      }
      _this.setData({
        codeTips: _t + "秒后重试"
      })
    }, 1000)
  },
  subscribeToNews: function(mydata) {
    app.subscribeToNews("recruit",function(){
      wx.showModal({
        title: '恭喜您',
        content: mydata.errmsg,
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          wx.reLaunch({ url: '/pages/published/recruit/list' })
        }
      })
    })
  },
  publishRecruitInfo: function () {
    var _this =this
    let v = vali.v.new();
    let {
      infoId,
      addressData,
      data,
      phone,
      userClassifyids,
      rulesClassifyids,
      userInfo,
      model
    } = _this.data
    //输入信息后的字段对象
    //处理图片数组取出数组对象中url
    let imagsArry = []
    _this.data.imgs.forEach(function (item,index) {
      imagsArry.push(item.url)
    })
    let imags = imagsArry.join(",")
    let dataJson = {
      detail:_this.data.data.detail,
      address:_this.data.addressData.title,
      province_id:_this.data.data.province_id,
      city_id:_this.data.data.city_id,
      county_id:_this.data.data.county_id,
      selectedClassifies:_this.data.selectedClassifies.sort(),
      user_name:_this.data.data.user_name,
      user_mobile:_this.data.data.user_mobile,
      imgs:imags,
    }
    //如果是修改界面再没有更改数据的情况下不能保存
    if (_this.data.infoId) {
      if (_this.data.reason != "0") {
        if (model == JSON.stringify(dataJson)){
          let reason = _this.data.reason
          wx.showModal({
            title: '审核失败',
            content: "失败原因："+reason,
            showCancel: false,
            confirmText:"立即修改",
            success: function (res) { }
          })
          return false;
        }
      }
    }
    if (!data.detail) {
      wx.showModal({
        title: '提示',
        content: '请输入招工详情。',
        showCancel: false
      })
      return false
    }
    if (data.detail.length < 3) {
      wx.showModal({
        title: '提示',
        content: '请正确输入3~500字招工详情。',
        showCancel: false
      })
      return false
    }
    if (!v.isChinese(data.detail)) {
      wx.showModal({
        title: '提示',
        content: '请正确输入3~500字招工详情,必须含有汉字。',
        showCancel: false
      })
      return false
    }
    if (!addressData.location) {
      if(_this.data.infoId) {
        let { id } = _this.data;
        if(!id){
          wx.showModal({
            title: '提示',
            content: "请选择招工所在地。",
            showCancel: false
          })
          return
      }}else{
        wx.showModal({
          title: '提示',
          content: '请选择招工城市。',
          showCancel: false
        })
        return false
      }
    }
    let works = [...userClassifyids, ...rulesClassifyids]
    works.splice(5)
    let ids = works.map(item => item.id)
    
    if (!works.length) {
      wx.showModal({
        title: '提示',
        content: '请选择工种。',
        showCancel: false
      })
      return false
    }
    
    if (!v.regStrNone(_this.data.data.user_name) || !v.chineseReg(_this.data.data.user_name) || (_this.data.data.user_name).trim().length<2) {
      if (infoId) {
        app.showMyTips("请输入2~5字纯中文姓名！");
        return false;
      }
    }
  
    if (!data.user_mobile) {
      wx.showModal({
        title: '提示',
        content: '请输入联系电话。',
        showCancel: false
      })
      return false
    }
    if (!v.isMobile(data.user_mobile)) {
      wx.showModal({
        title: '提示',
        content: '请正确输入11位联系电话。',
        showCancel: false
      })
      return false;
    }
    if (data.user_mobile == _this.data.normalTel) {
      wx.showModal({
        title: '提示',
        content: '该手机号暂不支持发布招工信息，请重新输入。',
        showCancel: false
      })
      return false
    }
    if (!data.code) {
      if (data.user_mobile != phone) {
        wx.showModal({
          title: '提示',
          content: '请输入验证码。',
          showCancel: false
        })
        return false
      }
    }

    let imgs = []; // 图片数组
    if (_this.data.switch) {
      imgs = _this.data.imgs.map(item => item.url)
    }
    
    
    let mydata = {
      ...userInfo,
      ...data,
      adcode: addressData.adcode,
      location: addressData.location,
      address: addressData.title + '@@@@@@' + addressData.district,
      classifies: ids,
      images: imgs,
      infoId: infoId,
    }
    console.log("mydata1",mydata)
    app.appRequestAction({
      url: 'publish/new-save-job/',
      way: 'POST',
      params: mydata,
      success: function (res) {
        app.globalData.isRuleClass = false
        let resdata = res.data
        if (res.data.errcode == "ok") {
          //发布成功后，清除缓存数据中的detail、rulesClassifyids、userClassifyids、imgs
          if (!infoId) {
            let jiSuData = wx.getStorageSync('jiSuData')
            jiSuData.detail = ''
            jiSuData.rulesClassifyids = []
            jiSuData.userClassifyids = []
            jiSuData.imgs = []
            wx.setStorageSync('jiSuData', jiSuData)
          }
          //发布成功后再次进入发布界面重新读取用户信息手机号码
          app.globalData.isRedPhone = true
          // 存入最近两个成功信息
          if (!userInfo) {
            let jobid = res.data.id
            let tel = res.data.tel
            let jsdata = wx.getStorageSync('userJiSuPublishedData')
            if (jsdata) {
              jsdata.push({
                job_id: jobid,
                tel: tel
              })
              jsdata = jsdata.slice(jsdata.length - 2)
            } else {
              jsdata = [{
                job_id: jobid,
                tel: tel
              }]
            }
            wx.setStorageSync('userJiSuPublishedData', jsdata)
          }
          if (_this.data.infoId) {
            //弹出接收通知的提示框
            _this.subscribeToNews(resdata)
          }else{
            wx.navigateTo({
              url: '/pages/issue/tips/tips',
            })
          }
          
        } else if (res.data.errcode == "member_forbid" || res.data.errcode == "login_over_time") {
          wx.showModal({
            title: '提示',
            content: resdata.errmsg,
            cancelText: '确定',
            confirmText: '联系客服',
            success: function (res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: app.globalData.serverPhone
                })
              }
            }
          })
        } else if (res.data.errcode == "auth_forbid") {
          wx.showModal({
            title: '提示',
            content: resdata.errmsg,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/realname/realname',
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: resdata.errmsg,
            showCancel: false
          })
        }
      }

    })

  },
  returnPrevPage: function () {
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    if (prePage) {
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  bindGetUserInfo: function (e) {
    let that = this;
    app.bindGetUserInfo(e, function (res) {
      app.mini_user(res, function (res) {
        app.api_user(res, function (res) {
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
            that.initInfo();
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("option",options)
    if (options.hasOwnProperty('id')) {
      this.setData({
        infoId: options.id
      })
    }
    this.initInfo()
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
    if (path == "pages/issue/tips/tips") {
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
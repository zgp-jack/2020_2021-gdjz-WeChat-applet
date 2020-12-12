const app = getApp();
let areas = require("../../utils/area");
let area = app.arrDeepCopy(areas.getAreaArr)
area.splice(0, 1)
const Amap = require("../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({
  key: app.globalData.gdApiKey
});
let v = require('../../utils/v');


Page({
  data: {
    titleImage: app.globalData.apiImgUrl + "new-publish-title-t-icon.png",
    areaData: {
      // 城市id
      id: 0,
      // 省id
      pid: 0,
      // 城市名称
      name: ''
    },
    // 期望地区文本数据
    areatext: '',
    //用户信息
    userInfo: {},
    // 工种选择文本
    showClassifyText: "",
    // 最大工种数量
    maxWorkNum: 3,
    // 工种字段
    classifies: [],
    // 选择一级工种index
    pindex: 0,
    // 子类工种数据
    childClassifies: [],
    // 根据详情匹配的工种数据
    rulesClassifyids: [],
    // 用户选择的工种数据
    userClassifyids: [],
    // 所需工种显示的工种文本信息
    showClassifyText: "",
    // 工种选择框是否显示
    showPicker: false,
    // 选择或者匹配的工种id数组
    selectedClassifies: [],
    ruserClassifyids: [], // 备份
    rchildClassifies: [], // 备份
    rclassifies: [], //备份
    // 是否展示快速发布找工作
    showfindwork: false,
    // 是否展示验证码输入框
    showTel: true,
    // 用户手机号码
    telPhone: "",
    // 输入手机号
    phone: "",
    // 验证码时间
    sendrefresh: 60,
    // 第一次获取验证码
    firstGetCode: true,
    // 是哪个界面2、3(找活名片)或者1（招工详情）
    type: false,
    // 验证码
    code: '',
    selectimg: app.globalData.apiImgUrl + 'select.png',
    isScroll: false,
    //选中的期望地区
    selectCityData: [],
    //选中期望地区的name
    selectCityName: '',
    //选中期望地区的id
    selectCityId: '',
    initIssueData:{},
    fastInfo:'',
    selectCityId:''
  },

  // 点击期望地区隐藏软键盘
  hideKeyboard: function () {
    // wx.hideKeyboard()
    this.selectComponent("#cityPicker").show();
  },
  onfocus: function () {
    this.setData({
      isScroll: false
    })
  },
  onblur: function () {
    this.setData({
      isScroll: true
    })
  },
  // 输入验证码
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 输入电话号码
  inputPhoneNumber: function (e) {
    // 输入的电话号码
    let phoneNumber = e.detail.value;
    // 设置电话号码到data中
    this.setData({
      phone: phoneNumber
    })
  },

  // 点击所需工种显示工种选择
  showWorkTypePicker: function () {
      // 避免用户选择之后取消，所以对数据进行一次备份
      this.setData({
        rchildClassifies: JSON.parse(JSON.stringify(this.data.childClassifies)),
        ruserClassifyids: JSON.parse(JSON.stringify(this.data.userClassifyids)),
        rclassifies: JSON.parse(JSON.stringify(this.data.classifies)),
        rpindex: this.data.pindex,
        showPicker: true,
      })
      wx.hideKeyboard()
  },
  // 点击取消关闭工种选择
  cancelWorkTypePicker: function () {
      this.setData({
        showPicker: false,
        pindex: this.data.rpindex,
        userClassifyids: JSON.parse(JSON.stringify(this.data.ruserClassifyids)),
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
  // 初始化加载工种数据
  initWorkTypeData: function () {
      this.countWorkNum()
      this.initChildWorkType()
      this.getWorkText()
  },
  // 初始化子类工种信息和选中状态
  initChildWorkType: function () {
      // 父级工种index
      let index = this.data.pindex;
      // 用户选择工种字段
      let uids = this.data.userClassifyids;
      // 获取父级工种对应的子类工种信息
      let data = JSON.parse(JSON.stringify(this.data.classifies[index].children))
      // 循环遍历子类工种数据与自动匹配和选择工种数据进行对比相同就将对应工种数据变成选中状态
      for (let i = 0; i < data.length; i++) {
        if (uids.findIndex(item => item.id == data[i].id) !== -1) {
          data[i].checked = true
        } else {
          data[i].checked = false
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
      // 已经选择的工种数据
      let userClassifyids = this.data.userClassifyids
      // 全部工种数据
      let data = JSON.parse(JSON.stringify(this.data.classifies))
      // 选择的父类工种index
      let pindex = this.data.pindex
      // 如果是选中状态
      if (checked) {
        // 选择的工种找到对应的工种然后删除并将对应的选中数量减1
        let ui = userClassifyids.findIndex(item => item.id == id)
        userClassifyids.splice(ui, 1)
        data[pindex].num = data[pindex].num - 1
        // 重新设置选择工种数据
        this.setData({
          classifies: data
        })
      } else {
        // 从未选中状态到选中状态
        // 检查选择工种数量
        let len = userClassifyids.length
        // 大于规定数量给出提示
        if (len >= num) {
          app.showMyTips('最多选择' + num + '个工种')
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
      // 初始化子类工种的数据与选中状态
      this.initChildWorkType()
  },
  // 匹配的工种数量
  countWorkNum: function () {
    //用户选择工种字段
    let userClassifyids = JSON.parse(JSON.stringify(this.data.userClassifyids))
    //返回所有工种字段id数组
    let rulesClassifyids = userClassifyids.map(item => item.id)
    //rulesClassifyids数组长度
    let ruleLen = rulesClassifyids.length
    let classifyids = this.data.classifies
    //所有工种数组长度
    let len = classifyids.length
    //如果没有选择工种那么就将num置为0
    if (!ruleLen) {
      classifyids.forEach(function (item) {
        if (item.num) {
          item.num = 0
        }
      })
    }
    //记录选择工种的数量
    for (let i = 0; i < len; i++) {
      let data = classifyids[i].children
      let inum = 0
      for (let j = 0; j < data.length; j++) {
        let has = rulesClassifyids.indexOf(data[j].id)
        if (has !== -1) {
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
      let list = this.data.userClassifyids
      //记录选中工种的id并存入this.data.selectedClassifies中
      let selectWorkType = list.map(function (item, index) {
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
  // 点击确认发布，发布找活信息
  publishFindWork: function () {
    // 用户信息
    let userInfo = wx.getStorageSync('userInfo')
    // 没有用户信息直接返回
    if (!userInfo) return
    let userId = userInfo.userId;
    let token = userInfo.token;
    let tokenTime = userInfo.tokenTime;
    let provinces = this.data.selectCityData.map((item)=>item.id).join(",")
    let vali = v.v.new();
    let userClassifyids = this.data.userClassifyids;
    let occupations = this.data.selectedClassifies.join(",");
    let phone = this.data.phone;
    let code = this.data.code;
    
    // 验证是否有选择城市
    if (!provinces) {
      wx.showModal({
        title: '提示',
        content: "请选择期望工作地。",
        showCancel: false
      })
      return false
    }
    // 验证是否有选择工种
    if (!userClassifyids.length) {
      wx.showModal({
        title: '提示',
        content: '请选择工种。',
        showCancel: false
      })
      return false
    }
    // 验证是否有电话号码
    if (phone == "" || !phone) {
      wx.showModal({
        title: '提示',
        content: '请正确输入联系电话。',
        showCancel: false
      })
      return false
    }
    // 验证电话号码格式是否正确
    if (phone && !vali.isMobile(phone)) {
      wx.showModal({
        title: '提示',
        content: '请正确输入联系电话。',
        showCancel: false
      })
      return false;
    }
    // 验证是否输入验证码
    if (this.data.telPhone != phone) {
      if (code.length < 4 || code.length > 6) {
        wx.showModal({
          title: '提示',
          content: '请正确输入验证码',
          showCancel: false
        })
        return false
      }
    }
    // 发送请求参数
    let params = {
      provinces: provinces,
      tel: parseInt(phone),
      code: parseInt(code),
      occupations: occupations,
      userId,
      token,
      tokenTime,
    }
    app.appRequestAction({
      url: 'resumes/add-fast-resume/',
      way: 'POST',
      params: params,
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode === "ok") {
          wx.navigateTo({
            url: `/pages/clients-looking-for-work/finding-name-card/findingnamecard?isFastPublish=true`,
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: mydata.errmsg,
            showCancel: false,
            success(res) {}
          })
        }
      }
    })
  },
  // 初始化验证码时间
  initCodeTime: function () {
    let _this = this;
    let codeTime = this.data.sendrefresh;
    _this.data.timer = setInterval(function () {
      codeTime--;
      _this.setData({
        sendrefresh: codeTime
      })
      if (codeTime == 0) {
        clearInterval(_this.data.timer);
        return false;
      }
    }, 1000)
  },
  // 获取验证码
  reGetPhoneCode: function () {
    // 用户信息
    let userInfo = wx.getStorageSync('userInfo')
    // 没有用户信息直接返回
    if (!userInfo) return
    let userId = userInfo.userId;
    let token = userInfo.token;
    let tokenTime = userInfo.tokenTime;
    let phone = this.data.telPhone;
    let vali = v.v.new();
    let _this = this;
    // 发送请求参数
    let params = {
      tel: parseInt(phone),
      userId,
      token,
      tokenTime
    }
    // 验证是否有电话号码
    if (phone == "" || !phone) {
      wx.showModal({
        title: '提示',
        content: '请正确输入联系电话。',
        showCancel: false
      })
      return false
    }
    // 验证电话号码格式是否正确
    if (phone && !vali.isMobile(phone)) {
      wx.showModal({
        title: '提示',
        content: '请正确输入联系电话。',
        showCancel: false
      })
      return false;
    }
    app.appRequestAction({
      title: "正在获取验证码",
      mask: true,
      failTitle: "网络错误，验证码获取失败！",
      url: "index/get-code/",
      way: "POST",
      params: params,
      success: function (res) {
        let mydata = res.data;
        app.showMyTips(mydata.errmsg);
        if (mydata.errcode == "ok") {
          _this.setData({
            sendrefresh: 60,
            firstGetCode: false
          });
          _this.initCodeTime();
        }
      }
    })
  },
  //选择期望地区 点击确定
  cityComfirm(e) {
    let select = e.detail.params
    this.setData({
      selectCityData: select,
      selectCityName: select.map(item => item.name).join(" | "),
    })
  },
  //初始化发布找活名片
  initIssueResume() {
    // 用户信息
    let userInfo = wx.getStorageSync('userInfo')
    let userId = userInfo.userId;
    let token = userInfo.token;
    let tokenTime = userInfo.tokenTime;
    let params = {
      userId,
      token,
      tokenTime
    }
    let _this = this
    app.appRequestAction({
      url: 'resumes/fast-resume/',
      way: 'POST',
      params: params,
      success: function (res) {
        let mydata = res.data
        if(mydata.errcode == 'ok'){
          // 用户手机号
          let telPhone = mydata.data.hasOwnProperty("tel") ? mydata.data.tel : '';
          // 工种id
          let occId = mydata.data.hasOwnProperty("occ") ? mydata.data.occ : '';
          // 工种名称
          let occName = mydata.data.hasOwnProperty("occ_txt") ? mydata.data.occ_txt : '';
          // 城市id
          let id = mydata.data.hasOwnProperty("provinces_id") ? mydata.data.provinces_id : '';
          // 地区名称
          let name = mydata.data.hasOwnProperty("provinces_txt") ? mydata.data.provinces_txt : '';
          // 所有工种字段
          let occupations = mydata.data.hasOwnProperty("occupation_tree") ? mydata.data.occupation_tree : []
          _this.setData({
            userClassifyids: [{id: occId, name: occName}],
            classifies: occupations,
            selectCityData: [{id, name}],
            telPhone: telPhone,
            selectCityName: name,
            phone: telPhone
          })
          _this.initWorkTypeData()
        }else{
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              wx.navigateBack()
            }
          })
        }
      }
    })
  },

  onLoad(){
    // 初始化期望工作地、所需工种、联系电话等信息
    this.initIssueResume()
  },
  onShow(){

  }
})
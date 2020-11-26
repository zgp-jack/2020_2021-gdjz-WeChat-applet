// components/publishfindwork/publishfindword.js
const app = getApp();
let areas = require("../../utils/area");
let area = app.arrDeepCopy(areas.getAreaArr)
area.splice(0,1)
const Amap = require("../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
let v = require('../../utils/v');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fastInfo:{
      type: Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 选择区域数据
    areapicker: [],
    index: [0,0],
    mindex: [0,0],
    titleImage: app.globalData.apiImgUrl +"new-publish-title-t-icon.png",
    areaData:{
      // 城市id
      id: 0,
      // 省id
      pid: 0,
      // 城市名称
      name:''
    },
    // 期望地区文本数据
    areatext: '',
    //用户信息
    userInfo:{},
    // 工种选择文本
    showClassifyText:"",
    // 最大工种数量
    maxWorkNum: 3,
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
    // 工种选择框是否显示
    showPicker:false,
    // 选择或者匹配的工种id数组
    selectedClassifies: [],
    ruserClassifyids: [], // 备份
    rchildClassifies: [], // 备份
    rclassifies: [], //备份
    // 是否展示快速发布找工作
    showfindwork:false,
    // 是否展示验证码输入框
    showTel:true,
    // 手机号码
    telPhone:"",
    // 验证码时间
    sendrefresh:60,
    // 第一次获取验证码
    firstGetCode:true,
    // 是哪个界面2、3(找活名片)或者1（招工详情）
    type: false,
    // 验证码
    code:'',
    selectimg: app.globalData.apiImgUrl + 'select.png',
    isScroll:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击期望地区隐藏软键盘
    hideKeyboard: function () {
      wx.hideKeyboard()
    },
    onfocus: function() {
      this.setData({isScroll: false})
    },
    onblur: function () {
      this.setData({isScroll: true})
    },
    // 输入验证码
    inputCode: function (e) {
      this.setData({code: e.detail.value})
    },
    // 输入电话号码
    inputPhoneNumber: function (e) {
      // 输入的电话号码
      let phoneNumber = e.detail.value;
      // 设置电话号码到data中
      this.setData({telPhone: phoneNumber})
    },
    initLocArea:function(){
      // 获取满足积分消耗条件的位置信息
      let area = this.data.areaData;
      let areaData = (area.pid && area.id && area.name)? area: false;
      //获取手机本地缓存地理位置信息
      let gpsPorvince = wx.getStorageSync('gpsPorvince')?wx.getStorageSync('gpsPorvince'):false;
      let province = areaData?areaData:gpsPorvince
      //获取所有省的信息
      let allProvince = this.getProvinceLists()
      //判断如果有地理位置信息
      if(province){
        //本地地理位置信息与所有省份信息相同对应的allProvince的index
        let index = allProvince.findIndex(item => item.id == province.pid)
        //本地地理位置信息具体信息
        let item = allProvince[index]
        //记录本地位置信息到data中
        this.setData({
          index:[index,0],
          "mindex[0]":index
        })
        //获取所有城市信息
        let cities = this.getCityLists()
        //从城市列表中匹配与本地位置对应的index
        let ci = cities.findIndex(item=>item.id == province.id)
        // 组合成初始化picker数据
        let areapicker = [allProvince,cities]
        this.setData({
          'areaData.id': (province.pid === province.id)? 0 : province.id,
          'areaData.pid': province.pid,
          'areaData.name': province.name,
          areatext: (province.pid === province.id)? item.name: item.name + province.name,
          index: [index,ci],
          mindex: [index,ci],
          areapicker: areapicker
        })
      }else{
        //获取所有城市信息
        let cities = this.getCityLists()
        // 组合成初始化picker数据
        let areapicker = [allProvince,cities]
        this.setData({
          areapicker
        })
      }
    },
    initAreaData:function(){
      let _this = this;
      let area = this.data.areaData;
      let areaData = (area.pid && area.id && area.name)? area: false;
      //获取手机本地缓存地理位置信息
      let gpsPorvince = wx.getStorageSync('gpsPorvince')?wx.getStorageSync('gpsPorvince'):false;
      let province = areaData?areaData:gpsPorvince
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
                'areaData.id': 0,
                'areaData.pid': 0,
                'areaData.name': '',
                areatext: ""
              })
              _this.initLocArea();
            }
          })
      }
    },
    // 获取省的数据
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
    // 获取城市数据
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
    // 期望地区的文本展示数据
    getAreaText:function(){
      let index = this.data.index
      let areapicker = this.data.areapicker
      let ptext = areapicker[0][index[0]].name
      let ctext = areapicker[1][index[1]].name
      let id = ptext == ctext? 0 : areapicker[1][index[1]].id
      let pid = ptext == ctext? areapicker[1][index[1]].id:areapicker[1][index[1]].pid
      let text = ''
      if(ptext == ctext){
        text = ptext
      }else{
        text = ptext + ctext
      }
      this.setData({
        areatext: text,
        'areaData.id':id,
        'areaData.pid':pid,
        'areaData.name':ctext,
      })
    },
    // picker改变列的时候
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
    // picker value改变的时候
    bindPickerChange:function(e){
      let data = e.detail.value
      let mydata = this.data.areapicker[1]
      let pid = mydata[data[1]].pid
      let id = mydata[data[1]].id
      let name = mydata[data[1]].name
      this.setData({
        'areaData.pid': pid,
        'areaData.id': id,
        'areaData.name': name,
        index: data
      })
      this.getAreaText()
    },
    // 点击取消关闭快速发布找活名片
    closeFindWork: function () {
      // type值是2或者3代表是找活名片快速发布
      let type = this.data.type
      // type存在关闭弹窗后续还会继续弹窗，
      // 反之（招工信息）点击取消后，当天不再展示
      if (type) {
        this.triggerEvent("cancelPublish")
        this.show()
      }else{
        let myDate = new Date();
        // 当前时间戳
        let currentTime = myDate.getTime();
        // 到期时间戳（23:59:59）
        let dueDate = (new Date(new Date().toLocaleDateString())).getTime() +  (24 * 60 * 60 * 1000 - 1);
        // let dueDate = currentTime +  (2 * 60 * 1000 - 1);
        // 存入缓存
        let FindWorkTime = {currentTime:currentTime,dueDate:dueDate}
        wx.setStorageSync("FindWorkTime",FindWorkTime)
        this.triggerEvent("cancelPublish")
        this.show()
        app.globalData.isShowFindWork = false;
      }
    },
    clooseTip: function () {
      let myDate = new Date();
      let currentTime = myDate.getTime();
      let dueDate = currentTime +  (24 * 7* 60 * 60 * 1000 - 1);
      // let dueDate = currentTime +  (2 * 60 * 1000 - 1);
      let FindWorkTime = {currentTime:currentTime,dueDate:dueDate}
      wx.setStorageSync("FindWorkTime",FindWorkTime)
      this.show()
      this.triggerEvent("cancelPublish")
      app.globalData.isShowFindWork = false;
    },
    // 显示快速找活名片
    show: function () {
      this.setData({showfindwork:!this.data.showfindwork})
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
        classifyids.forEach(function(item){
          if (item.num) {
            item.num = 0
          }
        })
      }
      //记录选择工种的数量
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
      let list = this.data.userClassifyids
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
    // 点击确认发布，发布找活信息
    publishFindWork: function () {
      // 用户信息
      let userInfo = wx.getStorageSync('userInfo')
      // 没有用户信息直接返回
      if (!userInfo) return
      let userId = userInfo.userId;
      let token	= userInfo.token;
      let tokenTime	= userInfo.tokenTime;
      let that = this;
      let vali = v.v.new();
      let { id, pid } = this.data.areaData;
      let userClassifyids = this.data.userClassifyids;
      let occupations = this.data.selectedClassifies.join(",");
      let phone = this.data.telPhone;
      let code = this.data.code;
      // 验证是否有选择城市
      if (!id && !pid) {
        wx.showModal({
          title: '提示',
          content: "请选择招工城市。",
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
      if (this.properties.fastInfo.tel != phone) {
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
      let params = { province: parseInt(pid), city: parseInt(id), tel: parseInt(phone), code: parseInt(code), occupations: occupations, userId, token, tokenTime }
      app.appRequestAction({
        url: 'resumes/add-fast-resume/',
        way: 'POST',
        params: params,
        success: function (res) {
          let mydata = res.data;
          if (mydata.errcode === "ok") {
            let defalutTop = mydata.data.default_top_area;
            that.triggerEvent("refreshPage",{ defalutTop: defalutTop })
            that.show()
            app.globalData.isShowFindWork = false;
          }else{
            wx.showModal({
              title: '温馨提示',
              content: mydata.errmsg,
              showCancel: false,
              success(res) {
               }
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
          _this.setData({ sendrefresh: codeTime })
          if (codeTime == 0) {
              clearInterval(_this.data.timer);
              return false;
          }
      }, 1000)
    },
    // 获取验证码
    reGetPhoneCode:function(){
      // 用户信息
      let userInfo = wx.getStorageSync('userInfo')
      // 没有用户信息直接返回
      if (!userInfo) return
      let userId = userInfo.userId;
      let token	= userInfo.token;
      let tokenTime	= userInfo.tokenTime;
      let phone = this.data.telPhone;
      let vali = v.v.new();
      let _this = this;
      // 发送请求参数
      let params = { tel: parseInt(phone), userId, token, tokenTime }
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
                  _this.setData({ sendrefresh: 60, firstGetCode:false });
                  _this.initCodeTime();
              }
          }
      })
    },
  },
  /**
    * 生命周期函数
    */
  lifetimes: {
    attached: function () { 
      console.log(this.data)
    },
  },
  /**
    * 监测属性值变化
    */
  observers: {
    'fastInfo': function (newVal) {
      // 定义位置数据
      let areaData = {};
      let classifyids = [];
      // 是哪个界面2、3(找活名片)或者1（招工详情）
      let type = newVal.hasOwnProperty("type")? newVal.type: '';
      let telPhone = newVal.hasOwnProperty("tel")? newVal.tel: '';
      // 判断是否有工种、区域数据字段，并保存相关数据
      // 工种id
      let occId = newVal.hasOwnProperty("occ")? newVal.occ: '';
      // 工种名称
      let occName = newVal.hasOwnProperty("occ_txt")? newVal.occ_txt: '';
      // 省或者直辖市id
      let pid = newVal.hasOwnProperty("province_id")? newVal.province_id: '';
      // 城市id
      let id = newVal.hasOwnProperty("city_id")? newVal.city_id: '';
      // 省或者直辖市名称
      let provinceText = newVal.hasOwnProperty("province_txt")? newVal.province_txt:'';
      // 城市名称
      let cityText = newVal.hasOwnProperty("city_txt")? newVal.city_txt:'';
      // 所有工种字段
      let occupations = newVal.hasOwnProperty("occupation_tree")? newVal.occupation_tree:[]
      if (JSON.stringify(newVal) != "{}") {
        // 如果id = 0，代表是直辖市，否则是市数据
        if (id === "0") {
          areaData.pid = pid;
          areaData.id = pid;
          areaData.name = provinceText
        } else {
          areaData.pid = pid;
          areaData.id = id;
          areaData.name = cityText
        }
        if (occId) {
          // 组合工种数据
          classifyids = [{ id: occId, name: occName }];
        }
        this.setData({userClassifyids:classifyids, classifies:occupations, areaData:areaData, type:type, telPhone:telPhone});
        // 初始化用户位置信息
        this.initAreaData()
        // 初始化工种信息
        this.initWorkTypeData()
      }else{
        this.setData({userClassifyids:classifyids, classifies:occupations, areaData:areaData, type:type, telPhone:telPhone});
      }
    }
  }
})

// components/publishfindwork/publishfindword.js
const app = getApp();
let areas = require("../../utils/area");
let area = app.arrDeepCopy(areas.getAreaArr)
area.splice(0,1)
const Amap = require("../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({ key: app.globalData.gdApiKey });
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info:{
      type: Object,
      value: {},
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
    // 城市id
    id:0,
    // 省id
    pid:0,
    // 期望地区文本数据
    areatext: '',
    //保存onload传过来的token
    token: '',
    //用户信息
    userInfo:{},
    // 工种选择文本
    showClassifyText:"",
    maxNum:3,
    // 最大图片数量
    maxImgNum: 0,
    // 最大工种数量
    maxWorkNum: 0,
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
    // 标题城市
    titleCity:'',
    // 标题工种
    titleOcc:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 输入电话号码
    inputPhoneNumber: function (e) {
      // 输入的电话号码
      let phoneNumber = e.detail.value;
      // 设置电话号码到data中
      this.setData({telPhone: phoneNumber})
    },
    initLocArea:function(){
      // 获取满足积分消耗条件的找工作信息
      let findWorkData = wx.getStorageSync('findWorkData');
      let areaData = findWorkData?(findWorkData.areaData?findWorkData.areaData:false):false;
      //获取手机本地缓存地理位置信息
      let gpsPorvince = wx.getStorageSync('gpsPorvince')?wx.getStorageSync('gpsPorvince'):false;
      let province = areaData?areaData:gpsPorvince
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
          pid: item.id,
          areatext: province.pid == province.id? item.name: item.name + province.name,
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
        // 组合成初始化picker数据
        let areapicker = [allProvince,cities]
        this.setData({
          areapicker
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
      let findWorkData = wx.getStorageSync('findWorkData');
      let areaData = findWorkData?(findWorkData.areaData?findWorkData.areaData:false):false;
      //获取手机本地缓存地理位置信息
      let gpsPorvince = wx.getStorageSync('gpsPorvince')?wx.getStorageSync('gpsPorvince'):false;
      let province = areaData?areaData:gpsPorvince
      // 保存城市数据
      this.setData({
        titleCity: province? province.name: ''
      })
      if(province){
          this.initLocArea()
      }else{
          amapFun.getRegeo({
            success: function (data) {
              console.log(data)
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
    // 获取省的数据
    getProvinceLists:function(){
      let len = area.length
      //省信息数组
      let arr = []
      for(let i = 0;i< len; i++){
        let data = area[i]
        arr.push({id:data.id,pid:data.pid,name:data.name})
      }
      console.log(area)
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
      let id = areapicker[1][index[1]].id
      let pid = areapicker[0][index[0]].id
      let text = ''
      if(ptext == ctext){
        text = ptext
      }else{
        text = ptext + ctext
      }
      this.setData({
        areatext: text,
        id:id,
        pid:pid
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
      this.setData({
        pid: pid,
        id: id,
        index: data
      })
      this.getAreaText()
    },
    // 点击取消关闭快速发布找活名片
    closeFindWork: function () {
      this.show()
    },
    // 显示快速找活名片
    show: function () {
      this.setData({showfindwork:!this.data.showfindwork})
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
    // 设置缓存保留已填写信息
    setEnterInfo: function (name, data) {
      let key = 'findWorkData'
      let findWorkData = wx.getStorageSync(key)
      if (findWorkData) {
        findWorkData[name] = data
      } else {
        findWorkData = {}
        findWorkData[name] = data
      }
      wx.setStorageSync(key, findWorkData)
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
        let findWorkData = wx.getStorageSync('findWorkData');
        let classifyids = findWorkData?(findWorkData.userClassifyids || []):[]
        // 最大图片数量
        let maxImgNum = resolve.typeTextArr.maxImageCount;
        // 最大工种数量
        let maxWorkNum = resolve.typeTextArr.maxClassifyCount;
        // 工种字段
        let classifies = resolve.classifyTree;
        // 保存到data中
        this.setData({ maxImgNum ,maxWorkNum ,classifies,userClassifyids: classifyids, titleOcc: classifyids.length === 0?'':classifyids[0].name })
        this.countWorkNum()
        this.initChildWorkType()
        this.getWorkText()
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
      })
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
      let { id, pid } = this.data;
      let userClassifyids = this.data.userClassifyids;
      let occupations = this.data.selectedClassifies.join(",");
      if (!id || !pid) {
        wx.showModal({
          title: '提示',
          content: "请选择招工城市。",
          showCancel: false
        })
        return false
      }
      if (!userClassifyids.length) {
        wx.showModal({
          title: '提示',
          content: '请选择工种。',
          showCancel: false
        })
        return false
      }

      console.log(id,pid,occupations)
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

      let _this = this;
      let phone = this.data.telPhone;
      app.appRequestAction({
          title: "正在获取验证码",
          mask: true,
          failTitle: "网络错误，验证码获取失败！",
          url: "fast-issue/get-code/",
          way: "POST",
          params: { phone: phone},
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
      // 初始化工种信息
      this.initWorkTypeData()
      // 初始化用户位置信息
      this.initAreaData()
    },
  },
  /**
    * 监测属性值变化
    */
  observers: {
    info: function (newVal) {
      // 获取类型是从哪个界面来的数据
      let type = newVal.type;
      // 判断是否是从找工作详情来数据
      if ( type === "findWorkDetail" ) {
        // 定义位置数据
        let areaData = {}
        // 判断是否有工种、区域数据字段，并保存相关数据
        let occId = newVal.hasOwnProperty("occ")? newVal.occ: '';
        let occName = newVal.hasOwnProperty("occ_txt")? newVal.occ_txt: '';
        let pid = newVal.hasOwnProperty("province_id")? newVal.province_id: '';
        let id = newVal.hasOwnProperty("city_id")? newVal.city_id: '';
        let provinceText = newVal.hasOwnProperty("province_txt")? newVal.province_txt:'';
        let cityText = newVal.hasOwnProperty("city_txt")? newVal.city_txt:'';
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
        // 组合工种数据
        let classifyids = [{ id: occId, name: occName }];
        // 保存到data数据中
        this.setEnterInfo("userClassifyids",classifyids);
        this.setEnterInfo("areaData",areaData)
      }
      this.setData({telPhone:newVal.tel})
    }
  }
})

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
    info:Object
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
    id:0,
    // 期望地区文本数据
    areatext: '',
    //保存onload传过来的token
    token: '',
    //用户信息
    userInfo:{},
    // 工种选择文本
    showClassifyText:"",
    imglen:0,
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
    // 工种选择框是否显示
    showPicker:false,
    // 选择或者匹配的工种id数组
    selectedClassifies: [],
    rrulesClassifyids: [], // 备份
    ruserClassifyids: [], // 备份
    rchildClassifies: [], // 备份
    rclassifies: [], //备份
    // 是否展示快速发布找工作
    showfindwork:false,
    // 是否展示验证码输入框
    showTel:true,
    // 手机号码
    telPhone:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
      console.log("index",index)
        let item = allProvince[index]
      //记录本地位置信息到data中
        this.setData({
          id: province.id,
          areatext: item.name + province.name,
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
        text = ptext + ctext
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
})

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
    id:0,
    areapicker: [],
    index: [0,0],
    mindex: [0,0],
    areatext: '',
    token: ''
  },
  initLocArea:function(){
    let province = wx.getStorageSync('gpsPorvince')
    let allProvince = this.getProvinceLists()
    let cities = this.getCityLists()
    if(province){
      let index = allProvince.findIndex(item => item.id == province.pid)
      let item = allProvince[index]
      this.setData({
        id: province.id,
        areatext: item.name + '-' + province.name,
        index:[index,0]
      })
    
      let ci = cities.findIndex(item=>item.id == province.id)
      this.setData({
        "index[1]": ci,
        "mindex[1]": ci
      })
    }
    let areapicker = [allProvince,cities]
    this.setData({
      areapicker
    })
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
    let arr = []
    for(let i = 0;i< len; i++){
      let data = area[i]
      arr.push({id:data.id,pid:data.pid,name:data.name})
    }
    return arr;
  },
  getCityLists:function(){

    let index = this.data.mindex[0]
    let data = area[index]
    let has = data.has_children
    let arr = []
    if(has){
      let len = data.children.length
      for(let i = 1; i< len;i++){
        let cdata = data.children[i]
        arr.push({id:cdata.id,pid:cdata.pid,name:cdata.name})
      }
    }else{
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
  sureAreaAction:function(){
    let { token,id } = this.data;
    if(!id){
      app.showMyTips("请选择您的招工所在地");
      return
    }
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
                  url: '/pages/fast/tips/tips',
                })
            }else{
              app.showMyTips(mydata.errmsg);
            }
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: options.token
    })
    this.initAreaData()
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
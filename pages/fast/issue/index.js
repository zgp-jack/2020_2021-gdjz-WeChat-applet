// pages/publish/issue/index.js
let v = require('../../../utils/v');
// let restful = require('../../utils/restful')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    phone: '',
    showTel: false,
  },
  checkType: function(obj, _type){
    var _re = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    if(_type == undefined) return _re;
    if (_re == _type) return true;
    return false;
  },
  enterContent:function(e){
    let val = e.detail.value;
    this.setData({
      content: val
    })
    let content = val.replace(/\s+/g, "");
    let _partten = /1[3-9]\d{9}/g;
    let phone = content.match(_partten);
    if(this.checkType(phone,'array')){
        let tel = phone[0];
        this.setData({ showTel: true, phone: tel });
    }
  },
  enterPhone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  contentBlur:function(){
    if (this.data.phone) {
      this.setData({
        showTel: true
      })
    }
  },
  publishRecurit:function(){
    let vali = v.v.new();
    let { content, phone } = this.data
    if(content == ""){
      app.showMyTips('请输入招工详情。')
      return false;
    }
    if(content.length < 3 || content.length > 500){
      app.showMyTips('请正确输入3~500字招工详情。')
      return false;
    }
    if (phone == "") {
      app.showMyTips('请输入联系电话。')
      return false
    }
    if(phone && !vali.isMobile(phone)){
      app.showMyTips('请正确输入11位联系电话。')
      return false;
    }
    app.appRequestAction({
      url: 'fast-issue/issue/',
      params: {content,phone},
      way: 'POST',
      success:function(res){
        if(res.data.errcode == "ok"){
          let mydata = res.data.data
          app.globalData.fastToken = mydata.token
          if(mydata.checked){
            wx.navigateTo({
              url: '/pages/fast/area/area?token='+mydata.token,
            })
          }else{
            wx.navigateTo({
              url: '/pages/fast/code/code?token='+mydata.token+'&tel='+phone,
            })
          }
        }
        if (res.data.errcode == "unusable") {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: true,
            cancelColor:"#797979",
            cancelText:"知道了",
            confirmText:"联系客服",
            confirmColor:"#009CFF",
            success:function (res) {
              if(res.confirm){
                
              }
            }
          })
        }
        if(res.data.errcode !== "unusable" && res.data.errcode !== "ok"){
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
      }
    })
  },
  clearContent:function(){
    this.setData({
      content: ''
    })
  },
  initClipboardData:function(){
    let _this = this;
    try{
        wx.getClipboardData({
            success(res) {
              let d = res.data;
              let p = /1[3-9]\d{9}/g;
              let phone = d.match(p);
              if (_this.checkType(phone, 'array')) {
                _this.setData({ content: res.data, phone: phone[0],showTel: true })
              }
            }
        })
    }
    catch(err){
        console.log(err);
    }
  },
  startRecord:function(){
    restful.startRecord()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initClipboardData()
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

    let path = pages[1].__displayReporter.showReferpagepath
    console.log("path",pages)
    path = path.slice(0,-5)
    if( path == "pages/fast/tips/tips" || path == "pages/fast/area/area"){
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
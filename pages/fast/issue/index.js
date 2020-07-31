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
    this.setData({
      showTel: true
    })
  },
  publishRecurit:function(){

    let vali = v.v.new();
    let { content, phone } = this.data
    if(content.length < 3){
      app.showMyTips('请输入正确的招工信息')
      return false;
    }
    if(!vali.isMobile(phone)){
      app.showMyTips('请输入正确的手机号')
      return false;
    }
    app.appRequestAction({
      url: 'fast-issue/issue/',
      params: {content,phone},
      way: 'POST',
      success:function(res){
        if(res.data.errcode == "ok"){
          let mydata = res.data.data
          if(mydata.checked){
            wx.navigateTo({
              url: '/pages/fast/area/area?token='+mydata.token,
            })
          }else{
            wx.navigateTo({
              url: '/pages/fast/code/code?token='+mydata.token+'&tel='+phone,
            })
          }
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false
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
    let path = pages[0].__displayReporter.showReferpagepath
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
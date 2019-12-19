// pages/clients-looking-for-work/ranking-rules/ranking-rules.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rulestatus:"",
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getstatus(options){
    console.log(options)
    this.setData({
      rulestatus: options.hasOwnProperty("rulestatus") ? options.rulestatus:""
    })
  },

  getdetail(){
    let that = this;
    app.appRequestAction({
      url: 'resumes/sort-rules/',
      way: 'POST',
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok"){
          that.setData({
            list: mydata.data.lists,
            listlength: mydata.data.lists.length
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.getstatus(options)
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
    this.getdetail()
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
    let that = this;
    let status = that.data.rulestatus;
    console.log(status)
    let commonShareImg = app.globalData.commonShareImg;
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    let commonShareTips = app.globalData.commonShareTips;
    if (status == 2) {
      let refId = userInfo.userId;
        return {
          title: commonShareTips,
          imageUrl: commonShareImg,
          path: `/pages/index/index?refId=${refId}`//这是一个路径
        }
    } else {
      return {
        title: commonShareTips,
        imageUrl: commonShareImg,
        path: `/pages/findingworkinglist/findingworkinglist`//这是一个路径
      }
    }
  }
})
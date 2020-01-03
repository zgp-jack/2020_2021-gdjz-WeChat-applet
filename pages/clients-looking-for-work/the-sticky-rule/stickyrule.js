// pages/clients-looking-for-work/the-sticky-rule/stickyrule.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgDetelte: '../../../images/delete.png',
    areaText: [],
    areadata: [],

  },
  changeAreaData() {
    let that = this;
    for (let i = 0; i < that.data.areadata.length; i++) {
      that.data.areadata[i].selected = 1
    }
    that.setData({
      areadata: that.data.areadata
    })


  },
  getAreaData(options) {
    let that = this;
    app.appRequestAction({
      url: 'resumes/top-areas/',
      way: 'POST',
      success: function (res) {
        let mydata = res.data;

        if (mydata.errcode == "ok") {

          that.setData({
            areadata: mydata.data.provinces
          })
          that.changeAreaData()
          that.modifyArea(options)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) { }
          })
          return
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },
  chooseThisCtiy(e) {

    let num = e.currentTarget.dataset.id.id;

    let that = this;
    if (that.data.areadata[num - 2].selected == 1) {
      that.data.areadata[num - 2].selected = 2;
      that.setData({
        areadata: that.data.areadata
      })
      that.data.areaText.push(that.data.areadata[num - 2])
      that.setData({
        areaText: that.data.areaText
      })
      if (that.data.areaText.length>3){
        that.setData({
          scrollLeft: "120" + ((that.data.areaText.length-3)*40)
        })
      }
    } else {
      let j = ''
      that.data.areadata[num - 2].selected = 1;
      that.setData({
        areadata: that.data.areadata
      })
      for (let i = 0; i < that.data.areaText.length ; i ++){
        if (that.data.areaText[i].id == num){
          j = i
        }
      }
      that.data.areaText.splice(j,1)
      that.setData({
        areaText: that.data.areaText
      })
    }
  },

  deletelable(e){

    let that = this;

    let num = e.currentTarget.dataset.id.id;
    let number = e.currentTarget.dataset.index;
    that.data.areadata[num - 2].selected = 1;
    that.setData({
      areadata: that.data.areadata
    })
    that.data.areaText.splice(number,1)
    that.setData({
      areaText: that.data.areaText
    })
  },
  seleted(){
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({                                      //修改上一个页面的变量
      areaTextcrum: that.data.areaText
    })
    wx.navigateBack({
      delta: 1
    })
  },

  modifyArea(options){
    let that = this;
    if (options.hasOwnProperty("area")){
    let data = JSON.parse(options.area)
      that.setData({
        areaText: data
      })

      for (let i = 0; i < data.length; i++){
        let num = data[i].id;
        that.data.areadata[num - 2].selected = 2;
        that.setData({
          areadata: that.data.areadata
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getAreaData(options);
  
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

})
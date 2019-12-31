// pages/information/leaveword/leaveword.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
    isEnd: false,
    page:1,
    listsImg: {
      nodata: app.globalData.apiImgUrl + "nodata.png",
    },
    lists:[]
  },

  getMymessage: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    let userUuid = wx.getStorageSync("userUuid");
    this.setData({ userInfo: userInfo })
    wx.showLoading({ title: '数据加载中' })
    app.doRequestAction({
      url: "member/message-of-type/",
      way: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        mid: userInfo.userId,
        token: userInfo.token,
        time: userInfo.tokenTime,
        uuid: userUuid,
      },
      params: {
        type:_this.data.type,
        page: _this.data.page,
    },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;
        if (mydata.errcode == "ok") {
            let _list = _this.data.lists;
            let _lists = mydata.data.lists;

            if(_lists.length == 0){
                _this.setData({ isEnd:true})
            }else{
                let mylist = _list.concat(_lists);
                let _page = _this.data.page + 1;
                _this.setData({ lists: mylist, page: _page});
            }
        } else {
            wx.showToast({
                title: mydata.errmsg,
                icon: 'none',
                duration: 5000
            })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败，请稍后重试！',
          icon: "none",
          duration: 5000
        })
      }
    })
  },
  valiUserUrl:function(){
    wx.navigateTo({
      url: "/pages/others/message/lists/lists"
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type =options.type
    this.setData({
      type: type
    })
    this.getMymessage()
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
    if(this.data.isEnd) return false;
    this.getMymessage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
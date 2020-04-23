const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusCheck: app.globalData.apiImgUrl + 'published-recruit-checking.png',
    statusEnd: app.globalData.apiImgUrl + 'published-recruit-end.png',
    statusNopass: app.globalData.apiImgUrl + 'published-recruit-nopass.png',
    page: 1,
    types: [{id:'all',name:'全部'},{id:'being',name:'正在招'},{id:'end',name:'已招满'}],
    current: 0,
    hasmore: true,
    lists: [],
    infoId: '',
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    checkingimg: app.globalData.apiImgUrl + 'published-info.png',
    infoId: '',
    infoIndex: -1
  },
  jumpRecruitInfo:function(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
  },
  userEditRecuritInfo:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/publish/recruit/recruit?id='+id,
    })
  },
  userSetTopAction:function(e){
    let _this = this;
    let id = e.currentTarget.dataset.id; // 信息id
    let infoIndex = e.currentTarget.dataset.index; // 信息下标
    let time = e.currentTarget.dataset.time; // 到期时间
    let status = e.currentTarget.dataset.status; // 招工状态
    let top = e.currentTarget.dataset.top; //是否置顶
    let end = e.currentTarget.dataset.end // 是否已招到
    let now = new Date().getTime() / 1000 // 当前时间戳
    let userInfo = wx.getStorageSync('userInfo') // 用户信息
    let showTime = time > now; // 置顶是否过期
    let topId = e.currentTarget.dataset.topid; // 置顶id

    if (top == '0' && !showTime) { // 置顶已过期
      if (end == "2") {
        wx.showModal({
          title: '提示',
          content: '已招到状态不能进行置顶操作，请修改招工状态',
          showCancel: false
        })
        return false;
      }
      this.setData({
        infoId: id,
        infoIndex: index
      })
      wx.navigateTo({
        url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=${topId}`,
      })

    } else if (!status && status != 0) { // 从没置顶
      wx.navigateTo({
        url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=${topId}`,
      })
    } else {
      wx.showLoading({
        title: '正在执行操作'
      })
      app.doRequestAction({
        url: 'job/update-top-status/',
        way: "POST",
        params: {
          userId: userInfo.userId,
          token: userInfo.token,
          tokenTime: userInfo.tokenTime,
          infoId: id,
          status: top ? top : "0"
        },
        success: function (res) {
          wx.hideLoading();
          let mydata = res.data;
          if (mydata.errcode == "ok") {
            let newData = _this.data.lists;
            newData[infoIndex] = mydata.data;
            _this.setData({
              lists: newData
            })
          }
          if (mydata.errcode == "auth_forbid") {
            wx.showModal({
              title: '温馨提示',
              content: res.data.errmsg,
              cancelText: '取消',
              confirmText: '去实名',
              success(res) {
                if (res.confirm) {
                  let backtwo = "backtwo"
                  wx.navigateTo({
                    url: `/pages/realname/realname?backtwo=${backtwo}`
                  })
                }
              }
            })
            return
          } else if (mydata.errcode == "member_forbid") {
              wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                cancelText: "取消",
                confirmText: "联系客服",
                success(res) {
                  if (res.confirm) {
                    let tel = app.globalData.serverPhone
                    wx.makePhoneCall({
                      phoneNumber: tel,
                    })
                  }
                }
              })
          } else {
              wx.showToast({
                title: mydata.errmsg,
                icon: "none",
                duration: 1500
              })
            }
          },
          fail: function (err) {
            wx.hideLoading();
            wx.showToast({
              title: "网络不太好，操作失败！",
              icon: "none",
              duration: 3000
            })
          }
        })
    }
  },
  userSetTop: function (e) {
    let id = e.currentTarget.dataset.id;
    let time = e.currentTarget.dataset.time
    wx.navigateTo({
      url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=${time}`,
    })
  },
  getRecruitList:function(){
    let _this = this
    let userinfo = wx.getStorageSync('userInfo')
    let userUuid = wx.getStorageSync('userUuid')
    userinfo.mid = userinfo.userId
    userinfo.uuid = userUuid
    userinfo.type = this.data.types[this.data.current].id
    userinfo.page = this.data.page
    app.appRequestAction({
      url: 'job/issue-lists/',
      way: 'POST',
      params: userinfo,
      title: '获取发布列表',
      success:function(res){
        let mydata = res.data
        if(mydata.errcode == 'ok'){
          let lists = _this.data.lists
          let newlist = mydata.data.lists
          let page = _this.data.page
          let len = newlist.length
          _this.setData({
            lists: lists.concat(newlist),
            hasmore: len ? true : false,
            page: len ? page + 1 : page
          })
        }else{
          app.showMyTips(mydata.errmsg)
        }
      }
    })
  },
  userChangeType:function(e){
    let key = e.currentTarget.dataset.key
    this.setData({
      current: parseInt(key),
      page: 1,
      hasmore: true,
      lists: []
    })
    this.getRecruitList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecruitList()
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
    if(!this.data.hasmore) return false
    this.getRecruitList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
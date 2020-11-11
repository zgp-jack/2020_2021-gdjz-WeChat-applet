// pages/recruitworker-browsing-record/recruit-worker-lists/index.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,//请求页数,第一页数据有会员中心点击后url传递
    hasmore: true,//是否还有更多数据
    lists: [],//我的正在招工信息列表
    seeNum: 0,//浏览增加数量
    sumNum: 0,//被查看总数
    tipBox: {//提示框显示信息
      showTitle: true,
      confirmColor:'#0099FF',
      cancelColor:'#797979',
      content: [{
        des: '该信息未被查看过置顶招工信息',
        color: '#868686',
        text: []
      },{
        des: '可以增加曝光率，让更多工人看到您的招工',
        color: '#868686',
        text: []
      }
    ],
      confirmText: '增加曝光率'
    },
    topIndex:false,//点击没有被查看的招工信息的index
    clickId: '',//点击查看浏览记录的招工信息id
    nodataImg: app.globalData.apiImgUrl + "collect-nodata.png",
  },
  getRecruitLists: function (action) {
    let that = this;
    // 用户uid
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) return
    let mid = userInfo.userId;
    // 请求页数
    let page = this.data.page;
    // 请求参数
    let params = { page, mid }
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: 'focus-me/zg-my-list/',
      way: 'POST',
      params: params,
      success: function (res) {
        if (res.data.errcode == "success") {
          wx.hideLoading();
          let list = res.data.data.list;
          // 处理查看总数和新增加浏览总数的显示
          list.forEach(item => {
            let sum_num = parseInt(item.sum_num ) > 99? '99+' : item.sum_num;
            let unread_num = parseInt(item.unread_num) > 9? '9+' : item.unread_num;
            item.sum_num = sum_num;
            item.unread_num = unread_num;
          });
          let _list = that.data.lists
          let len = list.length
          that.setData({
            lists: action? list: _list.concat(list),
            page: page + 1 ,
            hasmore: len < 15? false: true,
          })
        }else if (res.data.errcode == "have_not_zg_ing") {
          // 有招工信息，没有正在招的跳转到招工信息列表
          wx.showModal({
            title: '',
            content: res.data.errmsg,
            confirmText: "去修改",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/published/recruit/list',
                })
              }
            }
          })
        }else if (res.data.errcode == "have_not_zg") {
          // 没有招工信息，跳转到发布招工界面
          wx.showModal({
            title: '',
            content: res.data.errmsg,
            confirmText: "去发布",
            success: function (res) {
              if (res.confirm) {
                app.initJobView()
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel:false,
            success: function (res) {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        app.showMyTips('网络出错，数据加载失败！')
      }
    })
  },
  // 去增加曝光率
  goTop: function (e) {
    let topIndex = this.data.topIndex;
    let infoIndex = null;//点击招工信息的index
    if (e) {
      infoIndex = e.currentTarget.dataset.index;
    }else{
      infoIndex = topIndex;
    }
    let topdata = this.data.lists[infoIndex]; //当前招工信息数据
    let id = topdata.id; // 信息id
    let top = topdata.top;
    let now = new Date().getTime() / 1000 // 当前时间戳
    let isCheck = topdata.ischeck;//用户审核状态
    // 如果有置顶
    if (top == '1') {
      let data = topdata.top_data; //置顶数据
      let isTop = data.is_top;
      let endtime = data.end_time //置顶到期时间
      let showTime = now > parseInt(endtime) ? true : false; // 置顶是否过期 已过期
      let time = topdata.sort_time;
      if (isTop === '1') {
        wx.navigateTo({
          url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=${time}`,
        })
      }else{
        if(showTime){ //如果置顶过期
          wx.navigateTo({
            url: `/pages/workingtopAll/workingtop/workingtop?id=${id}$topId=${data}`,
          })
          return false
        }
        wx.navigateTo({
          url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=${time}`,
        })
      }
    }else{
      wx.navigateTo({
        url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=undefined&city_id=${topdata.area_id}&province_id=${topdata.province_id}&ischeck=${isCheck}`,
      })
    }
  },
  // 跳转到招工信息的浏览记录
  goNoReadRecord: function (e) {
    // 招工信息id
    let id = e.currentTarget.dataset.id;
    // 招工信息城市id
    let cityId = e.currentTarget.dataset.cityid;
    // 省id
    let provinceId = e.currentTarget.dataset.provinceid;
    let aid = cityId || provinceId;
    // 工种id
    let cid = e.currentTarget.dataset.cid;
    // 保存点击的招工信息id
    this.setData({clickId: id})
    // 跳转到招工信息浏览记录列表
    wx.navigateTo({
      url: `/pages/recruitworker-browsing-record/recruit-worker-record/index?id=${id}&cid=${cid}&aid=${aid}`
    })
  },
  // 点击提示框的“增加曝光率”或者“扩大置顶范围”去置顶界面
  confirm: function () {
    this.goTop()
  },
  // 如果招工信息一次没有被查看，点击后展示提示框
  showModel: function (e) {
    let infoIndex =e.currentTarget.dataset.index;//点击招工信息的index
    let topdata = this.data.lists[infoIndex]; //当前招工信息数据
    let top = topdata.top;
    // 如果有置顶
    if (top == '1') {
      let data = topdata.top_data; //置顶数据
      let isTop = data.is_top;
      if (isTop == '1') {
        this.setData({
          'tipBox.content[0].des':'该信息未被查看过',
          'tipBox.content[1].des': '扩大置顶范围，可以让更多工人看到您的招工',
          'tipBox.confirmText':'扩大置顶范围',
          topIndex: infoIndex
        })
        this.selectComponent("#promptbox").show()
      }else{
        this.setData({
          'tipBox.content[0].des':'该信息未被查看过',
          'tipBox.content[1].des': '置顶招工信息可以增加曝光率，让更多工人看到您的招工',
          'tipBox.confirmText':'增加曝光率',
          topIndex: infoIndex
        })
        this.selectComponent("#promptbox").show()
      }
    }else{
      this.setData({
        'tipBox.content[0].des':'该信息未被查看过',
        'tipBox.content[1].des': '置顶招工信息可以增加曝光率，让更多工人看到您的招工',
        'tipBox.confirmText':'增加曝光率',
        topIndex: infoIndex
      })
      this.selectComponent("#promptbox").show()
    }
  },
  // 从招工信息的浏览记录列表回到招工信息界面将对应未读浏览记录清零
  clearUnRead: function () {
    let id = this.data.clickId;
    let lists = this.data.lists;
    if (id) {
      let index = lists.findIndex((item)=> item.id == id)
      let listItem = lists[index];
      listItem.unread_num = 0;
      this.setData({lists})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty("recordInfo")) {
      let recordInfo = JSON.parse(options.recordInfo);
      let lists = recordInfo.list;
      lists.forEach(item => {
        let sum_num = parseInt(item.sum_num) > 99? '99+' : item.sum_num;
        let unread_num = parseInt(item.unread_num) > 9? '9+' : item.unread_num;
        item.sum_num = sum_num;
        item.unread_num = unread_num;
      });
      if (lists.length < 15) {
        this.setData({hasmore: false})
      }
      this.setData({lists})
    }
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
    let index = pages.length - 1
    let path = pages[index].__displayReporter.showReferpagepath
    path = path.slice(0, -5)
    if (path == "pages/workingtopAll/workingtop/workingtop") {
      this.setData({ page: 1, lists: [], hasmore: true })
      this.getRecruitLists(true)
    }
    if (path == "pages/recruitworker-browsing-record/recruit-worker-record/index") {
      // 点击某招工信息浏览记录，清空对应该记录的未读数
      this.clearUnRead()
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
    this.setData({ page: 1, hasmore: true })
    this.getRecruitLists(true)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasmore) {
      this.getRecruitLists(false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
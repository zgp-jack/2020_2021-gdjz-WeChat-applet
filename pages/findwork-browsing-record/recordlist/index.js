// pages/findwork-browsing-record/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positionImage: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    emptyImage: app.globalData.apiImgUrl + "yc/record-empty.png",
    page: 2,//请求页数,第一页数据从会员中心url传递
    lists:[],//浏览记录列表数据
    child: 0,//是否子列表
    infoId: "",
    cid: "",//工种id
    aid: "",//区域id
    more: true,
    defalutTop:'',//置顶默认区域
    show: false,//展示界面
    isEnd: false,//找活名片状态 1 正在找 2不是正在找
    isTop: false,//是否在置顶中状态 0 未置顶  1 置顶中
    resumeTop: [],//置顶数据
  },
  show: function () {
    this.setData({show:true})
    wx.hideLoading()
  },
  reqRecordData: function () {
    let more = this.data.more;
    if (!more) return  
    let that = this;
    // 用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) return;
    let mid = userInfo.userId;
    // 请求页数
    let page = this.data.page;
    // 请求参数
    let params = { mid, page, }
    wx.showLoading({ title: '数据加载中' })
    app.appRequestAction({
      url: 'focus-me/zh-view-list/',
      way: 'POST',
      params: params,
      success: function (res) {
        if (res.data.errcode == "success") {
          wx.hideLoading();
          let list = res.data.data.list;
          // 如果请求的列表有数据就讲请求数据追加到原有数据中
          if (list &&　list.length ) {
            // 浏览记录列表数据
            let lists = that.data.lists;
            // 遍历追加数据
            for (let i = 0; i < list.length; i++) {
              lists.push(list[i]);
            }
            that.setData({ page: parseInt(page) + 1, lists: lists })
            if (list.length < 15) {
              that.setData({ more:false })
            }
          }else{
            that.setData({ more:false })
          }
          // 请求第一页的时候讲数据保存到data中，后续下拉请求不再重复保存
          if (page === 1) {
            let zh_info = res.data.data.zh_info;
            let aid = zh_info.city || zh_info.province;
            let cid = zh_info.classify_id;
            let defalutTop = res.data.data.default_top_area;
            let isTop = zh_info.is_top;
            let resumeTop = zh_info.resume_top;
            that.setData({ aid, cid, defalutTop, isTop, resumeTop })
          }
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络出错，数据加载失败！',
          icon: "none"
        })
      }
    })
  },
  // 获取招工列表
  getRecruitLists: function (e) {
    // 用户id
    let userId = e.currentTarget.dataset.userid
    // 用户姓名
    let userName = e.currentTarget.dataset.user;
    let child = this.data.child;
    let aid = this.data.aid;
    let cid = this.data.cid;
    let url = `/pages/lists/recruit/index?infoId=${userId}&type=record&userName=${userName}&cid=${cid}&aid=${aid}&child=${child}`
    wx.navigateTo({
      url: url,
    })
  },
  // 浏览记录为空，去找活置顶
  goTop: function () {
    let resumeTop = this.data.resumeTop;
    let hasTop = resumeTop.has_top;
    // 如果需要去完善数据跳转去发布填写找活名片界面
    let topdata = JSON.stringify(resumeTop)
    let isTop = resumeTop.is_top;
    let isEnd = this.data.isEnd;
    let defalutTop = this.data.defalutTop;
    if (isEnd === 2) {
      wx.navigateTo({
        url: "/pages/clients-looking-for-work/finding-name-card/findingnamecard",
      })
    }
    if (isEnd === 1) {
      if (!hasTop) {
        wx.navigateTo({
          url: "/pages/clients-looking-for-work/workingtop/workingtop?topdata=" + topdata + "&defaulttop=" + defalutTop,
        })
      }else{
        if (isTop === 2) {
          // 置顶到期
          wx.navigateTo({
            url: "/pages/clients-looking-for-work/workingtop/workingtop?topdata=" + topdata + "&defaulttop=" + defalutTop,
          })
        }else{
          // 修改置顶或者继续置顶
          let modify = "modify";
          wx.navigateTo({
            url: `/pages/clients-looking-for-work/workingtop/workingtop?topdata=${topdata}&modify=${modify}`,
          })
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从url取出浏览记录数据
    if (options.hasOwnProperty("recordInfo")) {
      let recordInfo = JSON.parse(options.recordInfo)
      let lists = recordInfo.list;
      let zh_info = recordInfo.zh_info;
      // 区域id
      let aid = zh_info.city || zh_info.province;
      // 工种id
      let cid = zh_info.classify_id;
      // 默认置顶区域
      let defalutTop = recordInfo.default_top_area;
      // 找活名片状态
      let isEnd = zh_info.is_end;
      //置顶状态
      let isTop = zh_info.is_top;
      // 置顶数据
      let resumeTop = zh_info.resume_top;
      // 浏览记录数据为空
      if ( lists.length === 0 || lists.length < 15) {
        this.setData({more: false})
      }
      this.setData({ lists, aid, cid, defalutTop, isEnd, isTop, resumeTop })
    }
    // if (!this.data.show) {
    //   wx.showLoading({
    //     title: '数据加载中',
    //   })
    // }
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
    if (path == "pages/clients-looking-for-work/workingtop/workingtop") {
      this.setData({ page: 1, lists: [], more: true, show: false })
      this.reqRecordData()
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
    this.setData({ page: 1, lists: [], more: true, show: false })
    this.reqRecordData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.reqRecordData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
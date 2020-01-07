const app = getApp();
let footerjs = require("../../../utils/footer.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerActive: "home",
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    swiperheight: 0,
    tabBars: [], //导航类别
    newslist: [], //列表
    nodata: app.globalData.apiImgUrl + "nodata.png",
    maxRequestTimeIs: false,
    currentType: '-1', //传的类型 
    page:1,
    typename: '暂无相关资讯', //提示类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
      success(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 230;
        that.setData({
          swiperheight: calc
        });

      }
    })
    this.news()
    this.newslist()
    this.initFooterData();
  },

  onShow() {
    this.setData({
      page: 1,
      //  maxRequestTimeIs: false
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 共用footer
  jumpThisLink: function(e) {
    app.jumpThisLink(e);
  },
  initFooterData: function() {
    this.setData({
      footerImgs: footerjs.footerImgs,
      publishActive: footerjs.publishActive,
      showPublishBox: footerjs.showPublishBox
    })
    footerjs.initMsgNum(this);
  },
  doPublishAction: function() {
    footerjs.doPublishAction(this);
  },
  closePublishAction: function() {
    footerjs.closePublishAction(this);
  },
  valiUserCard: function() {
    let userInfo = this.data.userInfo;
    footerjs.valiUserCard(this, app, userInfo);
  },
  //新闻类型
  news() {
    app.appRequestAction({
      url: "news/types/",
      way: "GET",
      failTitle: "网络错误，请求失败！",
      success: res => {
        let ade = res.data.data
        this.setData({
          tabBars: ade
        })
      }
    })
  },
  //新闻列表
  newslist() {
    let td = this.data
    let page = td.page;
    let type = td.currentType;
    app.appRequestAction({
      url: "news/list/",
      way: "POST",
      failTitle: "网络错误，请求失败！",
      params: {
        page: page,
        newsType: type
      },
      success: res => {

        page = page + 1;

        let data = res.data.data
        if (!data.length) {
          app.showMyTips("没有更多数据");
          this.setData({
            maxRequestTimeIs: true
          })

          return false;
        }
        this.setData({
          newslist: this.data.newslist.concat(data),
          page: page
        })
      }
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    if (e.detail.source == 'touch') {
      let td = this.data
      let index = e.detail.current
      let currentType = this.data.tabBars[index].index
      let name = this.data.tabBars[index].name
      if (currentType == '-1') {
        this.setData({
          typename: '暂无相关资讯'
        })
      } else {
        this.setData({
          typename: '暂无相关' + name
        })
      }
      this.setData({
        currentTab: index,
        page: 1,
        maxRequestTimeIs: false,
        currentType: currentType,
        newslist: [],
      });
      this.checkCor();
      this.newslist()
      // console.log(currentType, index, this.data.tabBars)
    }

  },
  // 点击标题切换当前页
  swichNav: function(e) {
    let index = e.currentTarget.dataset.index
    let strindex = e.currentTarget.dataset.item.index
    let currentType = e.target.dataset.typeindex
    let name = e.currentTarget.dataset.item.name
    if (currentType == '-1') {
      this.setData({
        typename: '暂无相关资讯'
      })
    } else {
      this.setData({
        typename: '暂无相关' + name

      })
    }
    this.setData({
      currentTab: index,
      currentType: currentType,
      page: 1,
      maxRequestTimeIs: false,
      newslist: []
    })
    this.newslist()
    // console.log(e, strindex)
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //上拉加载
  loadmore(e) {
    let td = this.data
    let page = td.page + 1
    let type = td.currentType
    // console.log(this.data.newslist, this.data.newslist.length)
    if (this.data.maxRequestTimeIs) return
    if (!this.data.newslist.length) return
    // console.log(type, e)
    this.newslist();
  },
  category(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/static/notice?id='+id,
    })
  }
})
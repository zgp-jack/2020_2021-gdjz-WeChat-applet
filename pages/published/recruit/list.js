const app = getApp()
let footerjs = require("../../../utils/footer.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerActive: "member",
    refresh: false,
    statusCheck: app.globalData.apiImgUrl + 'published-recruit-checking.png',
    statusEnd: app.globalData.apiImgUrl + 'published-recruit-end.png',
    statusNopass: app.globalData.apiImgUrl + 'published-recruit-nopass.png',
    handsettop:app.globalData.apiImgUrl + "new-published-settop-tips.png",
    page: 1,
    types: [{id:'all',name:'全部'},{id:'being',name:'正在招'},{id:'end',name:'已招满'}],
    current: 0,
    hasmore: true,
    lists: [],
    infoId: '',
    nodata: app.globalData.apiImgUrl + 'nodata.png',
    checkingimg: app.globalData.apiImgUrl + 'published-info.png',
    infoId: '',
    infoIndex: -1,
    showTopTips: false
  },
  publishJob:function () {
    app.initJobView()
  },
  closeHandTips:function(){
    this.setData({
      showTopTips: false
    })
  },
  jumpRecruitInfo:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/info/info?id=${id}&more=1`,
    })
  },
  userEditRecuritInfo:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/issue/index/index?id='+id,
    })
  },
  userSetTopAction:function(e){
    let _this = this;
    let id = e.currentTarget.dataset.id; // 信息id
    let infoIndex = parseInt(e.currentTarget.dataset.index); // 信息下标
    let topdata = this.data.lists[infoIndex]; //当前数据
    let end = topdata.is_end // 是否已招到
    let status = topdata.is_check; // 招工状态
    let now = new Date().getTime() / 1000 // 当前时间戳
    let top = topdata.top; //是否有置顶数据
    let userInfo = wx.getStorageSync('userInfo') // 用户信息
    

    if(end == '2'){ //如果已招到
      wx.showModal({
        title: '提示',
        content: '已招到状态不能进行置顶操作，请修改招工状态',
        showCancel: false
      })
      return false;
    }
  
    if(top == '1'){ //如果说有置顶数据
      let data = topdata.top_data; //置顶数据
      let endtime = data.end_time //置顶到期时间
      let toping = data.is_top // 是否置顶状态
      let showTime = now > parseInt(endtime) ? true : false; // 置顶是否过期 已过期
      
      
      if(showTime){ //如果置顶过期
        console.log(showTime)
        wx.navigateTo({
          url: `/pages/workingtopAll/workingtop/workingtop?id=${id}$topId=${data}`,
        })
        return false
      }

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
          status: toping == '1' ? '1' : '0'
        },
        success: function (res) {
          wx.hideLoading();
          let mydata = res.data;
          console.log(mydata)
          if (mydata.errcode == "ok") {
            let newData = _this.data.lists;
            newData[infoIndex].top_data.is_top = mydata.data.top.is_top
            _this.setData({
              lists: newData
            })
            wx.showModal({
              title: '温馨提示',
              content: mydata.errmsg,
              showCancel: false
            })
          }else if(mydata.errcode == "auth_forbid") {
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
              wx.showModal({
                title: '温馨提示',
                content: mydata.errmsg,
                showCancel: false,
                success:()=>{
                  _this.setData({
                    page: 1,
                    hasmore: true,
                    lists: []
                  })
                  _this.getRecruitList()
                }
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

    }else{
      wx.navigateTo({
        url: `/pages/workingtopAll/workingtop/workingtop?id=${id}&topId=undefined`,
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
  changeRecruitStatus:function(e){
    let status = e.currentTarget.dataset.status
    let _id = e.currentTarget.dataset.id;
    let infoIndex = e.currentTarget.dataset.index;
    let userInfo = wx.getStorageSync('userInfo');
    let _this = this;
    wx.showLoading({
      title: '正在修改状态'
    })
    app.doRequestAction({
      way: "POST",
      url: "job/job-end-status/",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        infoId: _id,
        end_status:status
      },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          let newData = _this.data.lists;
          newData[infoIndex].is_end = mydata.data.is_end;
          newData[infoIndex].is_check = mydata.data.is_check;
          let top = newData[infoIndex].top_data;
          if(top) newData[infoIndex].top_data.is_top = mydata.data.top.is_top
          _this.setData({
            lists: newData
          })
          wx.showToast({
            title: mydata.errmsg,
            icon: "none",
            duration: 1500
          })
        } else if (mydata.errcode == "auth_forbid") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            cancelText: '取消',
            confirmText: '去实名',
            success(res) {
              if (res.confirm) {
                let backtwo = "backtwo"
                wx.redirectTo({
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
        } else if (mydata.errcode == "to_auth") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            cancelText: '取消',
            confirmText: '去实名',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: `/pages/realname/realname`
                })
              }
            }
          })
          return
        }else {
          wx.showToast({
            title: mydata.errmsg,
            icon: "none",
            duration: 1500
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: "网络不太好，操作失败！",
          icon: "none",
          duration: 3000
        })
      }
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
  initFooterData: function () {
    this.setData({
      footerImgs: footerjs.footerImgs,
      publishActive: footerjs.publishActive,
      showPublishBox: footerjs.showPublishBox
    })
    footerjs.initMsgNum(this);
  },
  doPublishAction: function () {
    footerjs.doPublishAction(this);
  },
  closePublishAction: function () {
    footerjs.closePublishAction(this);
  },
  valiUserCard: function () {
    let userInfo = this.data.userInfo;
    footerjs.valiUserCard(this, app, userInfo);
  },
  jumpThisLink: function (e) {
    app.jumpThisLink(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.hasOwnProperty('jz')){
      this.setData({
        showTopTips:true
      })
    }
    this.initFooterData()
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
    this.pageRefresh()  
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
  pageRefresh() {
    this.setData({ lists: [], page: 1, hasmore: true })
    this.getRecruitList()
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
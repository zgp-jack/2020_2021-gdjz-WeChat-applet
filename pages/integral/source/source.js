// pages/source/source.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingGif: app.globalData.apiImgUrl + "loading.gif",
        nodata: app.globalData.apiImgUrl + "nodata.png",
        nothavemore: false,
        isNone: false,
        isFirst: true,
        userInfo: "",
        lists: [],
        pageSize: 15,
        page: 1, 
        system: "",
        sign: app.globalData.apiImgUrl + "lpy/integral/select2.png",
        signright: app.globalData.apiImgUrl + "lpy/integral/select1.png",
        beforeDate: "",
        emdDate: "",
        birthday:"",
        expend:"",
        system_type:"",
        classify: [],
        classifyArray: [],
        classifyName: "",
        classifyNameId: 0,
        stime: 0,
        bak: 0,
        getintegral: 0,
        getexpend: 0,
        next_page: "",
        showintegral: true,
        classifyIndex:0
    },
    // getIntegralHeader: function () {
    //     let _this = this;
    //     let userInfo = wx.getStorageSync("userInfo");
    //     this.setData({ userInfo: userInfo })
    //     app.initSystemInfo(function (res) {
    //       if (res) _this.setData({ system: res.platform })
    //     })
    //     wx.showLoading({ title: '数据加载中' })
    //     app.doRequestAction({
    //         url: "integral/header-words/",
    //         way: "POST",
    //         params: {
    //             userId: userInfo.userId,
    //             token: userInfo.token,
    //             tokenTime: userInfo.tokenTime,
    //             type: "source",
    //           systemType:_this.data.system
    //         },
    //         success: function (res) {
    //             wx.hideLoading();
    //             let mydata = res.data;
    //             _this.setData({
    //                 lists: mydata.firstList.list,
    //                 day: mydata.day,
    //                 pageSize: mydata.firstList.pageSize,
    //                 isNone: mydata.firstList.list.length ? false : true,
    //                 isFirst: false
    //             })
    //             if ((mydata.firstList.list.length < parseInt(mydata.firstList.pageSize)) && mydata.firstList.list.length) {
    //                 _this.setData({ nothavemore: true })
    //             }
    //         },
    //         fail: function (err) {
    //             wx.hideLoading();
    //             wx.showToast({
    //                 title: '数据加载失败，请稍后重试！',
    //                 icon: "none",
    //                 duration: 5000
    //             })
    //         }
    //     })
    // },
  getDate() {
    let newdate = new Date();
    let nowyear = newdate.getFullYear();
    let nowmonth = newdate.getMonth() + 1;
    if (nowmonth >= 1 && nowmonth <= 9) {
      nowmonth = "0" + nowmonth;
    }
    this.setData({
      emdDate: nowyear + "-" + nowmonth
    })
    console.log(this.data.birthday)
  },
  getIntegralHeader: function (userInfo) {
    let _this = this;
    wx.showLoading({
      title: '数据加载中'
    })
    let date = _this.data.birthdaysubmit.split("-")
    app.doRequestAction({
      url: "integral/source-lists/",
      way: "POST",
      params: {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        y: date[0],
        m: date[1],
        stime: _this.data.stime,
        source_type: _this.data.classifyNameId,
        bak: _this.data.bak,
        system_type: _this.data.system_type
      },
      success: function (res) {
        wx.hideLoading();
        let mydata = res.data;
        if (mydata.errcode = "ok") {
          _this.setData({
            bak: mydata.data.bak,
            stime: mydata.data.stime,
            lists: [..._this.data.lists, ...mydata.data.lists],

            next_page: mydata.data.next_page,
            isNone: false
          })
          if (_this.data.showintegral) {
            _this.setData({
              getintegral: mydata.data.sum_data.get,
              getexpend: mydata.data.sum_data.expend,
            })
          }
          if (_this.data.lists.length == 0) {
            _this.setData({
              isNone: true
            })
          }
          if (_this.data.lists.length != 0 && mydata.data.lists == 0) {
            _this.setData({
              nothavemore: true
            })
          }
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
  birthday(e) {
    let data = this.data
    let date = e.detail.value.split("-")
    let end = data.emdDate.split("-")
    let start = data.beforeDate.split("-")
    let selectdate = Date.UTC(date[0] - 0, date[1] - 0);
    let enddate = Date.UTC(end[0] - 0, end[1] - 0);
    let startdate = Date.UTC(start[0] - 0, start[1] - 0);
    if (selectdate > enddate) {
      date[0] = end[0]
      date[1] = end[1]
    }
    if (selectdate < startdate) {
      date[0] = start[0]
      date[1] = start[1]
    }
    this.setData({
      birthday: date[0] + '年' + date[1] + '月',
      birthdaysubmit: date[0] + '-' + date[1],
      stime: 0,
      bak: 0,
      nothavemore: false,
      lists: [],
      showintegral: true
    })
    console.log(123123)
    this.getIntegralHeader(this.data.userInfo)
  },
  selectType(e) {
    let that = this;
    let odedail = e.detail.value;
    console.log(odedail)
    console.log(that.data.classifyArray[odedail])
    console.log(that.data.classifyArray)
    this.setData({
      classifyName: that.data.classifyArray[odedail],
      classifyNameId: that.data.classify[odedail].type,
      classifyIndex: odedail,
      stime: 0,
      bak: 0,
      nothavemore: false,
      lists: [],
      showintegral: true
    })
    that.getIntegralHeader(that.data.userInfo)
  },
    // getNextPageData: function () {
    //     let _this = this;
    //     let userInfo = this.data.userInfo;
    //     wx.showLoading({ title: '数据加载中' })
    //     app.doRequestAction({
    //         url: "integral/integral-record/",
    //         way: "POST",
    //         params: {
    //             userId: userInfo.userId,
    //             token: userInfo.token,
    //             tokenTime: userInfo.tokenTime,
    //             type: "source",
    //             page: _this.data.page,
    //             systemType:_this.data.system
    //         },
    //         success: function (res) {
    //             wx.hideLoading();
    //             let mydata = res.data.list;
    //             let pagesize = res.data.pageSize;

    //             if (mydata.length == 0) {
    //                 _this.setData({
    //                     nothavemore: true
    //                 })
    //             } else {
    //                 let addData = _this.data.lists;
    //                 for (let i = 0; i < mydata.length; i++) {
    //                     addData.push(mydata[i]);
    //                 }
    //                 _this.setData({
    //                     lists: addData,
    //                     nothavemore: (mydata.length < parseInt(pagesize)) ? true : false
    //                 })
    //             }
    //         },
    //         fail: function (err) {
    //             wx.hideLoading();
    //             wx.showToast({
    //                 title: '数据加载失败，请稍后重试！',
    //                 icon: "none",
    //                 duration: 5000
    //             })
    //         }
    //     })
    // },
    dointegral() {
      let expend = this.data.expend
      let source = "source"
      if (expend == "expend"){
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.navigateTo({
          url: `/pages/integral/expend/expend?source=${source}`,
        })
      }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    getjump(options){
      if (options.hasOwnProperty("expend")){
        this.setData({
          expend: options.expend
        })
      }
    },
  getDetail() {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    app.initSystemInfo(function (res) {
      if (res) that.setData({ system_type: res.platform })
    })
    userInfo = {
      ...userInfo,
      office:0,
      system_type: that.data.system_type
    }
    this.setData({
      userInfo: userInfo
    })
    app.appRequestAction({
      url: "integral/source-config/",
      way: "POST",
      params: userInfo,
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          let classifymap = mydata.data.types.map((item, index) => item.name)

          that.setData({
            birthday: mydata.data.default.y + "年" + mydata.data.default.m+"月",
            birthdaysubmit: mydata.data.default.y + "-" + mydata.data.default.m,
            beforeDate: mydata.data.min.y + "-" + mydata.data.min.m,
            classify: mydata.data.types,
            classifyArray: classifymap,
            classifyName: "来源分类",
            classifyNameId: mydata.data.types[0].type
          })
          that.getIntegralHeader(userInfo)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: mydata.errmsg,
            showCancel: false,
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '温馨提示',
          content: '网络错误，数据加载失败！',
          showCancel: false,
        })
      }
    })
  },
    onLoad: function (options) {
        this.getDetail();
        this.getjump(options)
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
      this.getDate()
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
        if ((this.data.isNone) || (this.data.nothavemore)) return false;
        this.setData({ page: this.data.page + 1 })
        // this.getNextPageData();
      this.setData({ showintegral: false })
      this.getIntegralHeader(this.data.userInfo)
    },

})
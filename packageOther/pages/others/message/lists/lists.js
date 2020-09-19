const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wechat: "",
        phone: "",
        page: 1,
        restaurants: [],
        hasmore: true,
        nodata: app.globalData.apiImgUrl + "nodata.png",
        isViewImgs: false,
        userInfo: true,
        icon: app.globalData.apiImgUrl + "userauth-topicon.png",
        joingroup:[],
        // 用户反馈列表
        FeedBackLists:[],
        // 向右的箭头
        rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
        serverPhone: app.globalData.serverPhone
    },
    initUserData: function(options) {
        let userInfo = wx.getStorageSync("userInfo");
        if (!userInfo) {
            this.setData({
                userInfo: false
            })
            return false;
        } else {
            this.setData({
                userInfo: userInfo
            })
        }
        this.setData({
            userInfo: userInfo
        });
    },
    returnPrevPage() {
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },
    bindGetUserInfo: function(e) {
        let that = this;
        app.bindGetUserInfo(e, function(res) {
            app.mini_user(res, function(res) {
                app.api_user(res, function(res) {
                    let uinfo = res.data;
                    if (uinfo.errcode == "ok") {
                        let userInfo = {
                            userId: uinfo.data.id,
                            token: uinfo.data.sign.token,
                            tokenTime: uinfo.data.sign.time
                        }
                        app.globalData.userInfo = userInfo;
                        wx.setStorageSync('userInfo', userInfo)
                        that.setData({ userInfo: userInfo });
                        that.getFeedbackList();
                    } else {
                        app.showMyTips(uinfo.errmsg);
                    }
                });
            });
        });
    },
    getPhonCons() {
    this.setData({
      joingroup: app.globalData.joingroup
    })
    },
    // 获取意见反馈列表
    getFeedbackList: function(bool){
        let _this = this
        // data数据
        let data = _this.data;
        // 页数
        let page = data.page
        // 用户信息
        let userInfo = wx.getStorageSync("userInfo");
        if (!userInfo) return false
        // 获取反馈列表请求
        app.appRequestAction({
            url: "others/message-list/",
            way: "GET",
            params: {
                page: data.page,
            },
            success: function(res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    // 响应反馈列表
                    let list = mydata.data;
                    // 数组长度
                    let len = list.length;
                    // 如果有内容将和原来的反馈列表数据进行组合拼接
                    if (len) {
                        let mylist = data.FeedBackLists
                        let lists = bool ? list : mylist.concat(list)
                        page = page + 1;
                        _this.setData({
                            FeedBackLists: lists
                        })
                    } else {
                        // 加载了多页且返回的数据为空表示数据已经全部加载完了
                        if (page !== 1) {
                            app.showMyTips("没有更多数据");
                            _this.setData({
                                hasmore: false
                            })
                            return false;
                        }
                    }
                    _this.setData({
                        page: page
                    })
                }
            },
            fail: function(err) {
                wx.showToast({
                    title: '数据加载失败！',
                    icon: "none",
                    duration: 3000
                })
            }
        })
        
    },
    //下拉加载方法
    // getFeedbackList: function(bool) {
    //     let _this = this;
    //     let td = this.data
    //     let page = td.page;
    //     let userInfo = wx.getStorageSync("userInfo");
    //     if (!userInfo) return false;
    //     // 发送网络请求
    //     app.appRequestAction({
    //         url: "leaving-message/list/",
    //         way: "POST",
    //         params: {
    //             userId: userInfo.userId,
    //             token: userInfo.token,
    //             tokenTime: userInfo.tokenTime,
    //             page: td.page,
    //         },
    //         success: function(res) {
    //             let mydata = res.data.data;
    //             if (page === 1) {
    //                 let memberInfo = res.data.memberInfo;
    //                 _this.setData({
    //                     memberInfo: memberInfo
    //                 })
    //             }
    //             let len = mydata.length;
    //             if (len) {
    //                 let mylist = td.restaurants
    //                 let _list = bool ? mydata : mylist.concat(mydata)
    //                 page = page + 1;
    //                 _this.setData({
    //                     restaurants: _list
    //                 })
    //             } else {
    //                 if (page !== 1) {
    //                     app.showMyTips("没有更多数据");
    //                     _this.setData({
    //                         hasmore: false
    //                     })
    //                     return false;
    //                 }
    //             }
    //             _this.setData({
    //                 page: page
    //             })
    //         },


    //     })
    // },

    valiUserUrl: function() {
        wx.navigateTo({
            url: '/packageOther/pages/others/message/publish/publish',
        })
    },
    clipboardWechat: function (e) {
      let wechat = e.currentTarget.dataset.wechat;
      wx.setClipboardData({
        data: wechat,
        success(res) {
          wx.hideToast();
          wx.showModal({
            title: '恭喜您',
            content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
            showCancel: false,
            success: function () { }
          })
        }
      })
    },
    callThisPhone: function(e) {
        app.callThisPhone(e);
    },
    initNeedData: function () {
        let joingroup = app.globalData.joingroup.slice(5,7);
      if(joingroup){
        this.setData({
          joingroup: joingroup,
          wechat: app.globalData.copywechat,
          phone: app.globalData.callphone
        })
        return false;
      }
        let _this = this;
        let _mark = true;
        let _wx = wx.getStorageSync("_wx");
        let userInfo = this.data.userInfo;
        let _time = Date.parse(new Date());
        if (_wx && _wx.expirTime) {
          if (parseInt(_wx.expirTime) > _time) _mark = false;
        }
        if (userInfo) userInfo.type = "job"
        else userInfo = { type: "job" }
        app.doRequestAction({
          url: "index/less-search-data/",
          way: "POST",
          hideLoading: true,
          params: userInfo,
          success: function (res) {
            let mydata = res.data;
            _this.setData({
              "notice.lists": mydata.notice,
              // member_notice: mydata.member_notice,
              member_less_info: mydata.member_less_info,
              phone: mydata.phone,
              wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number),
              joingroup: mydata.join_group_config
            })

            app.globalData.joingroup = mydata.join_group_config
            app.globalData.copywechat = mydata.wechat.number
            app.globalData.callphone = mydata.phone
            
            if (_mark) {
              let extime = _time + (mydata.wechat.outTime * 1000);
              wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime });
            }
          },
          fail: function (err) {
            wx.showToast({
              title: '数据加载失败！',
              icon: "none",
              duration: 3000
            })
          }
        })
      },
    //tup
    restimg(e) {
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        const dataArr = this.data.restaurants.find(fo => fo.id === item.id)
        const images = dataArr.images
        this.setData({
            isViewImgs: true
        })
        wx.previewImage({
            current: images[index],
            urls: images
        })
    },
    getDetail: function (e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `/packageOther/pages/others/message/detail/detail?id=${id}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.initUserData(options)
        this.initNeedData();
      //this.getPhonCons();
    },
    onShow: function() {
        if (this.data.isViewImgs) {
            this.setData({
                isViewImgs: false
            });
            return false;
        }
        this.setData({
            page: 1,
            hasmore: true
        })
        this.getFeedbackList(true);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },

    onHide: function() {
        wx.hideToast()

    },
    ////下拉加载生命周期
    onReachBottom: function() {
        if ((this.data.page != 1) && this.data.hasmore) this.getFeedbackList()
    },
})

// pages/publish/card/card.js
let vali = require("../../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo: false,
      icon: app.globalData.apiImgUrl + "userauth-topicon.png",
      options: {},
        cardInfo: {
            username: "",
            title: "",
            purpose: [],
            attribute_id: "",
            category_id: "",
            cities: [],
            provinceId: "",
            cityId: "",
            memberTel: "",
            cardTel: "",
            code: "",
            content: ""
        },
        areaProvince: [],
        provinceIndex: 0,
        areaCitys: [],
        cityIndex: 0,
        areaText: "",
        userPhone: "",
        infoId: "",
        showWorkType: false,
        showTextarea: true,
        codeTips: "获取验证码",
        status: 1,
        textareaActive: false,
        textareaTips: "",
        strlen:0,
        model:{},
        is_check:"",
        showHide:false
    },

    userClickItem: function (e) {
        let _id = e.currentTarget.dataset.id;
        let _check = e.currentTarget.dataset.check;
        let _index = parseInt(e.currentTarget.dataset.index);
        let _key = parseInt(e.currentTarget.dataset.key);
        let _cid = this.data.cardInfo.purpose[_index].id;
        let _newarr = this.resetArrItems(this.data.cardInfo.purpose, _index, _key);
        this.setData({
            "cardInfo.purpose": _newarr,
            "cardInfo.attribute_id": _id,
            "cardInfo.category_id": _cid
        })
    },
    resetArrItems: function (_arr, _index, _key) {
        let myarr = app.arrDeepCopy(_arr);
        for (let i = 0; i < myarr.length; i++) {
            if (myarr[i].has_attribute) {
                let _arr = myarr[i].attributes;
                for (let j = 0; j < _arr.length; j++) {
                    _arr[j].is_check = false;
                }
            }
        }
        myarr[_index].attributes[_key].is_check = true;
        return myarr;
    },
  judgecommit(mydata, options) {
       let userInfo = wx.getStorageSync("userInfo");
       let infoId = (options.hasOwnProperty("id")) ? options.id : "";
       let model = {
         userId: userInfo.userId,
         token: userInfo.token,
         tokenTime: userInfo.tokenTime,
         type: "fleamarket",
         infoId: infoId,
         user_mobile: mydata.model.user_mobile || mydata.memberInfo.tel,
         title: mydata.model.title ? mydata.model.title : "",
         user_name: mydata.model.user_name ? mydata.model.user_name : "",
         detail: mydata.model.detail ? mydata.model.detail : "",
         code: "",
         province_id: mydata.model.province_id ? mydata.model.province_id : "",
         city_id: mydata.model.city_id ? mydata.model.city_id : "",
         category_id: mydata.selectedClassifies ? mydata.selectedClassifies.category_id : "",
         attribute_id: mydata.selectedClassifies ? mydata.selectedClassifies.attribute_id : "",
       }
      this.setData({ model: model });
    },
    initUserCardinfo: function (options) {
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        let infoId = (options.hasOwnProperty("id")) ? options.id : "";
        this.setData({ userInfo: userInfo });
        app.appRequestAction({
            url: "publish/view-message/",
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                infoId: infoId,
                type: "fleamarket"
            },
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.setData({
                        infoId: infoId,
                        userPhone: mydata.model.user_mobile || mydata.memberInfo.tel,
                        "cardInfo.username": mydata.model.user_name ? mydata.model.user_name : "",
                        "cardInfo.title": mydata.model.title ? mydata.model.title : "",
                        "cardInfo.purpose": mydata.classifyTree,
                        "cardInfo.attribute_id": mydata.selectedClassifies ? mydata.selectedClassifies.attribute_id : "",
                        "cardInfo.category_id": mydata.selectedClassifies ? mydata.selectedClassifies.category_id : "",
                        "cardInfo.cities": mydata.areaTree,
                        "cardInfo.provinceId": mydata.model.province_id ? mydata.model.province_id : "",
                        "cardInfo.cityId": mydata.model.city_id ? mydata.model.city_id : "",
                        "cardInfo.memberTel": mydata.memberInfo.tel,
                        "cardInfo.cardTel": mydata.model.user_mobile,
                      "cardInfo.content": mydata.model.detail ? mydata.model.detail : "",
                        strlen: mydata.model.detail ? mydata.model.detail.length : 0,
                        textareaTips: mydata.placeholder,
                      is_check: mydata.model.hasOwnProperty("is_check") ? mydata.model.is_check : "",
                      showHide: false
                    })
                  _this.judgecommit(mydata, options)
                    setTimeout(function () {
                        _this.initAreaPicker();
                    }, 0)
                } else if (mydata.errcode == "to_auth") {
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.errmsg,
                    cancelText: '取消',
                    confirmText: '去实名',
                    success(res) {
                      if (res.cancel) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.confirm) {
                        wx.navigateTo({
                          url: `/pages/realname/realname`
                        })
                        _this.setData({
                          showHide:true
                        })
                      }
                    }
                  })
                  return
                } else if (mydata.errcode == "auth_checking") {
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.errmsg,
                    confirmText: '确定',
                    cancelText: '取消',
                    success(res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    }
                  })
                  return
                } else {
                    app.showMyTips(mydata.errmsg);
                }
            }
        })
    },
    initAreaPicker: function () {
        let _arr = app.arrDeepCopy(this.data.cardInfo.cities);
        let pid = this.data.cardInfo.provinceId;
        let pIndex = 0;
        let _areaArr = [];
        for (let i = 0; i < _arr.length; i++) {
            if (_arr[i].id == pid) pIndex = i;
            let _data = {
                id: _arr[i].id,
                has_children: _arr[i].has_children,
                name: _arr[i].name
            }
            _areaArr.push(_data)
        }

        this.setData({
            areaProvince: _areaArr,
            provinceIndex: pIndex,
        })
        this.initFirstPicker();
        this.initCityPicker(pIndex);
    },
    initFirstPicker: function () {
        let _this = this;
        let _id = this.data.cardInfo.cityId;
        let arr = this.data.cardInfo.cities;
        let _index = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].has_children == "1") {
                let _data = arr[i].children;
                for (let j = 0; j < _data.length; j++) {
                    if (_data[j].id == _id) {
                        _this.setData({ cityIndex: j })
                    }
                }
            }
        }
        setTimeout(function () {
            _this.getAreaText();
        }, 0)
    },
    getAreaText: function () {
        this.setData({
            areaText: (this.data.areaProvince[this.data.provinceIndex].name + ((this.data.areaProvince[this.data.provinceIndex].id == this.data.areaCitys[this.data.cityIndex].id) ? "" : ("-" + this.data.areaCitys[this.data.cityIndex].name)))
        })
    },
    initCityPicker: function (_index) {
        let _arr = app.arrDeepCopy(this.data.cardInfo.cities);
        let _newdata = {};
        let cityArr = [];
        if (_arr[_index].has_children == "1") {
            let _newarr = _arr[_index].children;
            for (let j = 0; j < _newarr.length; j++) {
                _newdata = {
                    id: _newarr[j].id,
                    pid: _newarr[j].pid,
                    name: _newarr[j].name
                }
                cityArr.push(_newdata);
            }
        } else {
            _newdata = {
                id: _arr[_index].id,
                pid: _arr[_index].pid,
                name: _arr[_index].name
            }
            cityArr.push(_newdata);
        }
        this.setData({
            areaCitys: cityArr
        })
    },
    userChangeWorktype: function () {
        this.setData({
            showWorkType: true,
            showTextarea: false
        })
    },
    userSureWorktype: function () {
        this.setData({
            showWorkType: false,
            showTextarea: true
        })
    },
    userSureWorkProvince: function () {
        this.setData({
            showWorkProvince: false,
            showTextarea: true
        })
    },
    userEnterNewtel: function (e) {
        this.setData({ userPhone: e.detail.value })
    },
    userEditPhoneCode: function (e) {
        this.setData({ "cardInfo.code": e.detail.value })
    },
    userGetCode: function () {
        let _this = this;
        let phone = this.data.userPhone;
        let userInfo = this.data.userInfo;
        let status = this.data.status;
        if (!status) return false;
        let v = vali.v.new();
        if (!v.isMobile(phone)) {
            app.showMyTips("手机号输入有误！");
            return false;
        }
        this.setData({ status: 0 });
        app.appRequestAction({
            title: "正在获取验证码",
            url: "index/get-code/",
            way: "POST",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                tel: phone,
                sendType: "have"
            },
            success: function (res) {
                let mydata = res.data;
                app.showMyTips(mydata.errmsg);
                if (mydata.errcode == "ok") {
                    let _time = mydata.refresh;
                    _this.initCountDown(_time);
                }
            },
            fail: function () {
                _this.setData({ status: 1 });
                wx.showToast({
                    title: '网络错误，获取失败！',
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    initCountDown: function (_time) {
        let _t = parseInt(_time);
        let _this = this;
        this.setData({
            status: 0,
            codeTips: _t + "秒后重试"
        });
        let timer = setInterval(function () {
            _t--;
            if (_t == 0) {
                clearInterval(timer);
                _this.setData({
                    status: 1,
                    codeTips: "获取验证码"
                })
                return false;
            }
            _this.setData({ codeTips: _t + "秒后重试" })
        }, 1000)
    },
    userPublishCard: function () {
        let _this = this;
        let userInfo = this.data.userInfo;
        let cardInfo = this.data.cardInfo;
        let phone = this.data.userPhone;
        let infoId = this.data.infoId;
        let v = vali.v.new();
      if (!v.isRequire(cardInfo.title,3)) {
            app.showMyTips("标题最少三个字！");
            return false;
        }
        if (cardInfo.category_id == "") {
            app.showMyTips("请选择您的交易类型！");
            return false;
        }
        if (cardInfo.provinceId == "") {
            app.showMyTips("请选择您的地区！");
            return false;
        }
        if (!v.regStrNone(cardInfo.username)) {
            app.showMyTips("请输入正确的联系人姓名！");
            return false;
        }
        if (!v.isMobile(phone)) {
            app.showMyTips("手机号输入有误！");
            return false;
        }

        if ((phone != cardInfo.memberTel) && (phone != cardInfo.cardTel)) {
            if (!v.isRequire(cardInfo.code, 4)) {
                app.showMyTips("请输入正确的验证码！");
                return false;
            }
        }else{
            this.setData({
                "cardInfo.code": ''
            })
        }

        if (!v.regStrNone(cardInfo.content)) {
            app.showMyTips("请输入交易详情");
            return false;
        }
        let dataJson = {
            userId: userInfo.userId,
            token: userInfo.token,
            tokenTime: userInfo.tokenTime,
            type: "fleamarket",
            infoId: infoId,
            user_mobile: phone,
            title: cardInfo.title,
            user_name: cardInfo.username,
            detail: cardInfo.content,
            code: cardInfo.code,
            province_id: parseInt(cardInfo.provinceId),
            city_id: (cardInfo.provinceId == cardInfo.cityId) ? "" : parseInt(cardInfo.cityId),
            category_id: parseInt(cardInfo.category_id),
            attribute_id: parseInt(cardInfo.attribute_id)
        };

      if (JSON.stringify(dataJson) == JSON.stringify(this.data.model) && this.data.is_check == '0') {
        wx.showModal({
          title: '温馨提示',
          content:"请修改信息后，再次提交",
          showCancel: false,
          success(res) { }
        })
        return
      }
        app.appRequestAction({
            title: "信息发布中",
            url: "publish/publish-msg/",
            way: "POST",
            mask: true,
            failTitle: "网络出错，发布失败！",
            params: dataJson,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    wx.showModal({
                        title: '恭喜您',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function (res) {
                            wx.reLaunch({
                                url: '/pages/published/published?type=1',
                            })
                        }
                    })
                } else {
                    app.showMyTips(mydata.errmsg);
                }
            }
        })
    },
    userEnterTitle: function (e) {
        this.setData({ "cardInfo.title": e.detail.value })
    },
    userEnterUsername: function (e) {
        this.setData({ "cardInfo.username": e.detail.value })
    },
    getTextareaFocus: function () {
        this.setData({ textareaActive: true })
    },
    userEnterContent: function (e) {
        this.setData({
            "cardInfo.content": e.detail.value,
            strlen : e.detail.value.length
        })
    },
    provincePickerChange: function (e) {
        let _this = this;
        let pId = parseInt(e.detail.value[0]);
        let cId = parseInt(e.detail.value[1]);
        this.setData({
            "cardInfo.provinceId": _this.data.areaProvince[pId].id,
            "cardInfo.cityId": _this.data.areaCitys[cId].id,
            provinceIndex: pId,
            cityIndex: cId
        })
        this.getAreaText();
    },
    provincePickerScorllChange: function (e) {
        let val = parseInt(e.detail.value);
        let col = parseInt(e.detail.column);
        let pi = parseInt(this.data.provinceIndex);
        if (col == 0) {
            this.initCityPicker(val);
        }
    },
  bindGetUserInfo: function (e) {
    let that = this;
    app.bindGetUserInfo(e, function (res) {
      app.mini_user(res, function (res) {
        app.api_user(res, function (res) {
          let uinfo = res.data;
          if (uinfo.errcode == "ok") {
            let userInfo = {
              userId: uinfo.data.id,
              token: uinfo.data.sign.token,
              tokenTime: uinfo.data.sign.time,
            }
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo)
            that.setData({ userInfo: userInfo });
            let options = that.data.options;
            that.initUserCardinfo(options);
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  returnPrevPage: function () {
    wx.navigateBack({ delta: 1 })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo) {
        this.setData({
          userInfo: userInfo
        })
        this.setData({ options: options })
        this.initUserCardinfo(options);
      } else {
        this.setData({ options: options })
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
      if (this.data.showHide){
        this.initUserCardinfo(this.data.options);
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

})
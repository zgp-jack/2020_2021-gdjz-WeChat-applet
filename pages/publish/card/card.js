// pages/publish/card/card.js
let vali = require("../../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:false,
      icon: app.globalData.apiImgUrl + "userauth-topicon.png",
      options: {},
        cardInfo:{
            username:"",
            title:"",
            workType:[],
            workTypeIds:[],
            workTypenum:3,
            cities:[],
            cityIds:[],
            citynum:3,
            team:"",
            teamId:"",
            memberTel:"",
            cardTel:"",
            code:"",
            content:"",
            imgs:[],
            imgnum:3,
        },
        userPhone:"",
        infoId:"",
        showWorkType: false,
        showWorkProvince:false,
        showTextarea: true,
        showUploads: false,
        codeTips:"获取验证码",
        status:1,
        textareaActive:false,
        textareaTips: "",
        strlen:0
    },
    bindPickerChange:function(e){
        this.setData({
            "cardInfo.teamId": parseInt(e.detail.value) + 1
        })
    },
    userClickItem: function (e) {
        let _type = e.currentTarget.dataset.type;
        let _id = e.currentTarget.dataset.id;
        let _check = e.currentTarget.dataset.check;
        let _index = parseInt(e.currentTarget.dataset.index);
        let _key = parseInt(e.currentTarget.dataset.key);
        if(_type == "workType"){
            if (_check){
                let _arr = this.delArrItems(this.data.cardInfo.workTypeIds,_id);
                let _newarr = this.resetArrItems(this.data.cardInfo.workType,_index,_key,false);
                this.setData({
                    "cardInfo.workTypeIds" : _arr,
                    "cardInfo.workType": _newarr
                })
            }else{
                if (this.data.cardInfo.workTypeIds.length >= this.data.cardInfo.workTypenum){
                    wx.showModal({
                        title: '温馨提示',
                        content: '所需工种最多选择' + this.data.cardInfo.workTypenum+'个',
                        showCancel:false,
                        success(res) {}
                    })
                    return false;
                }
                let _arr = this.addArrItems(this.data.cardInfo.workTypeIds,_id);
                let _newarr = this.resetArrItems(this.data.cardInfo.workType, _index, _key, true);
                this.setData({
                    "cardInfo.workTypeIds": _arr,
                    "cardInfo.workType": _newarr
                })
            }
        }else if(_type == "province"){
            if (_check) {
                let _arr = this.delArrItems(this.data.cardInfo.cityIds, _id);
                let _newarr = this.resetArrItems(this.data.cardInfo.cities, _index, _key, false);
                this.setData({
                    "cardInfo.cityIds": _arr,
                    "cardInfo.cities": _newarr
                })
            } else {
                if (this.data.cardInfo.cityIds.length >= this.data.cardInfo.citynum) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '接活省份最多选择' + this.data.cardInfo.citynum + '个',
                        showCancel: false,
                        success(res) { }
                    })
                    return false;
                }
                let _arr = this.addArrItems(this.data.cardInfo.cityIds, _id);
                let _newarr = this.resetArrItems(this.data.cardInfo.cities, _index, _key, true);
                this.setData({
                    "cardInfo.cityIds": _arr,
                    "cardInfo.cities": _newarr
                })
            }
        }
    },
    delArrItems:function(_arr,_id){
        let myarr = app.arrDeepCopy(_arr);
        for (var i = 0; i < myarr.length; i++) {
            if (myarr[i] == _id) myarr.splice(i,1);
        }
        return myarr;
    },
    addArrItems:function(_arr,_id){
        let myarr = app.arrDeepCopy(_arr);
        myarr.push(_id);
        return myarr;
    },
    resetArrItems:function(_arr,_index,_key,_bool){
        let myarr = app.arrDeepCopy(_arr);
        (_key < 0) ? myarr[_index].is_check = _bool : myarr[_index].children[_key].is_check = _bool;
        return myarr;
    },
    userDoUploads: function () {
        this.setData({
            showUploads: !this.data.showUploads
        })
    },
    initUserCardinfo: function (options){
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        userInfo = userInfo ? userInfo : {};
        let infoId = (options.hasOwnProperty("id")) ? options.id : "";
        if(infoId){
            wx.setNavigationBarTitle({
                title: '修改找活名片'
            })
        }
        app.appRequestAction({
            url: "publish/view-message/",
            way: "POST",
            params: {
                userId:userInfo.userId,
                token:userInfo.token,
                tokenTime:userInfo.tokenTime,
                infoId:infoId,
                type:"resume"
            },
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.setData({
                      userInfo: userInfo,
                        infoId: infoId,
                        userPhone: mydata.model.user_mobile || mydata.memberInfo.tel,
                        "cardInfo.username": mydata.model.user_name || "",
                        "cardInfo.title": mydata.model.title || "",
                        "cardInfo.workType": mydata.classifyTree,
                        "cardInfo.workTypeIds": mydata.selectedClassifies,
                        "cardInfo.workTypenum": parseInt(mydata.typeTextArr.maxClassifyCount),
                        "cardInfo.cities": mydata.provinceList,
                        "cardInfo.cityIds": mydata.resume_province,
                        "cardInfo.citynum": parseInt(mydata.typeTextArr.maxProvinceCount),
                        "cardInfo.team": mydata.staffList,
                        "cardInfo.teamId": mydata.model.team_composition ? parseInt(mydata.model.team_composition) : 1,
                        "cardInfo.memberTel": mydata.memberInfo.tel,
                        "cardInfo.cardTel": mydata.model.user_mobile,
                      "cardInfo.content": mydata.model.detail || "",
                        strlen: mydata.model.detail ? mydata.model.detail.length : 0,
                        "cardInfo.imgs": mydata.view_image,
                        "cardInfo.imgnum": parseInt(mydata.typeTextArr.maxImageCount),
                        showUploads: (mydata.view_image.length > 0) ? true : false,
                        textareaTips: mydata.placeholder
                    })
                }else if (mydata.errcode == "has") {
                  wx.redirectTo({
                    url: '/pages/mycard/mycard',
                  })
                }else{
                    app.returnPrevPage(mydata.errmsg);
                }
            }
        })
    },
    userChangeWorktype:function(){
        this.setData({ 
            showWorkType:true,
            showTextarea:false
        })
    },
    userChangeProvince:function(){
        this.setData({
            showWorkProvince: true,
            showTextarea: false
        })
    },
    userSureWorktype:function(){
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
    getTextareaFocus:function(){
        this.setData({ textareaActive:true })
    },
    userEnterNewtel:function(e){
        this.setData({ 
            userPhone:e.detail.value
        })
    },
    userEditPhoneCode: function (e) {
        this.setData({ 
            "cardInfo.code": e.detail.value
        })
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
    userPublishCard:function(){
        let _this = this;
        let userInfo = this.data.userInfo;
        let cardInfo = this.data.cardInfo;
        let phone = this.data.userPhone;
        let infoId = this.data.infoId;
        let v = vali.v.new();
        if (!v.regStrNone(cardInfo.title)) {
            app.showMyTips("请输入找活名称！");
            return false;
        }
        if (!cardInfo.workTypeIds.length) {
            app.showMyTips("请选择您的所属工种！");
            return false;
        }
        if (!cardInfo.cityIds.length) {
            app.showMyTips("请选择您的接活省份！");
            return false;
        }
        if (!v.regStrNone(cardInfo.username) || !v.chineseReg(cardInfo.username) || (cardInfo.username).trim().length<2){
            app.showMyTips("请正确输入2~5字纯中文姓名！");
            return false;
        }
        if (!v.isMobile(phone)){
            app.showMyTips("手机号输入有误！");
            return false;
        }
        if ((phone != cardInfo.memberTel) && (phone != cardInfo.cardTel) ){
            if (!v.isRequire(cardInfo.code,4)){
                app.showMyTips("请输入正确的验证码！");
                return false;
            }
        }
        if (!v.regStrNone(cardInfo.content)) {
            app.showMyTips("请输入找活详情");
            return false;
        }
        let cardImgs = _this.getUserCardImgs();
        let dataJson = {
            userId: userInfo.userId,
            token: userInfo.token,
            tokenTime: userInfo.tokenTime,
            type: "resume",
            infoId: infoId,
            user_mobile: phone,
            title: cardInfo.title,
            user_name: cardInfo.username,
            classifies: cardInfo.workTypeIds,
            provinces: cardInfo.cityIds,
            detail: cardInfo.content,
            team_composition: cardInfo.teamId,
            code: cardInfo.code,
            images: cardImgs
        };
        app.appRequestAction({
            title:"信息发布中",
            url:"publish/publish-msg/",
            way: "POST",
            mask: true,
            failTitle:"网络出错，发布失败！",
            params:dataJson,
            success:function(res){
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                    wx.showModal({
                        title: '恭喜您',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function (res) { 
                            wx.reLaunch({
                                url: '/pages/ucenter/ucenter',
                            })
                        }
                    })
                }else{
                    app.showMyTips(mydata.errmsg);
                }
            }
        })
    },
    userEnterTitle:function(e){
        this.setData({ 
            "cardInfo.title": e.detail.value
        })
    },
    userEnterUsername: function (e) {
        let reg = /^[\u4e00-\u9fa5]$/
            let value = e.detail.value
            let values = value.split("")
            let userNames = []
            for (let i = 0; i < values.length; i++) {
                if (reg.test(values[i])) {
                    userNames.push(values[i])
                }
            }
        let userName = userNames.join("")
        this.setData({
            "cardInfo.username": userName
        })
    },
    userEnterContent:function(e){
        this.setData({
            "cardInfo.content":e.detail.value,
            strlen:e.detail.value.length
        })
    },
    delCardImg:function(e){
        let _index = parseInt(e.currentTarget.dataset.index);
        let _arr = app.arrDeepCopy(this.data.cardInfo.imgs);
        _arr.splice(_index,1);
        this.setData({
            "cardInfo.imgs": _arr
        })
    },
    userUploadCardImg:function(e){
        let _this = this;
        let _type = parseInt(e.currentTarget.dataset.type);
        let _index = parseInt(e.currentTarget.dataset.index);
        app.userUploadImg(function (imgRes,mydata){
            wx.hideLoading();
            wx.showToast({
                title: mydata.errmsg,
                icon: "none",
                duration: 2000
            })
            let _data = {
                url: mydata.url,
                httpurl: imgRes.tempFilePaths[0]
            }
            let arr = _this.userChangeImgItem(_this.data.cardInfo.imgs, _index, _data,_type);
            _this.setData({
                "cardInfo.imgs":arr
            })
        })
        
    },
    userChangeImgItem:function(_arr,_index,_data,_type){
        let arr = app.arrDeepCopy(_arr);
        (_type == 0) ? arr.push(_data) : arr[_index] = _data;
        return arr;
    },
    getUserCardImgs:function(){
        let arr = app.arrDeepCopy(this.data.cardInfo.imgs);
        let _arr = [];
        for(let i = 0;i<arr.length;i++){
            _arr.push(arr[i].url);
        }
        return _arr;
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
            //that.setData({ userInfo: userInfo });
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
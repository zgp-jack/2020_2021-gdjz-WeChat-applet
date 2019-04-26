// pages/publish/card/card.js
let vali = require("../../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        fastToken:"",
        cardInfo: {
            username: "",
            title: "",
            workType: [],
            workTypeIds: [],
            workTypenum: 3,
            cities: [],
            provinceId:"",
            cityId: "",
            content: "",
        },
        areaProvince:[],
        provinceIndex:0,
        areaCitys:[],
        cityIndex:0,
        areaText:"",
        infoId: "",
        showWorkType: false,
        showTextarea: true,
        textareaActive: false,
        textareaTips: ""
    },
    bindPickerChange: function (e) {
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
        if (_type == "workType") {
            if (_check) {
                let _arr = this.delArrItems(this.data.cardInfo.workTypeIds, _id);
                let _newarr = this.resetArrItems(this.data.cardInfo.workType, _index, _key, false);
                this.setData({
                    "cardInfo.workTypeIds": _arr,
                    "cardInfo.workType": _newarr
                })
            } else {
                if (this.data.cardInfo.workTypeIds.length >= this.data.cardInfo.workTypenum) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '所需工种最多选择' + this.data.cardInfo.workTypenum + '个',
                        showCancel: false,
                        success(res) { }
                    })
                    return false;
                }
                let _arr = this.addArrItems(this.data.cardInfo.workTypeIds, _id);
                let _newarr = this.resetArrItems(this.data.cardInfo.workType, _index, _key, true);
                this.setData({
                    "cardInfo.workTypeIds": _arr,
                    "cardInfo.workType": _newarr
                })
            }
        } 
    },
    delArrItems: function (_arr, _id) {
        let myarr = app.arrDeepCopy(_arr);
        for (var i = 0; i < myarr.length; i++) {
            if (myarr[i] == _id) myarr.splice(i, 1);
        }
        return myarr;
    },
    addArrItems: function (_arr, _id) {
        let myarr = app.arrDeepCopy(_arr);
        myarr.push(_id);
        return myarr;
    },
    resetArrItems: function (_arr, _index, _key, _bool) {
        let myarr = app.arrDeepCopy(_arr);
        (_key < 0) ? myarr[_index].is_check = _bool : myarr[_index].children[_key].is_check = _bool;
        return myarr;
    },
    userDoUploads: function () {
        this.setData({
            showUploads: !this.data.showUploads
        })
    },
    initUserCardinfo: function (options) {
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo") : {};
        let infoId = (options.hasOwnProperty("id")) ? options.id : "";
        let fastToken = (options.hasOwnProperty("token")) ? options.token : "";
        this.setData({ userInfo: userInfo, fastToken: fastToken });
        app.appRequestAction({
            url: "fast-issue/job-info/",
            way: "POST",
            params: {
                oldJobId: infoId,
                token: fastToken
            },
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.setData({
                        infoId: infoId,
                        "cardInfo.username": mydata.jobInfo.user_name ? mydata.jobInfo.user_name : "",
                        "cardInfo.title": mydata.jobInfo.title ? mydata.jobInfo.title : "",
                        "cardInfo.workType": mydata.classifyTree,
                        "cardInfo.workTypeIds": mydata.selectedClassifies ? mydata.selectedClassifies : [],
                        "cardInfo.workTypenum": parseInt(mydata.typeTextArr.maxClassifyCount),
                        "cardInfo.cities": mydata.areaTree,
                        "cardInfo.provinceId": mydata.jobInfo.province_id ? mydata.jobInfo.province_id : "",
                        "cardInfo.cityId": mydata.jobInfo.city_id ? mydata.jobInfo.city_id : "",
                        "cardInfo.content": mydata.jobInfo.detail ? mydata.jobInfo.detail : "",
                        textareaTips: mydata.placeholder
                    })
                    setTimeout(function(){
                        _this.initAreaPicker();
                    },0)
                } else if (mydata.errcode == "job_null"){
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function (res) {
                            wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }
                    })
                } else {
                    app.showMyTips(mydata.errmsg);
                }
            }
        })
    },
    initAreaPicker:function(){
        let _arr = app.arrDeepCopy(this.data.cardInfo.cities);
        let pid = this.data.cardInfo.provinceId;
        let pIndex = 0;
        let _areaArr = [];
        for(let i = 0;i<_arr.length;i++){
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
    initFirstPicker:function(){
        let _this = this;
        let _id = this.data.cardInfo.cityId;
        let arr = this.data.cardInfo.cities;
        let _index = 0;
        for (let i = 0; i < arr.length;i++){
            if(arr[i].has_children == "1"){
                let _data = arr[i].children;
                for (let j = 0; j < _data.length;j++){
                    if (_data[j].id == _id){
                        _this.setData({  cityIndex:j })
                    }
                }
            }
        }
        setTimeout(function () {
            _this.getAreaText();
        }, 0)
    },
    getAreaText:function(){
        this.setData({
            areaText: (this.data.areaProvince[this.data.provinceIndex].name + ((this.data.areaProvince[this.data.provinceIndex].id == this.data.areaCitys[this.data.cityIndex].id) ? "" : ("-" + this.data.areaCitys[this.data.cityIndex].name)))
        })
    },
    initCityPicker:function(_index){
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
    getTextareaFocus:function(){
        this.setData({
            textareaActive: true
        })
    },
    userSureWorkProvince: function () {
        this.setData({
            showWorkProvince: false,
            showTextarea: true
        })
    },

    //用户提交数据
    userPublishCard: function () {
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        console.log(userInfo);
        let cardInfo = this.data.cardInfo;
        let phone = this.data.userPhone;
        let infoId = this.data.infoId;
        let v = vali.v.new();
        if (!v.regStrNone(cardInfo.title)) {
            app.showMyTips("请输入招工标题！");
            return false;
        }
        if (!cardInfo.workTypeIds.length) {
            app.showMyTips("请选择您的所需工种！");
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

        if (!v.regStrNone(cardInfo.content)) {
            app.showMyTips("请输入招工详情");
            return false;
        }

        let needData = this.data.cardInfo;
        let postData = {
            oldJobId: this.data.infoId,
            token: this.data.fastToken,
            fastId: wx.getStorageSync("fastId") ? wx.getStorageSync("fastId") : "",
            title: needData.title,
            user_name: needData.username,
            classifies: needData.workTypeIds,
            province_id: needData.provinceId,
            city_id: needData.cityId,
            detail: needData.content,
        }
  
        app.appRequestAction({
            title: "正在发布招工信息",
            url: "fast-issue/save/",
            way: "POST",
            mask: true,
            failTitle: "网络出错，发布失败！",
            params: postData,
            success: function (res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    let newId = mydata.new_job_id;
                    wx.setStorageSync("fastJobId", newId);
                    wx.showModal({
                        title: '恭喜您',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function (res) {
                            wx.reLaunch({
                                url: userInfo ?  '/pages/fast-issue/lists/lists' : '/pages/fast-issue/tips/tips' 
                            })
                        }
                    })
                } else if(mydata.errcode == "job_null"){
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function (res) {
                            wx.reLaunch({
                                url:  '/pages/index/index'
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
        this.setData({ 
            "cardInfo.title": e.detail.value
        })
    },
    userEnterUsername: function (e) {
        this.setData({
            "cardInfo.username": e.detail.value
             })
    },
    userEnterContent: function (e) {
        this.setData({
            "cardInfo.content": e.detail.value
        })
    },
    provincePickerChange:function(e){
        let _this = this;
        let pId = parseInt(e.detail.value[0]);
        let cId = parseInt(e.detail.value[1]);
        this.setData({
            "cardInfo.provinceId": _this.data.areaProvince[pId].id,
            "cardInfo.cityId": (_this.data.areaCitys[cId].id == _this.data.areaProvince[pId].id) ? 0 : _this.data.areaCitys[cId].id,
            provinceIndex: pId,
            cityIndex:cId
        })
        this.getAreaText();
    },
    provincePickerScorllChange:function(e){
        let val = parseInt(e.detail.value);
        let col = parseInt(e.detail.column);
        let pi = parseInt(this.data.provinceIndex);
        if(col == 0){
            this.initCityPicker(val);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUserCardinfo(options);
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
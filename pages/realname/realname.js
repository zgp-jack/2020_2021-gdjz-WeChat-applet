// pages/realname/realname.js
let vali = require("../../utils/v.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        member:{
            username:"",
            tel:"",
            code:"",
            age:"",
            id_card: "",
            nationality: "",
            hand_img:"",
            hand_img_path:"",
            id_card_img:"",
            id_card_img_path:"",
            idcard_check_failure_reason:"",
            show_resume:"",
            worktypeIds: [],
            province_id: "",
            cities: [],
            pass:"",
        },
        phone:"",
        myIndex:0,
        hasChecked:false,
        classifyTree:[],
        maxCount:3,
        codeTips: "获取验证码",
        status: 1,
        idcardz: "http://cdn.yupao.com/miniprogram/images/idcard-z.png",
        idcardf:"http://cdn.yupao.com/miniprogram/images/idcard-f.png",
        showWorkType:false,
        areaText: "",
        nationalarray: [],
        nation:"",
        nationindex:""
    },
    getnationdetail(item){
      console.log(item)
      let getId = this.data.nation;
      for (let i = 0; i < item.length;i++){
        if (item[i].mz_id == getId){
          this.setData({
            nationindex: i
          })
        }
      }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    initUserInfo:function(){
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo:userInfo });
        app.appRequestAction({
            url:"user/auth-view/",
            way:"POST",
            params:userInfo,
            success:function(res){
                let mydata =res.data;
                if(mydata.errcode == "ok"){
                    mydata = mydata.authData;
                    _this.setData({
                        "member.username": mydata.member.username,
                        "phone": mydata.member.tel,
                        "member.tel": mydata.member.tel,
                        "member.age": mydata.memberExt.age,
                        "member.id_card": mydata.memberExt.id_card,
                        "member.hand_img": mydata.memberExt.hand_img,
                        "member.hand_img_path": mydata.memberExt.hand_img_path,
                        "member.id_card_img": mydata.memberExt.id_card_img,
                        "member.id_card_img_path": mydata.memberExt.id_card_img_path,
                        "member.nationality": mydata.memberExt.nationality,
                        "member.idcard_check_failure_reason": mydata.memberExt.idcard_check_failure_reason,
                        "member.show_resume": mydata.show_resume,
                        "classifyTree": (mydata.show_resume == 1) ? mydata.classifyTree : [],
                        "member.cities":(mydata.show_resume == 1) ? mydata.provinceTree : [],
                         nation: mydata.memberExt.nation_id,
                    })
   
                  let nationalarray = [];
                  for (let i = 0; i < mydata.nation.length; i++) {
                    nationalarray.push(mydata.nation[i].mz_name)
                  }
                  _this.setData({
                    nationalarray: nationalarray,
                    nationalarrayone: mydata.nation,
                  })
                  _this.getnationdetail(mydata.nation)
                    if (mydata.show_resume == 1){
                        setTimeout(function () {
                            _this.initUserAutoProvince();
                        }, 0)
                    }

                    if (mydata.member.is_check == "0"){
                        wx.showModal({
                            title: '审核失败',
                            content: mydata.memberExt.idcard_check_failure_reason,
                            showCancel: false,
                            success: function (res) {}
                        })
                    }
                    
                }else{
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel: false,
                        success: function (res) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }
            }
        })
    },
  nation(e) {
    console.log(e)
    this.setData({
      nationindex: e.detail.value,
      nation: this.data.nationalarrayone[e.detail.value].mz_id
    })
  },
    initUserAutoProvince:function(){
        this.setData({
            "member.province_id": this.data.member.cities[this.data.myIndex].id
        })
    },
    userEnterName:function(e){
        this.setData({ "member.username" : e.detail.value })
    },
    userEnterAge: function (e) {
        this.setData({ "member.age": e.detail.value })
    },
    userEnterNationality: function (e) {
        this.setData({ "member.nationality": e.detail.value })
    },
    userEnterIdcard: function (e) {
        this.setData({ "member.id_card": e.detail.value })
    },
    userEnterTel: function (e) {
        this.setData({ phone: e.detail.value })
    },
    userEnterCode: function (e) {
        this.setData({ "member.code": e.detail.value })
    }, 
    userEnterPass:function(e){
        this.setData({ "member.pass": e.detail.value })
    },
    userGetCode: function () {
        let _this = this;
        let phone = this.data.phone;
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
    userUploadIdcard: function (e) {
        let _this = this;
        let _type = e.currentTarget.dataset.type;
        app.userUploadImg(function (imgRes, mydata) {
            wx.hideLoading();
            wx.showToast({
                title: mydata.errmsg,
                icon: "none",
                duration: 2000
            })
            if (_type == "zm"){
                _this.setData({
                    "member.id_card_img": mydata.url,
                    "member.id_card_img_path": imgRes.tempFilePaths[0]
                })
            }else if(_type == "sc"){
                _this.setData({
                    "member.hand_img": mydata.url,
                    "member.hand_img_path": imgRes.tempFilePaths[0]
                })
            }
            
        })

    },
    userClickItem: function (e) {
        let _id = e.currentTarget.dataset.id;
        let _check = e.currentTarget.dataset.check;
        let _index = parseInt(e.currentTarget.dataset.index);
        let _key = parseInt(e.currentTarget.dataset.key);

        if (_check) {
            let _arr = this.delArrItems(this.data.member.worktypeIds, _id);
            let _newarr = this.resetArrItems(this.data.classifyTree, _index, _key, false);
            this.setData({
                "member.worktypeIds": _arr,
                classifyTree: _newarr
            })
        } else {
            if (this.data.member.worktypeIds.length >= this.data.maxCount) {
                wx.showModal({
                    title: '温馨提示',
                    content: '工种最多选择' + this.data.maxCount + '个',
                    showCancel: false,
                    success(res) { }
                })
                return false;
            }
            let _arr = this.addArrItems(this.data.member.worktypeIds, _id);
            let _newarr = this.resetArrItems(this.data.classifyTree, _index, _key, true);
            this.setData({
                "member.worktypeIds": _arr,
                "classifyTree": _newarr
            })
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
        myarr[_index].children[_key].is_check = _bool;
        return myarr;
    },
    userSureWorktype:function(){
        this.setData({ showWorkType:false })
    },
    userChangeWorktype:function(){
        this.setData({ showWorkType: true })
    },
    provincePickerChange: function (e) {
        let _this = this;
        let _index = parseInt(e.detail.value);
       let _id = this.data.member.cities[_index].id;
        this.setData({
            "member.province_id": _id,
            myIndex: _index,
            hasChecked:true
        })
    },
    userSubmitIdcard:function(){
        let _this = this;
        let member = this.data.member;
        let userInfo = this.data.userInfo;
        let phone = this.data.phone;
        let v = vali.v.new();
        if (!v.isRequire(member.username,2)){
            app.showMyTips("请输入正确的用户名！");
            return false;
        }
        if (!v.isRequire(member.age, 1)) {
            app.showMyTips("请输入您的年龄！");
            return false;
        }
        if (!v.isRequire(member.nationality, 1)) {
            app.showMyTips("请输入您的民族！");
            return false;
        }
        if (!v.isRequire(member.id_card, 15)) {
            app.showMyTips("请输入正确的身份证号码！");
            return false;
        }
        if (!member.tel) {
            if (!v.isMobile(phone)) {
                app.showMyTips("手机号码有误！");
                return false;
            }
            if (!v.isRequire(member.code, 4)) {
                app.showMyTips("请输入正确的验证码！");
                return false;
            }
            if (!v.isRequire(member.pass, 6)) {
                app.showMyTips("密码由6-16位数字或字母组成！");
                return false;
            }
        }
        
        if (member.id_card_img == ""){
            app.showMyTips("请上传身份证正面照！");
            return false;
        }
        if (member.hand_img == "") {
            app.showMyTips("请上传手持身份证照！");
            return false;
        }

        if (parseInt(member.show_resume) == 1){
            if (member.worktypeIds.length == 0) {
                app.showMyTips("请选择您的工种！");
                return false;
            }
            if (!this.data.hasChecked){
                app.showMyTips("请选择您的地区！");
                return false;
            }
        }

        let formData = {
            userId:userInfo.userId,
            token:userInfo.token,
            tokenTime:userInfo.tokenTime,
            username:member.username,
            age:member.age,
            nation_id: _this.data.nation,
            nationality: _this.data.nationalarray[_this.data.nationindex],
            idCard:member.id_card,
            idCardImg: member.id_card_img,
            handImg: member.hand_img,
            tel :phone,
            pwd :member.pass,
            code :member.code,
            classifys:member.worktypeIds,
            province_id:member.province_id
        };
      console.log(formData)
        app.appRequestAction({
            url:"user/do-auth/",
            way:"POST",
            params:formData,
            title:"提交中",
            failTitle:"网络错误，提交失败！",
            success:function(res){
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                    app.returnPrevPage(mydata.errmsg);
                }else{
                    app.showMyTips(mydata.errmsg);
                }
            },
            
        })
        
    },
    onLoad: function (options) {
        this.initUserInfo();
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
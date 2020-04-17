// pages/realname/realname.js
let vali = require("../../utils/v.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check_modify: false,
    card_img_path: "http://cdn.yupao.com/miniprogram/images/lpy/auth/idcard-l.png?t=" + new Date().getTime(),
    handone_img_path: "http://cdn.yupao.com/miniprogram/images/lpy/auth/idcard-z.png?t=" + new Date().getTime(),
    card_img_status: app.globalData.apiImgUrl + "lpy/auth/idcard-bkqs.png",
    card_img_array: [app.globalData.apiImgUrl + "lpy/auth/idcard-yes.png", app.globalData.apiImgUrl + "lpy/auth/idcard-bkqs.png", app.globalData.apiImgUrl + "lpy/auth/idcard-qs.png", app.globalData.apiImgUrl + "lpy/auth/idcard-sg.png"],
    card_img_content: ["标准", "边框缺失", "照片模糊", "闪光强烈"],
    hand_img_path: "",
    uploadfailicon: app.globalData.apiImgUrl + "lpy/auth/upload-fail-tips.png?t=" + new Date().getTime(),
    userInfo: {},
    member: {
      username: "",
      tel: "",
      code: "",
      age: "",
      id_card: "",
      nationality: "",
      hand_img: "",
      hand_img_path: "",
      id_card_img: "",
      id_card_img_path: "",
      idcard_check_failure_reason: "",
      show_resume: "",
      worktypeIds: [],
      province_id: "",
      cities: [],
      pass: "",
    },
    phone: "",
    myIndex: 0,
    hasChecked: false,
    classifyTree: [],
    maxCount: 3,
    codeTips: "获取验证码",
    status: 1,
    idcardz: "http://cdn.yupao.com/miniprogram/images/lpy/auth/idcard-z.png?t=" + new Date().getTime(),
    idcardf: "http://cdn.yupao.com/miniprogram/images/lpy/auth/idcard-l.png?t=" + new Date().getTime(),
    showWorkType: false,
    areaText: "",
    nationalarray: [],
    nation: "",
    nationindex: "",
    sex: "",
    array: [{ id: '1', name: '男' }, { id: '2', name: '女' }],
    arrayone: [],
    beforeDate: "",
    emdDate: "",
    regionone: "",
    birthday: "",
    indexsex: "fail",
    check_degree: false,
    regionall: "",
    getCode: true,
    backtwo:"",
    model:{},
    is_check:""
  },
  getaddressindexof(relname) {
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (reg.test(relname)) {
      if (relname.length > 12) {
        this.setData({
          regionone: relname.substring(0, 18) + "...",
          regionall: relname
        })
      } else {
        this.setData({
          regionone: relname,
          regionall: relname
        })
      }
    }else{
      this.setData({
        regionone: "",
        regionall: ""
      })
    }
  },
  getaddress() {
    let relname = wx.getStorageSync("relname");
    if (relname) {
      this.getaddressindexof(relname)
    }
    wx.removeStorageSync('relname')
  },
  userTapAddress: function () {
    wx.navigateTo({
      url: '/pages/relnamemap/smap',
    })
  },
  starttimer() {
    let timer = new Date();
    let d = new Date(timer);
    let times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.setData({
      nowDate: times
    })
    let starttime = this.data.nowDate.split("-");
    let starttimeone = this.data.nowDate.split("-")[0] - 0;
    let starttimetwo = this.data.nowDate.split("-")[1];
    let starttimethree = this.data.nowDate.split("-")[2];

    let beforeDate = (starttimeone - 60) + "-" + starttimetwo + "-" + starttimethree;
    let emdDate = (starttimeone - 18) + "-" + starttimetwo + "-" + starttimethree;
    this.setData({
      beforeDate: beforeDate,
      emdDate: emdDate
    })


  },
  birthday(e) {
    console.log(e)
    this.setData({
      birthday: e.detail.value
    })

  },
  getpikerdetail() {
    let that = this;
    let array = []
    for (let i = 0; i < that.data.array.length; i++) {
      array.push(that.data.array[i].name)
    }
    that.setData({
      arrayone: array
    })

    if (that.data.indexsex != "fail" && that.data.indexsex >= 0) {
      that.setData({
        sex: that.data.array[that.data.indexsex].id
      })
    } else if (that.data.indexsex != "fail" && that.data.indexsex < 0) {
      that.setData({
        sex: ""
      })
    }
  },
  sex: function (e) {
    console.log(e)
    this.setData({
      indexsex: ~~e.detail.value
    })
    this.setData({
      sex: this.data.array[~~e.detail.value].id
    })

  },
  getnationdetail(item) {

    let getId = this.data.nation;

    if (item) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].mz_id == getId) {
          this.setData({
            nationindex: i
          })
        }
      }
    }

  },
  /**
   * 生命周期函数--监听页面加载 1122
   */

  judgecommit(mydata, userInfo){
    let _this = this;
    let member = this.data.member;
    if (_this.data.indexsex != "fail" && _this.data.indexsex >= 0) {
      _this.setData({
        sex: _this.data.array[_this.data.indexsex].id
      })
    } else if (_this.data.indexsex != "fail" && _this.data.indexsex < 0) {
      _this.setData({
        sex: ""
      })

    } else if (_this.data.indexsex == "fail") {
      _this.setData({
        sex: ""
      })
    }

    let nationality = _this.data.nationalarray[_this.data.nationindex]
    let model = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      username: mydata.hasOwnProperty("memberExt") ? mydata.memberExt.hasOwnProperty("user_name") ? mydata.memberExt.user_name : "" : "",
      age: mydata.memberExt.age,
      nation_id: mydata.memberExt.nation_id ? mydata.memberExt.nation_id : "",
      nationality: nationality,
      idCard: mydata.memberExt.id_card,
      idCardImg: mydata.memberExt.id_card_img,
      handImg: mydata.memberExt.hand_img,
      tel: mydata.hasOwnProperty("member") ? mydata.member.tel : "",
      code: member.code,
      province_id: member.province_id,
      address: mydata.memberExt.address ? mydata.memberExt.address == 0 ? "" : mydata.memberExt.address : "",
      birthday: mydata.memberExt.birthday ? mydata.memberExt.birthday == 0 ? "" : mydata.memberExt.birthday : "",
      gender: _this.data.sex
    }
    _this.setData({ model: model });
  },
  initUserInfo: function () {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo });
    app.appRequestAction({
      url: "user/auth-view/",
      way: "POST",
      params: userInfo,
      success: function (res) {
        let mydata = res.data;
        console.log(mydata)
        if (mydata.errcode == "ok") {
          mydata = mydata.authData;
          _this.setData({
            "member.username": mydata.hasOwnProperty("memberExt") ? mydata.memberExt.hasOwnProperty("user_name") ? mydata.memberExt.user_name : "" : "",
            "phone": mydata.hasOwnProperty("member") ? mydata.member.tel : "",
            "member.tel": mydata.hasOwnProperty("member") ? mydata.member.tel : "",
            "member.age": mydata.memberExt.age,
            "member.id_card": mydata.memberExt.id_card,
            "member.hand_img": mydata.memberExt.hand_img,
            "member.id_card_img": mydata.memberExt.id_card_img,
            "member.nationality": mydata.memberExt.nationality,
            "member.idcard_check_failure_reason": mydata.memberExt.idcard_check_failure_reason,
            "member.show_resume": mydata.show_resume,
            "classifyTree": (mydata.show_resume == 1) ? mydata.classifyTree : [],
            "member.cities": (mydata.show_resume == 1) ? mydata.provinceTree : [],
            nation: mydata.memberExt.nation_id ? mydata.memberExt.nation_id : "",
            birthday: mydata.memberExt.birthday ? mydata.memberExt.birthday == 0 ? "" : mydata.memberExt.birthday : "",
            regionall: mydata.memberExt.address ? mydata.memberExt.address == 0 ? "" : mydata.memberExt.address : "",
            indexsex: mydata.memberExt.sex ? mydata.memberExt.sex - 1 : "fail",
            card_img_path: mydata.memberExt.id_card_img_path ? mydata.memberExt.id_card_img_path : "",
            handone_img_path: mydata.memberExt.hand_img_path ? mydata.memberExt.hand_img_path : "",             
            is_check: mydata.member.is_check
          })
       
          _this.getaddressindexof(_this.data.regionall)
          if (mydata.hasOwnProperty("member")) {
            if (mydata.member.check_degree == 2) {
              _this.setData({
                check_degree: true
              })
            }

          }
          let nationalarray = [];
          for (let i = 0; i < mydata.nation.length; i++) {
            nationalarray.push(mydata.nation[i].mz_name)
          }
          _this.setData({
            nationalarray: nationalarray,
            nationalarrayone: mydata.nation,
          })
          _this.getnationdetail(mydata.nation)
          _this.judgecommit(mydata, userInfo)
          if (mydata.show_resume == 1) {
            setTimeout(function () {
              _this.initUserAutoProvince();
            }, 0)
          }

          if (mydata.member.is_check == "0") {
            wx.showModal({
              title: '审核失败',
              content: mydata.memberExt.idcard_check_failure_reason,
              showCancel: false,
              success: function (res) { }
            })
          }
          _this.getpikerdetail()
        } else {

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

    this.setData({
      nationindex: e.detail.value,
      nation: this.data.nationalarrayone[e.detail.value].mz_id
    })
  },
  initUserAutoProvince: function () {
    this.setData({
      "member.province_id": this.data.member.cities[this.data.myIndex].id
    })
  },
  userEnterName: function (e) {
    this.setData({ "member.username": e.detail.value })
  },
  userEnterAge: function (e) {
    this.setData({ "member.age": e.detail.value })
  },
  userEnterNationality: function (e) {
    this.setData({ "member.nationality": e.detail.value })
  },
  userEnterIdcard: function (e) {
    let that = this;
    if (e) {
      var re = /^\w{0,18}$/;
      if (!re.test(e.detail.value)) {
        wx.showModal({
          title: '温馨提示',
          content: '只能输入英文与数字，请重新输入',
          showCancel: false,
          success(res) {

            that.setData({
              "member.id_card": ''
            })
          }
        })
        return
      }
    }
    this.setData({ "member.id_card": e.detail.value })
  },
  userEnterTel: function (e) {

    this.setData({ phone: e.detail.value })
  },
  userEnterCode: function (e) {
    this.setData({ "member.code": e.detail.value })
  },
  userEnterPass: function (e) {
    this.setData({ "member.pass": e.detail.value })
  },
  userGetCode: function () {
    let _this = this;
    let phone = this.data.phone;
    let userInfo = this.data.userInfo;
    let status = this.data.status;
    if (!status) return false;
    let v = vali.v.new();
    if (!phone) {
      app.showMyTips("请输入正确的手机号码！");
      return false;
    }
    if (!v.isMobile(phone)) {
      app.showMyTips("手机号码错误！");
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
        _this.setData({
          getCode: false
        })
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
    app.cameraAndAlbum(function (imgRes, mydata) {
      wx.hideToast();
      if (_type == "zm") {
        _this.setData({
          "card_img_path": mydata.httpurl,
          "member.id_card_img": mydata.url
        })
      } else if (_type == "sc") {
        _this.setData({
          "handone_img_path": mydata.httpurl,
          "member.hand_img": mydata.url
        })
        wx.showToast({
          title: mydata.errmsg,
          icon: "none",
          duration: 2000
        })
      }
      if (mydata.hasOwnProperty("card_info")) {

        if (_type == "zm" && !mydata.card_info.success) {
          wx.showToast({
            title: mydata.card_info.tips_message,
            icon: "none",
            duration: 2000
          })
          _this.setData({
            "card_img_path": _this.data.uploadfailicon,
          })
        } else if (_type == "zm" && mydata.card_info.success) {

          wx.showToast({
            title: mydata.errmsg,
            icon: "none",
            duration: 2000
          })
          _this.getimageDetail(mydata)
        }

        _this.setData({
          check_degree: true,
        })

      }
    }, _type)
  },
  getimageDetail(mydata) {
    let _this = this;
    let nationalarrayone = this.data.nationalarrayone;
    if (mydata.hasOwnProperty("card_info")) {
      _this.setData({
        nation: mydata.card_info.nation_id ? mydata.card_info.nation_id : "",
        birthday: mydata.card_info.birth ? mydata.card_info.birth : "",
        regionall: mydata.card_info.address ? mydata.card_info.address : "",
        indexsex: mydata.card_info.gender ? mydata.card_info.gender - 1 : "fail",
        "member.id_card": mydata.card_info.num ? mydata.card_info.num : "",
        "member.username": mydata.card_info.name ? mydata.card_info.name : ""
      })
      _this.getaddressindexof(_this.data.regionall)
      if (_this.data.indexsex != "fail" && _this.data.indexsex >= 0) {
        _this.setData({
          sex: _this.data.array[_this.data.indexsex].id
        })
      } else if (_this.data.indexsex != "fail" && _this.data.indexsex < 0) {
        _this.setData({
          sex: ""
        })

      } else if (_this.data.indexsex == "fail") {
        _this.setData({
          sex: ""
        })
      }
      _this.dostatus(_this.data.birthday)
      // console.log(_this.data.nation)
      if (_this.data.nation == "") {
        _this.setData({
          nationindex: ""
        })
        return false
      }
      for (let i = 0; i < nationalarrayone.length; i++) {
        if (nationalarrayone[i].mz_id == _this.data.nation) {
          _this.setData({
            nationindex: i
          })
        }
      }

    }
  },
  dostatus(item) {
    let birthall = null;
    let birth = item.substring(0, 4)
    let birthtwo = item.substring(4, 6)
    let birththree = item.substring(6, 8)
    if (item != "") {
      birthall = birth + "-" + birthtwo + "-" + birththree;
    } else {
      birthall = ""
    }

    this.setData({
      birthday: birthall
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
  userSureWorktype: function () {
    this.setData({ showWorkType: false })
  },
  // showAll(){

  //   let show = this.data.check_degree;
  //   if ((!this.data.member.username || !this.data.arrayone[this.data.indexsex] || !this.data.birthday || !this.data.nationalarray[this.data.nationindex] || !this.data.member.id_card || !this.data.regionone || !this.data.member.tel) && show){
  //     this.setData({ check_modify: true })
  //   }

  // },
  // userChangeWorktype:function(){
  //     this.setData({ showWorkType: true })
  // },
  // provincePickerChange: function (e) {
  //     let _this = this;
  //     let _index = parseInt(e.detail.value);
  //    let _id = this.data.member.cities[_index].id;
  //     this.setData({
  //         "member.province_id": _id,
  //         myIndex: _index,
  //         hasChecked:true
  //     })
  // },
  userSubmitIdcard: function () {
    let _this = this;
    let nationalque = _this.data.nationalarray[_this.data.nationindex]

    let member = this.data.member;
    let userInfo = this.data.userInfo;
    let phone = this.data.phone;
    let v = vali.v.new();

    // if (_this.data.card_img_path == _this.data.uploadfailicon) {
    //   app.showMyTips("请上传身份证人像照！");
    //   return false;
    // }
    if (member.id_card_img == "") {
      app.showMyTips("请上传身份证人像照！");
      return false;
    }
    if (member.hand_img == "") {
      app.showMyTips("请上传手持身份证照！");
      return false;
    }


    if (member.username.length < 2) {
      app.showMyTips("请正确填写2~6字真实姓名！");
      return false;
    }
    var han = /^[\u4e00-\u9fa5]+$/;
    if (!han.test(member.username)) {
      app.showMyTips("请正确填写2~6字真实姓名！");
      return false;
    };
    if (!v.isRequire(member.username, 2)) {
      app.showMyTips("请输入正确的姓名！");
      return false;
    }
    console.log(_this.data.sex)
    if (!v.isRequire(_this.data.sex, 1)) {
      app.showMyTips("请选择您的性别！");
      return false;
    }
    if (_this.data.birthday == "") {
      app.showMyTips("请选择您的出生日期");
      return false;
    }
    console.log(_this.data.birthday)
    if (_this.data.nation == "") {
      app.showMyTips("请选择您的民族！");
      return false;
    }



    if (!v.isRequire(nationalque, 1)) {
      app.showMyTips("请选择您的民族！");
      return false;
    }

    if (!v.isRequire(member.id_card, 15)) {
      app.showMyTips("请输入正确的身份证号码！");
      return false;
    }
    if (_this.data.regionone == "") {
      app.showMyTips("请选择您的地址");
      return false;
    }
    console.log(phone)
    if (!phone) {
      app.showMyTips("请输入正确的手机号码！");
      return false;
    }
    if (!member.tel) {
      if (!v.isMobile(phone)) {
        app.showMyTips("手机号码错误！");
        return false;
      }
      if (!v.isRequire(member.code, 4) && !_this.data.getCode) {
        app.showMyTips("请输入正确的验证码！");
        return false;
      }
      if (!v.isRequire(member.code, 4) && _this.data.getCode) {
        app.showMyTips("请先获取验证码！");
        return false;
      }
      // if (!v.isRequire(member.pass, 6)) {
      //   app.showMyTips("密码由6-16位数字或字母组成！");
      //   return false;
      // }
    }




    // if (parseInt(member.show_resume) == 1){
    //     if (member.worktypeIds.length == 0) {
    //         app.showMyTips("请选择您的工种！");
    //         return false;
    //     }
    //     if (!this.data.hasChecked){
    //         app.showMyTips("请选择您的地区！");
    //         return false;
    //     }
    // }  1122

    let formData = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      username: member.username,
      age: member.age,
      nation_id: _this.data.nation,
      nationality: _this.data.nationalarray[_this.data.nationindex],
      idCard: member.id_card,
      idCardImg: member.id_card_img,
      handImg: member.hand_img,
      tel: phone,
      code: member.code,
      province_id: member.province_id,
      address: _this.data.regionall,
      birthday: _this.data.birthday,
      gender: _this.data.sex
    };

    if (JSON.stringify(_this.data.model) == JSON.stringify(formData) && _this.data.is_check == "0" ){
      wx.showModal({
        title: '审核失败',
        content: _this.data.member.idcard_check_failure_reason,
        showCancel: false,
        success: function (res) { }
      })
      return false;
    }

    app.appRequestAction({
      url: "user/do-auth/",
      way: "POST",
      params: formData,
      title: "提交中",
      failTitle: "网络错误，提交失败！",
      success: function (res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          _this.subscribeToNews(mydata, userInfo)
        } else {
          app.showMyTips(mydata.errmsg);
        }
      },
    })
  },
  subscribeToNews: function (mydata, userInfo) {
    app.subscribeToNews("auth", function () {
      app.returnPrevPage(mydata.errmsg);
    })
  },
  getBack(options){
    if (options.hasOwnProperty("backtwo")){
         this.setData({
           backtwo: options.backtwo
         })
    }
  },
  onLoad: function (options) {
    this.initUserInfo();
    this.getBack(options)
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
    this.starttimer()
    this.getaddress()
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
    console.log(123)
    if (this.data.backtwo == "backtwo"){
      wx.navigateBack({
        delta: 1
      })
    }

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
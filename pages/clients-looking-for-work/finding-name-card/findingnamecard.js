// addskill  lat nation projectlength showbot tom  view_num selectTap showbottom checkone projectone checkfour checkone ressonone note showperfection editor addproject toperfect improvementwork 修改失败 introinfo authentication returnPrevPage  userInfo
 

const app = getApp();

Page({

  /** 
   * 页面的初始数据 nation view_num perfection addskill
   */
  data: {
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    userInfo:true,
    certificate_count: 0,
    project_count: 0,
    username: '',
    userimg: '',
    showtop: true,
    showtopone: false,
    showModal: false,
    name: "未填写",
    sex: "未填写",
    nation: "未填写",
    occupations: "未填写",
    telephone: "未填写",
    introduce: "未填写",
    city: "未填写",
    intro: true,
    introne: false,
    selfintro: true,
    selfintrone: false,
    workingyears: "未填写",
    staffcomposition: "未填写",
    cityself: "未填写",
    procity: "未填写",
    personnum: "未填写",
    tags: "未填写",
    headerimg: "../../../images/hearding.png",
    selectk: [],
    selectkone: "",
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    check: "",
    checkstatus: true,
    is_introduces: false,
    view_num: 0,
    project: [],
    projectone: [],
    projectlength: 0,
    importimg: "",
    imgArrs: "",
    percent: 0,
    skilllength: 0,
    skillbooks: [],
    skillbooksone: [],
    checkone: false,
    checkonef: 4568,
    checktwo: false,
    checktwof: 4568,
    checkthree: false,
    checkthreef: 4568,
    checkfour: false,
    checkfourf: 4568,
    // showbottom: false,
    resume_uuid: "",
    showtan: false,
    resson: "",
    ressonone: false,
    note: "",
    passre: true,
    nopassre: true,
    showcomplete: true,
    checkcontent:"",
    fail_certificate:"",
    fail_project:"",
    display:"none",
    popup:"",
    move:true
  },
  vertify() {
    this.setData({
      showModal: false,
      display: "none"
    })
  },
  obtn() {
    this.setData({
      showModal: false,
      display: "none"
    })
  },
  editor(e) {
    console.log(e)
    wx.setStorageSync("projectdetail", e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/new-project-experience/projectexperience",
    })
  },
  editorone(e) {
    console.log(e)
    wx.setStorageSync("skilltail", e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate",
    })
  },
  completeall() {

    if (!this.data.resume_uuid) {
      wx.navigateTo({
        url: '/pages/clients-looking-for-work/essential-information/esinformation',
      })
    } else if (this.data.is_introduces == 0) {
      wx.navigateTo({
        url: '/pages/clients-looking-for-work/work-description/workdescription',
      })
    } else if (this.data.project.length == 0) {
      wx.navigateTo({
        url: "/pages/clients-looking-for-work/new-project-experience/projectexperience",
      })
    } else if (this.data.skillbooks.length == 0) {
      wx.navigateTo({
        url: "/pages/clients-looking-for-work/addcertificate/addcertificate",
      })
    }
  },
  redorblue() {
    if (this.data.resume_uuid && this.data.is_introduces != 0 && this.data.project.length != 0 && this.data.skillbooks.length != 0) {
      this.setData({
        showcomplete: false
      })
    }else{
      this.setData({
        showcomplete: true
      })
    }
  },
  onShareAppMessage: function () {
    console.log(123)
    return {
      title: '在这里输入标题',
      desc: '在这里输入简介说明',
      path: '../preview-name-card/previewcard'//这是一个路径
    }
  },
  selectTap() {
    let that = this;
    if (this.data.check == "2") {
      let selectdata = [];
      let selectdataId = [];
      for (let i = 0; i < this.data.selectData.length; i++) {
        selectdata.push(this.data.selectData[i].name)
      }
      for (let i = 0; i < this.data.selectData.length; i++) {
        selectdataId.push(this.data.selectData[i].id)
      }
      wx.showActionSheet({

        itemList: selectdata,
        success(res) {
          if (that.data.index == res.tapIndex) {
            return
          }
          that.setData({
            index: res.tapIndex
          })
          that.setData({
            selectData: that.data.selectData,
            selectk: that.data.selectk,
          })
          let userInfo = wx.getStorageSync("userInfo");
          let detail = {}
          let dataId = selectdataId[res.tapIndex] + ""
          Object.assign(detail, {
            userId: userInfo.userId,
            token: userInfo.token,
            tokenTime: userInfo.tokenTime,
            resume_uuid: that.data.resume_uuid,
            type: dataId
          })
          console.log(detail)
          app.appRequestAction({
            url: 'resumes/edit-end/',
            way: 'POST',
            params: detail,
            success(res) {
              console.log(res)
              if (res.data.errcode == "ok") {
                that.getdetail()
              }
            }
          })
        },
        fail(res) {
          // app.showMyTips("修改失败");
        }
      })
    }
    if (this.data.check == "1") {
      wx.showModal({
        title: '温馨提示',
        content: that.data.checkcontent,
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (this.data.check == "0") {
      wx.showModal({
        title: '温馨提示',
        content: that.data.checkcontent,
        showCancel: false,
        success(res) { }
      })
      return
    }
    this.setData({
      selectShow: !this.data.selectShow
    });
  },

  toperfect() {

    wx.navigateTo({
      url: '/pages/clients-looking-for-work/essential-information/esinformation',
    })
  },
  improvementwork() {

    if (this.data.resume_uuid == "") {
      wx.showModal({
        title: '温馨提示',
        content: '您未完善基本信息填写,请先填写基本信息',
        showCancel: false,
        success(res) {
          wx.navigateTo({
            url: '/pages/clients-looking-for-work/essential-information/esinformation',
          })
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/clients-looking-for-work/work-description/workdescription',
    })
  },
  edit(e) {

    wx.navigateTo({
      url: '/pages/clients-looking-for-work/essential-information/esinformation',
    })
  },
  addproject() {

    if (this.data.resume_uuid == "") {
      wx.showModal({
        title: '温馨提示',
        content: '您未完善基本信息填写,请先填写基本信息',
        showCancel: false,
        success(res) {
          wx.navigateTo({
            url: '/pages/clients-looking-for-work/essential-information/esinformation',
          })
        }
      })
      return
    }
    
    let projectnum = this.data.projectlength
    wx.setStorageSync("projectnum", projectnum)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/new-project-experience/projectexperience",
    })
  },
  moreproject() {
    app.globalData.allexpress = true;
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-project-experience/allexperience",
    })
  },
  addskill() {

    if (this.data.resume_uuid == "") {
      wx.showModal({
        title: '温馨提示',
        content: '您未完善基本信息填写,请先填写基本信息',
        showCancel: false,
        success(res) {
          wx.navigateTo({
            url: '/pages/clients-looking-for-work/essential-information/esinformation',
          })
        }
      })
      return
    }
    let skillnum = this.data.skilllength
    wx.setStorageSync("skillnum", skillnum)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate",
    })
  },
  moreskill() {
    app.globalData.allskill = true;
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-skills-certificate/skillscertificate",
    })
  },
  preview() {
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/preview-name-card/previewcard",
    })
  },
  chooseImage() {
    if (this.data.checkone){
      wx.showModal({
        title: '温馨提示',
        content: '信息审核中，请稍后再试',
        showCancel: false,
        success(res) {
        }
      })
      return
    }
    let that = this;
    app.userUploadImg(function (img, url) {
      console.log(url)
      wx.hideLoading()
      that.data.imgArrs = url.httpurl
      that.data.importimg = url.url
      that.setData({
        headerimg: that.data.imgArrs
      })
      let userInfo = wx.getStorageSync("userInfo");
      let imgdetail = {}
      Object.assign(imgdetail, {
        userId: userInfo.userId,
        token: userInfo.token,
        tokenTime: userInfo.tokenTime,
        image: that.data.importimg
      })
      app.appRequestAction({
        url: 'resumes/edit-img/',
        way: 'POST',
        failTitle: "操作失败，请稍后重试！",
        params: imgdetail,
        success(res) {
          console.log(res)
          if (res.data.errcode == 200) {
            app.showMyTips("保存成功");
          }
        },
        fail: function (err) {
          app.showMyTips("保存失败");
        }
      })
    })
  },
  getdetail() {
    let userInfo = wx.getStorageSync("userInfo");
    let detail = {}
    Object.assign(detail, {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })
    let that = this;
    app.appRequestAction({
      url: 'resumes/resume-list/',
      way: 'POST',
      params: detail,
      success:function(res) {
        let mydata = res.data.data;
        console.log(mydata)
        console.log(res)
        if (res.data.errcode == 200) {
          for (let i = 0; i < mydata.project.length; i++) {
            if (mydata.project[i].check == 1) {
              that.setData({
                checkthree: true,
                checkthreef: mydata.project[i].check
              })
            }

            if (mydata.project[i].check == 0) {
              that.setData({
                checkthree: false,
                checkthreef: mydata.project[i].check
              })
              break
            }

            if (mydata.project[i].check == 2) {
              that.setData({
                checkthree: false,
                checkthreef: mydata.project[i].check
              })
            }
          }

          for (let i = 0; i < mydata.certificates.length; i++) {
            if (mydata.certificates[i].check == 1) {
              that.setData({
                checkfour: false,
                checkfourf: mydata.certificates[i].check
              })
            }
            if (mydata.certificates[i].check == 0) {
              that.setData({
                checkfour: false,
                checkfourf: mydata.certificates[i].check
              })
              break
            }
            if (mydata.certificates[i].check == 1) {
              that.setData({
                checkfour: true,
                checkfourf: mydata.certificates[i].check
              })
            }
          }
          let date = new Date();
          let dateo = date.getTime()
          let dateone = new Date(dateo);
          wx.setStorageSync("introdetail", mydata.introduces)
          wx.setStorageSync("introinfo", mydata.info)
          if (mydata.info.uuid) {
            that.showtop()
            that.setData({
              resume_uuid: mydata.info.uuid
            })
            wx.setStorageSync("uuid", mydata.info.uuid)
          }
          that.setData({
            sex: mydata.info.gender == "1" ? "男" : "女"
          })
          if (mydata.info.birthday) {
            that.setData({
              age: dateone.getFullYear() - (mydata.info.birthday.split("-")[0] - 0)
            })
          }
          that.setData({
            name: mydata.info.hasOwnProperty("username") ? mydata.info.username : "",
            nation: mydata.info.hasOwnProperty("nation") ? mydata.info.nation : "",
            occupations: mydata.info.hasOwnProperty("occupations") ? mydata.info.occupations : "",
            telephone: mydata.info.hasOwnProperty("tel") ? mydata.info.tel : "",
            city: mydata.info.hasOwnProperty("address") ? mydata.info.address : "",
            intro: false,
            introne: true,
            introduce: mydata.info.hasOwnProperty("introduce") ? mydata.info.introduce : "",
            workingyears: mydata.introduces.hasOwnProperty("experience") ? mydata.introduces.experience : "",
            staffcomposition: mydata.introduces.hasOwnProperty("type_str") ? mydata.introduces.type_str : "",
            cityself: mydata.introduces.hasOwnProperty("hometown") ? mydata.introduces.hometown : "",
            procity: mydata.introduces.hasOwnProperty("prof_degree_str") ? mydata.introduces.prof_degree_str : "",
            personnum: mydata.introduces.hasOwnProperty("number_people") ? mydata.introduces.number_people : "",
            tags: mydata.introduces.hasOwnProperty("tags") ? mydata.introduces.tags : "",
            checkone: mydata.info.check && mydata.info.check == 1 ? true : false,
            checkonef: mydata.info.hasOwnProperty("check") ? mydata.info.check : "",
            checktwo: mydata.introduces.check && mydata.introduces.check == 1 ? true : false,
            checktwof: mydata.introduces.hasOwnProperty("check") ? mydata.introduces.check : "",
            certificate_count: mydata.hasOwnProperty("certificate_count") ? mydata.certificate_count : "",
            project_count: mydata.hasOwnProperty("project_count") ? mydata.project_count : "",
            note: mydata.info.hasOwnProperty("note") ? mydata.info.note : "",
            fail_certificate: mydata.hasOwnProperty("fail_certificate") ? mydata.fail_certificate : "",
            fail_project: mydata.hasOwnProperty("fail_project") ? mydata.fail_project : "",
          })
          if (that.data.showtop) {
            app.globalData.showperfection = true;
          }else{
            app.globalData.showperfection = false;
          }
          wx.setStorageSync("certificate_count", that.data.certificate_count)
          wx.setStorageSync("project_count", that.data.project_count)
          that.showbottom()
          let selectD = Object.values(mydata.status)
          let selectk = Object.keys(mydata.status)
          if (mydata.info.is_end == "2") {
            that.setData({
              index: 1,
            })
          }
          that.setData({
            passre: true
          })
          that.setData({
            selectData: selectD,
            selectk: selectk
          })
          that.setData({
            check: mydata.info.hasOwnProperty("check") ? mydata.info.check : "",
            checkcontent: mydata.hasOwnProperty("content") ? mydata.content.check_tips_string : "",
          })

          that.setData({
            headerimg: mydata.info.headerimg
          })
          if (mydata.is_introduces == 1) {
            that.setData({
              is_introduces: mydata.is_introduces,
              selfintro: false,
              selfintrone: true,
            })
          } else if (mydata.is_introduces == 0) {
            that.setData({
              is_introduces: mydata.is_introduces
            })
          }

          that.setData({
            view_num: mydata.info.hasOwnProperty("view_num") ? mydata.info.view_num : 0
          });


          if (mydata.project != []) {
            that.setData({
              project: mydata.project
            });

            that.setData({
              projectone: [mydata.project[0]]
            });
            that.setData({
              projectlength: mydata.project.length >= 1 ? mydata.project.length : 0
            })

          }
          that.setData({
            percent: mydata.info.hasOwnProperty("progress") ? mydata.info.progress : 0
          })



          if (mydata.certificates != []) {
            that.setData({
              skillbooks: mydata.certificates
            })
            that.setData({
              skilllength: res.data.data.certificates.length >= 1 ? res.data.data.certificates.length : 0
            })
            that.setData({
              skillbooksone: [that.data.skillbooks[0]]
            })
          }

          let popup = "";
          if (mydata.hasOwnProperty("popup_text")) {
            for (let i = 0; i < mydata.popup_text.length; i++) {
              if (mydata.popup_text.length - 1 == i) {
                popup += mydata.popup_text[i]
              } else {
                popup += mydata.popup_text[i] + "、"
              }
            }
          }
          if (that.data.checkonef != "0" || that.data.checktwof != "0") {
            that.setData({
              ressonone: false
            })
            that.setData({
              passre: true
            })
            that.setData({
              nopassre: true
            })
          }
          if (that.data.checkonef == "0" || that.data.checktwof == "0") {
            that.setData({
              ressonone: true
            })
            that.setData({
              nopassre: true
            })
            that.setData({
              passre: false
            })
          }
          if (that.data.checkonef == "1" || that.data.checktwof == "1") {
            that.setData({
              ressonone: false
            })
            that.setData({
              passre: true
            })
            that.setData({
              nopassre: false
            })
          }
          if (app.globalData.showdetail) {
            if (that.data.checkonef == "0" || that.data.checktwof == "0") {
              that.setData({
                ressonone: true
              })
            }
            if (that.data.checkthreef == "0") {
              ressonthree: true
            }
            if (that.data.checkfourf == "0") {
              ressonfour: true
            }
            if (that.data.checkonef == "0" || that.data.checktwof == "0" || that.data.checkthreef == "0" || that.data.checkfourf == "0") {
              // wx.showModal({
              //   title: '温馨提示',
              //   content: `您的${popup}未通过请重新修改`,
              //   showCancel: false,
              //   success(res) {
              //   }
              // })
              that.setData({
                showModal: true,
                display: "block",
                popup: popup
              })
              that.setData({
                resson: [that.data.skillbooks[0]],
              })
              app.globalData.showdetail = false
            }
          }
          that.redorblue()
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: `您的网络请求失败`,
          showCancel: false,
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },

  showtop() {
    this.setData({
      showtop: false,
      showtopone: true
    })
  },
  showbottom() {
    if (this.data.checkonef == "2") {
      this.setData({
        showbottom: true
      })
    } else {
      this.setData({
        showbottom: false
      })
    }
  },
  delestore() {
    wx.removeStorageSync("projectdetail")
  },
  deleskill() {
    wx.removeStorageSync("skilltail")
  },

  authrasution(){
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      this.setData({
        userInfo:false
      })
      return false;
    }else{
      this.setData({
        userInfo:userInfo
      })
      this.getdetail();
    }
  },
  returnPrevPage(){
    wx.navigateBack({
      delta: 1
    })
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
            that.getdetail();
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.authrasution()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

    this.getdetail();
    this.delestore();
    this.deleskill()

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

  /**
   * 用户点击右上角分享
   */
})
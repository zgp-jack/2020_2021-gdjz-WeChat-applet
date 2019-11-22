// moreproject age checkfour moreproject ressonone moreskill sex cityself staffcomposition personnum

const app = getApp();

Page({

  /**
   * 页面的初始数据 nation view_num occupations introduce workingyears procity introduce fail_certificate 
   */
  data: {
    username: '',
    userimg: '',
    showtop: true,
    showtopone: false,
    name: "未填写",
    sex: "未填写",
    nation: "未填写",
    occupations: [],
    occupationone: "未填写",
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
    view_num: "",
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
    showbottom: false,
    checkpan:false,
    resume_uuid: "",
    showtan: false,
    ressonone: false,
    note: "",
    introshow:true,
    fail_certificate: "",
    fail_project: "",
  },
  previewImagec: function (e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    let i = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let urls = this.data.skillbooksone[i].image
    wx.previewImage({
      current: url,
      urls: urls
    })
    app.globalData.previewpre =  false;
  },
  previewImage: function (e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    let i = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let urls = this.data.projectone[i].image
    wx.previewImage({
      current: url,
      urls: urls
    })
    app.globalData.previewpre = false;
  },
  telephorf(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.telephone,
    })
  },
  onShareAppMessage: function () {
    console.log(123)
    return {
      title: '在这里输入标题',
      desc: '在这里输入简介说明',
      path: '../preview-name-card/previewcard'//这是一个路径
    }
  },
  moreproject() {
    wx.setStorageSync("pass", 1)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-project-experience/allexperience",
    })
  },
  moreskill() {
    wx.setStorageSync("skillpass", 1)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-skills-certificate/skillscertificate",
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
      failTitle: "操作失败，请稍后重试！",
      success(res) {
        let mydata = res.data.data;
        console.log(mydata)
        console.log(res)
        if (res.data.errcode == 200) {

          let date = new Date();
          let dateo = date.getTime()
          let dateone = new Date(dateo);
          wx.setStorageSync("introdetail", mydata.introduces)
          wx.setStorageSync("introinfo", mydata.info)
          for (let i = 0; i < mydata.project.length; i++) {
            if (mydata.project[i].check != 1) {
              that.setData({
                checkthree: false,
                checkthreef: mydata.project[i].check
              })
              break
            }
            if (mydata.project[i].check == 1) {
              that.setData({
                checkthree: true,
                checkthreef: mydata.project[i].check
              })
            }
          }
          for (let i = 0; i < mydata.certificates.length; i++) {
            if (mydata.certificates[i].check != 1) {
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
          if (mydata.info.uuid) {
            that.setData({
              resume_uuid: mydata.info.uuid
            })
            wx.setStorageSync("uuid", mydata.info.uuid)
          }
          if (mydata.info.gender != "0") {
            that.setData({
              sex: mydata.info.gender == "1" ? "男" : "女"
            })
          } else {
            that.setData({
              sex: ""
            })
          }
          if (mydata.info.birthday) {
            that.setData({
              age: dateone.getFullYear() - (mydata.info.birthday.split("-")[0] - 0) + "岁"
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
            introduce: mydata.info.hasOwnProperty("introduce") ? mydata.info.introduce: "",
            workingyears: mydata.introduces.hasOwnProperty("experience") ? mydata.introduces.experience : "",
            staffcomposition: mydata.introduces.hasOwnProperty("type_str") ? mydata.introduces.type_str : "",
            cityself: mydata.introduces.hasOwnProperty("hometown") ? mydata.introduces.hometown : "",
            procity: mydata.introduces.hasOwnProperty("prof_degree_str") ? mydata.introduces.prof_degree_str : "",
            personnum: mydata.introduces.hasOwnProperty("number_people") ? mydata.introduces.number_people : "",
            tags: mydata.introduces.hasOwnProperty("tags") ? mydata.introduces.tags : "",
            checkone: mydata.info.check && mydata.info.check == 1 ? true : false,
            checkpan: mydata.info.check && mydata.info.check == 0 ? true : false,
            checkonef: mydata.info.hasOwnProperty("check") ? mydata.info.check : "",
            checktwo: mydata.introduces.check && mydata.introduces.check == 1 ? true : false,
            checktwof: mydata.introduces.hasOwnProperty("check") ? mydata.introduces.check : "",
            note: mydata.info.hasOwnProperty("note") ? mydata.info.note : "",
            fail_certificate: mydata.hasOwnProperty("fail_certificate") ? mydata.fail_certificate : "",
            fail_project: mydata.hasOwnProperty("fail_project") ? mydata.fail_project : "",
          })
          if (that.data.introduce === "") {
            that.setData({
              introshow: false
            })
          }
          let selectD = Object.values(mydata.status)
          let selectk = Object.keys(mydata.status)
          if (mydata.info.is_end == "2") {
            that.setData({
              index: 1,
            })
          }
          that.setData({
            selectData: selectD,
            selectk: selectk
          })
          that.setData({
            check: mydata.info.hasOwnProperty("check") ? mydata.info.check : ""
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
            console.log(mydata.project)
            // let projectall = [];
            // for (let i = 0; i < mydata.project.length; i ++ ){
            //   if (mydata.project[i].check == "2"){
            //      projectall.push(mydata.project[i])
            //   }
            // }
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
            console.log(mydata.certificates)
            // let certificatesall = [];
            // for (let i = 0; i < mydata.certificates.length; i++) {
            //   if (mydata.certificates[i].check == "2") {
            //     certificatesall.push(mydata.certificates[i])
            //   }
            // }

            that.setData({
              skillbooks: mydata.certificates
            })
            that.setData({
              skilllength: mydata.certificates.length >= 1 ? mydata.certificates.length : 0
            })
            that.setData({
              skillbooksone: [mydata.certificates[0]]
            })
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
        }
      },
      fail: function (err) {
        app.showMyTips("请求失败");
      }
    })
  },


  delestore() {
    wx.removeStorageSync("projectdetail")
  },
  deleskill() {
    wx.removeStorageSync("skilltail")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    if (app.globalData.previewpre) {
      this.getdetail();
      this.delestore();
      this.deleskill();
    }
    app.globalData.previewpre = true;
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
   * 用户点击右上角分享  projectone
   */
})
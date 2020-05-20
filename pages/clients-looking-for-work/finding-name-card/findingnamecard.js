// bindGetUserInfo share



const app = getApp();

Page({

  /** 
   * 页面的初始数据 nation view_num perfection addskill fail_certificate app.globalData.allexpress 
   * newresume-experience.png audit.png baseinform headerimg uuid age chooseImage onShareAppMessage checkfourf age showskill
   */
  data: {
    topoimage: app.globalData.apiImgUrl + 'lpy/resume-settop-daytips.png',
    realNames: app.globalData.apiImgUrl + 'newresume-infolist-ysm.png?t=1',
    authentication: app.globalData.apiImgUrl + 'newresume-infolist-jnz.png?t=1',
    ruleimage: app.globalData.apiImgUrl + "lpy/biaptu.png",
    baseinform: app.globalData.apiImgUrl + "lpy/jichu.png",
    workingposition: app.globalData.apiImgUrl + "lpy/workdetail.png",
    subscripted: app.globalData.apiImgUrl + 'select.png',
    linktag: app.globalData.apiImgUrl + "lpy/newresume-linktag.png",
    description: app.globalData.apiImgUrl + "lpy/newresume-description.png",
    audit: app.globalData.apiImgUrl + "lpy/audit.png",
    projectexperience: app.globalData.apiImgUrl + "lpy/newresume-experience.png",
    inreview: app.globalData.apiImgUrl + "lpy/review.png",
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    notthrough: app.globalData.apiImgUrl + "lpy/notthrough.png",
    experienceitem: app.globalData.apiImgUrl + "lpy/newresume-experience-item.png",
    downward: app.globalData.apiImgUrl + "lpy/downward.png",
    newresumeskill: app.globalData.apiImgUrl + "lpy/newresume-skill.png",
    pvw: app.globalData.apiImgUrl + "lpy/bottom-one.png",
    participation: app.globalData.apiImgUrl + "lpy/bottom-two.png",
    topimage: app.globalData.apiImgUrl + "lpy/personaltop.png",
    userInfo: true,
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
    occupations: ["未填写"],
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
    headerimg: "",
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
    showpassre: false,
    nopassre: true,
    showcomplete: true,
    checkcontent: "",
    fail_certificate: "",
    fail_project: "",
    display: "none",
    top_display: "none",
    popup: "",
    move: true,
    show_tips: "",
    showskill: true,
    age: [],
    sort_flag: "",
    ranking: "",
    rankjump: "",
    resume_top: [],
    top_status: [],
    indextop: 0,
    top_tips_string: "",
    selectDatatop: [],
    selectktop: [],
    endtime: "",
    has_top: 0,
    is_show_tips: "",
    authenticationimg:false,
    certificate_show:false,
    top_status_one:"",
    topshow:false,
    is_top_show:true
  },


  modifytop() {
    let that = this;
    let nowtime = new Date().getTime();
    let endtime = this.data.endtime;
    let contentom = that.data.top_tips_string
    if (nowtime - 0 > nowtime - 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您的置顶已过期',
        showCancel: false,
        success(res) {
          that.getdetail()
        }
      })
      return
    }
    if (that.data.is_show_tips == 1) {
      wx.showModal({
        title: '温馨提示',
        content: contentom,
        showCancel: false,
        success(res) {
          that.getdetail()
        }
      })
      return
    }
    let all = that.data.resume_top;
    let area = ''
    let maxnumber = ''
    let firstprovincenum = ''
    if (all.hasOwnProperty('top_provinces_str')) {
      area = JSON.stringify(all.top_provinces_str)
    }
    let modify = "modify";
    if (all.hasOwnProperty('max_number')) {
      maxnumber = all.max_number;
    }
    if (all.hasOwnProperty('first_province_num')) {
      firstprovincenum = all.first_province_num;
    }
   
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/the-sticky-rule/stickyrule?area=${area}&modify=${modify}&maxnumber=${maxnumber}&firstprovincenum=${firstprovincenum}`,
    })

  },
  selectTaptop() {
    let that = this;
    let nowtime = new Date().getTime();
    let endtime = this.data.endtime;
    if (nowtime - 0 > nowtime - 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您的置顶已过期',
        showCancel: false,
        success(res) {
          that.getdetail()
        }
      })
      return
    }

    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) return false;
    let userUuid = wx.getStorageSync("userUuid");
    let detail = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      uuid: userUuid,
    }
    let selectdata = [];
    let selectdataId = [];
    for (let i = 0; i < this.data.top_status.length; i++) {
      selectdata.push(this.data.top_status[i].name)
    }
    for (let i = 0; i < this.data.top_status.length; i++) {
      selectdataId.push(this.data.top_status[i].id)
    }
    let contentom = that.data.top_tips_string

    wx.showActionSheet({

      itemList: selectdata,
      success(res) {

        if (that.data.indextop == res.tapIndex) {
          return
        }
        if (that.data.indextop == 1 && that.data.is_show_tips == 1) {
          wx.showModal({
            title: '温馨提示',
            content: contentom,
            showCancel: false,
            success(res) {
              that.getdetail()
            }
          })
          return
        }
        that.setData({
          indextop: res.tapIndex
        })

        app.appRequestAction({
          url: 'resumes/change-top-status/',
          way: 'POST',
          params: detail,
          success(res) {
       
            let mydata = res.data;
            
            if (mydata.errcode == "ok") {
              
              that.getdetail()
              
              that.setData({
                top_status_one: mydata.data.top_data.top_status
              })
              wx.showModal({
                title: '温馨提示',
                content: res.data.errmsg,
                showCancel: false,
                success(res) { }
              })
            } else {
              wx.showModal({
                title: '温馨提示',
                content: res.data.errmsg,
                showCancel: false,
                success(res) { }
              })
            }
          }
        })
      },
      fail(res) {
        // console.log(res)
        // app.showMyTips("修改失败");
      }
    })

  },

  thestickyrule() {
    // ressonone
    let that = this;
    let contentom = that.data.top_tips_string
    
    if (that.data.showtop) {
      wx.showModal({
        title: '温馨提示',
        content: contentom,
        confirmText: `去添加`,
        success(res) {
          if (res.confirm) {
            that.toperfect()
          } else if (res.cancel) {
          }
        }
      })
      return
    } else if (that.data.is_show_tips == 1) {
      wx.showModal({
        title: '温馨提示',
        content: contentom,
        showCancel: false,
        success(res) {
        }
      })
      return
    } else {
      wx.navigateTo({
        url: `/pages/clients-looking-for-work/finding-top/findingtop`,
      })
    }
  },

  previewImage: function (e) {

    let url = e.currentTarget.dataset.url;
    let i = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let urls = this.data.projectone[i].image
    wx.previewImage({
      current: url,
      urls: urls
    })
    app.globalData.previewshou = false;
  },
  previewImagec: function (e) {

    let url = e.currentTarget.dataset.url;
    let i = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let urls = this.data.skillbooksone[i].image
    wx.previewImage({
      current: url,
      urls: urls
    })
    app.globalData.previewshou = false;
  },
  vertify() {
    this.setData({
      showModal: false,
      display: "none"
    })
  },
  rulepoit() {
    // let rulestatus =  this.data.checkonef
    if (this.data.rankjump == "rankjump") {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: `/pages/clients-looking-for-work/ranking-rules/ranking-rules`,
      })
    }
  },
  obtn() {
    this.setData({
      showModal: false,
      display: "none"
    })
  },
  editor(e) {
    wx.setStorageSync("projectdetail", e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/new-project-experience/projectexperience?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid,
    })

  },
  editorone(e) {

    wx.setStorageSync("skilltail", e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid,
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
    } else {
      this.setData({
        showcomplete: true
      })
    }
  },
  onShareAppMessage: function () {
    let that = this;
    let tel = this.data.telephone;
    tel = tel.substring(0, tel.length - 4) + "****";
    this.setData({
      telephone: tel
    })
    let commonShareImg = app.globalData.commonShareImg;
    let userInfo = wx.getStorageSync("userInfo");
    let refId = userInfo ? userInfo.userId : "";
    let uuid = this.data.resume_uuid;
    let commonShareTips = app.globalData.commonShareTips;
    if (userInfo && that.data.checkonef == 2) {

      if (uuid) {
        return {
          title: commonShareTips,
          // imageUrl: commonShareImg,
          path: `/pages/boss-look-card/lookcard?uuid=${uuid}&refId=${refId}&sharedekeId=1`//这是一个路径
        }
      } else {
        return {
          title: `${commonShareTips}`,
          imageUrl: commonShareImg,
          path: `/pages/findingworkinglist/findingworkinglist?refid=${refId}`//这是一个路径
        }
      }
    } else {
      return {
        title: commonShareTips,
        imageUrl: commonShareImg,
        path: `/pages/findingworkinglist/findingworkinglist?refid=${refId}`//这是一个路径
      }
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

          app.appRequestAction({
            url: 'resumes/edit-end/',
            way: 'POST',
            params: detail,
            success(res) {

              if (res.data.errcode == "ok") {
                that.getdetail()
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.errmsg,
                  showCancel: false,
                  success(res) { }
                })
              } else {
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.errmsg,
                  showCancel: false,
                  success(res) { }
                })
              }
            }
          })
        },
        fail(res) {
          // console.log(res)
          // app.showMyTips("修改失败");
        }
      })
    }
    if (this.data.check == "1") {
      wx.showModal({
        title: '温馨提示',
        content: "审核中请耐心等待",
        showCancel: false,
        success(res) { }
      })
      return
    }
    if (this.data.check == "0") {
      wx.showModal({
        title: '温馨提示',
        content: "审核未通过，请修改信息",
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
        content: '您未完善基础信息填写,请先填写基础信息',
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
        content: '您未完善基础信息填写,请先填写基础信息',
        showCancel: false,
        success(res) {
          wx.navigateTo({
            url: '/pages/clients-looking-for-work/essential-information/esinformation',
          })
        }
      })
      return
    }
    // console.log(this.data.project_count,this.data.certificate_count,this.data.resume_uuid, "resume_uuid")

    let projectnum = this.data.projectlength
    wx.setStorageSync("projectnum", projectnum)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/new-project-experience/projectexperience?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid,
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
        content: '您未完善基础信息填写,请先填写基础信息',
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
      url: "/pages/clients-looking-for-work/addcertificate/addcertificate?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid,
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
  errImg: function () {

    this.setData({
      headerimg: "http://cdn.yupao.com/miniprogram/images/lpy/hearding.png"
    })
  },

  chooseImage() {
    if (this.data.checkone) {
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

          if (res.data.errcode == 200) {
            app.showMyTips("保存成功");
            that.getdetail()
          } else {
            wx.showModal({
              title: '温馨提示',
              content: res.data.errmsg,
              showCancel: false,
              success(res) { }
            })
            return
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
    if (!userInfo) return false;

    let detail = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    }
    let that = this;
    app.appRequestAction({
      url: 'resumes/resume-list/',
      way: 'POST',
      params: detail,
      success: function (res) {
     
        let mydata = res.data.data;
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
            if (mydata.certificates[i].check == 2) {
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
          } else {
            that.setData({
              showtop: true,
              showtopone: false
            })
          }

          if (mydata.info.gender != "0" && mydata.info.gender) {

            that.setData({
              sex: mydata.info.gender == "1" ? "男" : "女"
            })
          } else {
            that.setData({
              sex: ""
            })
          }
          if (mydata.info.birthday) {


            if (dateone.getFullYear() - (mydata.info.birthday.split("-")[0] - 0) == 0) {
              that.setData({
                age: ""
              })
            } else {
              that.setData({
                age: dateone.getFullYear() - (mydata.info.birthday.split("-")[0] - 0) + "岁"
              })
            }

          }
          that.setData({
            occupations_id: mydata.info.hasOwnProperty("occupations_id")?mydata.info.occupations_id : '',	
            cityid:mydata.info.hasOwnProperty("city") ? parseInt(mydata.info.city) || 0 : mydata.info.hasOwnProperty("province") ? mydata.info.province || 0 : 0,
            show_tips: mydata.hasOwnProperty("content") ? mydata.content.show_tips : "",
            name: mydata.info.hasOwnProperty("username") ? mydata.info.username : "",
            nation: mydata.info.hasOwnProperty("nation") ? mydata.info.nation : "",
            occupations: mydata.info.hasOwnProperty("miniInfoOccupations") ? mydata.info.miniInfoOccupations : "",
            telephone: mydata.info.hasOwnProperty("tel") ? mydata.info.tel : "",
            city: mydata.info.hasOwnProperty("address") ? mydata.info.address : "",
            intro: false,
            introne: true,
            introduce: mydata.info.hasOwnProperty("introduce") ? (mydata.info.introduce == "" ? "请简要介绍您所从事行业以及工作经验..." : mydata.info.introduce) : "",
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
            sort_flag: mydata.info.hasOwnProperty("sort_flag") ? mydata.info.sort_flag : "",
            ranking: mydata.info.hasOwnProperty("ranking") ? mydata.info.ranking : "",
            certificate_show: mydata.info.hasOwnProperty("certificate_show") ? mydata.info.certificate_show : "",
            authenticationimg: mydata.info.hasOwnProperty("authentication") ? mydata.info.authentication : "",
            resume_top: mydata.hasOwnProperty("resume_top") ? mydata.resume_top : [],
            top_status: mydata.hasOwnProperty("top_status") ? mydata.top_status : []
          })
          
          if (mydata.hasOwnProperty("resume_top")) {
            if (mydata.resume_top.is_top == 1) {
              
              that.setData({
                indextop: 0,
                is_top_show: false,
              })
            } else if (mydata.resume_top.is_top == 0) {
              that.setData({
                indextop: 1,
                is_top_show: false,
              })
            } 
 
          }
          // if (mydata.resume_top.is_top == 2) {
          //   that.setData({
          //     is_top_show: true,
          //   })
          // }
          // console.log(that.data.is_top_show)
          let selectDtop = Object.values(mydata.top_status)
          let selectktop = Object.keys(mydata.top_status)
          that.setData({
            selectDatatop: selectDtop,
            selectktop: selectktop
          })

          if (mydata.hasOwnProperty("resume_top")) {

            that.setData({
              top_tips_string: mydata.resume_top.top_tips_string,
              endtime: mydata.resume_top.end_time ? mydata.resume_top.end_time:"",
              has_top: mydata.resume_top.has_top ? mydata.resume_top.has_top : 0,
              is_show_tips: mydata.resume_top.is_show_tips ? mydata.resume_top.is_show_tips:"",
            })
           
          }
          if (that.data.showtop) {
            app.globalData.showperfection = true;
          } else {
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
              is_introduces: mydata.is_introduces,
              selfintro: true,
              selfintrone: false,
            })
          }

          that.setData({
            view_num: mydata.info.hasOwnProperty("view_num") ? mydata.info.view_num : 0
          });


          if (mydata.project.length == 0) {
            that.setData({
              project: [],
              projectone: [],
              projectlength: 0
            });
          } else {
            if (new Date(mydata.project[0].completion_time).getTime() / 86400000 < parseInt(new Date().getTime() / 86400000)) {

              that.setData({
                project: mydata.project,
                projectone: [mydata.project[0]],
                projectlength: mydata.project.length >= 1 ? mydata.project.length : 0
              });
              that.data.project[0].completiontime = "zhijing"
            } else {
              that.setData({
                project: [...mydata.project],
              })
              that.data.project[0].completiontime = "zhijin"
              that.setData({
                projectone: [that.data.project[0]],
                projectlength: mydata.project.length >= 1 ? mydata.project.length : 0
              });
            }
          }


          that.setData({
            percent: mydata.info.hasOwnProperty("progress") ? mydata.info.progress : 0,
            showpassre: true
          })


          if (mydata.certificates.length == 0) {
            that.setData({
              skillbooks: [],
              skilllength: 0,
              skillbooksone: []
            })
          } else {
            that.setData({
              skillbooks: mydata.certificates,
              skilllength: mydata.certificates.length >= 1 ? mydata.certificates.length : 0,
              skillbooksone: [mydata.certificates[0]]
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
              ressonone: false,
              passre: true,
              nopassre: true
            })

          }
          if (that.data.checkonef == "0" || that.data.checktwof == "0") {
            that.setData({
              ressonone: true,
              nopassre: true,
              passre: false
            })
          }
          if (that.data.checkonef == "1" || that.data.checktwof == "1") {
            that.setData({
              ressonone: false,
              passre: true,
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
          that.showskill();
          that.gettiner()
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) { }
          })
          return
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

  authrasution() {
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
      // this.getdetail();
    }
  },
  sontwoview() {
    return false
  },
  returnPrevPage() {
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
  cardjump(options) {

    if (options.hasOwnProperty("rankjump")) {
    
      this.setData({
        rankjump: options.rankjump
      })
    }
  },
  onLoad: function (options) {
    this.authrasution();
    this.cardjump(options)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showskill() {
    this.setData({
      showskill: false
    })
  },

  gettiner(){

    let that = this;
    let toptimer = wx.getStorageSync("toptimer");
    let onoff = that.data.is_top_show || that.data.has_top == 0;
   

    let timer = new Date().getTime();
    let top_onoff = that.data.checkonef == "0" || that.data.checktwof == "0" || that.data.checkthreef == "0" || that.data.checkfourf == "0"
    let timer_maker = (timer - toptimer) / 86400000;
    if (!toptimer && !top_onoff && !that.data.showtop && onoff && !that.data.checkone && that.data.index == 0){
       app.globalData.topshow = true;
       that.setData({
         topshow: app.globalData.topshow,
         top_display: "block",
       })
       wx.setStorageSync("toptimer", timer)
    }else{
      if (timer_maker >= 7 && !top_onoff && !that.data.showtop && onoff && !that.data.checkone && that.data.index == 0){
        
        app.globalData.topshow = true;
        that.setData({
          topshow: app.globalData.topshow,
          top_display: "block",
        })
        wx.setStorageSync("toptimer", timer)
      }
    }

  },
  topvertify(){
    let that = this;
    app.globalData.topshow = false;
    that.setData({
      topshow: app.globalData.topshow,
      top_display: "none",
    })
    that.thestickyrule()
  },
  topvertifyquit(){
    let that = this;
    app.globalData.topshow = false;
    that.setData({
      topshow: app.globalData.topshow,
      top_display: "none",
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (app.globalData.previewshou) {

      this.getdetail();
      this.delestore();
      this.deleskill();
    }
    app.globalData.previewshou = true;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showpassre: false,
      is_top_show:true
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 
    // wx.redirectTo({
    //   url: '/pages/ucenter/ucenter'
    // })
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
   * 用户点击右上角分享 app.globalData.showperfection
   */
})
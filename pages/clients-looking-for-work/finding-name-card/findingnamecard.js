// bindGetUserInfo share



const app = getApp();

Page({

  /** 
   * 页面的初始数据 nation view_num perfection addskill fail_certificate app.globalData.allexpress 
   * newresume-experience.png audit.png baseinform headerimg uuid age chooseImage onShareAppMessage checkfourf age showskill
   */
  data: {
    topoimage: app.globalData.apiImgUrl + 'lpy/resume-settop-daytips.png',
    realNames: app.globalData.apiImgUrl + 'new-list-realname-icon.png',
    authentication: app.globalData.apiImgUrl + 'new-list-jnzs-icon.png?t=1',
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
    is_top_show:true,
    default_top_area:false,
    userTopArea:[],//初始化用户置顶城市数据
    pulishFindWork:false,//展示发布成功提示框
    publishWay: false,//是否展示发布置顶弹窗（有两个弹窗只会弹其中一个）
    refreshText: '',//刷新名片文本
    integral:'',//刷新消耗积分
    // 刷新提示框提示内容
    tipBox: {//提示框显示信息
      title: '',
      showTitle: true,
      showIcon: false,
      showCancel: true,
      confirmColor:'',
      cancelColor:'',
      content: [{
        des: '',
        color: '',
        text:[],
      }],
      confirmText: '',
      cancelText: '',
      showClose: false
    },
    // 刷新成功icon
    successIcon:app.globalData.apiImgUrl + 'yc/findwork-publish-success.png',
    reqStatus:false,//刷新请求状态
    show_refresh_btn:true,//是否展示刷新名片
    dayfirst: false, //是否是当天第一次从置顶界面返回（未成功置顶）
    todayRefresh: 0,//是否是当天第一次刷新
    provinces_txt:"",//期望工作地
    boxStatus: 0,//弹窗类型 如果是从快速发布成功到找活名片 1 有找活名片且未置顶当天未刷新 2 正常刷新 3 找活名片置顶未成功返回 4 其他 0
    province:0,//省id
    refresh: false,//是否显示提示刷新弹窗，如果置顶页面置顶成功返回会设置成true，不展示刷新弹窗
    projectCheckLen:0,
    projectCheck: false,//项目经验审核状态，有一个项目经验审核通过就视为通过，否则未通过
    showRefreshToBox: false,//当有个人资料项目经验技能证书有审核失败，优先展示审核失败弹窗，点击失败确定按钮展示刷新置顶弹窗 true 展示刷新置顶  false 展示审核失败
    dataInfo:{},//我的找活名片请求返回的信息集合
    showCheckFailBox: false,//是否显示了审核失败弹窗
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
    wx.navigateTo({
      url: `/pages/clients-looking-for-work/workingtop/workingtop`,
    })

  },
  // 修改置顶的请求方法
  isTopReq:function () {
    let that = this
    // 获取缓存用户信息
    let userInfo = wx.getStorageSync("userInfo");
    // 没用户信息直接返回
    if (!userInfo) return false;
    let userUuid = wx.getStorageSync("userUuid");
    // 发送请求参数对象
    let detail = {
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      uuid: userUuid,
    }
    app.appRequestAction({
      url: 'resumes/change-top-status/',
      way: 'POST',
      params: detail,
      success(res) {
        let mydata = res.data;
        if (mydata.errcode == "ok") {
          // that.getdetail()
          that.setData({
            top_status_one: mydata.data.top_data.top_status,
            "resume_top.is_top": mydata.data.top_data.is_top
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
  // 点击置顶或者取消置顶
  tabTop:function(){
    let that = this;
    // 现在时间
    let nowtime = new Date().getTime();
    // 置顶结束时间
    let endtime = this.data.endtime * 1000;
    // 如果现在时间大于项目置顶结束时间提示置顶到期并更新项目
    if (nowtime - 0 > endtime - 0) {
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
    // 发送修改置顶请求
    this.isTopReq()
  },
  // 点击继续置顶
  coutinueTop:function(e){
    let that = this
    let istop = e.currentTarget.dataset.istop;
    // 如果是置顶到期那么就跟初次置顶一样跳转到对应界面
    if ( istop == 2 ) {
      that.thestickyrule()
    // 如果是置顶未到期且继续置顶发送置顶请求
    } else {
      let contentom = that.data.top_tips_string
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
      that.tabTop()
    }
  },
  thestickyrule() {
    // 去置顶前检查是否有填写名片信息
    let that = this;
    // 获取是否可以置顶的文案
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
    //如果需要展示提示框，显示提示信息
    } else if (that.data.is_show_tips == 1) {
      wx.showModal({
        title: '温馨提示',
        content: contentom,
        showCancel: false,
        success(res) {
        }
      })
      return
    //如果有找活名片信息跳转去招工置顶界面
    } else {
      app.globalData.showdetail = false
      wx.navigateTo({
        url: "/pages/clients-looking-for-work/workingtop/workingtop",
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
    this.showTopRefresh(this.data.dataInfo)
  },
  rulepoit() {
    // let rulestatus =  this.data.checkonef
    if (this.data.rankjump == "rankjump") {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: `/packageOther/pages/ranking-rules/ranking-rules`,
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
    if (this.data.check != '0' && this.data.project.length < 1 ) {
      wx.navigateTo({
        url: '/pages/clients-looking-for-work/new-project-experience/projectexperience',
      })
    }
    if (this.data.check == '0') {
      wx.navigateTo({
        url: `/pages/clients-looking-for-work/essential-information/esinformation?type=bj`,
      })
    }
    if (this.data.check != '0' &&　this.data.project.length>0 && !this.data.projectCheckLen) {
      wx.navigateTo({
        url: `/pages/clients-looking-for-work/all-project-experience/allexperience`,
      })
    }
    if (!this.data.resume_uuid) {
      wx.navigateTo({
        url: '/pages/jsIssueResume/index',
      })
    } 
    // else if (this.data.is_introduces == 0) {
    //   wx.navigateTo({
    //     url: '/pages/clients-looking-for-work/essential-information/esinformation',
    //   })
    // } else if (this.data.project.length == 0) {
    //   wx.navigateTo({
    //     url: "/pages/clients-looking-for-work/new-project-experience/projectexperience",
    //   })
    // } else if (this.data.skillbooks.length == 0) {
    //   wx.navigateTo({
    //     url: "/pages/clients-looking-for-work/addcertificate/addcertificate",
    //   })
    // }
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
  onShareTimeline:function () {
    let commonShareTips = app.globalData.commonShareTips;
    let commonShareImg = app.globalData.commonShareImg;
    return {
      title: commonShareTips,
      imageUrl: commonShareImg
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
                if (dataId === 2) {
                  that.selectTaptop()
                }
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
      url: '/pages/clients-looking-for-work/essential-information/esinformation?type='+e.currentTarget.dataset.type,
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
          that.noTopTipBox(res.data.data)
          that.showTopRefresh(res.data.data)
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
          //初始化数据如果有uuid就隐藏提示完善信息窗口
          if (mydata.info.uuid) {
          //隐藏提示信息窗口
            that.showtop()
            that.setData({
              resume_uuid: mydata.info.uuid,
            })
            wx.setStorageSync("uuid", mydata.info.uuid)
          } else {
            that.setData({
              showtop: true,
              showtopone: false,
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
          let cityid = mydata.info.hasOwnProperty("city")? parseInt(mydata.info.city) : 0
          let province = mydata.info.hasOwnProperty("province") ? mydata.info.province : 0

          that.setData({
            occupations_id: mydata.info.hasOwnProperty("occupations_id")?mydata.info.occupations_id : '',
            province: province,
            dataInfo: mydata,
            cityid: cityid || province,
            show_tips: mydata.hasOwnProperty("content") ? mydata.content.show_tips : "",
            name: mydata.info.hasOwnProperty("username") ? mydata.info.username : "",
            nation: mydata.info.hasOwnProperty("nation") ? mydata.info.nation : "",
            occupations: mydata.info.hasOwnProperty("miniInfoOccupations") ? mydata.info.miniInfoOccupations : "",
            telephone: mydata.info.hasOwnProperty("tel") ? mydata.info.tel : "",
            city: mydata.info.hasOwnProperty("current_area_str") ? mydata.info.current_area_str : "",
            provinces_txt:mydata.info.hasOwnProperty("provinces_txt") ? mydata.info.provinces_txt : "",
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
            top_status: mydata.hasOwnProperty("top_status") ? mydata.top_status : [],
            default_top_area: mydata.hasOwnProperty("default_top_area")?mydata.default_top_area : false,
            refreshText: mydata.hasOwnProperty("refresh_text")?mydata.refresh_text:'',
            integral: mydata.hasOwnProperty("integral")?mydata.integral:'',
          })
          if (mydata.hasOwnProperty("is_refreshed_today")) {
            app.globalData.dayFirstRefresh = mydata.is_refreshed_today
          }
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
          
            // 获取项目经验对象
            let project = mydata.project;
            let projectCheckLen = project.some(item=> item.check == '2')
            that.setData({ projectCheckLen })
            // 定义有图片项目数组
            let hasImageProject = [];
            // 定义没图片的数组
            let NoImageProject = [];
            for (let i = 0; i < project.length; i++) {
              // 将时间转成毫秒并存入数组
              project[i].endTime = new Date(project[i].completion_time).getTime()
              // 获取项目经验对象中images不为空的项目
              if (project[i].image.length != 0) {
                // 处理如果图片数量大于3就只保留三张图片
                // if (project[i].image.length > 3) {
                //   project[i].image.splice(3,project[i].image.length-3)
                // }
                // 增加index字段作为project数组查找标识
                project[i].index = i
                hasImageProject.push(project[i])
              }else{
                project[i].index = i
                NoImageProject.push(project[i])
              }
            }
            // 获取项目结束时间比较近的项目
            // 排序规则降序排列
            function projectSort(key) {
              return function (objectN,objectM) {
                let valueN = objectN[key];
                let valueM = objectM[key];
                if (valueN < valueM) return 1
                else if (valueN > valueM) return -1
                else return 0
              }
            }
            // 将有图片的数组与没有图片的数组进行按照时间降序排列
            let sortImageProject = hasImageProject.sort(projectSort("endTime"))
            let sortNoImageProject = NoImageProject.sort(projectSort("endTime"))
            // 组合项目经验对象
            let projectObj = [...sortImageProject, ...sortNoImageProject]
            console.log("projectObj",projectObj)
            // 获取排序后的第一个元素
            let projectOne = projectObj[0]
            // 处理如果图片数量大于3就只保留三张图片
            // if (projectOne.image.length > 3) {
            //   projectOne.image.splice(3, projectOne.image.length-3)
            // }
            
            if (new Date(projectObj[0].completion_time).getTime() / 86400000 < parseInt(new Date().getTime() / 86400000)) {
              that.setData({
                project: projectObj,
                projectone: [projectOne],
                projectlength: projectObj.length >= 1 ? projectObj.length : 0
              });
              that.data.project[0].completiontime = "zhijing"
            } else {
              that.setData({
                project: projectObj,
              })
              that.data.project[0].completiontime = "zhijin"
              that.setData({
                projectone: [projectOne],
                projectlength: projectObj.length >= 1 ? projectObj.length : 0
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
                showCheckFailBox: true,
                display: "block",
                popup: popup
              })
              that.setData({
                resson: [that.data.skillbooks[0]],
              })
              app.globalData.showdetail = false
              
            }
          }
          let area = wx.getStorageSync('areadata')
          //获取置顶区域的信息
          if (mydata.resume_top.has_top != 0 && mydata.resume_top.is_top ==1 ) {
            let areaProcrum = mydata.resume_top.top_provinces_str.length === 0? mydata.resume_top.top_provinces_str: (mydata.resume_top.top_provinces_str[0].pid == 1?mydata.resume_top.top_provinces_str:[]);
            let areaCitycrum = mydata.resume_top.top_citys_str;
            let isCountry = mydata.resume_top.is_country
            let areaAllcrum = [];
            let areaItem = area.data[0][0];
            areaItem.name = areaItem.city;
            if (isCountry == 1) {
              areaAllcrum.push(areaItem) 
            }
            let userTopArea = [...areaProcrum,...areaCitycrum,...areaAllcrum]
            that.setData({
              userTopArea,
            })
          }
          that.redorblue()
          that.showskill();
          that.gettiner()
          that.setData({
            show_refresh_btn:mydata.show_refresh_btn
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) {
              wx.navigateBack()
             }
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
    let pages = getCurrentPages()
    if(pages.length >= 2){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.redirectTo({
        url: '/pages/findingworkinglist/findingworkinglist',
      })
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
            that.getdetail();
          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },
  activeRefresh:function () {
    app.activeRefresh()
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
    if (!toptimer && !top_onoff && !that.data.showtop && onoff && !that.data.checkone && that.data.index == 0 && !that.data.publishWay){
       app.globalData.topshow = true;
       that.setData({
         topshow: app.globalData.topshow,
         top_display: "block",
       })
       wx.setStorageSync("toptimer", timer)
    }else{
      if (timer_maker >= 7 && !top_onoff && !that.data.showtop && onoff && !that.data.checkone && that.data.index == 0 && !that.data.publishWay){
        
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
  // 刷新页面子组件调用方法
  // refreshPage: function () {
  //   // 将是否展示发布成功提示框设置为true（要展示）
  //   this.setData({ pulishFindWork:true, publishWay:true, })
  //   // 展示发布成功弹窗
  //   this.showPublishTip()
  // },

  // 有找活名片且正在招没有置顶弹窗
  showBox: function () {
    this.setData({
      "tipBox.title": "温馨提示",
      "tipBox.content[0].des":"您的找活名片排名靠后，您可以去刷新或置顶找活名片，让老板主动来联系您。",
      "tipBox.confirmText": "去刷新",
      "tipBox.cancelText": "去置顶",
      "tipBox.showClose" : true,
      "tipBox.cancelColor" : "#797979",
      "tipBox.confirmColor" : "#0097FF",
    })
    this.selectComponent("#promptbox").show()
  },


  // 有找活名片且正在招没有置顶弹窗判断逻辑
  showTopRefresh: function (data) {
    // 置顶数据
    let topData = data.resume_top;
    // 判断是否在置顶中 0 没有置顶或者取消置顶 1 置顶中 2 置顶到期
    let isTop = topData.is_top;
    // 取消弹窗后不展示弹窗时间
    let day = Number(data.cancel_refresh_top_expire_days);
    // 找活名片审核状态 2 审核通过 1 正在审核 0 审核未通过
    let check = data.info.check;
    // 找活名片招工状态 1 正在招 2 已招满 
    let isEnd = data.info.is_end;
    // 是否有找活名片 
    let isResume = data.info.hasOwnProperty("uuid")? true: false; 
    // 当天是否刷新
    let todayRefresh = data.is_refreshed_today;
    // 点击关闭弹窗的时间戳
    let haveCardCloseBox = wx.getStorageSync("haveCardCloseBox");
    //弹窗类型 如果是从快速发布成功到找活名片 1 有找活名片且未置顶当天未刷新 2 正常刷新 3 找活名片置顶未成功返回 4 其他 0
    let boxStatus = this.data.boxStatus;
    // 项目经验的是否全部审核
    let projectCheck = data.project.some(item => item.check == '0')
    // 审核失败弹窗是否显示状态
    let showCheckFailBox = this.data.showCheckFailBox;
    // 技能证书是否全部审核
    let skillCheck = data.certificates.some(item => item.check == '0')
    if ( check == '0' || projectCheck || skillCheck ) {
      if (showCheckFailBox) {
        this.setData({ showRefreshToBox: true })
      }
    }else{
      this.setData({ showRefreshToBox: true })
    }
    // 当前时间戳
    let currentTime = new Date().getTime();
    if ( isResume && check == '2' && isEnd == '1' && isTop != '1' && !todayRefresh && boxStatus != 1 &&　this.data.showRefreshToBox) {
      if (!haveCardCloseBox) {
        wx.setStorageSync("haveCardCloseBox",currentTime)
        if ( boxStatus == 4 ) {
          this.setData({ boxStatus: 0 })
        }else{ 
          this.setData({ boxStatus: 2 })
          this.showBox()
        }
      }else{
        let dueTime = haveCardCloseBox + day * 24 * 60 * 60 * 1000 - 1
        if (currentTime > dueTime) {
          wx.setStorageSync("haveCardCloseBox",currentTime)
          if ( boxStatus == 4 ) {
            this.setData({ boxStatus: 0 })
          }else{
            this.setData({ boxStatus: 2 })
            this.showBox()
          }
        }
      }
      
    }
  },
  // 展示发布成功界面
  showPublishTip: function () {
    let boxStatus = this.data.boxStatus;
    if (boxStatus == 1 ) {
      this.setData({
        "tipBox.title": "发布成功",
        "tipBox.content[0].des":"置顶找活名片，让更多老板能看到你，找更多活！",
        "tipBox.confirmText": "去置顶",
        "tipBox.cancelText": "查看招工信息",
        "tipBox.showClose" : true,
        "tipBox.cancelColor" : "#797979",
        "tipBox.confirmColor" : "#0097FF",
      })
      this.selectComponent("#promptbox").show()
    }
  },
  //去实名
  goRealName:function(){
    wx.navigateTo({
      url: '/pages/realname/realname',
    })
  },
  
  // 刷新找活名片
  refreshCard: function () {
    let reqStatus = this.data.reqStatus;
    let reqDueTime = this.data.reqDueTime;
    let currentTime = new Date().getTime();
    // 刷新请求返回状态（3为刷新成功）
    let refreshStatus = this.data.refreshStatus;
    if (!reqStatus) {
      if (reqDueTime) {
        if (currentTime > reqDueTime) {
          wx.showModal({
            title: '温馨提示',
            content: '请勿点击过快',
            showCancel: false,
          })
        }else{
          if (refreshStatus === 3) {
            wx.showModal({
              title: '温馨提示',
              content: '您已消耗1积分成功刷新名片，请勿点击过快',
              showCancel: false,
            })
            this.setData({reqStatus:true})
          }else{
            wx.showModal({
              title: '温馨提示',
              content: '请勿点击过快',
              showCancel: false,
            })
          }
        }
      }else{
        app.refreshReq(1,this)
        this.setData({reqStatus:true})
      }
    } else {
      if (reqDueTime) {
        if (reqDueTime > currentTime) {
          if (refreshStatus === 3) {
            wx.showModal({
              title: '温馨提示',
              content: '您已消耗1积分成功刷新名片，请勿点击过快',
              showCancel: false,
            })
          }else{
            wx.showModal({
              title: '温馨提示',
              content: '请勿点击过快',
              showCancel: false,
            })
          }
        }else{
          app.refreshReq(1,this)
          this.setData({reqStatus:false})
        }
      }else{
        wx.showModal({
          title: '温馨提示',
          content: '请勿点击过快',
          showCancel: false,
        })
      }
    }
  },
  // 点击弹窗取消按钮
  tapCancel: function () {
    // 直辖市
    let municipality = app.globalData.municipality;
    // 省id或者直辖市id
    let province = this.data.province;
    //弹窗类型 如果是从快速发布成功到找活名片 1 有找活名片且未置顶当天未刷新 2 正常刷新 3 找活名片置顶未成功返回 4 其他 0
    let boxStatus = this.data.boxStatus;
    let index = municipality.findIndex(item=>item.id == province)
    let cityid = index == -1 ? this.data.cityid:province;
    let occupations_id = this.data.occupations_id.split(",")[0];
    if (boxStatus == 1 || boxStatus == 3) {
      wx.reLaunch({
        url: `/pages/index/index?aid=${cityid}&id=${occupations_id}`,
      })
      this.setData({ boxStatus: 0 })
    }
    if(boxStatus == 2){
      let currentTime = new Date().getTime();
      wx.setStorageSync("haveCardCloseBox",currentTime)
      wx.navigateTo({
        url: `/pages/clients-looking-for-work/workingtop/workingtop`,
      })
      this.setData({ boxStatus: 0 })
    }
  },
  // 点击弹窗的关闭按钮
  tapClose: function () {
    let currentTime = new Date().getTime();
    //弹窗类型 如果是从快速发布成功到找活名片 1 有找活名片且未置顶当天未刷新 2 正常刷新 3 找活名片置顶未成功返回 4 其他 0
    let boxStatus = this.data.boxStatus
    if (boxStatus == 1) {
      this.setData({ boxStatus: 0 })
      // 发布成功弹窗点击关闭按钮也要设置情况为2的弹窗时间缓存
      wx.setStorageSync("haveCardCloseBox",currentTime)
    }
    if (boxStatus == 2) {
      wx.setStorageSync("haveCardCloseBox",currentTime)
      this.setData({ boxStatus: 0 })
    }
  },
  // 点击弹窗确定按钮
  tapConfirm: function () {
    //弹窗类型 如果是从快速发布成功到找活名片 1 有找活名片且未置顶当天未刷新 2 正常刷新 3 找活名片置顶未成功返回 4 其他 0
    let boxStatus = this.data.boxStatus
    if (boxStatus == 1) {
      wx.navigateTo({
        url: `/pages/clients-looking-for-work/workingtop/workingtop`,
      })
      this.setData({ boxStatus: 0 })
    }
    if (boxStatus == 2) {
      let currentTime = new Date().getTime();
      wx.setStorageSync("haveCardCloseBox",currentTime)
      this.refreshCard()
      this.setData({ boxStatus: 0 })
    }
  },
  // 从置顶页面返回（未置顶）弹窗
  todayRefresh: function () {
    let that = this
    wx.showModal({
      title: "温馨提示",
      content: "您可以刷新找活名片，让更多老板看到您的找活信息！",
      confirmText: "去刷新",
      confirmColor: "#0097FF",
      cancelColor: "#797979",
      success: function (res) {
        if (res.confirm) {
          that.refreshCard()
          that.setData({ boxStatus: 0 })
        }
        if (res.cancel) {
          let myDate = new Date();
          // 当前时间戳
          let currentTime = myDate.getTime();
          // 到期时间戳（23:59:59）
          let dueDate = (new Date(new Date().toLocaleDateString())).getTime() +  (24 * 60 * 60 * 1000 - 1);
          // let dueDate = currentTime +  (1 * 60 * 1000 - 1);
          // 当天没有刷新过且未置顶返回找活名片缓存（是否当天第一次返回，到期时间）
          let topBackRefresh = {currentTime:currentTime,dueDate:dueDate};
          wx.setStorageSync("topBackRefresh",topBackRefresh)
          that.setData({ boxStatus: 0 })
        }
      }
    })
  },
  // 从找活名片点击去置顶没有置顶成功返回提示框
  noTopTipBox: function (data) {
    // 当前时间戳
    let currentTime = new Date().getTime();
    // 找活名片置顶数据
    let topData = data.resume_top;
    // 找活名片是否置顶过
    let hasTop = topData.has_top;
    // 找活名片置顶状态
    let isTop = topData.is_top;
    // 是否是当天第一次从置顶界面返回（未成功置顶),当天多次返回只是第一次展示提示框
    let todayRefresh = app.globalData.dayFirstRefresh;
    // 当天没有刷新过且未置顶返回找活名片缓存（是否当天第一次返回，到期时间）
    let topBackRefresh = wx.getStorageSync('topBackRefresh')
    //获取页面栈
    let pages = getCurrentPages();
    // 弹窗类型
    let boxStatus = this.data.boxStatus;
    if(pages.length > 1) {
      let index = pages.length - 1;
      let path = pages[index].__displayReporter.showReferpagepath;
      path = path.slice(0, -5);
      if (path == "pages/clients-looking-for-work/workingtop/workingtop") {
        if ( ( !hasTop && boxStatus == 4 )|| ( hasTop && isTop != '1' && boxStatus == 4 )) {
          // 如果当天没有刷新过
          if (!todayRefresh) {
            // 如果置顶未成功置顶且是当天第一次返回
            if (!topBackRefresh) {
              let myDate = new Date();
              // 当前时间戳
              let currentTime = myDate.getTime();
              // 到期时间戳（23:59:59）
              let dueDate = (new Date(new Date().toLocaleDateString())).getTime() +  (24 * 60 * 60 * 1000 - 1);
              // let dueDate = currentTime +  (1 * 60 * 1000 - 1);
              // 当天没有刷新过且未置顶返回找活名片缓存（是否当天第一次返回，到期时间）
              let topBackRefresh = {currentTime:currentTime,dueDate:dueDate};
              wx.setStorageSync("topBackRefresh",topBackRefresh)
              this.todayRefresh()
            }else{
              if (currentTime > topBackRefresh.dueDate) {
                let myDate = new Date();
                // 当前时间戳
                let currentTime = myDate.getTime();
                // 到期时间戳（23:59:59）
                let dueDate = (new Date(new Date().toLocaleDateString())).getTime() +  (24 * 60 * 60 * 1000 - 1);
                // let dueDate = currentTime +  (1 * 60 * 1000 - 1);
                // 当天没有刷新过且未置顶返回找活名片缓存（是否当天第一次返回，到期时间）
                let topBackRefresh = {currentTime:currentTime,dueDate:dueDate};
                wx.setStorageSync("topBackRefresh",topBackRefresh)
                this.todayRefresh()
              }
            }
          }
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.authrasution();
    this.cardjump(options)
    // 如果是从快速发布找活名片到我的找活名片展示发布成功弹窗
    if (options.hasOwnProperty("boxStatus")) {
      if (options.boxStatus) {
        this.setData({ boxStatus: options.boxStatus})
        this.showPublishTip()
      }
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
  onShow() {
    if (app.globalData.previewshou) {
      this.getdetail();
      this.delestore();
      this.deleskill();
    }
    app.getAreaData(this)
    app.globalData.previewshou = true;
    app.activeRefresh()
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
    this.getdetail();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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

const app = getApp();
let remain = require("../../utils/remain.js");
let v = require("../../utils/v.js");
const ads = require('../../utils/ad')
Page({

  /**/
  data: {
    shownewtips: false,
    complaincontent: app.globalData.complaincontent,
    realNames: app.globalData.apiImgUrl + 'new-list-realname-icon.png',
    authentication: app.globalData.apiImgUrl + 'new-list-jnzs-icon.png',
    unitid: ads.resumeInfoAd,
    homebtnImg: app.globalData.apiImgUrl + "yp-return-jobinfo.png",
    downward: app.globalData.apiImgUrl + "lpy/downward.png",
    experienceitem: app.globalData.apiImgUrl + "lpy/newresume-experience-item.png",
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    baseinform: app.globalData.apiImgUrl + "newresume-catimg.png",
    userInfo: true,
    icon: app.globalData.apiImgUrl + "userauth-topicon.png",
    complainInfo: "",
    showComplain: false,
    soucang: app.globalData.apiImgUrl + "newresume-footer-collect.png",
    soucangone: app.globalData.apiImgUrl + "newresume-footer-collect-active.png",
    fenxiang: app.globalData.apiImgUrl + "newresume-footer-share.png",
    zan: app.globalData.apiImgUrl + "newresume-footer-star.png",
    zanone: app.globalData.apiImgUrl + "newresume-footer-star-active.png",
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
    sharetelephone: "未填写",
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
    selectShow: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //下拉列表的数据
    index: 0, //选择的下拉列表下标
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
    resume_uuid: "",
    showtan: false,
    onoff: false,
    praise: 0,
    status: 0,
    collect: 0,
    is_read: "",
    distance: "",
    location: "",
    showdistan: true,
    is_end: 0,
    detailid: "",
    examine: true,
    options: {
      location: "",
      uuid: ""
    },
    introshow: true,
    sharedeke: true,
    options: {},
    show_complain: {},
    authenticationimg: false,
    certificate_show: false,
    cid: '',
    aid: '',
    rpage: 1,
    recommendlist: [],
    toptown: app.globalData.apiImgUrl + 'newlist-jobzd.png',
    rullIntegral: app.globalData.apiImgUrl + "resume-list-rules-btn.png",
    finded: app.globalData.apiImgUrl + "lpy/finded.png",
    biaoqian: app.globalData.apiImgUrl + "lpy/biaoqian.png",
    userImg: "http://cdn.yupao.com/miniprogram/images/user.png",
    more: 0,
    child: 0,
    user_id: '',
    teltipsimg: app.globalData.apiImgUrl + 'usercallphone-tips.png',
    infoId:'',
    experience:'',
    provinces_txt:'',
    _address:''
  },
  closeNewPhoneFc:function(){
    this.setData({shownewtips: false})
  },
  returnAction:function(){
    return false
  },
  recentlynottips:function(){
    this.setData({shownewtips: false})
    let time = new Date().getTime()
    wx.setStorageSync('resumeHideTipsTime', time)
    wx.makePhoneCall({
      phoneNumber: this.data.telephone,
    })
  },
  callthisphonehide:function(){
    this.setData({shownewtips: false})
    let tel = this.data.telephone
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  showDetailInfo:function(e){
    let id = e.currentTarget.dataset.uuid
    let url = `/pages/boss-look-card/lookcard?uuid=${id}&more=${this.data.more}&location=${this.data.options.location}`
    wx.redirectTo({ url: url })
  },
  seemoreaction:function(){
    let { more, cid, aid } = this.data
    let url = `/pages/lists/resume/index?aid=${aid}&cid=${cid}&location=${this.data.options.location}`
    if(parseInt(more)){
      wx.navigateBack()
    }else{
      wx.navigateTo({
        url: url
      })
    }
  },
  errImg: function (e) {
    let index = e.currentTarget.dataset.index;
    let obj = `recommendlist[${index}].headerimg`;
    this.setData({
      [obj]: this.data.userImg
    })
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
    app.globalData.previewboss = false;
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
    app.globalData.previewboss = false;
  },
  errImg: function (e) {

    // let index = e.currentTarget.dataset.index;

    // let obj = `lists[${index}].headerimg`;
    this.setData({
      headerimg: "http://cdn.yupao.com/miniprogram/images/user.png"
    })

  },
  showThisMapInfo: function () {

    if (this.data.location) {
      let loc = this.data.location;
      let locArr = loc.split(",");

      wx.openLocation({
        latitude: parseFloat(locArr[1]),
        longitude: parseFloat(locArr[0]),
        name: this.data.city,
        scale: 18
      })
    }
  },
  telephorft() {
    let that = this
    var pages = getCurrentPages();//获取页面栈
    let userInfo = wx.getStorageSync("userInfo");
    let infoId = this.data.infoId;
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    let detailid = that.data.detailid;
    let dert = {}
    Object.assign(dert, {
      resume_uuid: detailid,
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })
    app.appRequestAction({
      url: "resumes/get-tel/",
      way: "POST",
      failTitle: "网络错误！",
      params: dert,
      success: function (res) {
        if (res.data.errcode == 200) {
          that.setData({
            telephone: res.data.tel,
            sharetelephone: res.data.tel,
            onoff: true,
            is_read: 0,
            // "show_complain.show_complain":
          })

          let rtime = wx.getStorageSync('resumeHideTipsTime')
          if(rtime){
            let t = 15 * 60 * 60 * 24 * 1000
            let tt = new Date().getTime()
            if(tt - rtime >= t){
              _this.setData({shownewtips:true})
            }
          }else{
            _this.setData({shownewtips:true})
          }

        } else if (res.data.errcode == "7405") {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/getintegral/getintegral',
                })
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        } else if (res.data.errcode == "reload") { //已招满状态刷新页面
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel:false,
            confirmText: "确定",
            success(res) {
              if (res.confirm) {
                 _this.getdetail(_this.data.options)
              } 
            }
          })
        } else if (res.data.errcode == "goback") { //已删除返回上一页
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            // 设置上一页对象属性
            prePage.setData({
              pageStatus: res.data.errcode,
              pageId: infoId,
            })
          } 
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            confirmText: "确定",
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              } 
            }
          })
        } else {
          app.showMyTips(res.data.errmsg)
        }
      }
    })
  },
  userTapComplain: function () {
    let infoId = this.data.resume_uuid;
    //查看电话三天后点击投诉按钮弹出该信息已过期
    if(this.data.show_complain.not_complain == 1){
      wx.showModal({
        title:'提示',
        content:'该信息已过期，无法投诉',
        showCancel:false,
      })
      return  false
    }
    if (!this.data.show_complain.show_complain) {
      wx.showModal({
        title: '提示',
        content: this.data.show_complain.tips_message,
        showCancel: false,
        confirmText: '知道了'
      })
      return false;
    }
    // 跳转到投诉界面
    wx.navigateTo({
      url: `/pages/complaint/index?infoId=${infoId}&type=resume&page=detail`,
    })
  },
    
  subscribeToNews: function(mydata) {
    app.subscribeToNews("complain",function(){
      wx.showModal({
        title: '提示',
        content: mydata.errmsg,
        showCancel: false,
        confirmText:  '确定'
      })
    })
    
  },
  userTapComplai() {
    let userInfo = wx.getStorageSync("userInfo");

    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }

    if (!this.data.show_complain.show_complain) {
      wx.showModal({
        title: '提示',
        content: this.data.show_complain.tips_message,
        showCancel: false,
        confirmText: '知道了'
      })
      return false;
    }
    if (this.data.is_read == 1) {
      wx.showModal({
        title: '提示',
        content: "请先查看电话号码！",
        showCancel: false,
        confirmText: '知道了'
      })
      return false;
    } else {
      this.setData({
        showComplain: true
      })
    }

  },
  userEnterComplain: function (e) {
    this.setData({
      complainInfo: e.detail.value
    })
  },
  telephorf(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.telephone,
    })
  },
  moreproject() {
    let userInfo = wx.getStorageSync("userInfo");
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    app.globalData.allexpress = false
    wx.setStorageSync("allexpress", _this.data.project)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-project-experience/allexperience",
    })
  },
  moreskill() {
    let userInfo = wx.getStorageSync("userInfo");
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    app.globalData.allskill = false
    wx.setStorageSync("allskill", _this.data.skillbooks)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/all-skills-certificate/skillscertificate",
    })
  },
  getdetail(option) {
    let that = this;
    let infoId = option.id
    var pages = getCurrentPages();//获取页面栈
    if (option.hasOwnProperty("refId")){
      app.globalData.refId = option.refId;
    }
    if (option.hasOwnProperty("sharedekeId")) {
      if (option.sharedekeId == 1) {
        that.setData({
          sharedeke: false
        })
      }
    }
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      userInfo = {
        userId: null
      }
      this.setData({
        userInfo: true
      })
    }else{
      this.setData({
        userInfo: userInfo
      })
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    

    let detail = {
      userId: userInfo.userId,
      resume_uuid: option.uuid,
      location: option.hasOwnProperty("location") ? option.location : ""
    }

    if (that.data.options.location != "" && that.data.options.uuid != "") {
      this.setData({
        detailid: option.uuid
      })
    } else {
      this.setData({
        detailid: option.uuid,
        options: {
          location: option.hasOwnProperty("location") ? option.location : "",
          uuid: option.uuid
        }
      })
    }

    app.appRequestAction({
      url: 'resumes/resume-detail/',
      way: 'POST',
      mask: true,
      params: detail,
      success(res) {
        let mydata = res.data;
        if (res.data.errcode == "ok") {
          wx.hideLoading();
          let date = new Date();
          let dateo = date.getTime()
          let dateone = new Date(dateo);
          wx.setStorageSync("introdetail", mydata.introduces)
          wx.setStorageSync("introinfo", mydata.info)
          if (mydata.info.uuid) {
            that.setData({
              resume_uuid: mydata.info.uuid
            })
            wx.setStorageSync("uuid", mydata.info.uuid)
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
            name: mydata.info.hasOwnProperty("username") ? mydata.info.username : "",
            nation: mydata.info.hasOwnProperty("nation") ? mydata.info.nation : "",
            occupations: mydata.info.hasOwnProperty("occupations") ? mydata.info.occupations : "",
            cid: mydata.info.hasOwnProperty("occupations_id") ? mydata.info.occupations_id : '',
            aid: cityid || province,
            uuid: mydata.info.hasOwnProperty('uuid') ? mydata.info.uuid : '',
            telephone: mydata.info.hasOwnProperty("tel") ? mydata.info.tel : "",
            sharetelephone: mydata.info.hasOwnProperty("tel") ? mydata.info.tel : "",
            city: mydata.info.hasOwnProperty("current_area_str") ? mydata.info.current_area_str : "",
            intro: false,
            introne: true,
            introduce: mydata.info.hasOwnProperty("introduce") ? mydata.info.introduce : "",
            workingyears: mydata.info.hasOwnProperty("experience_num") ? mydata.info.experience_num : "",
            staffcomposition: mydata.info.hasOwnProperty("type_str") ? mydata.info.type_str : "",
            cityself: mydata.info.hasOwnProperty("hometown") ? mydata.info.hometown : "",
            procity: mydata.info.hasOwnProperty("prof_degree_str") ? mydata.info.prof_degree_str : "未填写",
            personnum: mydata.info.hasOwnProperty("number_people") ?
              mydata.info.number_people : "未填写",
            tags: mydata.info.hasOwnProperty("tags") ? mydata.info.tags : "",
            praise: mydata.operation.hasOwnProperty("is_zan") ? mydata.operation.is_zan : "",
            collect: mydata.operation.hasOwnProperty("is_collect") ? mydata.operation.is_collect : "",
            status: mydata.operation.hasOwnProperty("status") ? mydata.operation.status : "",
            is_read: mydata.info.hasOwnProperty("is_read") ? mydata.info.is_read : "",
            distance: mydata.info.hasOwnProperty("new_distance") ? mydata.info.new_distance == "" ? "" : mydata.info.new_distance : "",
            location: mydata.info.hasOwnProperty("location") ? mydata.info.location : "",
            is_end: mydata.info.hasOwnProperty("is_end") ? mydata.info.is_end : "",
            examine: false,
            show_complain: mydata.info.hasOwnProperty("show_complain") ? mydata.info.show_complain : {},
            certificate_show: mydata.info.hasOwnProperty("certificate_show") ? mydata.info.certificate_show : "",
            authenticationimg: mydata.info.hasOwnProperty("authentication") ? mydata.info.authentication : "",
            userId: mydata.info.user_id,
            infoId: mydata.info.id,
            experience:mydata.info.hasOwnProperty("experience") ? mydata.info.experience : '',
            provinces_txt:mydata.info.hasOwnProperty("provinces_txt") ? mydata.info.provinces_txt : '',
            _address:mydata.info.hasOwnProperty("address") ? mydata.info.address : '',
          })

          // 加载推荐列表
          //that.getRecommendList()

          if (that.data.introduce === "") {
            that.setData({
              introshow: false
            })
          }

          that.setData({
            headerimg: mydata.info.headerimg
          })

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
            // 定义有图片项目数组
            let hasImageProject = [];
            // 定义没图片的数组
            let NoImageProject = [];
            for (let i = 0; i < project.length; i++) {
              // 获取项目经验对象中images不为空的项目
              if (project[i].image.length != 0) {
                // 将时间转成毫秒并存入数组
                project[i].endTime = new Date(project[i].completion_time).getTime()
                // 增加index字段作为project数组查找标识
                project[i].index = i
                hasImageProject.push(project[i])
              }else{
                project[i].endTime = new Date(project[i].completion_time).getTime()
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
            // 获取排序后的第一个元素
            let projectOne = {...projectObj[0]}
            let images = projectOne.image
            let image = []
            for (let i = 0; i < images.length; i++) {
              if (i < 3) {
                image.push(images[i])
              }
            }
            projectOne.image = image
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
            percent: mydata.info.hasOwnProperty("progress") ? mydata.info.progress : 0
          })


          if (mydata.certificates.length == 0) {
            that.setData({
              skillbooks: [],
              skilllength: 0,
              skillbooksone: []
            })

          } else {
            let certificatesall = [];
            for (let i = 0; i < mydata.certificates.length; i++) {
              certificatesall.push(mydata.certificates[i])
            }
            that.setData({
              skillbooks: certificatesall,
              skilllength: certificatesall.length >= 1 ? certificatesall.length : 0,
              skillbooksone: [certificatesall[0]]
            })
          }

        } else if (res.data.errcode == "fail") {
          if (option.hasOwnProperty("sharedekeId")) {
            wx.showModal({
              title: '温馨提示',
              content: '该信息已被删除！',
              showCancel: false,
              success: function () {
                wx.redirectTo({
                  url: "/pages/index/index",
                })
              }
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: res.data.errmsg,
              showCancel: false,
              success: function () {
                wx.navigateBack({})
              }
            })
          }
        } else if (res.data.errcode == "goback") { //已删除返回上一页
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            // 设置上一页对象属性
            prePage.setData({
              pageStatus: res.data.errcode,
              pageId: infoId,
            })
          } 
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            confirmText: "确定",
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              } 
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errmsg,
            showCancel: false,
            success(res) { }
          })
        }

      },
      fail: function (err) {
        let that = this;
        // wx.hideLoading();
        if (option.hasOwnProperty("sharedekeId")) {
          if (option.sharedekeId == 1) {
            wx.showModal({
              title: '温馨提示',
              content: '网络请求失败，即将返回首页！',
              showCancel: false,
              success: function () {
                wx.navigateTo({
                  url: '/pages/index/index',
                })
              }
            })
          }
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '网络请求失败，请稍后重试！',
            showCancel: false,
            success: function () {
              wx.navigateBack({})
            }
          })
        }
      }
    })
  },


  delestore() {
    wx.removeStorageSync("projectdetail")
  },
  deleskill() {
    wx.removeStorageSync("skilltail")
  },
  praise() {
    let that = this

    let userInfo = wx.getStorageSync("userInfo");
    let detailid = that.data.detailid;
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    let praise = {}
    Object.assign(praise, {
      resume_uuid: detailid,
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })

    app.appRequestAction({
      url: "resumes/resume-support/",
      way: "POST",
      failTitle: "网络错误！",
      params: praise,
      title: '正在操作',
      mask: true,
      success: function (res) {
        app.showMyTips(res.data.errmsg);
        if (res.data.errcode == "ok") {
          _this.setData({
            praise: res.data.show ? 1 : 0,
          })
        }
      },
      fail: function (err) {
        app.showMyTips("请求失败");
      }
    })
  },

  collect() {

    let that = this
    let userInfo = wx.getStorageSync("userInfo");
    let detailid = that.data.detailid;
    let _this = this;
    if (!userInfo) {
      app.gotoUserauth();
      return false;
    }
    let collect = {}
    Object.assign(collect, {
      resume_uuid: detailid,
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
    })

    app.appRequestAction({
      url: "resumes/resume-collect/",
      way: "POST",
      failTitle: "网络错误！",
      title: '正在操作',
      mask: true,
      params: collect,
      success: function (res) {
        app.showMyTips(res.data.errmsg);
        if (res.data.errcode == "ok") {
          _this.setData({
            collect: res.data.show ? 1 : 0
          })
        }
      },
      fail: function (err) {
        app.showMyTips("请求失败");
      }
    })
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
      this.telephorft()
    }
  },
  returnPrevPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  returnindex() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onShareAppMessage: function () {
    let tel = this.data.telephone;

    let uuid = this.data.resume_uuid;
    let commonShareTips = app.globalData.commonShareTips;
    let commonShareImg = app.globalData.commonShareImg;

    return {
      title: commonShareTips,
      imageUrl: commonShareImg,
      path: '/pages/boss-look-card/lookcard?uuid=' + uuid + '&sharedekeId=1' //这是一个路径
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
            that.setData({
              userInfo: userInfo
            });

            that.getdetail(that.data.options)

          } else {
            app.showMyTips(uinfo.errmsg);
          }
        });
      });
    });
  },


  sharetelphe() {
    this.setData({
      telephone: this.data.sharetelephone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    if(options.hasOwnProperty('more')){
      this.setData({
        more: options.more
      })
    }
    if(options.hasOwnProperty('child')){
      this.setData({
        child: options.child
      })
    }
    if(options.hasOwnProperty('id')){
      this.setData({
        infoId: options.id
      })
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
    if (app.globalData.previewboss) {
      this.getdetail(this.data.options);
      //this.sharetelphe();
      this.delestore();
      this.deleskill()
    }
    app.globalData.previewboss = true;
    app.activeRefresh()
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
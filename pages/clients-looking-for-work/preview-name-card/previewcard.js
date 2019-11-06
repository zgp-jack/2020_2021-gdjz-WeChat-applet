// pages/Finding a name card.js
const app = getApp();
//selfintro 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allde: false,
    username: '',
    userimg: '',
    showtop: true,
    showtopone: false,
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
    resume_uuid: "",
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
    skillbooksone: []
  },

  selectTap() {
    if (this.data.check == "1") {
      wx.showModal({
        title: '温馨提示',
        content: '提示信息审核中，请稍后再试',
        showCancel: false,
        success(res) { }
      })
      return
    }
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  // 点击下拉列表
  moreproject() {
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/preall-project-experience/preall-project-experience",
    })
  },
  
  moreskill() {
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/preall-skills-certificate/preall-skills-certificate",
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
    app.doRequestAction({
      url: 'resumes/resume-list/',
      way: 'POST',
      params: detail,
      success(res) {
        let date = new Date();
        let dateo = date.getTime()
        let dateone = new Date(dateo);
        console.log(res)
        if (res.data.data.info.uuid) {
          that.showtop()
          that.setData({
            resume_uuid: res.data.data.info.uuid
          })
          wx.setStorageSync("uuid", res.data.data.info.uuid)
        }
        that.setData({
          name: res.data.data.info.username
        })
        that.setData({
          sex: res.data.data.info.gender == "1" ? "男" : "女"
        })
        that.setData({
          age: dateone.getFullYear() - (res.data.data.info.birthday.split("-")[0] - 0)
        })

        that.setData({
          nation: res.data.data.info.nation
        })

        that.setData({
          occupations: res.data.data.info.occupations
        })
        that.setData({
          telephone: res.data.data.info.tel
        })
        that.setData({
          city: res.data.data.info.address
        })
        that.setData({
          intro: false,
          introne: true,
          introduce: res.data.data.info.introduce
        })
        that.setData({
          workingyears: res.data.data.introduces.experience
        })
        that.setData({
          staffcomposition: res.data.data.introduces.type_str
        })
        that.setData({
          cityself: res.data.data.introduces.hometown
        })
        that.setData({
          procity: res.data.data.introduces.prof_degree_str
        })
        that.setData({
          personnum: res.data.data.introduces.number_people
        })
        that.setData({
          tags: res.data.data.introduces.tags
        })
        let selectD = Object.values(res.data.data.status)
        let selectk = Object.keys(res.data.data.status)
        if (res.data.data.info.is_end == "2") {
          selectD.reverse();
          selectk.reverse()
        }
        that.setData({
          selectData: selectD,
          selectk: selectk
        })
        if (res.data.data.info.check == "1") {
          that.setData({
            checkstatus: false
          });
        }
        that.setData({
          check: res.data.data.info.check
        })

        that.setData({
          headerimg: res.data.data.info.headerimg
        })
        if (res.data.data.is_introduces) {
          that.setData({
            is_introduces: res.data.data.is_introduces,
            selfintro: false,
            selfintrone: true,
          })
        }

        that.setData({
          view_num: res.data.data.info.view_num
        });
        that.setData({
          project: res.data.data.project
        });
        that.setData({
          projectone: [res.data.data.project[0]]
        });
        that.setData({
          projectlength: res.data.data.project.length
        })
        that.setData({
          allde: true
        })

        that.setData({
          percent: res.data.data.info.progress - 0
        })

        that.setData({
          skillbooks: res.data.data.certificates
        })
        that.setData({
          skilllength: res.data.data.certificates.length
        })
        that.setData({
          skillbooksone: [that.data.skillbooks[0]]
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
    this.getdetail();

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
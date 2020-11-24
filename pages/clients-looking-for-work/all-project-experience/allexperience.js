const app = getApp();
Page({

  /**
   * 页面的初始数据 editor allgetexpre addpro previewImage previewproject
   */
  data: {
    notthrough: app.globalData.apiImgUrl + "lpy/notthrough.png",
    inreview: app.globalData.apiImgUrl + "lpy/review.png",
    experienceitem: app.globalData.apiImgUrl + "lpy/newresume-experience-item.png",
    allproject: [],
    projectlength: 0,
    allde: false,
    allgetexpre: 0,
    projectwo: [],
    projecthree: [],
    allgetexpreone: false,
    onoff: false,
    listsImg: {
      nodata: app.globalData.apiImgUrl + "nodata.png",
    },
    resume_uuid:'',
  },
  editor(e) {
    
      wx.setStorageSync("projectdetail", e.currentTarget.dataset)
      wx.navigateTo({
        url: "/pages/clients-looking-for-work/new-project-experience/projectexperience?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid,
      })
  },
  delestore() {
    wx.removeStorageSync("projectdetail")
  },
  getexpre() {
    let pass = wx.getStorageSync("pass");
    
    if (pass) {
      this.setData({
        allgetexpre: pass
      })
    }
    wx.removeStorageSync("pass")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.activeRefresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addpro() {
    let projectnum = this.data.allproject.length
    wx.setStorageSync("projectnum", projectnum)
    wx.navigateTo({
      url: "/pages/clients-looking-for-work/new-project-experience/projectexperience?project_count="+this.data.project_count+"&certificate_count="+this.data.certificate_count+"&resume_uuid="+this.data.resume_uuid,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  project() {
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
        
        let allproject = [];
        if (res.data.errcode == 200) {
          let mydata = res.data.data;
          // 获取项目经验对象
          let project = mydata.project;
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
          for (let i = 0; i < projectObj.length ; i++){
            if (new Date(projectObj[i].completion_time).getTime() / 86400000 < parseInt(new Date().getTime() / 86400000)) {
              projectObj[i].completiontime = "zhijing"
              allproject.push(projectObj[i])
            }else{
              projectObj[i].completiontime = "zhijin"
              allproject.push(projectObj[i])
            }
          }

          that.setData({
            allproject: allproject,
            certificate_count:res.data.data.certificate_count,
            project_count:res.data.data.project_count,
            resume_uuid:res.data.data.info.uuid
          })
          that.setData({
            projectlength: res.data.data.project.length
          })
          
          let projectall = [];
          for (let i = 0; i < that.data.allproject.length; i++) {
            if (that.data.allproject[i].check == "2") {
              projectall.push(that.data.allproject[i])
            }
          }
          that.setData({
            projectwo: projectall,
            onoff: true
          });

        }else{
          wx.showModal({
            title: '温馨提示',
            content: `操作失败，请稍后重试！`,
            showCancel: false,
            success(res) {
            }
          })
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

  projecttwo() {
    let that = this;
    if (!app.globalData.allexpress) {
      let allexpress = wx.getStorageSync("allexpress");
      this.setData({
        allgetexpreone: true
      });
      this.setData({
        allgetexpre: 8
      })


      let projectall = [];
      let allproject = [];
      for (let i = 0; i < allexpress.length; i++) {
        projectall.push(allexpress[i])
      }
       // 获取项目经验对象
       let project = allexpress;
       // 定义有图片项目数组
       let hasImageProject = [];
       // 定义没图片的数组
       let NoImageProject = [];
       for (let i = 0; i < project.length; i++) {
         // 获取项目经验对象中images不为空的项目
         if (project[i].image.length != 0) {
           // 处理如果图片数量大于3就只保留三张图片
           // if (project[i].image.length > 3) {
           //   project[i].image.splice(3,project[i].image.length-3)
           // }
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
       

      for (let i = 0; i < projectObj.length; i++) {
        if (new Date(projectObj[i].completion_time).getTime() / 86400000 < parseInt(new Date().getTime() / 86400000)) {
          projectObj[i].completiontime = "zhijing"
          allproject.push(projectObj[i])
        } else {
          projectObj[i].completiontime = "zhijin"
          allproject.push(projectObj[i])
        }
      }
    
      that.setData({
        projecthree: allproject
      });
    }

  },

  onShow: function () {
    if (app.globalData.previewproject) {
      if (app.globalData.allexpress) {
        this.project()
      }
      this.projecttwo()
      this.getexpre()
      this.delestore()
    }

    app.globalData.previewproject = true;
  },
  previewImage: function (e) {
    let url = e.currentTarget.dataset.url;
    let i = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let urls = type == "1" ? this.data.projecthree[i].image : this.data.allproject[i].image
    wx.previewImage({
      current: url,
      urls: urls
    })
    app.globalData.previewproject = false;
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
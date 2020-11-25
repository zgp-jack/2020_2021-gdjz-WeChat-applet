// pages/complaint/index.js
const v = require('../../utils/v.js');
const vali = v.v.new();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    normalImg: app.globalData.apiImgUrl + "uploads.png",
    // 上传图片按钮
    uploadImg: app.globalData.apiImgUrl + "yc/upload-img.png",
    // 删除图片按钮
    delImg: app.globalData.apiImgUrl + "new-published-close-icon.png",
    hintImg: app.globalData.apiImgUrl + 'new-uploadbgimg.png',
    imgs: [],
    // 上传图片数组
    imglists: [],
    // 上传图片最大长度
    maxLen: 6,
    // 投诉填写内容
    content: "",
    // 提交按钮可点击状态
    disabled: false, //验证按钮
    // 文本域内容长度
    texralength: 0,
    // 投诉信息id
    infoId: "",
    // 来自哪个页面的投诉job（招工信息），resume（找活信息）
    type: "",
    // 详情页面还是积分消耗页面detail(详情页面)，expend（积分消耗页面）
    page:"",
    isIos:false,
    textLength: 300,
  },
  // 用户上传图片
  userUploadsImg: function(e) {
    let _type = parseInt(e.currentTarget.dataset.type);
    let _index = parseInt(e.currentTarget.dataset.index);
    let _this = this;
    let max = this.data.maxLen - this.data.imglists.length
    if(_type == 0) {
        max = 1
    }
    let fail = 0;
    let num = 0
    app.userUploadImg(function(imgRes, mydata, allnum, res) {
        num++//用于判断 选中的图片是否上传完毕
        if(res !== 'ok'){
            fail++//记录失败次数
        }else {
            wx.hideLoading();
            wx.showToast({
                title: mydata.errmsg,
                icon: "none",
                duration: 2000
            })
            let imgs = _this.data.imgs;
            let imglists = _this.data.imglists;
            if (_type == 0) {
                imgs[_index] = mydata.url;
                imglists[_index] = imgRes;
            } else {
                if(imgs.length < 6){
                    imgs.push(mydata.url)
                    imglists.push(imgRes)
                }
            }
            _this.setData({
                imgs: imgs,
                imglists: imglists
            })
        }
        if(num == allnum && fail !== 0){
            wx.hideLoading()
            wx.showModal({
              title: "提示",
              content:'您有'+fail+'张图片上传失败，请重新上传',
              showCancel:true,
              confirmText:'确定',
            })
        }
    },max)
},
  // 用户输入投诉内容
  userEnterContent: function(e) {
    // 输入内容
    let val = e.detail.value
    // 设置输入内容到data
    this.setData({
        content: val
    })
    let content = this.data.content;
    // 获取输入内容长度
    let length = content.length > this.data.textLength? this.data.textLength:content.length;
    // 设置长度到data中texralenth
    this.setData({texralength:length})
  },
  // 删除图片
  delThisImg: function(e) {
    // 当前删除图片的index
    let index = parseInt(e.currentTarget.dataset.index);
    // 获取图片数组
    let imgs = this.data.imgs;
    let imglists = this.data.imglists;
    // 删除对应图片
    imgs.splice(index, 1);
    imglists.splice(index, 1);
    // 重新设置到data
    this.setData({
        imgs: imgs,
        imglists: imglists
    })
  },
  // 用户提交投诉
  userSubmitComlaint: function() {
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) return
    // 上传图片
    let image = this.data.imgs.join(",");
    // 获取当前页面栈
    let pages = getCurrentPages();
    // 详情页面还是积分消耗页面detail(详情页面)，expend（积分消耗页面）
    let page = this.data.page;
    // 来自哪个页面的投诉job（招工信息），resume（找活信息）
    let type = this.data.type;
    // 获取找活或者找活投诉信息id
    let infoId = this.data.infoId;
    // 投诉内容
    let content = this.data.content; 
    // 投诉不符合填写内容条件的提示信息
    let complaincontent = app.globalData.complaincontent;
    // 内容验证
    let vertifyNum = v.v.new();
    // 将以空格开头空格结尾的替换空字符串
    content = content.replace(/^\s+|\s+$/g, '');
    // 不少于1个汉字的正则表达式
    let vRegx = /[\u4E00-\u9FA5]{1}/g; 
    // 验证不通过直接退出
    if (content == "" || !content.match(vRegx) ||　content.match(vRegx).length < 5 || content.length < 5) {
      app.showMyTips(complaincontent);
      return false;
    }
    // 找工作投诉请求参数
    let jobParams = { userId: userInfo.userId, token: userInfo.token, tokenTime: userInfo.tokenTime, infoId: infoId, type: type, content: content, image: image };
    // 找工人投诉请求参数
    let resumeParams = { userId: userInfo.userId, token: userInfo.token, tokenTime: userInfo.tokenTime, resume_uuid: infoId, content: content, image: image };
    let params = (page === "detail" && type === "resume")? resumeParams:jobParams;
    // 投诉请求url
    let url = (page === "detail" && type === "resume")? "resumes/complain/" : "publish/complain/";
    // 发送投诉请求
    app.appRequestAction({
        url: url,
        way: "POST",
        params: params,
        title: "正在提交投诉",
        failTitle: "网络错误，投诉失败！",
        success: function (res) {
          let mydata = res.data;
          if (mydata.errcode == "ok"){
            // 如果上一个页面是从积分消耗过来设置info.show_complain为0，隐藏投诉按钮
            // 获取上一个页面并获取route
            if( pages.length > 1 ){
              let prevPage = pages[pages.length - 2];
              let route = prevPage.route;
              if (route === "pages/integral/expend/expend") {
                prevPage.setData({
                  "info.show_complain": 0
                })
              }
            }
            setTimeout(function () {
              wx.showToast({
                title: mydata.errmsg,
                duration: 3000,
                mask: true,
                success: function () {
                  setTimeout(() => {
                    wx.navigateBack({
                    delta: 1,
                  })
                  }, 3000);
                }
              })
            }, 1)
            // 投诉成功显示toast框，并展示3秒后返回上一页
            // app.showMyTips(mydata.errmsg);
            // setTimeout(() => {
            //   wx.navigateBack({
            //   delta: 1,
            // })
            // }, 2000);
          }else{
            wx.showModal({
              title: '提示',
              content: mydata.errmsg,
              showCancel:false,
              confirmText: mydata.errcode == 'pass_complaint' ? '知道了' : '确定'
            })
          }
        }
      })
  },
  initUploadImgsApi: function() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
        userInfo: userInfo
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty("infoId")) {
      this.setData({ infoId: options.infoId })
    }
    if (options.hasOwnProperty("type")) {
      this.setData({ type: options.type })
    }
    if (options.hasOwnProperty("page")) {
      this.setData({ page: options.page })
    }
    //判断ios
    var phone = wx.getSystemInfoSync();  //调用方法获取机型
    var that = this;
    if (phone.platform == 'ios') {
      that.setData({
        isIos: true
      });
    } else if (phone.platform == 'android') {
      that.setData({
        isIos: false
      });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
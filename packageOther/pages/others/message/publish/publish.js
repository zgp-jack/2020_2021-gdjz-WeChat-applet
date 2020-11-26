// pages/feedback/feedback.js
const v = require('../../../../../utils/v.js');
const vali = v.v.new();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        normalImg: app.globalData.apiImgUrl + "uploads.png",
        uploadImg: app.globalData.apiImgUrl + "yc/upload-img.png",
        delImg: app.globalData.apiImgUrl + "new-published-close-icon.png",
        hintImg: app.globalData.apiImgUrl + 'new-uploadbgimg.png',
        imgs: [],
        imglists: [],
        maxLen: 9,
        userInfo: "",
        content: "",
        disabled: false, //验证按钮
        texralengh: 0,
        joingroup:[]
    },
  
    initNeedData: function () {
    let joingroup = app.globalData.joingroup;
    if(joingroup){
      this.setData({
        joingroup: joingroup,
        wechat: app.globalData.copywechat,
        phone: app.globalData.callphone
      })
      return false;
    }
    let _this = this;
    let _mark = true;
    let _wx = wx.getStorageSync("_wx");
    let userInfo = this.data.userInfo;
    let _time = Date.parse(new Date());
    if (_wx && _wx.expirTime) {
      if (parseInt(_wx.expirTime) > _time) _mark = false;
    }
    if (userInfo) userInfo.type = "job"
    else userInfo = { type: "job" }
    app.doRequestAction({
      url: "index/less-search-data/",
      way: "POST",
      hideLoading: true,
      params: userInfo,
      success: function (res) {
        let mydata = res.data;
        _this.setData({
          "notice.lists": mydata.notice,
          // member_notice: mydata.member_notice,
          member_less_info: mydata.member_less_info,
          phone: mydata.phone,
          wechat: _mark ? mydata.wechat.number : (_wx.wechat ? _wx.wechat : mydata.wechat.number),
          joingroup: mydata.join_group_config
        })
        app.globalData.joingroup = mydata.join_group_config
        app.globalData.copywechat = mydata.wechat.number
        app.globalData.callphone = mydata.phone
        if (_mark) {
          let extime = _time + (mydata.wechat.outTime * 1000);
          wx.setStorageSync("_wx", { wechat: mydata.wechat.number, expirTime: extime });
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '数据加载失败！',
          icon: "none",
          duration: 3000
        })
      }
    })
    },
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
                    if(imgs.length < 9){
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
    userEnterContent: function(e) {
        let val = e.detail.value
        this.setData({
            content: val
        })
        let content = this.data.content;
        let length = content.length;
        this.setData({texralengh:length})
    },
    delThisImg: function(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        let imgs = this.data.imgs;
        let imglists = this.data.imglists;
        imgs.splice(index, 1);
        imglists.splice(index, 1);
        this.setData({
            imgs: imgs,
            imglists: imglists
        })
    },
    userSubmitFeedback: function() {
        let _this = this;
        let userInfo = wx.getStorageSync("userInfo");
        let imgs = this.data.imgs;
        let images = imgs.join(",");
        let content = this.data.content
        content = content.replace(/^\s+|\s+$/g, '');
        let words = /[\u4e00-\u9fa5]+/;
        if (content.length < 15 || !words.test(content)) {
            wx.showModal({
                title: '提示',
                content: "输入内容不少于15个字且必须包含文字",
                showCancel: false
            })
            return false;
        }
        app.appRequestAction({
            url: "leaving-message/publish-v2/",
            way: "POST",
            mask: true,
            title: "正在提交留言",
            failTitle: "网络错误，留言失败！",
            params: {
                mid: userInfo.userId,
                token: userInfo.token,
                time: userInfo.tokenTime,
                images: images,
                content: content,
            },
            success: function(res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    _this.subscribeToNewsAgain(mydata)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: mydata.errmsg,
                        showCancel: false
                    })
                }
            },
        })
    },
    subscribeToNewsAgain: function(mydata) { 
        app.subscribeToNews("msg",function(){
            wx.showModal({
                title: '系统提示',
                content: mydata.errmsg,
                showCancel: false,
                success: function(res) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        })
    },
    callThisPhone: function(e) {
        app.callThisPhone(e);
    },
    clipboardWechat: function (e) {
      let wechat = e.currentTarget.dataset.wechat;
      wx.setClipboardData({
        data: wechat,
        success(res) {
          wx.hideToast();
          wx.showModal({
            title: '恭喜您',
            content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
            showCancel: false,
            success: function () { }
          })
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
    onLoad: function() {
        this.initNeedData()
        //this.initUploadImgsApi();
    },
})
// pages/feedback/feedback.js
const v = require('../../../../utils/v.js');
const vali = v.v.new();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        normalImg: app.globalData.apiImgUrl + "uploads.png",
        delImg: app.globalData.apiImgUrl + "del.png",
        hintImg: app.globalData.apiImgUrl + 'new-uploadbgimg.png',
        imgs: [],
        imglists: [],
        maxLen: 9,
        userInfo: "",
        content: "",
        wechat: "",
        phone: "",
        member: {
            username: "", //名字
            phone: "", //手机号
            verification: "", //验证码
        },
        tel: "",
        verify: "获取验证码",
        disabled: false, //验证按钮
        texralengh: 0,
    },
    initUserInfo: function(options) {
        let td = this.data
        let tel = options.tel;
        let name = options.name;
        this.setData({
            tel: tel,
            "member.phone": tel,
            "member.username": name,
            wechat: options.wechat,
            phone: options.phone,
        })

    },
    onLoad: function(options) {
        this.initUserInfo(options);
        //this.initUploadImgsApi();
        console.log('订阅模块当前版本是否可用：', wx.canIUse('requestSubscribeMessage'))

    },
    userUploadsImg: function(e) {
        let _type = parseInt(e.currentTarget.dataset.type);
        let _index = parseInt(e.currentTarget.dataset.index);
        let _this = this;
        app.userUploadImg(function(imgRes, mydata) {
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
                imglists[_index] = imgRes.tempFilePaths[0];
            } else {
                imgs.push(mydata.url)
                imglists.push(imgRes.tempFilePaths[0])
            }
            _this.setData({
                imgs: imgs,
                imglists: imglists
            })
        })
    },
    userEnterContent: function(e) {
        let val = e.detail.value
        let cursor = e.detail.cursor
        this.setData({
            texralengh: cursor,
            content: val
        })
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
        let td = this.data
        let userInfo = wx.getStorageSync("userInfo");
        let imgs = this.data.imgs;
        let content = this.data.content
        let username = td.member.username
        content = content.replace(/^\s+|\s+$/g, '');
        let words = /[\u4e00-\u9fa5]+/;
        if (content.length < 15 || !words.test(content)) {
            app.showMyTips("输入内容不少于15个字且必须包含文字！");
            return false;
        }

        if (username.length < 2 || !words.test(username)) {
            app.showMyTips("请正确输入联系人且必须包含汉字！");
            return false;
        }

        if (!vali.isMobile(td.member.phone)) {
            app.showMyTips("请输入正确的手机号！");
            return false;
        }

        if (td.member.phone != td.tel) {
            if (td.member.verification == "") {
                app.showMyTips("请输入正确的验证码！");
                return false;
            }
        }

        app.appRequestAction({
            url: "leaving-message/publish/",
            way: "POST",
            mask: true,
            title: "正在提交留言",
            failTitle: "网络错误，留言失败！",
            params: {
                userId: userInfo.userId,
                token: userInfo.token,
                tokenTime: userInfo.tokenTime,
                images: imgs,
                content: content,
                username: username,
                tel: td.member.phone,
                code: td.member.verification
            },
            success: function(res) {
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    if (wx.canIUse('requestSubscribeMessage') === true) {
                        wx.requestSubscribeMessage({
                            tmplIds: ['z5y8OFD9gs0SY0sT7FZwiWsrzT3rNp3CJFH7yhv7dUE'],
                            success(res) {
                                app.appRequestAction({
                                    url: "leaving-message/add-subscribe-msg/",
                                    way: "POST",
                                    mask: true,
                                    params: {
                                        userId: userInfo.userId,
                                        token: userInfo.token,
                                        tokenTime: userInfo.tokenTime,
                                        type: 1
                                    },
                                    success: function(res) {
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
                                    },
                                })
                            }
                        })
                    } else {
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
                    }
                } else {
                    if (wx.canIUse('requestSubscribeMessage') === true) {
                        wx.requestSubscribeMessage({
                            tmplIds: ['z5y8OFD9gs0SY0sT7FZwiWsrzT3rNp3CJFH7yhv7dUE'],
                            success(res) {
                                app.appRequestAction({
                                    url: "leaving-message/add-subscribe-msg/",
                                    way: "POST",
                                    mask: true,
                                    params: {
                                        userId: userInfo.userId,
                                        token: userInfo.token,
                                        tokenTime: userInfo.tokenTime,
                                        type: 1
                                    },
                                    success: function(res) {
                                        wx.showModal({
                                            title: '提示',
                                            content: mydata.errmsg,
                                            showCancel: false
                                        })
                                    },
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: mydata.errmsg,
                            showCancel: false
                        })
                    }
                }
            },
        })

    },

    callThisPhone: function(e) {
        app.callThisPhone(e);
    },
    clipboardWechat: function(e) {
        let wechat = e.currentTarget.dataset.wc;
        wx.setClipboardData({
            data: wechat,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    title: '恭喜您',
                    content: '微信号：' + wechat + "已复制到粘贴板,去微信-添加朋友-搜索框粘贴",
                    showCancel: false,
                    success: function() {}
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    initUploadImgsApi: function() {
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({
                userInfo: userInfo
            })
            // this.initNeedData();
    },

    //手机号
    addinput: function(e) {
        let val = e.detail.value
        this.setData({
            'member.phone': val
        })
    },
    //名字
    userEnterName: function(e) {
        let username = e.detail.value
        this.setData({
            'member.username': username
        })
    },
    //验证
    verifi: function(e) {
        let verification = e.detail.value
        this.setData({
            'member.verification': verification
        })
    },
    //短信请求
    getVerifyCode: function() {
        let td = this.data
        let userInfo = wx.getStorageSync("userInfo");
        let _this = this
        if (vali.isMobile(td.member.phone)) {
            this.setData({
                    disabled: true
                })
                // 发送网络请求
            app.appRequestAction({
                url: "index/get-code/",
                way: "POST",
                mask: true,
                failTitle: "网络错误，获取失败！",
                params: {
                    userId: userInfo.userId,
                    token: userInfo.token,
                    tokenTime: userInfo.tokenTime,
                    tel: td.member.phone,
                    sendType: "have"
                },
                success: function(res) {
                    let mydata = res.data;
                    if (mydata.errcode == "ok") {
                        _this.validateBtn(mydata.refresh);
                    }
                    app.showMyTips(mydata.errmsg);
                },

            })
        } else app.showMyTips("手机号有误")
    },

    validateBtn: function(refresh) {
        let time = refresh ? parseInt(refresh) : 60;
        let timer = setInterval(() => {
            if (time == 0) {
                clearInterval(timer);
                this.setData({
                    verify: '获取验证码',
                    disabled: false
                })
            } else {
                // 倒计时
                this.setData({
                    verify: time + "秒后重试",
                })
                time--;
            }
        }, 1000);
    },
})
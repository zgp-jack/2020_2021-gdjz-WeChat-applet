// pages/turntable/turntable.js
const ads = require('../../utils/ad')
const app = getApp();
let videoAd = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        userTimes:0,
        luckydraw:false,
        bg: app.globalData.apiImgUrl + "truntable-bg.png",
        btn: app.globalData.apiImgUrl + "truntable-btn.png",
        xydzp: app.globalData.apiImgUrl + "xydzp.png",
        daywin: app.globalData.apiImgUrl + "turntable-daymustwin.png?t=1",
        bgHeight:337.5,
        btnWidth: 51.68611596067261,
        wordsHeight: 10,
        wordsWidth: 800,
        shadeWidth:300,
        rotateDeg:0,
        transTime:5,
        winWidth:320,
        winHeight:346,
        notimesW:320,
        isShare:false,
        shared:false,
        topay:0,
        toPaymsg:"",
        scrollname: {
            num:100,
            current:0,
            autoplay: true,
            indicatorDots: false,
            circular: true,
            vertical: true,
            interval: 3000,
            duration: 1000,
            nameArr:[]
        },
        winData:{
            isShow:false,
            integral:1,
            stime: "",
            etime:"",
        },
        showTimesTips:false,
        allVideoTimes: 0,
        overVideoTimes: 0 ,
        adtype: 'tx',
        btndis: false,
        max: 10,
        showRules: false,
        isClick: true,
    },
    closeRules:function(){
        this.setData({
            showRules: false
        })
    },
    showRules:function(){
        if(!this.data.isClick) return false;
        this.setData({
            showRules: true
        })
    },
    initSystemInfo:function(){
        let _this = this;
        app.initSystemInfo(function(res){
            if (res) {
                let _ww = res.screenWidth;
                let _wh = res.screenHeight;
                let _bg = _ww * 0.9;
                let _btnh = _bg / 4.695;
                let wordsw = _ww * 0.5;
                let _wordsh = wordsw / 4.21;
                let _shadew = _ww * 0.8;
                let _winw = _ww * 0.9;
                let _winh = _winw / 0.9247;
                let _tipsw = _ww * 0.96;
                _this.setData({
                    bgHeight: _bg,
                    btnWidth: _btnh,
                    wordsHeight: _wordsh,
                    wordsWidth: wordsw,
                    shadeWidth: _shadew,
                    winWidth: _winw,
                    winHeight: _winh,
                    notimesW: _tipsw
                })
            }
        })
    },
    startTurntable: function () {
        if(this.data.btndis) return false;
        this.setData({btndis: true})
        let _this = this;
        let userInfo = this.data.userInfo;
        userInfo.is_new = 1
        app.appRequestAction({
            url:"turntable/draw/",
            way:"POST",
            mask: true,
            params: userInfo,
            success:function(res){
                let mydata = res.data;
                if(mydata.code == 200){

                    let userTimes = mydata.data.all_video_times - mydata.data.over_video_times
                    _this.setData({
                        userTimes: userTimes,
                        overVideoTimes: mydata.data.over_video_times,
                        allVideoTimes: mydata.data.all_video_times,
                        "winData.integral": mydata.data.integral,
                        transTime:5,
                        rotateDeg: 1440 + mydata.data.rotate,
                        isClick: false
                    })
                    let timer = setTimeout(function(){
                        clearTimeout(timer)
                        _this.setData({
                            btndis: false
                        })
                        wx.showModal({
                          title: '恭喜中奖',
                          content: mydata.errmsg,
                          showCancel: false,
                          confirmText: '确定',
                          success:()=>{
                            _this.setData({
                                rotateDeg: 0,
                                transTime:0,
                                isClick: true
                            })
                          }
                        })
                    },5000)
                    //_this.doRandomIntegral(parseInt(mydata.data.rotate));
                }else if(mydata.code == 206 || mydata.code == 207){
                    let userTimes = mydata.data.all_video_times - mydata.data.over_video_times
                    _this.setData({
                        userTimes: userTimes,
                        overVideoTimes: mydata.data.over_video_times,
                        allVideoTimes: mydata.data.all_video_times,
                        "winData.integral": mydata.data.integral,
                        transTime:5,
                        rotateDeg: 10800 + mydata.data.rotate,
                        isClick: false
                    })
                    let timer = setTimeout(function(){
                        _this.setData({
                            btndis: false
                        })
                        clearTimeout(timer)
                        wx.showModal({
                          title: '谢谢参与',
                          content: mydata.errmsg,
                          showCancel: false,
                          confirmText: mydata.code == 206 ? '再来一次' : '确定',
                          success:()=>{
                            _this.setData({
                                rotateDeg: 0,
                                transTime:0,
                                isClick: true
                            })
                          }
                        })
                    },5000)
                    //_this.doRandomIntegral(parseInt(mydata.data.rotate));
                }else if(mydata.code == 405){
                    _this.setData({
                        btndis: false
                    })
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        cancelText: '取消',
                        confirmText: '去观看',
                        success:(res)=>{
                          if(res.confirm){
                            _this.setData({
                                adtype: mydata.data.video
                            })
                            wx.showLoading({
                              mask: true
                            })
                            _this.userSeeVideo()
                            //_this.userGetVideo()
                          }
                        }
                      })
                }else{
                    _this.setData({
                        btndis: false
                    })
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel: false
                      })
                }
            },
            fail:function(){
                _this.setData({
                    btndis: false
                })
                app.showMyTips("网络异常，请稍后再试！");
                _this.setData({ luckydraw: false })
            }
        })
    },
    doRandomIntegral:function(_deg){
        let _this = this;
        this.setData({
            rotateDeg: 10800 + _deg,
        })
        setTimeout(function () {
            
            wx.vibrateShort();
            let timestamp = Date.parse(new Date());
            let date = new Date(timestamp);
            let year = date.getFullYear();
            let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            let hours = (date.getHours()) < 10 ? "0" + (date.getHours()) : (date.getHours());
            let min = ((date.getMinutes()) < 10 ? "0" + (date.getMinutes()) : (date.getMinutes()));
            let _data = new Date();
            _data.setTime(_data.getTime() + 24 * 60 * 60 * 1000);
            let tomorrow = _data.getFullYear() + "-" + ((_data.getMonth() + 1 < 10 ? '0' + (_data.getMonth() + 1) : _datagetMonth() + 1)) + "-" + ((_data.getDate()) < 10 ? "0" + (_data.getDate()) : _data.getDate()) + " 00:00";
            let today = year + "-" + month + "-" + day + " " + hours + ":" + min;
            _this.setData({
                rotateDeg:0,
                transTime:0,
                luckydraw:false,
                shared:false,
                "winData.isShow": true,
                "winData.stime": today,
                "winData.etime": tomorrow
            })
        }, 5200)
    },
    userChooseUcenter:function(){
        wx.reLaunch({
            url: "/pages/ucenter/ucenter"
        })
    },
    userChooseApp:function(){
        this.setData({
            showTimesTips: false
        })
        wx.navigateTo({
            url: '/pages/download/download-app',
        })
    },
    userCloseTips:function(){
        console.log("close");
        this.setData({
            showTimesTips:false
        })
    },
    initOrderLists: function () {
        let firstName = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍卻璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易";
        firstName = firstName.split("");
        let _integral = [10,10,10,10,10,10,10,100,100,300];
        let firstLen = firstName.length - 1;
        let nameArr = [];
        for (let i = 0; i < this.data.scrollname.num; i++) {
            let nameStr = firstName[this.getRand(0, firstLen)] + "先生";
            let integral = _integral[this.getRand(0, _integral.length-1)];
            nameArr.push({ name: nameStr, integral: integral });
        }

        this.setData({
            "scrollname.current": (this.data.scrollname.num / 4) -1,
            "scrollname.nameArr": this.sliceArrGroup(nameArr)
        })
    },
    closeWinbox:function(e){
        let _pay = e.currentTarget.dataset.pay;
        this.setData({"winData.isShow": false})
        if(_pay == "1"){
            wx.showModal({
                title: '温馨提示',
                content: this.data.toPaymsg,
                success:function(res){
                    if (res.confirm) {
                        wx.navigateBack({ delta: 1 })
                    }
                }
            })
        }
    },
    getRand: function (start, end) {
        if (start == 0) return Math.floor((end + 1) * Math.random());
        return Math.floor(Math.random() * end + 1);
    },
    sliceArrGroup:function(arr){
        let result = [];
        let chunk = 4;
        for (var i = 0, j = arr.length; i < j; i += chunk) {
            result.push(arr.slice(i, i + chunk));
        }
        return result;
    },
    endThisNames:function(e){
        if (e.detail.current == (this.data.scrollname.current - 1)){
            let _this = this;
            setTimeout(function(){
                _this.initOrderLists();
            }, _this.data.scrollname.interval)
        }
    },
    initUserinfo:function(){
        let _this = this;
        let userinfo = wx.getStorageSync("userInfo");
        this.setData({ userInfo:userinfo });
        app.appRequestAction({
            url:"turntable/index/",
            way:"POST",
            mask: true,
            title:"正在初始化数据",
            params:userinfo,
            success:function(res){
                let mydata = res.data;
                console.log(mydata)
                let userTimes = mydata.data.all_video_times - mydata.data.over_video_times
                if(mydata.errcode == "ok"){
                    _this.setData({
                        userTimes: userTimes,
                        allVideoTimes: mydata.data.all_video_times,
                        overVideoTimes: mydata.data.over_video_times,
                        max: mydata.data.max_times
                    })
                }else{
                    app.showMyTips(mydata.errmsg)
                }
            }
        })
    },
    
    userSeeVideo:function(){
        let _this = this;
        if (videoAd) {
            videoAd.show()
            .then(()=>{
                wx.hideLoading()
                _this.setData({
                    btndis: false
                })
            })
            .catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => {
                    videoAd.show()
                    _this.setData({
                        btndis: false
                    })
                })
                .catch(err => {
                    wx.hideLoading()
                    _this.setData({
                        btndis: false
                    })
                    //两次展示广告失败，直接获得奖励
                    console.log('两次展示广告失败，直接获得奖励')
                })
            })
        }
    },
    createVideo:function(){
        let _this = this
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: ads.videoAd
            })
            videoAd.onLoad(() => {
                
            })
            videoAd.onError((err) => {
                wx.showModal({
                  title: '温馨提示',
                  content: '广告创建失败，请重新进入！',
                  showCancel: false,
                  success:()=>{
                      wx.navigateBack()
                  }
                })
            })
            videoAd.onClose((status) => {
                
                if (status && status.isEnded || status === undefined) {
                    this.videoAdStop()
                }
                
            })
        }
    },
    videoAdStop:function(){
        let _this = this;
        let userinfo = this.data.userInfo;
        userinfo.ad = this.data.adtype
        app.appRequestAction({
            url:"/turntable/video-end/",
            way:"POST",
            title:"数据加载中",
            mask: true,
            params:userinfo,
            success:function(res){
                let mydata = res.data;
                console.log(mydata)
                if(mydata.code == 200){
                    wx.showLoading({
                      title: '视频加载中',
                      mask: true
                    })
                    _this.startTurntable()
                    
                }else if(mydata.code == 205){
                    wx.showLoading({
                        mask: true
                    })
                    _this.startTurntable()
                }else{
                    app.showMyTips(mydata.errmsg)
                }
            }
        })
    },
    userGetVideo: function() {
        if(this.data.btndis) return false;
        this.setData({
            btndis: true
        })
        let _this = this;
        let userinfo = this.data.userInfo;
        userinfo.ad = this.data.adtype
        app.appRequestAction({
            url:"turntable/show-video/",
            way:"POST",
            mask: true,
            title:"数据加载中",
            params:userinfo,
            success:function(res){
                let mydata = res.data;
                
                if(mydata.code == 200){
                    _this.setData({
                        adtype: mydata.data.video
                    })
                    _this.userSeeVideo()
                }else if(mydata.code == 410){
                    _this.setData({
                        btndis: false
                    })
                    wx.showModal({
                        title: '温馨提示',
                        content: mydata.errmsg,
                        showCancel: false,
                        confirmText: '知道了'
                      })
                }else{
                    _this.setData({
                        btndis: false
                    })
                    wx.showModal({
                      title: '温馨提示',
                      content: mydata.errmsg,
                      showCancel: false
                    })
                }
            }
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.createVideo()
        this.initSystemInfo();
        this.initOrderLists();
        this.initUserinfo();
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

})
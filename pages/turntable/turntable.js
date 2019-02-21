// pages/turntable/turntable.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        userTimes:1,
        luckydraw:false,
        bg: app.globalData.apiImgUrl + "truntable-bg.png",
        btn: app.globalData.apiImgUrl + "truntable-btn.png",
        xydzp: app.globalData.apiImgUrl + "xydzp.png",
        bgHeight:337.5,
        btnWidth: 51.68611596067261,
        wordsHeight: 71.2589,
        wordsWidth: 300,
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
            num:200,
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
        showTimesTips:false
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
        let _this = this;
        if (this.data.luckydraw) return false;
        if (!this.data.shared){
            this.setData({ isShare : true })
            return false;
        }
        if (this.data.userTimes == 0) {
            this.setData({
                showTimesTips:true
            })
        }else{
            _this.setData({ luckydraw:true })
            let userInfo = this.data.userInfo;
            app.appRequestAction({
                url:"integral/roundabout/",
                way:"POST",
                params: userInfo,
                success:function(res){
                    let mydata = res.data;
                    if(mydata.errcode == "ok"){
                        _this.setData({ 
                            toPaymsg: mydata.toPayMsg,
                            topay: mydata.toPay,
                            "winData.integral": mydata.errmsg,
                            transTime:5
                        })
                        _this.doRandomIntegral(parseInt(mydata.angle));
                    }else{
                        app.showTimesTips(mydata.errmsg);
                    }
                },
                fail:function(){
                    app.showMyTips("网络异常，请稍后再试！");
                    _this.setData({ luckydraw: false })
                }
            })
        }
        
    },
    doRandomIntegral:function(_deg){
        let _this = this;
        this.setData({
            rotateDeg: 10800 + _deg,
            userTimes: (_this.data.userTimes - 1)
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
        let lastName = ["浪","涛", "鑫", "进", "帅", "博", "洪", "越", "丹", "红", "梅", "军", "均", "慧", "奇", "杰", "琼", "鸣", "芳", "伟", "娜", "敏", "静", "丽", "强", "磊", "洋", "勇", "超", "霞", "平", "刚", "元", "豪", "泽", "轩", "宇", "梓", "彤", "涵", "峰", "鹏", "龙", "德", "德", "武", "昌", "耀", "安", "通", "宁", "健", "建", "华", "宝", "浩", "竣", "佳", "烨", "瑞", "宏", "言", "夏", "山", "玉", "清", "壮", "凯", "恒 ", "贤", "阳", "波", "才", "哲", "运", "威", "立", "朗", "坚", "振", "昊", "忠"];
        let _integral = [1,2,3,5,50,100];
        let firstLen = firstName.length - 1;
        let lastLen = lastName.length - 1;
        let nameArr = [];
        for (let i = 0; i < this.data.scrollname.num; i++) {
            let nameStr = (this.getRand(2, 3) == 2) ? (firstName[this.getRand(0, firstLen)] + "*") : (firstName[this.getRand(0, firstLen)] + "*" + lastName[0, this.getRand(0, lastLen)]);
            let integral = _integral[this.getRand(0, 5)];
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
            url:"integral/init-round/",
            way:"POST",
            title:"正在初始化数据",
            params:userinfo,
            success:function(res){
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                    _this.setData({
                        userTimes: parseInt(mydata.lessNumber)
                    })
                }
            }
        })
    },
    userShareAction:function(){
        let userInfo = this.data.userInfo;
        app.doRequestAction({
            url:"user/big-share/",
            way:"POST",
            params: userInfo
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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

        this.userShareAction();
        let userId = this.data.userInfo.userId
        let _this = this;
        setTimeout(function () {
            _this.setData({ isShare: false,shared:true })
        }, 500);
        return {
            title: '全国建筑工地招工平台',
            path: '/pages/index/index?refid=' + userId,
            imageUrl: "http://yupao.oss-cn-beijing.aliyuncs.com/miniprogram/images/minishare.png"
        }
    }
})
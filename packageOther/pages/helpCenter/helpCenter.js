// pages/ucenter/ucenterNew/helpCenter.js 
const app = getApp();
Page({
    data: {
        // 向右的方向箭头
        rightarrow: app.globalData.apiImgUrl + "new-center-rightarrow.png",
        // 搜索框Icon
        searchIcon: app.globalData.apiImgUrl + "yc/helpCenter-search.png",
        isEnd: false,
        page:1,
        helpeLists:[],
        // 点击一级标题展示二级标题
        showDetail:false,
        // 手机系统ios或者andriod
        system:"",
        // 检索结果数组
        searchLists: [],
        // 搜索结果框是否显示
        showSearch: false
    },
    // 搜索框输入类型搜索问题
    getSearchList: function (e) {
        // 获取输入内容
        let content = e.detail.value;
        // 获取问题数据
        let helpeLists = this.data.helpeLists;
        // 检索结果的数据
        let searchLists =[];
        // 如果输入框内容不为空，才进行匹配
        if (content.length != 0) {
            // 找到与搜索关键词匹配的问题数据
            searchLists = helpeLists.reduce((pre,item)=>{
                // pre当前最新的检索数组
                let searchArray = pre
                // 获取data中二维数据quesitons
                let questions = item.questions
                // 遍历quesitons中每一项如果有跟输入内容匹配的数据就添加到searchArray中
                for (let question of questions) {
                    let questionStr = question.question
                    if (questionStr.includes(content)) searchArray.push(question)
                }
                // 返回检索结果数据
                return searchArray
            },[])
        }else searchLists=[] //如果将输入内容置空将检索结果数组也置空
        // 将结果数据存入data中
        this.setData({ 
            searchLists: searchLists,
            showSearch: searchLists.length == 0 ? false:true
         })
    },
    //点击最外层列表展开收起
    listTap(e) {
        //获取点击的下标值
        let aIndex = e.currentTarget.dataset.parentindex, 
        helpeLists = this.data.helpeLists;
        //变换其打开、关闭的状态
        helpeLists[aIndex].show = !helpeLists[aIndex].show || false; 
        //如果点击后是展开状态，则让其他已经展开的列表变为收起状态
        if (helpeLists[aIndex].show) { 
          this.packUp(helpeLists, aIndex);
        }
        this.setData({
            helpeLists
        });
    },
    //让所有的展开项，都变为收起
    packUp(data, index) {
        for (let i = 0, len = data.length; i < len; i++) { //其他最外层列表变为关闭状态
            if (index != i) {
                data[i].show = false;
            }
        }
    },
    // 将问题列表数据存入缓存中
    setStorage: function (data) {
        let questions = data.reduce((pre,item)=>{
            return [...pre, ...item.questions]
        },[])
        wx.setStorageSync('questionList', questions)
    },
    // 获取帮助中心问题列表数据
    getHelpeData: function() {
        let _this = this;
        wx.showLoading({ title: '数据加载中' })
        // 获取手机设备的平台信息ios或者Android
        _this.initGetIntegralList()
        app.appRequestAction({
            url: "/others/feedback-tree/",
            params: {
                system:_this.data.system,
            },
            success: function(res) {
                wx.hideLoading();
                let mydata = res.data;
                if (mydata.errcode == "ok") {
                    let lists = mydata.data;
                    _this.setData({
                        helpeLists: lists
                    })
                    _this.setStorage(lists)
                } else {
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: 'none',
                        duration: 5000
                    })
                }
            },
            fail: function(err) {
                wx.hideLoading();
                wx.showToast({
                    title: '加载失败，请稍后重试！',
                    icon: 'none',
                    duration: 5000
                })
            }
        })
    },
    // 获取当前设备平台信息ios或者android
    initGetIntegralList:function(){
        let _this = this;
        app.initSystemInfo(function(res){
            if (res && res.platform == "ios"){
                _this.setData({
                    system: 'ios'
                })
            }else if( res && res.platform != "ios"){
                _this.setData({
                    system: 'android'
                })
            }
        })
    },
    // 去问题答案详情页面
    findAnswer: function (e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url,
        })
        this.setData({showSearch: false})
    },
    // 搜索输入框获取焦点的时候如果输入框有搜索结果显示搜索结果框
    showSearch: function () {
        let searchLists = this.data.searchLists
        this.setData({showSearch: searchLists.length == 0 ? false:true})
    },
    // 搜索输入框失去焦点隐藏结果
    hiddenSearch: function () {
        this.setData({showSearch: false})
    },
    // 点击我的反馈跳转到我的反馈列表
    goFeedback: function () {
        wx.navigateTo({
          url: '/packageOther/pages/others/message/lists/lists',
        })
    },
    // 点击去发布意见反馈
    goPublishFeedback: function () {
        wx.navigateTo({
            url: '/packageOther/pages/others/message/publish/publish',
        })
    },
    onLoad: function(options) {
        this.getHelpeData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
    
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if(this.data.isEnd) return false;
        this.getHelpeData()
    }
})
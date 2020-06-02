// pages/course/course.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courseIndex:0,
        playId:0,
        courseData:[
            {
                title:'招工老板',
                normalImg: app.globalData.apiImgUrl + "course-laoban.png",
                activeImg: app.globalData.apiImgUrl + "course-laoban-active.png",
                lists:[]
            },
            {
                title: '工人师傅',
                normalImg: app.globalData.apiImgUrl + "course-geren.png",
                activeImg: app.globalData.apiImgUrl + "course-geren-active.png",
                lists: []
            }
        ]
    },
    showThisCourse:function(e){
        //console.log(e);
        let index = e.currentTarget.dataset.index;
        this.setData({
            courseIndex: index
        })
    },
    showThisCourseInfo:function(e){
        let _id = e.currentTarget.dataset.id;
        this.setData({ 
            playId: (this.data.playId == _id) ? 0 : _id
         })
    },
    getCourseData:function(){
        let _this = this;
        wx.showLoading({ title: '数据加载中' })
        app.doRequestAction({
            url:"index/course/",
            success:function(res){
                wx.hideLoading();
                let mydata = res.data;
                if(mydata.errcode == "ok"){
                    _this.setData({
                        "courseData[0].lists": mydata.masterList,
                        "courseData[1].lists": mydata.userList
                    })
                }else{
                    wx.showToast({
                        title: mydata.errmsg,
                        icon: 'none',
                        duration: 5000
                    })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: '使用教程加载失败，请稍后重试！',
                    icon:'none',
                    duration:5000
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCourseData();
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

})
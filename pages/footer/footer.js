const app = getApp()
Page({
    data: {
        publishActive: false,
        showPublishBox: false
    },
    // console.log(this.data,"globalData")
    doPublishAction: function () {
        let _this = this;
        this.setData({
            showPublishBox: true
        })
        setTimeout(function () {
            _this.setData({
                publishActive: true
            })
        }, 0)
    },
    closePublishAction: function () {
        let _this = this;
        this.setData({
            publishActive: false
        })
        setTimeout(function () {
            _this.setData({
                showPublishBox: false
            })
        }, 500)
    },

})

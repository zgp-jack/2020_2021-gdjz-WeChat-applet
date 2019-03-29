const _url = "http://cdn.yupao.com/miniprogram";
const footerImgs = {
    homeNormal: "/images/footer-home.png",
    homeActive:"/images/footer-home-active.png",
    zgNormal: "/images/footer-zg.png",
    zgActive: "/images/footer-zg-active.png",
    publish: "/images/footer-publish.png",
    zhNormal: "/images/footer-zh.png",
    zhActive: "/images/footer-zh-active.png",
    memberNormal: "/images/footer-member.png",
    memberActive: "/images/footer-member-active.png",
}

function doPublishAction (_this) {
    _this.setData({
        showPublishBox: true
    })
    setTimeout(function () {
        _this.setData({
            publishActive: true
        })
    }, 0)
}
function closePublishAction(_this) {
    _this.setData({
        publishActive: false
    })
    setTimeout(function () {
        _this.setData({
            showPublishBox: false
        })
    }, 500)
}
function valiUserCard(_this,app,userInfo){
    app.appRequestAction({
        title:"正在加载名片",
        url:"resume/judge-resume/",
        way:"POST",
        params: userInfo,
        failTitle:"网络异常，请稍后再试！",
        success:function(res){
            let mydata = res.data;
            if (mydata.errcode == "ok"){
                wx.navigateTo({
                    url: (mydata.hasResume == "1") ? "/pages/mycard/mycard" : "/pages/publish/card/card"
                })
            }else{
                app.showMyTips(mydata.errmsg);
            }
            
        },

    })
}

module.exports = {
    footerImgs: footerImgs,
    publishActive: false,
    showPublishBox: false,
    doPublishAction: doPublishAction,
    closePublishAction: closePublishAction,
    valiUserCard: valiUserCard
}
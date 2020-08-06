const _url = "http://cdn.yupao.com/miniprogram";
const app = getApp();

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
  pubicon: "/images/yupao-footer-publish-btnimg.png",
}

function initMsgNum(_this){
  app.getUserMsg((infoNum,msgNum)=>{
    _this.setData({
      "footerImgs.infoNumber": infoNum,
      "footerImgs.msgsNumber": msgNum
    })
  })
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
  app.globalData.showdetail = true
  wx.navigateTo({
    url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
  })

  return false;
  if (!userInfo) {
    wx.navigateTo({
      url: '/pages/publish/card/card?u=0',
    })
  } else {
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
}

module.exports = {
    footerImgs: footerImgs,
    publishActive: false,
    showPublishBox: false,
    doPublishAction: doPublishAction,
    closePublishAction: closePublishAction,
    valiUserCard: valiUserCard,
    initMsgNum: initMsgNum
}
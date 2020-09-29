// components/issueok/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tipdata: Object,
    thisLstData: Object
  },
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    userInfo: false,
    icon: app.globalData.apiImgUrl + 'mini-fast-success-icon.png',
    close: app.globalData.apiImgUrl + 'mini-close-icon.png',
    buttontext:{
      "close":"取消",
      "comfirm":"确定"
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show:function(){
      this.setData({
        show: !this.data.show
      })
    },
    comfirm:function () {
    let topdata = this.properties.thisLstData; //当前数据
    let isCheck = topdata.is_check;//用户审核状态
    this.show()
      //去增加曝光率
      if(this.properties.tipdata.tip_type == "day_first"){
        wx.navigateTo({
          url: `/pages/workingtopAll/workingtop/workingtop?id=${this.properties.tipdata.job_id}&topId=undefined&city_id=${topdata.area_id}&province_id=${topdata.province_id}&ischeck=${isCheck}`,
        })
      }else{
        //去发布
        wx.redirectTo({
          url: '../../pages/fast/issue/index',
        })
      }
    },
    close:function () {
      this.show()
    }
  },
  ready:function() {
    let tipdata = this.properties.tipdata
    if(tipdata){
      //当日第一次发布
      if(tipdata.tip_type == "day_first") {
        this.setData({
          "buttontext.close":"暂不提醒",
          "buttontext.comfirm":"去增加曝光率",
        })
      }
      //最后一次发布
      if(tipdata.tip_type == "day_last") {
        debugger
        this.setData({
          "buttontext.close":"不了，谢谢",
          "buttontext.comfirm":"去发布",
        })
      }
    }
  }
})

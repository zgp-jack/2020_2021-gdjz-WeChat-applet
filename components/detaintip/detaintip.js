// components/issueok/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tipdata: {
      type:Object,
      value:null
    },
    thisLstData:  {
      type:Object,
      value:null
    },
    ConfigData:  {
      type:Object,
      value:null
    },
    tipstr: {
      type:Array,
      value:null
    },
    successData:{
      type:Object,
      value:null
    }
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
      this.show()
      // 是否是置顶成功
      if(!this.properties.successData){
        let topdata = this.properties.thisLstData; //当前数据
        let isCheck = topdata.is_check;//用户审核状态
        //去增加曝光率
        if(this.properties.tipdata.tip_type == "day_first"){
          wx.navigateTo({
            url: `/pages/workingtopAll/workingtop/workingtop?id=${this.properties.tipdata.job_id}&topId=undefined&city_id=${topdata.area_id}&province_id=${topdata.province_id}&ischeck=${isCheck}`,
          })
        }else if(this.properties.tipdata.tip_type == "day_last"){
            wx.redirectTo({
              url: '/pages/fast/issue/index',
            })
        }else{
          //去发布
          wx.redirectTo({
            url: '/pages/fast/issue/index',
          })
        }
      }else {
        //去招工列表
        wx.reLaunch({
          url: '/pages/published/recruit/list',
        })
      }
       
    },
    close:function () {
      if(!this.properties.successData){
        let tipdata = this.properties.tipdata
        if(tipdata.tip_type == "day_first"){
          this.notip();
        }
      }else{
         //去找活列表
         wx.redirectTo({
          url: '/pages/clients-looking-for-work/finding-name-card/findingnamecard',
        })
      }
      this.show()
    },
    notip:function () {
      app.appRequestAction({
        url:"/fast-issue/hide-tips/",
        way:"GET"
      })
    },
  },
  ready:function() {
    if(this.properties.tipdata){
      let tipdata = this.properties.tipdata
      //当日第一次发布
      if(tipdata.tip_type == "day_first") {
        this.setData({
          "buttontext.close":"暂不提醒",
          "buttontext.comfirm":"去增加曝光率",
        })
      }
      //最后一次发布
      if(tipdata.tip_type == "day_last") {
        this.setData({
          "buttontext.close":"不了，谢谢",
          "buttontext.comfirm":"去发布",
        })
      }
    }
    //如果是置顶成功
    if(this.properties.successData) {
      this.setData({
        "buttontext.close":"查看工人简历",
        "buttontext.comfirm":"管理招工信息",
      })
    }
  }
})

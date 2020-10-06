// components/issueok/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tipdata: {
      type:Object,
      value:false
    },
    payreleasetip:{
      type:Array,
      value:null
    },
    dayMaxData:{
      type:Object,
      value:false
    },
    dayMax:{
      type:Array,
      value:null
    },
    tipstr:{
      type:Array,
      value:null
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    userInfo: false,
    buttontext:{
      "close":"不了，谢谢",
      "comfirm":"确认发布"
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
    comfirm:function (e) {
      if(this.properties.payreleasetip.length) {
        let issue = 1
        this.triggerEvent('mycomfirm',issue)
      }
      this.show()
      if(this.properties.tipstr.length){
        wx.redirectTo({
          url: '/pages/getintegral/getintegral',
        })
      }
      this.setData({
        tipdata : null,
        payreleasetip: null,
        dayMaxData:null,
        dayMax:null,
        tipstr:null
      })
    },
    close:function () {
      this.show()
      this.setData({
        tipdata : null,
        payreleasetip: null,
        dayMaxData:null,
        dayMax:null,
        tipstr:null
      })
    },
  },
  ready:function() {
  }
})

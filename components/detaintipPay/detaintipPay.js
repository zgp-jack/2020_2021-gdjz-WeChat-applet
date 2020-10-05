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
      value:[]
    },
    dayMaxData:{
      type:Object,
      value:false
    },
    dayMax:{
      type:Array,
      value:[]
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    userInfo: false,
    buttontext:{
      "close":"取消发布",
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
      let issue = 1
      this.triggerEvent('mycomfirm',issue)
    },
    close:function () {
      this.show()
    },
  },
  ready:function() {
  }
})

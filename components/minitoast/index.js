// components/minitoast/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    msg: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showToast:function(msg){
      this.setData({show: true,msg: msg})
      setTimeout(()=>{
        this.setData({show:false, msg: ''})
      },3000)
    }
  }
})

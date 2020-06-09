// components/downapptips/index.js
Component({
  options:{
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    aid:{
      type: String,
      value: '',
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    showdownapp: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showaction:function(){
      this.setData({
        showdownapp: !this.data.showdownapp
      })
    }
  }
})

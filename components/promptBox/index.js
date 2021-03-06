// components/promptBox/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '温馨提示'
    },
    // 是否展示标题
    showTitle: {
      type: Boolean,
      value: true
    },
    showIcon: {
      type: Boolean,
      value: false
    },
    //是否显示取消按钮
    showCancel: {
      type: Boolean,
      value: true
    },
    //取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    //取消按钮颜色
    cancelColor: {
      type: String,
      value: '#000000'
    },
    //确定按钮的文字
    confirmText: {
      type: String,
      value: '确定'
    },
    //确定按钮的颜色
    confirmColor: {
      type: String,
      value: '#576B95'
    },
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    // 发布提示icon图标
    icon: {
      type: String,
      value: ""
    },
    // 发布提示内容
    content: {
      type: Array,
      value: []
    },
    // 详细描述信息
    des: {
      type: String,
      value: ""
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      value: false
    },
    // 关闭弹窗icon
    closeIcon: {
      type: String,
      value: app.globalData.apiImgUrl + 'mini-close-icon.png',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示promptBox框
    show: function(){
      this.setData({
        show: true
      })
    },
    close() {
      this.setData({
        show: false,
        title: '提示',
        showTitle: true,
        showIcon: false,
        showCancel: true,
        confirmText:'确定',
        cancelText:'取消',
        confirmColor:'#576B95',
        cancelColor:'#000000',
        content: [],
        showClose: false
      })
      this.triggerEvent('close')
    },
    // 取消函数
    cancel() {
      this.setData({
        show: false,
        title: '提示',
        showTitle: true,
        showIcon: false,
        showCancel: true,
        confirmText:'确定',
        cancelText:'取消',
        confirmColor:'#576B95',
        cancelColor:'#000000',
        content: [],
        showClose: false
      })
      this.triggerEvent('cancel')
    },
    // 确认函数
    confirm() {
      this.setData({
        show: false,
        title: '提示',
        showTitle: true,
        showIcon: false,
        showCancel: true,
        confirmText:'确定',
        cancelText:'取消',
        confirmColor:'#576B95',
        cancelColor:'#000000',
        content: [],
        showClose: false
      })
      this.triggerEvent('confirm')
    }
  }
})

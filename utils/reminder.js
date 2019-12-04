const rem = function (obj) {
  wx.showModal({
    title: '温馨提示',
    content: `请选择您的${obj.tips}`,
    showCancel: false,
    success(res) {
      obj.callback ? obj.callback() : "";
    }
  })
}

module.exports = {
  reminder: rem
}
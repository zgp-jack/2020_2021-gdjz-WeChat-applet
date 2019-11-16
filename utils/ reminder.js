const rem = function (obj) {
  wx.showModal({
    title: '温馨提示',
    content: `您输入的${obj.tips}为空,请重新输入`,
    showCancel: false,
    success(res) {
      obj.callback ? obj.callback() : "";
    }
  })
}

module.exports = {
  reminder: rem
}
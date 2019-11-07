const rem = function (obj){
  wx.showModal({
    title: obj.title || '温馨提示',
    content: obj.tips,
    showCancel: obj.hasOwnProperty('cancel') ? obj.cancel : false,
    success(res) {
      obj.callback ? obj.callback() : ""; 
    }
  })
}

module.exports = {
   remain:rem
}
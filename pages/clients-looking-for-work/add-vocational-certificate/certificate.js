
Page({
  data: {
    date: "",
    region: "",
    imgArrs: [],
    idArrs: []
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  changeRegin(e) {
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },
  previewImage(e) {
    console.log(e)
    let that = this
    wx.previewImage({
      urls: that.data.imgArrs,
      current: e.target.dataset.item,
    })
  },
  chooseImage() {
    let that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const path = res.tempFilePaths[0]
        if (that.data.imgArrs.length >= 5) {
          return
        }
        that.data.imgArrs.push(path)
        // that.data.idArrs.push(id)
        that.setData({
          imgArrs: that.data.imgArrs,
          // idArrs: that.data.idArrs
        })

        wx.uploadFile({
          url: '要上传的地址',
          filePath: path,
          name: 'image',
          success: (res) => {
            console.log(res)
            // 根据查看结果是否需要json化
            let { url, id } = JSON.parse(res.data).data
            console.log(url)
            console.log(id)
            that.data.imgArrs.push(url)
            that.data.idArrs.push(id)
            that.setData({
              imgArrs: that.data.imgArrs,
              idArrs: that.data.idArrs
            })
            console.log(that.data.imgArrs)
            console.log(that.data.idArrs)

          }
        })
      }
    })
  },
})
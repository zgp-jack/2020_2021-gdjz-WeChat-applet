// pages/basic-information/information.js
var amapFile = require('../../utils/amap-wx.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: "",
    evaluation: [],
    detailevaluation: ["努力上进", "一直加班", "吃苦耐劳1", "吃苦耐劳2"],
    detailevaluationo: ["吃苦耐劳", "刻苦勤奋", "努力劳动", "发奋条哈", ],
    regionone: "",
    oimg: "../../images/touxiang.png",
    array: ["男", "女"],
    typeworkarray: ["小工", "中工", "大工"],
    proficiencyarray: ["熟悉", "很牛", "特牛"],
    compositionarray: ["木工", "水工", "电工"],
    date: "",
    nationalarray: ["汉族", "壮族", "藏族", "彝族", "裕固族", "瑶族", "锡伯族", "乌孜别克族", "维吾尔族", "佤族", "土家族", "土族", "塔塔尔族", "塔吉克族", "水族", "畲族", "撒拉族", "羌族", "普米族", "怒族", "纳西族", "仫佬族", "苗族", "蒙古族", "门巴族", "毛南族", "满族", "珞巴族", "僳僳族", "黎族", "拉祜族", "柯尔克孜族", "景颇族", "京族", "基诺族", "回族", "赫哲族", "哈萨克族", "哈尼族", "仡佬族", "高山族", "鄂温克族", "俄罗斯族", "鄂伦春族", "独龙族", "东乡族", "侗族", "德昂族", "傣族", "达斡尔族", "朝鲜族", "布依族", "保安族", "布朗族", "白族", "阿昌族", "汉族"]
  },
  GPSsubmit: function() {
    this.getLocation();
  },
  clock(e) {
    let off = true;
    for (let i = 0; i < this.data.evaluation.length; i++) {
      if (this.data.evaluation[i] == e.currentTarget.dataset.id) {
        this.data.evaluation.splice(i, 1)
        off = false;
      }
    }
    if (this.data.evaluation.length >= 3) {
      return
    }
    if (off) {
      this.data.evaluation.push(e.currentTarget.dataset.id)
    }
    console.log(this.data.evaluation.length)
  },
  userTapAddress: function () {
    console.log(123)
    wx.navigateTo({
      url: '/pages/selectmap/smap',
    })
  },
  bindcompositionone(e) {
    this.setData({
      indexcomposition: e.detail.value
    })
  },
  bindproficiencyone(e) {
    console.log(e)
    this.setData({
      indexproficiency: e.detail.value
    })
  },
  bindTypeworkone(e) {
    this.setData({
      index: e.detail.value
    })
  },
  getLocation: function() {
    var _this = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.globalData.gdApiKey
    }); //key注册高德地图开发者
    myAmapFun.getRegeo({
      success: function(data) {
        console.log(data);
        let oname = data[0].name + ' ' + data[0].desc;
        if (oname.length >= 10) {
          let onamesplit = oname.slice(0, 10) + '...';
          _this.setData({
            regionone: onamesplit
          });
        } else {
          _this.setData({
            regionone: data[0].name + ' ' + data[0].desc
          });
        }
      },
      fail: function(info) {
        console.log("getLocation fail");
        wx.showModal({
          title: info.errMsg
        });
        _this.setData({
          result: '获取位置失败！'
        });
      }
    });
  },
  changeRegin(e) {
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },
  changeReginone(e) {
    console.log(e.detail.value)
    this.setData({
      regionone: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },
  bindPickernational(e) {
    this.setData({
      nationalindex: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  chooseImage() {
    let that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        that.setData({
          oimg: res.tempFilePaths[0]
        })
        wx.uploadFile({
          url: '要上传的地址',
          filePath: path,
          name: 'image',
          success: (res) => {
            console.log(res)
            // 根据查看结果是否需要json化
            let {
              url,
              id
            } = JSON.parse(res.data).data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
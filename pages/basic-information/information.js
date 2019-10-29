// pages/basic-information/information.js
var amapFile = require('../../utils/amap-wx.js');
let areas = require("../../utils/area.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [[], []],
    objectMultiArray: [
      [], []
    ],
    region: "",
    evaluation: [],
    detailevaluation: [],
    regionone: "",
    oimg: "../../images/touxiang.png",
    array: [],
    typeworkarray: [],
    proficiencyarray: [],
    compositionarray: [],
    date: "",
    nationalarray: [],
    person: "",
    judge: false
  },
  GPSsubmit: function () {
    this.getLocation();
  },

  clock(e) {
    let that = this;
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

    let odetailevaluation = this.data.detailevaluation
    if (odetailevaluation[e.currentTarget.dataset.index - 1].classname != "oinformationnosave"){
      odetailevaluation[e.currentTarget.dataset.index - 1].classname = "oinformationnosave"
      that.setData({
         detailevaluation: odetailevaluation
      })
    }else{
      odetailevaluation[e.currentTarget.dataset.index - 1].classname = "informationnosave"
      that.setData({
        detailevaluation: odetailevaluation
      })
    }

  },

  userTapAddress: function () {
    wx.navigateTo({
      url: '/pages/selectmap/smap',
    })
  },
  personnelpositionone(e) {
    this.setData({
      indexperson: e.detail.value,
      judge: true
    })
  },
  bindproficiencyone(e) {

    this.setData({
      indexproficiency: e.detail.value
    })
  },
  bindTypeworkone(e) {
    this.setData({
      index: e.detail.value
    })
  },
  getLocation: function () {
    var _this = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.globalData.gdApiKey
    }); //key注册高德地图开发者
    myAmapFun.getRegeo({
      success: function (data) {
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
      fail: function (info) {
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

    this.setData({
      region: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },
  changeReginone(e) {

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
  bindPickerChange: function (e) {
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


  getlocationdetails() {
    let historyregionone = wx.getStorageSync("historyregionone");
    if (historyregionone) {
      this.setData({
        regionone: historyregionone
      })
      wx.removeStorageSync('historyregionone')
    }
  },
  accessprovince() {
    let that = this;
    app.doRequestAction({
      url: 'resumes/get-data/',
      way: 'GET',
      success(res) {
        let nationalarray = [];
        let alllabel = [];
        let typeworkarray = [];
        let proficiencyarray = [];
        let compositionarray = [];
        let array = []
        for (let i = 0; i < res.data.nation.length; i++) {
          nationalarray.push(res.data.nation[i].mz_name)
        }
        for (let i = 0; i < res.data.label.length; i++) {
          res.data.label[i].classname = "informationnosave"
        }
        for (let i = 0; i < res.data.occupation.length; i++) {
          typeworkarray.push(res.data.occupation[i].name)
        }
        for (let i = 0; i < res.data.prof_degree.length; i++) {
          proficiencyarray.push(res.data.prof_degree[i].name)
        }
        for (let i = 0; i < res.data.type.length; i++) {
          compositionarray.push(res.data.type[i].name)
        }
        for (let i = 0; i < res.data.gender.length; i++) {
          array.push(res.data.gender[i].name)
        }

        that.setData({
          nationalarray: nationalarray,
          detailevaluation: res.data.label,
          typeworkarray: typeworkarray,
          proficiencyarray: proficiencyarray,
          compositionarray: compositionarray,
          array: array
        })

      }
    })
  },







initAllProvice: function () { //获取所有省份
    let arr = app.arrDeepCopy(areas.getPublishArea());
    console.log(arr)
    let provice = [];
    let provicemore = [];
    let provicechild = [];
    let provicechildmore = [];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let data = { id: arr[i].id, pid: arr[i].pid, name: arr[i].name }
      let dataone = arr[i].name 
      provice.push(data)
      provicemore.push(dataone)
      for (let j = 0; j < arr[i].children.length; j++) {
        if (arr[i].children[j].id){
        let datachild = { id: arr[i].children[j].id, pid: arr[i].children[j].pid, name: arr[i].children[j].name }
          let datachildone = arr[i].children[j].name
          provicechild.push(datachild)
          provicechildmore.push(datachildone)
        }else{
          let datachildone = arr[i].name
          provicechildmore.push(datachildone)
        }
     

      }
    }
  console.log(provicechild)
  console.log(provicechildmore)
  console.log(provice)
  console.log(provicechild)
    this.setData({
      multiArray: [provicemore, provicechildmore],
      objectMultiArray: [provice, provicechild]
    })
    console.log(provice)
    // return provice;
  },
  bindMultiPickerChange: function (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log(e)
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:

            break;
          case 1:

            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
           
            break;
          case 1:

            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.accessprovince();
    this.initAllProvice()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getlocationdetails()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
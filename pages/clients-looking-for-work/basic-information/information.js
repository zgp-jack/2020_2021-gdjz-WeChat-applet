// pages/basic-information/information.js
var amapFile = require('../../../utils/amap-wx.js');
let areas = require("../../../utils/area.js");
const app = getApp();
// bindPickerChange
//is_check
//workIndexvalue
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    multiArrayone: [],
    multiArray: [],
    objectMultiArray: [
    ],
    multiIndexvalue:"",
    multiIndex: [0, 0],
    multiworkIndex: [0, 0],
    allprovinces:[],
    region: "",
    evaluation: [],
    detailevaluation: [],
    regionone: "",
    oimg: "../../../images/touxiang.png",
    array: [],
    typeworkarray: [],
    typeworkarrayone: [],
    objecttypeArray: [
    ],
    proficiencyarray: [],
    compositionarray: [],
    complexwork:[],
    complexworkid: [],
    date: "",
    name:"",
    telephone:0,
    sex:"",
    nation:"",
    index:"",
    birthday:"",
    nationalarray: [],
    person: "",
    judge: false,
    showWorkType: false,
    pindex: 0,
    cindex: 0,
    workIndexvalue:'请选择工种'
  },
  GPSsubmit: function () {
    this.getLocation();
  },
  name(e){
    this.setData({
      name: e.detail.value
    })
  },
  telephone(e){
    this.setData({
      telephone: e.detail.value
    })
  },
  sex: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  nation(e) {
    this.setData({
      nation: e.detail.value
    })
  },
  typeworkone(e) {
    console.log(e)
    this.setData({
      index: e.detail.value
    })
  },
  birthday(e){
    this.setData({
      birthday: e.detail.value
    })
  },
  typeworktwo(){
    this.setData({
      showWorkType: true
    })
  },
  clock(e) {   //标签选择的处理
    let that = this;
    let off = true;
    for (let i = 0; i < this.data.evaluation.length; i++) {
      if (this.data.evaluation[i] === e.currentTarget.dataset.index) {
        this.data.evaluation.splice(i, 1)
        off = false;
      }
    }
    if (this.data.evaluation.length >= 3) {
      return
    }
 
    if (off) {
      this.data.evaluation.push(e.currentTarget.dataset.index)
    }
    let odetailevaluation = this.data.detailevaluation
    if (odetailevaluation[e.currentTarget.dataset.index - 1].classname != "oinformationnosave") {
      odetailevaluation[e.currentTarget.dataset.index - 1].classname = "oinformationnosave"
      that.setData({
        detailevaluation: odetailevaluation
      })
    } else {
      odetailevaluation[e.currentTarget.dataset.index - 1].classname = "informationnosave"
      that.setData({
        detailevaluation: odetailevaluation
      })
    }

  },

  userTapAddress: function () {
    wx.navigateTo({
      url: '/pages/clients-looking-for-work/selectmap/smap',
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

  getLocation: function () {   //定位获取
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

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  chooseImage() {     //图片的上传
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


  getlocationdetails() {   //所在地区的位置
    let historyregionone = wx.getStorageSync("historyregionone");
    if (historyregionone) {
      this.setData({
        regionone: historyregionone.title
      })
      wx.removeStorageSync('historyregionone')
    }
  },
  accessprovince() {  //大部分piker需要的数据
    let that = this;
    app.doRequestAction({
      url: 'resumes/get-data/',
      way: 'GET',
      success(res) {
        console.log(res)
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
            typeworkarray: res.data.occupation
          })
        console.log(that.data.typeworkarray)

        for (let i = 0; i < that.data.typeworkarray.length; i++) {
          for (let j = 0; j < that.data.typeworkarray[i].children.length; j++){
            that.data.typeworkarray[i].children[j].is_check = false
          }
        }
        that.setData({
          typeworkarray: that.data.typeworkarray
        })
             that.setData({
          nationalarray: nationalarray,
          detailevaluation: res.data.label,
          proficiencyarray: proficiencyarray,
          compositionarray: compositionarray,
          array: array
        })

      }
    })
  },

  initAllProvice: function () { //获取所有省份
    let that = this;
    let arr = app.arrDeepCopy(areas.getPublishArea());
    this.setData({
      allprovinces: arr
    })
    let provice = [];
    let provicemore = [];
    let provicechild = [];
    let provicechildmore = [];
    let array = [];
    let arrayname = [];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let data = { id: arr[i].id, pid: arr[i].pid, name: arr[i].name }
      let dataone = arr[i].name

      provice.push(data)
      provicemore.push(dataone)
      array[i] = [];
      arrayname[i] = []
      if (arr[i].children.length == 0) {
        array[i].push(arr[i])
        arrayname[i].push(arr[i].name)
      }
      for (let j = 0; j < arr[i].children.length; j++) {
        if (arr[i].children[j].id) {
          let datachild = { id: arr[i].children[j].id, pid: arr[i].children[j].pid, name: arr[i].children[j].name }

          if (arr[i].children[j].pid - 2 == i) {
            array[i].push(arr[i].children[j])
            arrayname[i].push(arr[i].children[j].name)
          }
        } else {
          let datachildone = arr[i].name
          provicechildmore.push(datachildone)
        }
      }
      provicechild.push(array[i])
      provicechildmore.push(arrayname[i])
    }
    this.setData({
      multiArrayone: [provicemore, provicechildmore],
      // multiArray: [provicemore, that.data.multiArrayone[1][0]],
      objectMultiArray: [provice, provicechild]
    })
    this.setData({
      multiArray: [provicemore, that.data.multiArrayone[1][0]],
      objectMultiArray: [provice, provicechild]
    })
  },
  bindMultiPickerChange: function (e) {    //最终家乡的选择
    let that = this; 
    this.setData({
      multiIndex: e.detail.value
    })
    let allpro = '';
    if (this.data.allprovinces[this.data.multiIndex[0]].children.length != 0){
 
    allpro = this.data.allprovinces[this.data.multiIndex[0]].id +","+ this.data.allprovinces[this.data.multiIndex[0]].children[this.data.multiIndex[1]].id
      this.setData({
        multiIndexvalue: that.data.allprovinces[that.data.multiIndex[0]].name + that.data.allprovinces[that.data.multiIndex[0]].children[that.data.multiIndex[1]].name
    })
    } else {
      allpro = this.data.allprovinces[this.data.multiIndex[0]].id
      this.setData({
        multiIndexvalue: that.data.allprovinces[that.data.multiIndex[0]].name + that.data.allprovinces[that.data.multiIndex[0]].name
      })
    } 
  },

  bindMultiPickerColumnChange: function (e) {   //下滑家乡列表所产生的函数
    let that = this;
    let namearry = this.data.multiArrayone;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case data.multiIndex[0]:
            data.multiArray[1] = namearry[1][data.multiIndex[0]];
            break;
        }
        data.multiIndex[1] = 0;
        break;

    }
    this.setData(data);
    console.log(data)
  },

  typeworkone(e) {
    console.log(e)
    // this.setData({
    //   index: e.detail.value
    // })
  },
  // multypeworkone: function (e) {   //下滑工种列表所产生的函数
  //   console.log(e.detail.column + ",,," + e.detail.value)
  
  //    let that = this;
  //   let namearry = this.data.typeworkarrayone;
  //   var data = {
  //     typeworkarray: this.data.typeworkarray,
  //     multiworkIndex: this.data.multiworkIndex
  //   };
  //   data.multiworkIndex[e.detail.column] = e.detail.value;
  //   switch (e.detail.column) {
  //     case 0:
  //       switch (data.multiworkIndex[0]) {
  //         case data.multiworkIndex[0]:
  //           data.typeworkarray[1] = namearry[1][data.multiworkIndex[0]];
  //           break;
  //       }
  //       data.multiworkIndex[1] = 0;
  //       break;

  //   }
  //   this.setData(data);
  //   console.log(data)
  // },

  userSureWorktype(){
    this.setData({
      showWorkType: false
    })

    let all = ""
    for (let i = 0; i < this.data.complexwork.length; i++){
        all += this.data.complexwork[i]+ " "
    }
    this.setData({
      workIndexvalue: all
    })
  },
  
  userClickItem: function (e) {
    let that = this;
    let ce = false;
    console.log(e)
    console.log(e.currentTarget.dataset.id)
    
    for (let i = 0; i<this.data.typeworkarray.length;i++){
      for (let j = 0; j< this.data.typeworkarray[i].children.length;j++){
        if (~~this.data.typeworkarray[i].children[j].id === ~~e.currentTarget.dataset.id){
          for (let q = 0; q < this.data.complexwork.length; q++) {
            if (this.data.complexwork[q] == e.currentTarget.dataset.name) {
              ce = true
            }
          }
          if (this.data.complexwork.length < 5 || ce) {
          for (let k = 0; k < this.data.complexwork.length ;k++){
            if (this.data.complexwork[k] == e.currentTarget.dataset.name){
        
              this.data.complexwork.splice(k,1)
              this.data.complexworkid.splice(k, 1)
              this.data.typeworkarray[i].children[j].is_check = false
 

              this.setData({
                typeworkarray: this.data.typeworkarray
              })
              return
            }
          }
          this.data.typeworkarray[i].children[j].is_check = true
          this.data.complexwork.push(e.currentTarget.dataset.name)
          this.data.complexworkid.push(e.currentTarget.dataset.id)
          }else{
            wx.showModal({
              title: '温馨提示',
              content: '所需工种最多选择' + that.data.complexwork.length + '个',
              showCancel: false,
              success(res) { }
            })
          }
        }
      }
    }
    this.setData({
      typeworkarray: this.data.typeworkarray
    })
    console.log(this.data.complexwork)
  },


  submitinformation() {
    let information = {}
    let userInfo = wx.getStorageSync("userInfo");
    let obirthday = this.data.birthday.split("-")[0] + "年" + this.data.birthday.split("-")[1] + "月" + this.data.birthday.split("-")[2]+"日"

    Object.assign(information,{
      userId: userInfo.userId,
      token: userInfo.token,
      tokenTime: userInfo.tokenTime,
      // code:
      username: this.data.name,
      // headerimg:
      tel: this.data.telephone,
      gender: this.data.sex,
      nation: this.data.nation,
      birthday: obirthday,
      // occupations
    })
    console.log(information)
    // app.doRequestAction({
    //   url: "resumes/add-resume/",
    //   way: "POST",
    //   params: information,
    //   success: function (res) {

    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
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
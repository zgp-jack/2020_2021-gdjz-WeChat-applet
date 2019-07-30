// pages/publish/card/card.js
let vali = require("../../../utils/v.js");
let areas = require("../../../utils/tas.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pindex:0,
        cindex:0,
        tindex:0,
        objectAreaData:[],
        
    },
   initPickerData:function(){
     let pickerData = [];
     let p = this.initAllProvice();
     let c = this.getCityList();
     let t = this.getTownList();
     pickerData.push(p,c,t);
     this.setData({ objectAreaData: pickerData })
   },
   initAllProvice:function(){ //获取所有省份
     let arr = app.arrDeepCopy(areas.getAreaArr);
     let provice = [];
     let len = arr.length;
     for(let i = 0 ;i < len; i++){
       let data = {id:arr[i].id,pid:arr[i].pid,name:arr[i].name}
       provice.push(data)
     }
     return provice;
   },
   getCityList:function(){
     let i = this.data.pindex;
     let arr = app.arrDeepCopy(areas.getAreaArr);
     let cdata = arr[i].children;
     let len = cdata.length;
     let city = [];
     for(let j=0;j < len;j++){
       let data = { id: cdata[j].id, pid: cdata[j].pid, name: cdata[j].name}
       city.push(data)
     }
     return city;
   },
   getTownList:function(){
     let arr = app.arrDeepCopy(areas.getAreaArr);
     let i = this.data.pindex;
     let j = this.data.cindex;
     let _data = arr[i].children[j];
     return _data.has_children ? _data.children : [{id:_data.id,pid:_data.pid,name:_data.name}];
   },
  bindPickerColumnChange:function(e){
    let column = e.detail.column;
    let value = e.detail.value;
    if(column == 0){
      this.setData({ pindex: value})
    }else if(column == 1){
      this.setData({ cindex: value })
    }else{
      this.setData({ tindex: value })
    }
    
    this.initPickerData();
  },
  bindMultiPickerChange:function(e){
    let arrdata = app.arrDeepCopy(areas.getAreaArr);
    let arr = e.detail.value;
    let data = arrdata[arr[0]].children[arr[1]];
    let mydata = (data.has_children) ? data.children[arr[2]] : data
    console.log(mydata)
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initPickerData();
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

})
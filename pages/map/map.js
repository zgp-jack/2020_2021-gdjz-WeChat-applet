// pages/map/map.js

var amapFile = require('../../utils/amap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:"",
    longitude:"",
    markers: [{
      iconPath: "../../images/localmap_checked.png",
      id: 0,
      latitude: 30.5693973176,
      longitude: 103.9566224813,
      width: 25,
      height: 25
    }],
    distance: '',
    cost: '',
    steps:[],
    polyline: [],
    type:"drive",
    transits:[]
  },
  getWalkingRoute:function(){
    var that = this;
    var key = '08a5ac6e6270b8d129368ef83ec2eee9';
    let origin = that.data.longitude + "," + that.data.latitude;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getWalkingRoute({
      origin: origin,
      destination: '103.9566224813,30.5693973176',
      success: function (data) {
        var points = [];
        var stepsArr = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            stepsArr.push(steps[i].instruction)
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          let s = data.paths[0].duration / 60
          let h = Math.floor(s / 60);
          let m = Math.floor(s % 60)
          that.setData({
            cost: '步行大约需要' + (h != 0 ? h + "小时" : "") + m + "分钟"
          });
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0099ff",
            width: 3
          }],
          steps: stepsArr
        });
      },
      fail: function (info) {
        console.log(info)
      }
    })
  },
  getDrivingRoute: function () {
    var that = this;
    var key = '08a5ac6e6270b8d129368ef83ec2eee9';
    let origin = that.data.longitude + "," + that.data.latitude;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getDrivingRoute({
      origin: origin,
      destination: '103.9566224813,30.5693973176',
      success: function (data) {
        var points = [];
        var stepsArr = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            stepsArr.push(steps[i].instruction)
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0099ff",
            width: 3
          }],
          steps: stepsArr
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {
        console.log(info)
      }
    })
  },
  getRidingRoute:function(){
    var that = this;
    var key = '08a5ac6e6270b8d129368ef83ec2eee9';
    let origin = that.data.longitude + "," + that.data.latitude;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRidingRoute({
      origin: origin,
      destination: '103.9566224813,30.5693973176',
      success: function (data) {
        var points = [];
        var stepsArr = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            stepsArr.push(steps[i].instruction)
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0099ff",
            width: 3
          }],
          steps: stepsArr
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          let s = data.paths[0].duration / 60
          let h = Math.floor(s / 60);
          let m = Math.floor(s % 60)
          that.setData({
            cost: '骑行大约需要' + (h != 0 ? h + "小时" : "") + m + "分钟"
          });
        }
        
      },
      fail: function (info) {
        console.log(info)
      }
    })
  },
  getBusRoute: function () { 
    var that = this;
    var key = '08a5ac6e6270b8d129368ef83ec2eee9';
    let origin = that.data.longitude + "," + that.data.latitude;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getTransitRoute({
      origin: origin,
      destination: '103.9566224813,30.5693973176',
      city:"成都",
      extensions:"all",
      success: function (data) {
        if (data && data.transits) {
          var transits = data.transits;
          for (var i = 0; i < transits.length; i++) {
            var segments = transits[i].segments;
            transits[i].transport = [];
            for (var j = 0; j < segments.length; j++) {
              if (segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name) {
                var name = segments[j].bus.buslines[0].name
                if (j !== 0) {
                  name = '--' + name;
                }
                transits[i].transport.push(name);
              }
            }
          }
        }
        

        that.setData({
          transits: transits,
        });

      },
      fail: function (info) {
        console.log(info)
      }
    })
  },
  compare: function (property, desc){
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      if (desc == true) { // 升序排列
        return value1 - value2;
      } else { // 降序排列
        return value2 - value1;
      }
    }
  },
  showDetail: function () {
    wx.setStorageSync("map_detail", this.data.steps);
    wx.navigateTo({
      url: '/pages/map/detail',
    })
  },
  driveRoute: function (e) {
    this.setData({ type: "drive" })
    this.getDrivingRoute();
  },
  busRoute: function (e) {
    this.setData({ type: "bus" })
    this.getBusRoute();
  },
  rideRoute: function (e) {
    this.setData({ type: "ride" })
    this.getRidingRoute();
  },
  walkRoute: function (e) {
    this.setData({ type:"walk" })
    this.getWalkingRoute();
  },
  getMapInfo:function(){
    let that = this;
    wx.getLocation({
      type: 'gcj02', 
      altitude:true,
      success(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        console.log(res)
        that.loadCity(longitude,latitude)
        that.setData({ 
          latitude: latitude, 
          longitude: longitude,
        })
        //that.getDrivingRoute();
        //that.getWalkingRoute();
        //that.getRidingRoute();
        //that.getBusRoute();
      }
    })
    
  },
  loadCity: function (longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=您的ak&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success  
        console.log(res);
      },
      fail: function () {
        console.log("获取定位失败")
      },

    })
  },
  userCmap:function(){
    wx.chooseLocation({
      success:function(res){
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMapInfo();
    //this.initGaodeMap();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
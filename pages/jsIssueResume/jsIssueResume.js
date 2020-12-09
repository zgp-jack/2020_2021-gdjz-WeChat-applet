// pages/jsIssueResume/jsIssueResume.js
const app = getApp();
let areas = require("../../utils/area");
let area = app.arrDeepCopy(areas.getAreaArr)
area.splice(0, 1)
const Amap = require("../../utils/amap-wx.js");
const amapFun = new Amap.AMapWX({
	key: app.globalData.gdApiKey
});
let v = require('../../utils/v');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 选择区域数据
		areapicker: [],
		index: [0, 0],
		mindex: [0, 0],
		titleImage: app.globalData.apiImgUrl + "new-publish-title-t-icon.png",
		areaData: {
			// 城市id
			id: 0,
			// 省id
			pid: 0,
			// 城市名称
			name: ''
		},
		// 期望地区文本数据
		areatext: '',
		//用户信息
		userInfo: {},
		// 工种选择文本
		showClassifyText: "",
		// 最大工种数量
		maxWorkNum: 3,
		// 工种字段
		classifies: [],
		// 选择一级工种index
		pindex: 0,
		// 子类工种数据
		childClassifies: [],
		// 根据详情匹配的工种数据
		rulesClassifyids: [],
		// 用户选择的工种数据
		userClassifyids: [],
		// 所需工种显示的工种文本信息
		showClassifyText: "",
		// 工种选择框是否显示
		showPicker: false,
		// 选择或者匹配的工种id数组
		selectedClassifies: [],
		ruserClassifyids: [], // 备份
		rchildClassifies: [], // 备份
		rclassifies: [], //备份
		// 是否展示快速发布找工作
		showfindwork: false,
		// 是否展示验证码输入框
		showTel: true,
		// 手机号码
		telPhone: "",
		// 验证码时间
		sendrefresh: 60,
		// 第一次获取验证码
		firstGetCode: true,
		// 是哪个界面2、3(找活名片)或者1（招工详情）
		type: false,
		// 验证码
		code: '',
		selectimg: app.globalData.apiImgUrl + 'select.png',
		isScroll: false,
		//选中的期望地区
		selectCityData: [],
		//选中期望地区的name
		selectCityName: '',
		//选中期望地区的id
		selectCityId: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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
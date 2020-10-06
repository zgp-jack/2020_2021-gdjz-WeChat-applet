let _city = require("../../utils/city")
// pages/releaseSuccess.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		listArr:[],
		tipdata:{},
		thislistData:{}
	},

	initList:function (){
		let num = 80;
		let arr = [];
		let firstName = "赵钱孙李周吴郑王冯陈褚蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水章云苏潘葛范彭郎鲁韦昌马苗凤花方俞任袁柳鲍史唐费廉岑薛雷贺倪汤滕罗毕郝安常乐于时傅齐康伍余元顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄明计成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝席季贾危江童颜郭梅盛林钟徐邱骆高夏蔡田樊胡凌霍万支";
		firstName = firstName.split("");
		let day = [1,1,1,2,2,3,3,4,4,5];
		for (let index = 0; index < num; index++) {
			let firstNameNum = this.getRandomInt(0,firstName.length-1)
			let dayNum = this.getRandomInt(0,day.length-1)
			let cityNum = this.getRandomInt(0,_city.city.length-1)
			let m = 0;
			switch (day[dayNum]){
				case 1:
					m = this.getRandomInt(1,5)
					break;
				case 2:
					m = this.getRandomInt(5,10)
					break;
				case 3:
					m = this.getRandomInt(10,15)
					break;
				case 4:
					m = this.getRandomInt(15,20)
					break;
				case 5:
					m = this.getRandomInt(20,30)
					break;
			}
			arr.push(firstName[firstNameNum]+"老板 " +_city.city[cityNum]+"置顶"+day[dayNum]+"天 成功招到"+m+"人");
		}
		var newArr = [];
    for (var i = 0; i < arr.length; i += 4) {
        newArr.push(arr.slice(i, i + 4));
    }
    this.setData({listArr:newArr})
	},
	getRandomInt:function(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
	},
	//跳转招工列表
	goRecruitList() {
		wx.reLaunch({
			url: '../../pages/published/recruit/list',
		})
	},
	goexposure:function() {
		let topdata = this.data.thislistData; //当前数据
		let isCheck = topdata.is_check;//用户审核状态
		// let id = this.thislistData.currentTarget.dataset.id;
    // let time = this.thislistData.currentTarget.dataset.time
    wx.navigateTo({
			url: `/pages/workingtopAll/workingtop/workingtop?id=${topdata.id}&topId=undefined&city_id=${topdata.area_id}&province_id=${topdata.province_id}&ischeck=${isCheck}`,
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			tipdata:JSON.parse(options.tipdata)
		})
		this.setData({
			thislistData:JSON.parse(options.listdata)
		})
		this.initList()
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
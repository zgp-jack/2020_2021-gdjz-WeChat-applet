const app = getApp();
Component({
	properties: {

	},
	data: {
		showPicker: false,
		areaData: [],
		cityData: []
	},
	methods: {
		show: function () {
			this.setData({
				showPicker: !this.data.showPicker
			})
		},
		getAreaData() {
			const _this = this
			wx.request({
				url: 'https://cdn.yupao.com/json/yp_area_tree_2012021149.json',
				success: function (res) {
					if (res.data.all_tree) {
						wx.setStorageSync('newAreaData', res.data.all_tree)
						_this.initAeraData()
					}
				}
			})
		},
		initAeraData() {
			let newAreaData = wx.getStorageSync('newAreaData')
			this.setData({
				areaData: newAreaData
			})
			this.handleProvinceClick(0)
		},
		//切换省的时候 Provincei=省的index
		handleProvinceClick(Provincei) {
			this.setData({
				cityData: this.data.areaData[Provincei].children
			})
		},
		selectProvince(e) {
			this.handleProvinceClick(e.currentTarget.dataset.provincei)
			let _areaData = this.data.areaData
			
			for (let i = 0; i < _areaData.length; i++) {
				if(i == e.currentTarget.dataset.provincei){
					_areaData[i].ischeck = true
				}else{
					_areaData[i].ischeck = false
				}
			}
			this.setData({
				areaData: _areaData
			})
		}
	},
	lifetimes: {
		ready: function () {
			let newAreaData = wx.getStorageSync('newAreaData')
			if (!newAreaData) {
				this.getAreaData()
			} else {
				this.initAeraData()
			}
		},
	}
})
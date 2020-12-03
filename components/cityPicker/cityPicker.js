const app = getApp();
Component({
	properties: {

	},
	data: {
		showPicker: false,
		areaData: [],
		cityData: [],
		provincei:0
	},
	methods: {
		show: function () {
			this.setData({
				showPicker: !this.data.showPicker
			})
		},
		//获取城市数据
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
			//默认选中第一个省
			newAreaData[0].current = true
			this.setData({
				areaData: newAreaData
			})
			this.handleProvinceClick(0)
		},
		//切换省的时候 Provincei=省的index
		handleProvinceClick(Provincei) {
			this.setData({
				//用省的index找出对应的市
				cityData: this.data.areaData[Provincei].children
			})
		},
		// 选择省
		selectProvince(e) {
			//找出点击的省对应的市
			this.handleProvinceClick(e.currentTarget.dataset.provincei)
			let _areaData = this.data.areaData
			for (let i = 0; i < _areaData.length; i++) {
				//给点击的省添加选中的样式
				if(i == e.currentTarget.dataset.provincei){
					_areaData[i].current = true
				}else{
					_areaData[i].current = false
				}
			}
			this.setData({
				areaData: _areaData,
				provincei:e.currentTarget.dataset.provincei
			})
		},
		//选择市
		selectCity(e) {
			let cityi = e.currentTarget.dataset.cityi
			let _cityData = this.data.cityData
			let _areaData = this.data.areaData
			if(_cityData[cityi].ischeck){
				//选中市
				_cityData[cityi].ischeck = false
			}else {
				//取消选中
				_cityData[cityi].ischeck = true
			}
			//找出省下面有没有市被选中
			for(let i = 0;i<_areaData.length;i++){
				if(_areaData[i].children){
					//选中的数量
					let childrenCheckNum = 0
					//已经循环了几个市
					let childrenLen = 0
					for(let n = 0;n < _areaData[i].children.length;n++){
						childrenLen ++
						if(_areaData[i].children[n].ischeck){
							childrenCheckNum ++
							_areaData[i].childrenCheck = true
						}
						//如果市循环完了 还没有选中的市  说明这个省下面没有选中的市
						if(childrenLen == _areaData[i].children.length){
							if(childrenCheckNum == 0){
								_areaData[i].childrenCheck = false
							}
						}
					}
				}
			}
			this.setData({
				cityData:_cityData,
				areaData:_areaData
			})
			console.log(this.data.areaData)
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
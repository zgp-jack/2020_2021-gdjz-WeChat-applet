const app = getApp();
Component({
	properties: {
		defaultData: { 
      type: Array,
      value: []
    },
	},
	data: {
		showPicker: false,
		areaData: [],
		cityData: [],
		provincei: 0,
		selectArea:[],
		selectAllData:[],
		oldSelectData: [],
		oldCytiData:[]
	},
	methods: {
		show: function () {
			this.setData({
				oldSelectData: JSON.parse(JSON.stringify(this.data.areaData)),
				// oldCytiData: JSON.parse(JSON.stringify(this.data.cityData)),
				showPicker: true
			})
			this.defaultCity(this.data.selectArea)



		},
		close: function () {
			this.setData({
				areaData: this.data.oldSelectData,
				// cityData: this.data.oldCytiData,
				showPicker: false
			})
		},
		//获取城市数据
		getAreaData(newVal) {
			const _this = this
			wx.request({
				url: 'https://cdn.yupao.com/json/yp_area_tree_2012021149.json',
				success: function (res) {
					if (res.data.all_tree) {
						wx.setStorageSync('newAreaData', res.data.all_tree)
						_this.initAeraData(newVal)
					}
				}
			})
		},
		//初始化城市数据
		initAeraData(newVal) {
			console.log(newVal)
			let newAreaData = wx.getStorageSync('newAreaData')
			if(newVal.length>0){//如果没有默认城市数据才默认显示第一个
				this.defaultCity(newVal)
			} else {
				//默认选中第一个省
				newAreaData[0].current = true
				this.setData({
					areaData: newAreaData
				})
				this.handleProvinceClick(0)
			}
		
		},
		//切换省的时候 Provincei=省的index
		handleProvinceClick(Provincei) {
			console.log(this.data.areaData)
			let _city = this.data.areaData[Provincei].children
			if (_city[0].name !== '全部') {
				_city.unshift({
					name: '全部'
				})
			}
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
				if (i == e.currentTarget.dataset.provincei) {
					_areaData[i].current = true
				} else {
					_areaData[i].current = false
				}
			}
			this.setData({
				areaData: _areaData,
				provincei: e.currentTarget.dataset.provincei
			})
		},
		//选择市 判断选中了几个
		selectCity(e) {
			let cityi = e.currentTarget.dataset.cityi
			let _cityData = this.data.cityData
			let _areaData = this.data.areaData
			let selectData = []//选中的数据
			//判断已经选中了几个
			//选中了几个省
			let selectProvince = 0
			//选中了几个市
			let selectCity = 0
			//统计选中数量
			if (!_cityData[cityi].ischeck) {
				for (let q = 0; q < _areaData.length; q++) {
					//如果选中了全部 就不循环下面的城市
					if (_areaData[q].children[0].ischeck) {
						selectProvince++
					} else {
						//循环下面的城市
						for (let w = 0; w < _areaData[q].children.length; w++) {
							if (_areaData[q].children[w].ischeck) {
								selectCity++
							}
						}
					}
				}
				//如果已经选中了三个
				if (selectProvince + selectCity >= 3) {
					//当前点击的是否是全部
					if (cityi == 0) { //如果点击全部 需要判断有没有选中下面的市 如果选中了市 需要把市取消 选中全部 而不是直接给提示
						let dqcity = 0
						//找出当前选中了几个市
						for (let i = 0; i < _cityData.length; i++) {
							if (_cityData[i].ischeck && i !== 0) {
								dqcity++
							}
						}
						//当前没有选中市
						if (dqcity == 0) {
							// debugger
							return
						}
						//点击的不是全部
					} else { //如果点击市 需要判断是否选中了全部 如果选中了 需要把全部取消 选中市 而不是直接给提示
						//没有选中全部
						if (!_cityData[0].ischeck) {
							// debugger
							return
						}
					}
				}
			}

			//判断是否选中
			if (_cityData[cityi].ischeck) {
				//取消
				_cityData[cityi].ischeck = false
			} else {
				if (cityi !== 0) {
					//判断是否已经全选
					if (_cityData[0].ischeck) {
						_cityData[0].ischeck = false
					}
					//选中
					_cityData[cityi].ischeck = true
				} else {
					if (!_cityData[0].ischeck) {
						_cityData[0].ischeck = true
						for (let e = 0; e < _cityData.length; e++) {
							_cityData[e].ischeck = false
							_cityData[0].ischeck = true
						}
					}
				}

			}

			//找出省下面有没有市被选中  省上面显示红点
			for (let i = 0; i < _areaData.length; i++) {
				if (_areaData[i].children) {
					//选中的数量
					let childrenCheckNum = 0
					//已经循环了几个市
					let childrenLen = 0
					for (let n = 0; n < _areaData[i].children.length; n++) {
						childrenLen++
						if (_areaData[i].children[n].ischeck) {
							childrenCheckNum++
							_areaData[i].childrenCheck = true
						}
						//如果市循环完了 还没有选中的市  说明这个省下面没有选中的市
						if (childrenLen == _areaData[i].children.length) {
							if (childrenCheckNum == 0) {
								_areaData[i].childrenCheck = false
							}
						}
					}
				}
			}
			//找出已经选中的数据
			for(let a = 0;a<_areaData.length;a++){
				for(let s = 0;s<_areaData[a].children.length;s++){
					if(_areaData[a].children[0].ischeck){
						selectData.push({
							name:_areaData[a].name,
							id:_areaData[a].id
						})
						break
					}else if(_areaData[a].children[s].ischeck){
						selectData.push({
							name:_areaData[a].children[s].name,
							id:_areaData[a].children[s].id
						})
					}
				}
			}
			
			this.setData({
				cityData: _cityData,
				areaData: _areaData,
				selectArea: selectData
			})
		},
		//点击确定
		comfirmCity(e) {
			//通知父组件
			this.triggerEvent('cityComfirm', {
				params: this.data.selectArea
			})
			this.setData({
				oldSelectData: JSON.parse(JSON.stringify(this.data.areaData)),
				oldCytiData: JSON.parse(JSON.stringify(this.data.cityData)),
				showPicker: false
			})
		},
		//找出默认地区
		defaultCity(defaultData) {
			let ids = defaultData.map(item => item.id)
			let _areaData = this.data.areaData
			for (let j = 0; j < ids.length; j++) {
				for(let i = 0;i<_areaData.length;i++){
					//给每个市的第一个添加全部
					if(_areaData[i].children[0].name != '全部'){
						_areaData[i].children.unshift({
							'name':'全部'
						})
					}
					if (_areaData[i].id == ids[j]) {
						_areaData[i].childrenCheck = true
						_areaData[i].children[0].ischeck = true
						if (j == 0) {
							_areaData[i].current = true
							this.handleProvinceClick(i)
						}else{
							_areaData[i].current = false
						}
					}else{
						let children = _areaData[i].children
						let index = children.findIndex((item) => item.id == ids[j])
						if (index !== -1) {
							_areaData[i].childrenCheck = true
							_areaData[i].children[index].ischeck = true
							if (j == 0) {
								_areaData[i].current = true
								this.handleProvinceClick(i)
							}else{
								_areaData[i].current = false
							}
						}else{
							_areaData[i].current = false
						}
					}
				}
			}
			this.setData({
				areaData:_areaData,
			})
			console.log("_areaData",_areaData)
		}
	},

	lifetimes: {
		ready: function () {
			// let newAreaData = wx.getStorageSync('newAreaData')
			// if (!newAreaData) {
			// 	this.getAreaData()
			// } else {
			// 	this.initAeraData()
			// }
			// if(this.data.defaultData){
			// 	this.defaultCity(this.data.defaultData)
			// }
		},
	},
	observers: {
		"defaultData": function (newVal){
			console.log("newVal",newVal)
			let newAreaData = wx.getStorageSync('newAreaData')
			this.setData({
				selectArea:newVal
			})
			if (!newAreaData) {
				this.getAreaData(newVal)
			} else {
				this.initAeraData(newVal)
			}
		}
	}
})
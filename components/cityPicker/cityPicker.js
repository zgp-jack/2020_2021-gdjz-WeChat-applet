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
		scrollPId:'',
		scrollCId:''
	},
	methods: {
		show: function () {
			this.setData({
				selectArea: JSON.parse(JSON.stringify(this.data.defaultData)),
				showPicker: true
			})
			this.showCityData()
		},
		close: function () {
			this.setData({
				showPicker: false
			})
		},
		// 根据父级index设置子城市数据
		setChildrenData: function (index) {
			let areaData = this.data.areaData;
			// 当前index对应的子城市
			let childrenCity = areaData[index].children;
			// 将index对应一级城市变成选中状态，非index未选中状态
			areaData.forEach((_,num)=>{
				if (num == index) {
					areaData[num].current = true
				}else{
					areaData[num].current = false
				}
			})
			// 设置子城市数据
			this.setData({ cityData:childrenCity, areaData, provincei:index })
		},
		showCityData: function() {
			// 复制一份全新城市数据
			let _areaData = JSON.parse(JSON.stringify(this.data.newAreaData))
			// 获取确定选择的获取默认的城市数据
			let selectData = this.data.defaultData;
			//给每个市的第一个添加全部
			for(let i = 0;i<_areaData.length;i++){
				if(_areaData[i].children[0].name != '全部'){
					_areaData[i].children.unshift({
						name:'全部',
						ad_name: _areaData[i].name,
						id: _areaData[i].id,
						fid: _areaData[i].fid
					})
				}
			}
			this.setData({areaData: _areaData})
			// 如果默认城市或者确定选择的城市为空，则默认展示并选中北京—全部
			if (selectData.length>0) {
				this.defaultCity()
			}else{
				_areaData[0].current = true;
				this.setData({areaData:_areaData,cityData:_areaData[0].children})
			}
		},
		//显示城市数据并找出默认地区
		defaultCity: function() {
			let _areaData = this.data.areaData
			// 获取确定选择的获取默认的城市数据
			let selectData = this.data.defaultData;
			//匹配的一级城市index数组
			let index = [];
			let ids = selectData.map(item => item.id)
			for (let j = 0; j < ids.length; j++) {
				for(let i = 0;i<_areaData.length;i++){
					// 获取字城市数据
					let childrenCity = _areaData[i].children;
					for (let n = 0; n < childrenCity.length; n++) {
						if (ids[j] == childrenCity[n].id) {
							let indexObj = {
								pIndex:i,
								cId:childrenCity[n].id
							}
							index.push(indexObj)
							if (selectData[j].hasOwnProperty("fid")) {
								selectData[j].fid = childrenCity[n].fid
							}
							_areaData[i].childrenCheck = true;
							_areaData[i].children[n].ischeck = true
						}
					}
				}
			}
			index.sort(function(a,b){
				return a.pIndex > b.pIndex ? 1 : -1
			})

			let scrollPId = "p"+_areaData[index[0].pIndex].id
			let scrollCId = "c"+index[0].cId
			this.setData({
				areaData:_areaData,
				selectData,
				scrollPId,
				scrollCId
			})
			
			this.setChildrenData(index[0].pIndex)
			
		},
		// 初始化区域数据
		initAeraData: function () {
			// 获取缓存的城市数据
			let newAreaData = wx.getStorageSync('newAreaData');
			// 如果有缓存城市数据直接存入data，否则从cdn获取数据并存入缓存
			if (newAreaData) {
				this.setData({ newAreaData })
			}else{
				this.getAreaData()
			}
		},
		//获取城市数据
		getAreaData() {
			const _this = this
			wx.request({
				url: 'https://cdn.yupao.com/json/yp_area_tree_2012021149.json',
				success: function (res) {
					if (res.data.all_tree) {
						wx.setStorageSync('newAreaData', res.data.all_tree)
						_this.setData({newAreaData: res.data.all_tree})
					}
				}
			})
		},

		// 选择省
		selectProvince(e) {
			//找出点击的省对应的市
			this.setChildrenData(e.currentTarget.dataset.provincei)
		},
		//选择二级城市处理
		chooseCity: function (index) {
			// 选中父级index
			let pIndex = this.data.provincei;
			// 选中城市
			let selectArea = this.data.selectArea;
			let _cityData = this.data.cityData
			let _areaData = this.data.areaData
			// 点击二级城市的id
			let id = _cityData[index].id
			let fid = _cityData[index].fid
			// 点击二级城市的名称
			let name = index == 0? _cityData[index].ad_name: _cityData[index].name
			
			if (index == 0) {
				_cityData.forEach(item=>item.ischeck=false)
				for (let i = 0; i < _cityData.length; i++) {
					let id = _cityData[i].id;
					let indexnum = selectArea.findIndex(item=>item.id == id)
					if (indexnum !== -1) {
						selectArea.splice(indexnum,1)
					}
				}
				let item = { id, name, fid }
				let length = selectArea.push(item)
				if (length<4) {
					_cityData[index].ischeck = true
					_areaData[pIndex].childrenCheck = true
					_areaData[pIndex].children = _cityData
					this.setData({selectArea,cityData:_cityData,areaData:_areaData})
				}else{
					selectArea.pop()
					this.setData({selectArea})
				}
			}else{	
				_cityData[0].ischeck = false;
				let firstId = _cityData[0].id;
				let indexnum = selectArea.findIndex(item=>item.id == firstId)
				if (indexnum !== -1) {
					selectArea.splice(indexnum,1)
				}
				let item = { id, name, fid }
				let length = selectArea.push(item)
				if (length<4) {
					_cityData[index].ischeck = true
					_areaData[pIndex].childrenCheck = true	
					_areaData[pIndex].children = _cityData
					this.setData({selectArea,cityData:_cityData,areaData:_areaData})
				}else{
					selectArea.pop()
					this.setData({selectArea})
				}
			}
		}, 
		//选择市
		selectCity(e) {
			// 选中父级index
			let pIndex = this.data.provincei;
			// 选中城市
			let selectArea = this.data.selectArea;
			// 选中二级城市index
			let cityi = e.currentTarget.dataset.cityi
			let _cityData = this.data.cityData
			let _areaData = this.data.areaData
			// 点击二级城市的选择状态
			let ischeck = _cityData[cityi].ischeck
			// 点击二级城市的id
			let id = _cityData[cityi].id
			if (ischeck) {
				let index = selectArea.findIndex(item=>id == item.id);
				selectArea.splice(index,1)
				_cityData[cityi].ischeck = false
				let bool = _cityData.every(item=> {
					return !item.ischeck
				})
				if (bool) {
					_areaData[pIndex].childrenCheck = false
				}
				_areaData[pIndex].children = _cityData
				this.setData({selectArea,cityData:_cityData,areaData:_areaData})
			}else{
				this.chooseCity(cityi)
			}
			
		},
		//点击确定
		comfirmCity(e) {
			//通知父组件
			this.triggerEvent('cityComfirm', {
				params: this.data.selectArea
			})
			this.setData({
				showPicker: false
			})
		},
	},

	lifetimes: {
		ready: function () {
			this.initAeraData()
		},
	},
	
	observers: {
	}
})
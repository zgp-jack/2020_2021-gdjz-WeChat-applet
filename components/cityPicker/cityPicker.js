const app = getApp();
Component({
	properties: {
    
	},
	data:{
		showPicker:false,
		areaData:[]
	},
	methods: {
		show:function () {
			this.setData({
				showPicker:true
			})
		},
		getAreaData() {
			const _this = this
			wx.request({
				url: 'https://cdn.yupao.com/json/yp_area_tree_2012021149.json',
				success:function(res){
					if(res.data.all_tree){
						wx.setStorageSync('newAreaData', res.data.all_tree)
						_this.initAeraData()
					}
				}
			})
		},
		initAeraData(){
			let newAreaData = wx.getStorageSync('newAreaData')
			this.setData({
				areaData:newAreaData
			})
			console.log(this.data.areaData)
		},
		handleClick() {

		},
		selectProvince() {
			
		}
	},
	lifetimes: {
		ready:function(){
			let newAreaData = wx.getStorageSync('newAreaData')
			if(!newAreaData){
				this.getAreaData()
			}else {
				this.initAeraData()
			}
		},
	}
})
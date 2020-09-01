// js自定义的验证方法
let vali = {
    new: function () {
        var vali = {};
        // 检查是否为网址
        vali.checkUrl = function (url) {
            var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            return !reg.test(url) ? false : true;
        }
        vali.isChinese = function (v) {
            var re = new RegExp("[\\u4E00-\\u9FFF]+", "g");
            if (re.test(v)) {
                return true;
                }

            return false;
        }

      vali.allChinese = function (v) {
         let vRegx, vResult; 
            vRegx = /^[\u4E00-\u9FA5]+$/; 
            vResult = vRegx.test(v);
            if (vResult) { 
              return true;
            }
        return false;
      }
      //中文汉字2-5验证规则
      vali.chineseReg = function (v) {
        let vRegx= /^[\u4E00-\u9FA5]{2,5}$/; 
        let vResult = vRegx.test(v);
           if (vResult) { 
             return true;
           }
       return false;
     }
        //验证邮箱
        vali.isEmail = function (email) {
            return email.length > 6 && /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/.test(email);
        }

        // 验证是否是微信
        vali.isWeiXin = function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }

        //验证是否是手机客户端
        vali.IsWap = function () {
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                return true;
            }
            else {
                return false;
            }
        }

        // 校验座机号 和传真 优先使用
        vali.isTel = function (s) {
            var patrn = /^[+]{0,1}(\d){1,3}[ ]?([-]?(\d){1,12})+$/;
            var patrn = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
            return (!patrn.exec(s)) ? false : true;
        }

        //验证座机号
        vali.isPhone = function (inpurStr) {
            var partten = /^0(([1,2]\d)|([3-9]\d{2}))\d{7,8}$/;
            if (partten.test(inpurStr)) {
                return true;
            } else {
                return false;
            }
        }

        //验证手机号
        vali.isMobile = function (inputString) {
            var partten = /^1[3,4,5,6,7,8,9]\d{9}$/;
            var fl = false;
            if (partten.test(inputString)) {
                return true;
            } else {
                return false;
            }
        }

        //验证必填项且长度
        vali.isRequire = function (str, _len = 5) {
            return (str != '' && str != null && str != undefined && str.length >= _len) ? true : false;
        }

        //验证必填项且长度包含 _obj->min(起始) max(结束)
        vali.isRequireLen = function (str, _obj) {
            if (_obj != undefined) {
                if (_obj.min && _obj.max) {
                    return (str != '' && str != null && str != undefined && str.length >= _obj.min && str.length <= _obj.max) ? true : false;
                } else if (_obj.min && !_obj.max) {
                    return (str != '' && str != null && str != undefined && str.length >= _obj.min) ? true : false;
                } else if (!_obj.min && _obj.max) {
                    return (str != '' && str != null && str != undefined && str.length <= _obj.max) ? true : false;
                }
            }
            return (str != '' && str != null && str != undefined && str.length > 0) ? true : false;
        }

        //验证身份证
        vali.issfzok = function (str) {
            if ("" == str) {
                return false;
            }
            if (str.length != 15 && str.length != 18) { //身份证长度不正确
                return false;
            }
            if (str.length == 15) {
                if (!isNumber(str)) {
                    return false;
                }
            } else {
                str1 = str.substring(0, 17);
                str2 = str.substring(17, 18);
                alpha = "X0123456789";
                if (!isNumber(str1) || alpha.indexOf(str2) == -1) {
                    return false;
                }
            }
            return true;
        }

        //判断是否为空
        vali.isNull = function (obj) {
            var obj = obj;
            if (obj == "" || obj == null || obj == false || obj == undefined || obj == "null" || obj == "undefined") {
                return true;
            } else {
                return false;
            }
        }

        //校验登录密码：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串 
        vali.isUserPwd = function (s) {
            var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){5,15}$/;
            if (!patrn.exec(s)) return false
            return true
        }

        // 校验登录名：只能输入6-20个字母、数字、下划线 
        vali.isUserName = function (s) {
            var patrn = /^(\w){6,20}$/;
            if (!patrn.exec(s)) return false
            return true
        }

        // 验证数字 true in 0
        vali.isInteger = function (_val, _bool = false) {
            if (_bool) {
                var patrn = /^[0-9]*$/;
                if (!patrn.test(_val)) return false;
                return true
            }
            var patrn = /^([1-9][0-9]*)$/;
            if (!patrn.test(_val)) return false;
            return true;
        }

        // 验证浮点数
        vali.isFloat = function (_val) {
            if (_val == 0 || _val == "0") return true;
            var patrn = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            return patrn.test(_val);
        }

        // 生成随机数值
        vali.rand = function (min, max) {
            return min + (Math.random() * (max - min + 1));
        }

        // 生成随机区间整数
        vali.getRand = function (start, end) {
            if (start == 0) return Math.floor((end + 1) * Math.random());
            return Math.floor(Math.random() * end + 1);
        }

        // 将对象或数组转成json文本
        vali.json = function (obj) {
            return JSON.stringify(obj);
        }

        // 打印json文本
        vali.console = function (obj) {
            console.log(vali.json(obj));
        }

        //检测参数类型
        vali.ObjType = function (obj, _type) {
            var _re = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
            if (_type == undefined) return _re;
            if (_re == _type) return true;
            return false;
        }

        // 字符串去空
        vali.regStrNone = function(_str){
          var _re = Object.prototype.toString.call(_str).slice(8, -1).toLowerCase();
          if(_re != 'string') return false
          let str = _str.replace(/^\s+|\s+$/g, '');
          return (str == "") ? false : true
        }

        //数组去重
        vali.ArrUniq = function (array) {
            var temp = [];
            for (var i = 0; i < array.length; i++) {
                if (temp.indexOf(array[i]) == -1) {
                    temp.push(array[i]);
                }
            }
            return temp;
        }

        return vali;
    }

}

module.exports = {
    v:vali
}
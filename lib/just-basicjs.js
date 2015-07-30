/**
 * 移动开发基本库
 * @author  谭崇师
 * @version 1.0
 */
var justJs = justJs || (function() {

    /**
     * main
     */
    JustJs = function(config) {
        this.version = '0.02'; 
        this.ua = navigator.userAgent.toUpperCase();
        this.IS_ANDROID = this.ua.indexOf('ANDROID') != -1;
        this.IS_IOS = this.ua.indexOf('IPHONE OS') != -1;
        this.IS_WEIXIN = /micromessenger/i.test(this.ua);
        this.innerWidth = window.innerWidth; //窗口宽度
        this.screenHeight = screen.height; //窗口宽度
        this.offsetWidth = document.body.offsetWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.commonArgs = {aopsId: 'null', token: 'null', addCar: 0};
        this.win = window;
    }

    /**
     * config init
     */
    JustJs.prototype.init = function(config) {
        for (key in config) {
            this[key] = config[key];
        }            
    }

    /** 
     * ajax method dependence zeptojs
     */
    JustJs.prototype.ajax = function(targetConfig, otherCfg) {

        otherCfg = otherCfg || '';
        var source = {
            async : true,
            dataType : 'json',
            type: 'post',
            beforeSend: function() {
                return true;
            },
            success : function(data) {},
            error : function(data) {},
            complete: function(data) {
                if(otherCfg.loading) otherCfg.loading.style.display = 'none';
                if(otherCfg.layer) layer.hide();
            }
        }

        $.extend(source, targetConfig);
        $.ajax(source); 

    }

    /**
     * get url ? parameter
     */

     JustJs.prototype.getParams = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if(r) {
            return decodeURI(r[2]);
        }
        return '';
    };


    /**
     * get url # parameter
     */

     JustJs.prototype.getParams2 = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var l = window.location.href;
        var r = l.substring(l.indexOf('#')).substr(1).match(reg);
        if(r) {
            return decodeURI(r[2]);
        }
        return '';
    };

    /**
     * 格式化时间format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss')
     */
    JustJs.prototype.format = function(time, format){
        var t = new Date(time);
        var tf = function(i){return (i < 10 ? '0' : '') + i};
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
            switch(a){
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    };

    /**
     *  倒计时
     */
    JustJs.prototype.countDownTime = function(sysTime, endTime, callback) {

        var _self = this;
        var ts = endTime - sysTime;//计算剩余的毫秒数
        var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
        var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
        var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
        dd = _self.checkTime(dd);
        hh = _self.checkTime(hh);
        mm = _self.checkTime(mm);
        ss = _self.checkTime(ss);
        if(!!callback(mm, ss, sysTime+1000, endTime)) {
            return;
        }
        setTimeout(function(){ _self.countDownTime(sysTime+1000, endTime, callback)}, 1000);

    };

    //调整时间个位数
    JustJs.prototype.checkTime = function(i) {  
        if (i < 10) {  
           i = "0" + i;  
        }  
        return i;  
    };     

    //DOM居中
    JustJs.prototype.centerWindow = function(eleObj) {
        var _self = this;
        eleObj.style.left = (parseInt(_self.offsetWidth) - parseInt(eleObj.offsetWidth)) / 2 + 'px';
        eleObj.style.top = (parseInt(_self.clientHeight) - parseInt(eleObj.offsetHeight)) / 2 + 'px';
    };



    // Get Browser-Specifc Prefix
    JustJs.prototype.getBrowserPrefix = function() {

          // Check for the unprefixed property.
          if ('hidden' in document) {
            return null;
          }

          // All the possible prefixes.
          var browserPrefixes = ['moz', 'ms', 'o', 'webkit'];

          for (var i = 0; i < browserPrefixes.length; i++) {
            var prefix = browserPrefixes[i] + 'Hidden';
            if (prefix in document) {
              return browserPrefixes[i];
            }
          }

          // The API is not supported in browser.
          return null;
    }

    // Get Browser Specific Hidden Property
    JustJs.prototype.hiddenProperty = function(prefix) {
          if (prefix) {
            return prefix + 'Hidden';
          } else {
            return 'hidden';
          }
    }

    // Get Browser Specific Visibility State
    JustJs.prototype.visibilityState = function(prefix) {
          if (prefix) {
            return prefix + 'VisibilityState';
          } else {
            return 'visibilityState';
          }
    }

    // Get Browser Specific Event
    JustJs.prototype.visibilityEvent = function(prefix) {
          if (prefix) {
            return prefix + 'visibilitychange';
          } else {
            return 'visibilitychange';
          }
    }

    //js获取项目根路径，如： http://localhost:8080/icore_aops_portal_dmz
    JustJs.prototype.getRootPath = function(){
        //获取当前网址，如： http://localhost:8080/icore_aops_portal_dmz/activity/index.html
        var curWwwPath=window.document.location.href;
        //获取主机地址之后的目录，如： icore_aops_portal_dmz/activity/index.html
        var pathName=window.document.location.pathname;
        var pos=curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8080
        var localhostPaht=curWwwPath.substring(0,pos);
        //获取带"/"的项目名，如：/icore_aops_portal_dmz
        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
        return(localhostPaht+projectName);
    };  

    //val is or not function
    JustJs.prototype.isFunction = function() {
         return typeof arguments[0] == 'function';
    } 

    //自适应屏幕viewport
    JustJs.prototype.initViewport = function() {

        var _this = this;
        try{
            var DEFAULT_WIDTH = 640; // 页面的默认宽度
            var ua = navigator.userAgent.toLowerCase(); // 根据 user agent 的信息获取浏览器信息
            var deviceWidth = window.screen.width; // 设备的宽度
            var devicePixelRatio = window.devicePixelRatio || 1; // 物理像素和设备独立像素的比例，默认为1
            var targetDensitydpi;
            if(_this.IS_IOS) {
                targetDensitydpi = DEFAULT_WIDTH / deviceWidth * devicePixelRatio * 160;
            } else {
                targetDensitydpi = DEFAULT_WIDTH / deviceWidth * devicePixelRatio * 160 -1;
            }
            document.getElementById('viewport').setAttribute('content', 'target-densitydpi=' + targetDensitydpi +
                    ', width=640, user-scalable=no');        
        } catch(e) {

        }  

    }

    // 通过id查找
    JustJs.prototype.$ = function(id) {
        var _this = this;
        return _this.win.document.getElementById(id);
    }

    // 通过iframe调用ios
    JustJs.prototype.trackWithEvent = function(url, args){
        var _this = this;
        try{
            var iframe = document.createElement("iframe");
            if(args) {
                //console.log(_this.stringify(args));
                url += '?args=' + encodeURIComponent(_this.stringify(args))
            }
            iframe.src = url;
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe= null;

        } catch(error) {
 
        }
    };

    //验证手机号码 13 145 147 15【^3】 18 //http://bbs.csdn.net/topics/390281883 //http://www.iteye.com/topic/481228/
    JustJs.prototype.regPhoneNumber = function(num) {
        var reg = /^1([3]\d|4[57]|5[^3]|8\d)\d{8}$/;
        return  reg.test(num);
    }

    //倒计时 60 or ?
    JustJs.prototype.countDownSixty = function(ele, time, callback) {
        var _self = this;
        if(parseInt(time) == -1) {
            callback && callback();
            return;
        }
        if(pubEndflag == true) { //结束标识符
            pubEndflag = false; 
            return;
        }
        ele.innerHTML = time;
        setTimeout(function() {_self.countDownSixty(ele, --time, callback)}, 1000);
    }

    //去除字符前后空格    
    JustJs.prototype.trim = function(val) {
        return val.replace(/^\s+/,"").replace(/\s+$/,"")
    }

    //判断事件是否存在
    JustJs.prototype.isSupportEvent = function(event) {
        return event in document ? true: false;
    }

    //监听 webkitAnimationEnd
    JustJs.prototype.webkitAnimationEnd = function(options, callback) {
        var _this = this;
        if(_this.isSupportEvent('webkitAnimationEnd')) {
            options.ele.addEventListener('webkitAnimationEnd', function() {
                callback();
            })
        } else {
            setTimeout(callback, options.time);
        }

    }

    //验证验证码
    JustJs.prototype.regverifNumber = function(num) {
        var reg = /^\d{4}$/;
        return  reg.test(num);
    }    

    //埋点统计
    JustJs.prototype.buriedPoint = function(options) {
        var _this = this;
        options.url = options.url || 'http://www.baidu.com';
        options.data = options.data || {data: 'nothing'}
        var url = options.url + '?t=' + new Date().getTime() + '&' + _this.param(options.data);
        var sr = _this.win.document.createElement("script");
        //sr.setAttribute('onerror', "alert('The image could not be loaded.')");
        _this.win.document.getElementsByTagName("head")[0].appendChild(sr);
        sr.src = url; 
    }

    //把对象格式成URL参数
    JustJs.prototype.param = function(e, t) {
        var n = [];
        for (var r in e) e.hasOwnProperty(r) && e[r] && (t === !0 ? n.push([ encodeURIComponent(r), "=", encodeURIComponent(e[r]), "&" ].join("")) : n.push([ r, "=", e[r], "&" ].join("")));
        return n.join("").slice(0, -1);
    }    

    //设置HTML的font-size rem基于HTML根元素
    JustJs.prototype.setRootUnit = function() {

        var _this = this;
        var docEl = _this.win.document.documentElement;
        //设置HTML rem的父基点
        docEl.style.fontSize = parseInt(docEl.getBoundingClientRect().width)/16 + 'px';

        return;
        //设置android和ios字体
        var dpr = _this.win.navigator.appVersion.match(/iphone/gi)?_this.win.devicePixelRatio:1;
        docEl.setAttribute('data-dpr', dpr);

        //设置ios和android缩放
        var scale = 1/dpr;
        var metaEl = _this.win.document.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if(docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        }

    }

    //三行排列，获得第一行宽度，向下取整，并用此整数设置第二和第三行的宽度 基于zepto
    JustJs.prototype.initSlotWidth = function(ele) {

        var slotEleWidth = $('#' + ele).width();     
        $('.col-mb-4').each(function() {
            $(this).css('width', Math.floor(slotEleWidth) + 'px');
        });  

    }

    //活动请求原生的接口
    JustJs.prototype.actNativeFun= function(type, args) {
        var _this = this;
        if(_this.IS_IOS) {
            switch(type) {
                case 1: //initialize 获取aopsid和token 
                    _this.trackWithEvent('native://commonAPI.getAopsIdAndToken'); 
                    break;
                case 2: //登陆
                    _this.trackWithEvent('native://commonAPI.goLogin');
                    break;
                case 3: //请求加车参数
                    _this.trackWithEvent('native://commonAPI.haveAddCar');
                    break;
                case 4: //加车
                    _this.trackWithEvent('native://commonAPI.goAddCar');
                    break;
                case 5: //获取版本号
                    _this.trackWithEvent('native://commonAPI.getAppVersion');
                    break;
                case 6: //获得车辆列表
                    _this.trackWithEvent('native://commonAPI.getCarList');
                    break;
                case 7: //获取保险积分
                    _this.trackWithEvent('native://commonAPI.getInsuranceScore');
                    break;
                case 8: //分享至微信朋友圈 
                    _this.trackWithEvent('native://commonAPI.shareToWeChatWithParams', args);
                    break;
                case 9: //分享到微信好友
                    _this.trackWithEvent('native://commonAPI.shareToWXFriendsWithParams', args);
                    break;
                case 10:
                    _this.trackWithEvent('native://commonAPI.isWXAppSupport');
                    break;
                case 11: // 分享到微博
                    _this.trackWithEvent('native://commonAPI.shareToSinaWeiboWithParams', args);
                    break;
                case 12: // 分享到短信                    
                    _this.trackWithEvent('native://commonAPI.shareToMessageWithParams', args);
                    break;
            }
        } else {
            try {
                switch(type) { //说明android 不用判断接口是否可用， 并且车辆列表和保险积分接口android没有
                    case 1: //initialize 获取aopsid和token 
                        window.wst.GetLogininfo();
                        break;
                    case 2: //登陆
                        window.wst.goLogin();
                        break;
                    case 3: //请求加车参数
                        window.wst.HaveAddCar();
                        break;
                    case 4: //加车
                        window.wst.goAddCar();
                        break;
                    case 5: //获取版本号
                        window.wst.GetVersionInfo();
                        break;
                    case 8: //分享朋友圈
                        window.wst.shareWithFriends(args.msg, args.url);
                        break;
                    case 9: //分享到微信朋友
                        window.wst.shareWithWX(args.title, args.msg, args.url);
                        break;
                    case 11: //分享到微博
                        window.wst.shareToWeibo(args.msg, args.url);
                        break;
                    case 12: //分享到短信
                        window.wst.shareToSMS(args.msg, args.url);
                        break;
                }                
            }catch(e) {
                console.log(e);
            }            
        }
    }

    //获取aopsid和token appVersions addcar 回调
    JustJs.prototype.getCommonArgs = function() {
        //$('#afterResulitId').html(JSON.stringify(arguments[0]));
        var _this = this;
        var temp = arguments[0];
        var tempStr = '';
        for(var i in temp) {
            _this.commonArgs[i] =  temp[i]; 
            tempStr += i;
            tempStr += ':';
            tempStr += temp[i];
            tempStr += ' ';
        } 
        //console.log(_this.commonArgs);
        //new JustJs.Alert({valTitle: '返回的信息', valContent: tempStr});
        if(_this.commonArgs.status == '1' && _this.commonArgs.aopsId == 'null' && _this.commonArgs.token == 'null') {
            //new JustJs.Alert({valContent: '执行登陆'});
            JustJs.actNativeFun(2); //登陆            
        }else if((_this.commonArgs.status == '1' && _this.commonArgs.aopsId != 'null' && _this.commonArgs.token != 'null') || _this.commonArgs.status == '2') {
            //gameUnderWay(1, JustJs.commonArgs.aopsId);
            
            //GAME.descriptionStage.show(); //登陆成功，开始游戏
            return; //  暂时不用加车
            //new JustJs.Alert({valContent: '开始获取加车信息'});
            JustJs.actNativeFun(3); // 获得addcar
        } else if(_this.commonArgs.status == '3' && _this.commonArgs.addCar == 0) {
            return; //  暂时不用加车
            //new JustJs.Alert({valContent: '执行加车'});
            _this.actNativeFun(4); //加车
        } else if(_this.commonArgs.status == '6') {
            return; //  暂时不用加车
            //new JustJs.Alert({valTitle: '车列表', valContent: JSON.stringify(arguments[0])});
            //$('#afterResulitId').html(JSON.stringify(arguments[0]));
        } else if(_this.commonArgs.status == '8') {
             //new JustJs.Alert({valTitle: '朋友圈分享成功', valContent: tempStr});
            //new JustJs.Alert({valTitle: '分享', valContent: tempStr});
        } else if(_this.commonArgs.status == '9') {
            //new JustJs.Alert({valTitle: '朋友分享成功', valContent: tempStr});
            //alert('朋友圈分享成功' + tempStr);
        } else if(_this.commonArgs.status == '10') {
            //new JustJs.Alert({valTitle: '判断微信安装', valContent: tempStr});
            //alert('朋友圈分享成功' + tempStr);
        }  else if(_this.commonArgs.status == '11') {
            //new JustJs.Alert({valTitle: '微薄分享成功', valContent: tempStr});
            //alert('朋友圈分享成功' + tempStr);
        }  else if(_this.commonArgs.status == '12') {
            //new JustJs.Alert({valTitle: '短信分享成功', valContent: tempStr});
            //alert('朋友圈分享成功' + tempStr);
        }   

    }

    // 把json转成字符串
    JustJs.prototype.stringify = function() {
        var temp = arguments[0];
        var str;
        var j = 0;
        if(temp) {
            str = '{'
            for(var i in temp) {
                if(j != 0) {
                  str += ','  
                } else {
                    j++;
                }
                str += '"' + i + '"';
                str += ':';
                str += '"' + temp[i] + '"';
            }
            str += '}';
        }
        return str;
    }

    //  数字化好车主版本号  V2.3.1 beta -> 231
    JustJs.prototype.getIntVersionNo = function(arg) {
        if(arg) {
            var temp =  parseInt(arg.replace(/\./g, '').replace(/V/, ''));
            return temp;
            // if(!isNaN(temp)) { //   如果是数字
            //     return temp;
            // } else {
            //     alert('版本号格式异常， 请升级你的版本');
            // }
        }        
    };

    // 把元素插当前元素的首位
    JustJs.prototype.insertFirst = function(newEl, targetEl) {

        var _this = this;
        if(_this.isDom(newEl) && _this.isDom(targetEl)) {
            if (targetEl.children[0]) {
                targetEl.insertBefore(newEl, targetEl.children[0]);
            } else {
                targetEl.appendChild(newEl);
            }            
        }
        
    };

    //  判断一个原生是否是DOM元素 http://www.cnblogs.com/2050/p/3870835.html
    JustJs.prototype.isDom = function(obj) {

        return (( typeof HTMLElement === 'object' ) ?
                    function(obj){
                        return obj instanceof HTMLElement;
                    } :
                    function(obj){
                        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
                    })(obj);
         
    }

    //  生成一个DOM元素
    JustJs.prototype.createDom = function(ele) {

        var _this = this;
        return _this.win.document.createElement(ele);

    }

    // 给DOM元素设置属性
    JustJs.prototype.setDomAttr = function (ele, options) {

        var _this = this;
        if(_this.isDom(ele) && typeof options == 'object') {
            ele.setAttribute(options.key, options.val);
        }

    }

    return new JustJs();

})(); 
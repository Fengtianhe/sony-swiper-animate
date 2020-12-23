// 当前页面域名
var t_url = {
  'A1_1': 'P32850870', //ilce_9m2.html
  'A1_2': 'P43033968',//xperia_1m2_green.html
  'A2_1': 'P92487205',//wh_1000xm4_b.html
  'A2_2': 'P43033968',//xperia_1m2_green.html
  'A3_1': 'P92487006', //wf_h800_l.html
  'A3_2': 'P43033968',//xperia_1m2_green.html
  'B1_1': 'P32850870', //ilce_9m2.html
  'B1_2': 'P43040182', //xperia_5m2_pink
  'B2_1': 'P92487205',//wh_1000xm4_b.html
  'B2_2': 'P43040182',//xperia_5m2_pink
  'B3_1': 'P92487006', //wf_h800_l.html
  'B3_2': 'P43040182'//xperia_5m2_pink
};

var t_func = function (n) {
  console.log('product-id => ', n);
  var H5_url = '/content/dam/sonystyle-wechat/index.html#/Product?eightD=';
  n && gotoLinks(H5_url + t_url[n]);
  console.log('Product:' + t_url[n] + '\n' + 't_url:' + t_url[n]);
  return !0;
};


var BASE_URL = 'https://www.sonystyle.com.cn';
var channel = '';

function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function isAndroid() {
  return /(Android)/i.test(navigator.userAgent);
}

function isApple() {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
}

function isSony() {
  return /sonyapp/i.test(navigator.userAgent);
}

function isSonyAppwk() {
  return /sonyapp_wkwebview/i.test(navigator.userAgent);
}

function isSonyApp() {
  return isSony() || isSonyAppwk();
}

function urlDelP(url, name) {
  var urlArr = url.split('?');
  if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
    var query = urlArr[1];
    var obj = {};
    var arr = query.split('&');
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=');
      obj[arr[i][0]] = arr[i][1];
    }
    ;
    delete obj[name];
    var urlte = urlArr[0] + '?' + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&');
    return urlte;
  } else {
    return url;
  }
  ;
}

// 如果App进入-交互
function connectWebViewJavascriptBridge(callback) {

  if (window.WebViewJavascriptBridge) {

    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(WebViewJavascriptBridge);
    }, false);
  }
}

function doAppAction(ed) {
  try {
    if (isApple()) {
      if (isSonyAppwk()) {
        window.webkit.messageHandlers.showName.postMessage(ed);
      } else if (isSony()) {
        connectWebViewJavascriptBridge((bridge) => {
          bridge.send(JSON.stringify(ed), function (response) {
            console.log(response);
          });
        });
      }
    }
    if (isAndroid() && ed.linktype) {
      window.SysClientJs.linktype(ed.linktype, JSON.stringify(ed));
    }
  } catch (err) {
    console.log('do app linktype', err);
  }
}

if (isSonyApp()) {
  window['pushUserInfo'] = function (sendMsg) {
    console.log('H5获得APP UserInfo:' + sendMsg);
    var send = JSON.parse(sendMsg);
    localStorage.setItem('extendMsg', sendMsg);
    if (send && send.access_token) {
      localStorage.setItem('access_token', send.access_token);
      localStorage.setItem('member_group', send.customerGroup);
    } else {
      console.log('SendMsg 有错误:' + sendMsg);
    }
  };
}
// 一进入页面，给APP发送交互
if (isSonyApp()) {
  var getapp = { linktype: '27' };
  doAppAction(getapp);
}

if (isSonyApp()) {
  channel = 'APP';
} else {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    channel = 'WECHAT';
  } else {
    channel = 'WAP';
  }
}


function gotoLinks(links) {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    window.location.href = window.location.origin + links;
  } else {
    if (isSonyApp()) {

      var ed = {};
      ed.link = window.location.origin + links;
      ed.title = '产品详情';
      ed.linktype = '4';
      doAppAction(ed);

    } else {
      //window.location.href=window.location.origin +"/content/dam/sonystyle-wechat/index.html#/Product?eightD=" +eds;
      window.location.href = window.location.origin + links;

    }
  }
}

var ww = $(window).width();
function appendWxBtn(th, btns,imgsrc) {

		var xhtml =' <wx-open-launch-weapp class="wxbtn"  username="gh_4cb3d4a90ee1" path="packageProduct/pages/product/product.html?eightd="'+btns+' style="width:100%;"><template><style>.wx-btn { width: 100%; display: block;}.buy_btn{ width: 100%; display: block;}</style><a href="#" class="buy_btn" style="display: block;width: 100%;"><img src='+imgsrc+' style="display: block;width: 100%;"></a></template></wx-open-launch-weapp>';
	$(th).html(xhtml);
}

var filename=window.location.href;
filename=filename.substr(0,filename.lastIndexOf("/")+1);

var ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) == 'micromessenger') {

	$(".pull-detail").each(function () {
		var id = this.id;
		var btns = $(this).dataset.productId;
		if (id&&btns) {
			appendWxBtn($(this),btns,$(this).find(".preload img").attr("src"));
			var launchBtn = $(this).find(".wxbtn")[0];
			launchBtn.addEventListener('launch', function (e) {
				console.log('eee', e);
			})
			launchBtn.addEventListener('error', function (e) {
				console.log('fail', e.detail)
			})
		}
	})

	$.ajax({
		type: "POST",
		url: "https://weixin.csmc-cloud.com/WechatAgencyDBC/JsApiConfig?uri=" + window.location.href.replace("&", "__").replace("&", "__").replace("&", "__"),
		cache: false,
		async: true,
		success: function (configdata) {
			var configresult = JSON.parse(configdata);
			wx.config({
				debug: false,
				appId: configresult.appId,
				timestamp: configresult.timestamp,
				nonceStr: configresult.noncestr,
				signature: configresult.signature,
				jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'hideOptionMenu', 'showOptionMenu', 'chooseWXPay', 'getLocation', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'hideMenuItems'],
				openTagList: ['wx-open-launch-weapp']
			});
		}
	});

	wx.ready(function () {

	});


}











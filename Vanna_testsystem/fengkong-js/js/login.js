$('#btn_login').on('click', function(e) {
	var username = $("#username").val(),
		password = $("#password").val();
	if(''==username) {
		alert("请输入账号");
		return false;
	}
	if(''==password) {
		alert("请输入密码");
		return false;
	}
	toLogin();
});
function toLogin() {
	$.ajax({
		type: 'post',
		url: 'http://192.168.0.192:8080/risk-control/api/client/login',
		data: $("#login-form").serialize(),
		dataType : "json",
		success: function(data) {
			if(data.code=='200') {
				if($('#remember').is(':checked')) {
					setCookie("token",data.result,1);
				} else {
					setCookie("token",data.result,null);
				}
				checkBuild(data.result);
			} else {
				alert("账号或密码错误");
			}
		}
	});
}
function setCookie(c_name,value,expiredays) {
	var exdate=new Date()
	exdate.setTime(exdate.getTime()+(expiredays*24*60*60*1000));
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toUTCString())
}
function checkCookie() {
	var token = getCookie('token')
	if (token!=null && token!="") {
		return token;
	}
	return "";
}
//清除cookie 
function clearCookie(c_name) {   
	setCookie(c_name, "", -1);
}
//判断是否已建仓
function checkBuild(token) {
	$.ajax({
		type: 'post',
		url: 'http://192.168.0.192:8080/risk-control/api/clientPosition/whether',
		data: {token:token},
		dataType : "json",
		success: function(data) {
			if(data.code=='200') {
				if(data.result) {
					location.href="earnings-report.html";
				} else {
					location.href="build-position.html";
				}
			} else {
				alert("333");
				alert(data.resultMassage);
			}
		}
	});
}
// 创建XHR对象
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // 针对Chrome/Safari/Firefox.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // 针对IE
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // 不支持CORS
    xhr = null;
  }
  return xhr;
}

// 辅助函数，用于解析返回的内容
function getTitle(text) {
  return text.match('')[1];
}

// 发送CORS请求
function makeCorsRequest() {
  // bibliographica.org是支持CORS的
  var url = 'http://bibliographica.org/';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // 回应处理
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
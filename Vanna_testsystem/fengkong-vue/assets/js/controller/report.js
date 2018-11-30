var apiPrefix = "http://192.168.0.192:8080/risk-control/"

var token = getCookie("token");
jQuery(document).ready(function() {
	if(null==token||''==token) {
		location.href="login.html";
	}
	$("#token").val(token);
	$('#export-report').on('click', function(e) {
		$.ajax({
			type: 'post',
			url: apiPrefix+"api/report/exportExcel",
			data: $("#condition-form").serialize(),
			dataType : "json",
			success: function(data) {
				if(data.code=='200') {
					if(data.result=='') {
						alert("系统出错,请重新操作");
					} else {
						location.href=apiPrefix+data.result;
					}
				} else if(data.code=='403') {
					location.href="login.html";
				} else {
					alert(data.resultMessage);
				}
			}
		});
	});
});
var token = getCookie("token");
jQuery(document).ready(function() {
	if(null==token||''==token) {
		location.href="login.html";
	}
	list(token);
	$("#token").val(token);
	$('#save-btn').on('click', function(e) {
		var fundName = $("#fund-name").val();
		if(''==fundName) {
			alert("请输入基金名称");
			return false;
		}
		var fundId = $("#fundId").val();
		if(null!=fundId&&''!=fundId) {
			saveFund(apiPrefix+"api/client/updFund");
		} else {
			saveFund(apiPrefix+"api/client/saveFund");
		}
	});
});
function saveFund(url) {
	$.ajax({
		type: 'post',
		url: url,
		data: $("#fund-form").serialize(),
		dataType : "json",
		success: function(data) {
			if(data.code=='200') {
				alert("操作成功!");
				$("#fund-name").val("");
				list(token);
			} else if(data.code=='403') {
				location.href="login.html";
			} else {
				alert(data.resultMessage);
			}
		}
	});
}
function edit(name,id,parentId) {
	$("#fund-name").val(name);
	$("#fundId").val(id);
	if(null!=parentId&&''!=parentId) {
		$("#parentId").val(parentId);
	}
	$("#fund-name").focus();
}
function list(token) {
	$("#loadding").show();
	$.post(apiPrefix+"api/client/listFund",{token:token},function(data){ 
		if(data.code=='200') {
			appendList(data);
		} else if(data.code=='403') {
			location.href="login.html";
		} else {
			alert(data.resultMessage);
		}
		$("#loadding").hide();
	});
}
function appendList(data) {
	$("#data-list").html("");
	var list = data.result;
	var listStr = "<ul class='nav'>";
	for(var i = 0 ;i<list.length; i=i+1) {
		var listSubFund = list[i].listSubFund;
		listStr += "<li>";
		if(listSubFund.length>0) {
			listStr += "  <a class='panel-item' onclick=\"showSub(this)\"><span class=\"fa fa-plus-square-o\"></span>"+list[i].fundName+"</a>";
		} else {
			listStr += "  <a class='panel-item'>"+list[i].fundName+"</a>";
		}
		listStr += "  <div class=\"btn-group\">";
		listStr += "    <button type=\"button\" data-toggle=\"dropdown\" aria-expanded=\"false\" class=\"btn btn-success br2 btn-xs fs12 dropdown-toggle\">操作<span class=\"caret ml15\"></span></button>";
		listStr += "    <ul role=\"menu\" class=\"dropdown-menu\">";
		listStr += "       <li><a onclick=\"edit('"+list[i].fundName+"',"+list[i].fundId+",null);\">编辑</a></li>";
		listStr += "       <li><a onclick=\"addSubFund("+list[i].fundId+");\">添加子基金</a></li>";
		listStr += "       <li><a onclick=\"del("+list[i].fundId+",this);\">删除</a></li>";
		listStr += "    </ul>";
		listStr += "  </div>";
		if(listSubFund.length>0) {
			listStr += "<ul class=\"nav sub-ul\" style=\"display:none;\">";
			for(var j = 0 ;j<listSubFund.length; j=j+1) {
				listStr += "<li>";
				listStr += "	<a class=\"panel-item\">"+listSubFund[j].fundName+"</a>";
				listStr += "    <div class=\"btn-group text-right\">";
				listStr += "      <button type=\"button\" data-toggle=\"dropdown\" aria-expanded=\"false\" class=\"btn btn-success br2 btn-xs fs12 dropdown-toggle\">操作<span class=\"caret ml15\"></span></button>";
				listStr += "      <ul role=\"menu\" class=\"dropdown-menu\">";
				listStr += "       <li><a onclick=\"edit('"+listSubFund[j].fundName+"',"+listSubFund[j].fundId+","+list[i].fundId+");\">编辑</a></li>";
				listStr += "         <li><a onclick=\"del("+listSubFund[j].fundId+",this);\">删除</a></li>";
				listStr += "      </ul>";
				listStr += "  </div>";
				listStr += "</li>";
			}
			listStr += "</ul>";
		}
		listStr += "</li>";
	}
	listStr += "</ul>";
	$("#data-list").append(listStr);
}
function showSub(obj1) {
	var obj = $(obj1).next().next();
	if(obj.is(":hidden")) {
		$(".sub-ul").hide();
		obj.show();
		$(obj1).children("span").removeClass("fa-plus-square-o");
		$(obj1).children("span").addClass("fa-minus-square-o");
	} else {
		obj.hide();
		$(obj1).children("span").addClass("fa-plus-square-o");
		$(obj1).children("span").removeClass("fa-minus-square-o");
	}
}
function addSubFund(parentId) {
	$("#parentId").val(parentId);
	$("#fund-name").attr("placeholder","请输入子基金名称");
	$("#fund-name").focus();
}
function del(id,obj) {
	if(confirm("确定要删除此基金吗？")) {
		$.post(apiPrefix+"api/client/delFund",{token:token,fundId:id},function(data){ 
			if(data.code=='200') {
				alert("删除成功!");
				$(obj).parent().parent().parent().parent().remove();
			} else if(data.code=='403') {
				location.href="login.html";
			} else {
				alert(data.resultMessage);
			}
		});
	}

}
$(function(){
	$(".otab li").click(function(){
		//num = $(".otab li").index($(this));
		//$(".otcon").eq(num).addClass("otcon_on").siblings(".otcon").removeClass("otcon_on");
		$(".otab li").removeClass();
		$(this).addClass("tab_on");
		$(".otab li.tab_on").prevAll().addClass("tab_left");
		$(".otab li.tab_on").nextAll().addClass("tab_right");
	})
	/* 左侧菜单生成tab并从iframe打开html */
	
	$(".left_nav dt").click(function(){
		$(this).toggleClass("show");
		$(this).siblings("dd").slideToggle();
	})
	/* 左侧菜单展开 */
	
	$(".left_nav dl").click(function(){
		$(this).addClass("on").siblings().removeClass("on");
	})
	$(".left_nav dl:eq(0),.left_nav dl:eq(2)").click(function(){
		$(".left_nav dd a").removeClass("on");
	})
	/* 左侧菜单样式 */
	
	$(".left_nav dd a").click(function(){
		$(this).addClass("on").siblings().removeClass("on");
	})
	/* 左侧菜单样式 */
	
	$(".p_process").each(function(){
		pNum = $(this).attr("p_num");
		if(pNum<=30){ $(this).find("em").addClass("p_red"); }
		if(pNum>30 && pNum<=70){ $(this).find("em").addClass("p_blue"); }
		if(pNum>70){ $(this).find("em").addClass("p_green"); }
		if(pNum>=100){ $(this).parents(".p_process_box").addClass("p_process_full"); }
		$(this).find("em").css({"width":pNum+"%"})
	})
	/* 百分比样式 */
	
	$(".p_child").click(function(){
		$(this).toggleClass("p_child_show");
		$(this).parents(".p_box_con").siblings(".p_box_in").toggleClass("p_box_show");
	})
	/* 收起展开目标 */
	
	$(".pop_close").click(function(){
		$(".pop_out").hide();
		$(".no_operate").hide();
		$("body").removeClass("bodyoverflow");
	})
	/* 弹窗关闭 */
	
	$(".select_close").click(function(){
		$(".select_out").hide();
		
		if($(".no_operate2").is(":visible")){
			$(".no_operate2").hide();
		}else {
			$(".no_operate").hide();
			$("body").removeClass("bodyoverflow");
		}
		
	})
	/* 二级弹窗关闭 */

	$(".p_child").click();
	$(".left_nav dt a").eq(2).click();
//	$(".left_nav dd a").eq(0).click();
	/* 初始化页面 */
	
	$(".add_detail").click(function(){
		piHtml = $(this).siblings(".pi_box2").find(".pi_clone").html();
		$(this).siblings(".pi_box2").find(".pi_info").append(piHtml);
	})
	/* 新增详情描述 */
	
	$(".value_tab").click(function(){
		$(".value_tab").removeClass("value_tab_on");
		$(this).addClass("value_tab_on");
	})
	$(".value_num").click(function(){
		$(this).parents("dl").siblings("dl").find(".percent_sign").fadeOut();
	})
	$(".value_percent").click(function(){
		$(this).parents("dl").siblings("dl").find(".percent_sign").fadeIn();
	})
	/* 百分号显示 */
	
	$(".p_diy_select > h2,.p_diy_select > s").click(function(event){
		$(this).parents("dd").siblings("dd").find(".p_diy_select").removeClass("childshow");
		$(this).parents("dl").siblings("dl").find(".p_diy_select").removeClass("childshow");
		$(this).parents(".p_diy_select").toggleClass("childshow");
		event.stopPropagation();
	})
	$(".diy_select_multiple li").click(function(){
		// person页面中不能选择特别关注、所有成员
		if ($(this).attr("class") == "li_class") {
			return;
		}
		$(this).toggleClass("on");
		dsTarget = $(this).parents(".p_diy_select").find("h2");
		var dsHtml = new Array();
		var dsId = new Array();
		$(this).parents("ul").find("li.on").each(function(){
			dsHtml.push($(this).text());
			dsId.push($(this).attr("value"));
		})
		dsTarget.siblings("input[type='hidden']").val(dsId);
		dsTarget.text(dsHtml);
		dsTarget.attr("title",dsHtml);
	})
	$(".diy_select_single li").click(function(){
		// person页面中不能选择特别关注、所有成员
		if ($(this).attr("class") == "li_class") {
			return;
		}
		$(this).addClass("on").siblings().removeClass("on");
		dsTarget = $(this).parents(".p_diy_select").find("h2");
		dsHtml = $(this).text();
		dsId = $(this).attr("value");
		dsTarget.siblings("input[type='hidden']").val(dsId);
		dsTarget.text(dsHtml);
		dsTarget.attr("title",dsHtml);
		$(this).parents(".p_diy_select").removeClass("childshow");
	})
	$(".p_diy_con").click(function(event){
		event.stopPropagation();
	})
	$(".p_diy_con h3 input").bind('input propertychange',function(){
		pinputValue = $(this).val();
		$(this).siblings("em").text(pinputValue);
		$(this).parents("h3").siblings("ul").find("li").each(function(){
			// 个人页面只展示data-class为all的
			var data_class = $(this).attr("data-class");
			if(($(this).text().indexOf(pinputValue) > -1 || ($(this).attr("value") && $(this).attr("value").indexOf(pinputValue) > -1)) 
					&& (!pinputValue || !data_class || data_class == "all")) {
				$(this).show();
			}
			else{
				$(this).hide();
			}
		})
	})
	$("body").click(function(){
		$(".p_diy_select").removeClass("childshow");
	})
	/* 自定义下拉菜单 */
	
	$(".pi_box1 dd").each(function(){
		num = $(".pi_box1 dd").index($(this));
		$(this).css({"z-index":1000-num});
	})
	

	/* start：选择目标弹出 */
	$(".p_diy_modal .s2").click(function(event){
		$(this).parents("dd").siblings("dd").find(".p_diy_select").removeClass("childshow");
		$(this).parents("dl").siblings("dl").find(".p_diy_select").removeClass("childshow");
		show2Pop("#select_target");
		event.stopPropagation();
	})
	/* end：选择目标弹出 */
	/* start：清空上级目标 */
	$(".p_diy_modal .s4").click(function(event){
		$("#objecttype_val").val("");
		$("#objecttype").text("");
		$("#tree_content").find("a").removeClass("tree_node_select");
		event.stopPropagation();
	})
	/* end：清空上级目标 */
	
	/* start：个人页面成员选择框 */
	$(".p_diy_person h2,.p_diy_person s").click(function(event){
		$(this).parents(".p_diy_person").toggleClass("childshow");
		event.stopPropagation();
	})
	/* end：个人页面成员选择框 */
	
	/* start：选择队友弹出 */
	$(".p_diy_teammate .s3").click(function(event){
		showPop("#select_teammate");
		event.stopPropagation();
	})
	/* end：选择目标弹出 */
})

// 显示隐藏操作列表
function showOperate(obj) {
	$(obj).children(".page_operate").show();
}
//显示隐藏操作列表
function hideOperate(obj) {
	$(obj).children(".page_operate").hide();
}
/* 弹窗出现 */
function showPop(obj){
	$(obj).fadeIn();
	$(".no_operate").fadeIn();
	$("body").addClass("bodyoverflow");
}
/* 弹窗隐藏 */
function hidePop(obj){
	$(obj).hide();
	$(".no_operate").fadeOut();
	$("body").removeClass("bodyoverflow");
}

/* 二级弹窗出现 */
function show2Pop(obj){
	$(obj).fadeIn();
	$(".no_operate2").fadeIn();
}
/* 二级弹窗隐藏 */
function hide2Pop(obj){
	$(obj).hide();
	$(".no_operate2").fadeOut();
}

function fileDel(obj){
	$(obj).parents("li").remove();
}
/* 删除附件 */

/* 查询表格数据 */
function queryTable(table, params, async) {
	if (typeof(async) == "undefined") {
		async = true;
	}
	// 移除数据
	table.find(".data_tr").remove();
	var url = table.attr("url");
	var name = table.attr("name");
	// 标题栏
	var ths = table.find("th[data]");
	$.ajax({
		url: url,
		type: "POST",
		data: params,
		async: async,
		dataType: "json",
		success: function(data) {
			if (!data) {
				return;
			}
			// 保存数据
			table.data(data);
			$.each(data, function(index, item){
				var tr = '<tr class="data_tr">';
				ths.each(function(){
					var wrap = "";
					if (typeof($(this).attr("nowrap")) != "undefined") {
						wrap = "nowrap";
					}
					// 如果类型为空，默认类型
					if (!$(this).attr("type")) {
						var dataStr = "item." + $(this).attr("data");
						var v = null;
						try {
							v = eval(dataStr);
						}catch(e){}
						if (!v && !(v === 0)) {
							v = "";
						}
						// 判断是否有map转换
						var mapStr = $(this).attr("map");
						if (mapStr) {
							var map = JSON.parse(mapStr);
							if (map[v]) {
								v = map[v];
							}else if (map["default"]) {
								v = map["default"];
							}
						}
						tr += '<td '+wrap+'>'+v+'</td>';
					}
					// 如果为操作列，拼接操作链接
					else if ("operator" == $(this).attr("type")) {
						var objs = eval($(this).attr("data"));
						tr += '<td '+wrap+' class="operator_td">';
						$.each(objs, function(objIndex, obj){
							if (obj.disable && item[obj.disable.param] == obj.disable.value) {
								tr += '<a href="javascript:void(0)" style="color:#333;cursor:default;">' + obj.text + '</a>';
							}else {
								tr += '<a href="javascript:' + obj.operate + '(';
								$.each(obj.params, function(paramIndex, param) {
									tr += '\'' + item[param] + '\'';
									if (paramIndex < obj.params.length - 1) {
										tr += ',';
									}
								});
								tr += ')">' + obj.text + '</a>';
							}
						});
						tr += '</td>';
					}
					// 如果为checkbox或radio
					else if ("checkbox" == $(this).attr("type") || "radio" == $(this).attr("type")) {
						var type = $(this).attr("type");
						var objs = eval($(this).attr("data"));
						tr += '<td>';
						$.each(objs, function(objIndex, obj){
							tr += '<input type="'+type+'" name="'+obj.name+'" value="'+item[obj.valueField]+'" />';
						});
						tr += '</td>';
					}
				});
				tr += '</tr>';
				table.append(tr);
			});
		},
		error: function() {
			alert(name + "数据加载失败！");
		}
	});
}
// 深克隆
function deepCopy(source) { 
	var result={};
	for (var key in source) {
		result[key] = typeof source[key]==='object'? deepCopy(source[key]) : source[key];
	} 
	return result; 
}
/* 根据id从表格数据中获取对象 */
function getObject(id, fieldId, dataTable) {
	var object = null;
	var data = dataTable.data();
	$.each(data, function(index, item) {
		if (id == item[fieldId]) {
			object = deepCopy(item);
			return false;
		}
	});
	return object;
}
/* 提交 */
function submit(url, params, operateMsg, callback) {
	var target = null;
	// 防止重复提交
	if (event && event.currentTarget) {
		target = $(event.currentTarget);
		target.attr("disabled",true);
		target.unbind("click");
	}
	$.ajax({
		url: url,
		type: "POST",
		data: params,
		success: function(data) {
			if (callback) {
				callback();
			}
			var notification = new NotificationFx({
				message : '<p>'+operateMsg+'成功。</p>',
				layout : 'growl',
				effect : 'jelly',
				type : 'notice', // notice, warning, error or success
				wrapper: document.body
			});
			// show the notification
			notification.show();
			hidePop($('.pop_out'));
			if (target) {
				target.attr("disabled",false);
			}
		},
		error: function(xhr, msg, exp) {
			if (target) {
				target.attr("disabled",false);
			}
			alert(operateMsg + "失败！");
		}
	});
}
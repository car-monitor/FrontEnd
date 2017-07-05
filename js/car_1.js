$(function ($) {
	//点击添加加号 弹出添加车辆窗口
	$("#addCarPlus").on("click", function() {
		//添加mask背景
		$("body").append("<div id='mask'></div>");
		$("#mask").addClass("mask").fadeIn("slow");
		//弹出添加车辆弹窗，并将input的值清空.
		$("#addCarBox").fadeIn("slow");
		$(".addCarBox-item").val();
	});

	//点击取消
	$("#cancelButton").on("click", function() {
		//添加车辆窗口弹出
		$("#addCarBox").fadeOut("fast");
		$("#mask").css({ display: 'none' });
		$("#mask").remove();
	})

	$("#submitButton").on("click", function(e) {
		e.preventDefault();
	});
});
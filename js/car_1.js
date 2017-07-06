//添加模板CARTEMPLATE
const CARTEMPLATE = {
    car: {
        head: `<div id="car">
                <h1 id="car-title" class="car-border">
                    车辆列表<i id="addCarPlus" class="fa fa-plus" aria-hidden="true" style="float: right; cursor: pointer"></i>
                </h1>

                <div id="car-list">
                </div>
            </div>`,
        item: `<div class="car-item car-border">
                    <h1 class="car-item-title">
                        <i class="fa fa-car" aria-hidden="true"></i>
                        <span style="cursor: pointer">{{carPlate}}</span>
                        <i class="fa fa-trash-o" aria-hidden="true" style="float: right; cursor: pointer"></i>
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer; padding-right: 5px"></i>
                    </h1>
                    <div class="car-item-content">
                        <div>总里程：{{totalKM}}</div>
                    </div>
                    <div class="car-item-content">
                        <div>车辆类型：{{carType}}</div>
                    </div>
                    <div class="car-item-content">
                        <div>是否可用：{{judgeUse}}</div>
                    </div>
                    <div class="car-item-content">
                        <div>购买时间：{{buyTime}}</div>
                    </div>
                </div>`
    }
}

//模板控制
const utils = (function() {
    /**
     * 获取模板
     * @param {String} name 要获取的键名链，如 car.head 
     * @return {String}
     */
    var getTemplate = function(name) {
        let result = CARTEMPLATE;
        name.split('.').forEach(key => {
            result = result[key];
        });
        return result;
    };
    /**
     * 将值代入模板中
     * @param {String} template 要渲染的模板 
     * @param {Object} data
     */
    var replace = function(template, data) {
        let regExp;
        Object.keys(data).forEach(key => {
            regExp = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regExp, data[key]);
        });
        return template;
    };
    /**
     * 将模板渲染到HTML中
     * @param {DOM} template
     */
    var load = function(template) {
        template.appendTo('.aside');
    };
    /**
     * 清除侧边栏内的填充内容
     */
    var clear = function() {
        $('.aside').empty()
    };
    /**
     * $.ajax 请求函数
     * @param {String}   type    请求方式
     * @param {String}   url     请求URL
     * @param {Function} success 请求成功后的回调函数
     * @param {Object}   data    向后台发送的数据 
     */
    var httpRequest = function({ type, url, success, data }) {
        // TODO
        $.ajax({ type, url, success, data, dataType: 'json' })
    };
    return {
        getTemplate,
        replace,
        load,
        clear,
        httpRequest
    }
})();

/**
 * 生成‘车辆列表’页面
 * @param {Array} list
 *   格式说明：[{
 *      CarID: , 车辆ID
 *      carPlate: , 车辆名称//车牌号
 *      totalKM: , 总里程
 *      carType:, 车辆类型
 *      judgeUse:, 车辆现在是否可用
 		buyTime 车辆购买时间
 *   }]
 */
function createCarListPage(list) {
    let root = $(utils.getTemplate('car.head'));
    list.forEach(item => {
        let template = utils.getTemplate('car.item');
        $(utils.replace(template, item)).appendTo(root.children('#car-list'));
    });
    utils.load(root);
}

/**
 * ‘车辆列表’页面初始化函数
 */
function goToCar() {
    utils.clear();

    //从data.js获取假数据
    createCarListPage([{
        CarID: 1,
        carPlate: dataCars[0].carPlate,
        totalKM: 100,
        carType: dataCars[0].carType,
        judgeUse: "T",
        buyTime: dataCars[0].buyTime
    }, {
        CarID: 2,
        carPlate: dataCars[1].carPlate,
        totalKM: 100,
        carType: dataCars[1].carType,
        judgeUse: "T",
        buyTime: dataCars[1].buyTime
    }, {
        CarID: 3,
        carPlate: dataCars[2].carPlate,
        totalKM: 100,
        carType: dataCars[2].carType,
        judgeUse: "T",
        buyTime: dataCars[2].buyTime
    }, {
        CarID: 4,
        carPlate: dataCars[3].carPlate,
        totalKM: 100,
        carType: dataCars[3].carType,
        judgeUse: "T",
        buyTime: dataCars[3].buyTime
    }, {
        CarID: 5,
        carPlate: dataCars[4].carPlate,
        totalKM: 100,
        carType: dataCars[4].carType,
        judgeUse: "T",
        buyTime: dataCars[4].buyTime
    }]);
}


$(function ($) {
	goToCar();

	//点击添加加号 弹出添加车辆窗口
	$("#addCarPlus").on("click", function() {
		//添加mask背景
		$("body").append("<div id='mask'></div>");
		$("#mask").addClass("mask").fadeIn("slow");
		//弹出添加车辆弹窗，并将input的值清空.
		$("#addCarBox").fadeIn("slow");
		$(".addCarBox-item").val();
	});

	//取消添加车辆
	$("#addCarBox-cancelButton").on("click", function() {
		//添加车辆窗口弹出
		$("#addCarBox").fadeOut("fast");
		$("#mask").css({ display: 'none' });
		$("#mask").remove();
	})

	//添加车辆提交
	$("#addCarBox-submitButton").on("click", function(e) {
		e.preventDefault();
	});

	//点击添加车辆设置按钮 弹出添加车辆窗口
	$(".car-item .fa-cog").on("click", function() {
		//添加mask背景
		$("body").append("<div id='mask'></div>");
		$("#mask").addClass("mask").fadeIn("slow");
		$("#setCarBox").fadeIn("slow");
		$(".setCarBox-item").val();
	});

	//取消修改车辆
	$("#setCarBox-cancelButton").on("click", function() {
		$("#setCarBox").fadeOut("fast");
		$("#mask").css({ display: 'none' });
		$("#mask").remove();
	})

	//修改车辆提交
	$("#setCarBox-submitButton").on("click", function(e) {
		e.preventDefault();
	});

	//点击删除车辆按钮 弹出删除车辆窗口
	$(".car-item .fa-trash-o").on("click", function() {
		//添加mask背景
		$("body").append("<div id='mask'></div>");
		$("#mask").addClass("mask").fadeIn("slow");
		$("#deleteCarBox").fadeIn("slow");
	});

	//取消删除车辆
	$("#deleteCarBox-cancelButton").on("click", function() {
		$("#deleteCarBox").fadeOut("fast");
		$("#mask").css({ display: 'none' });
		$("#mask").remove();
	})

	//确定删除车辆
	$("#deleteCarBox-submitButton").on("click", function(e) {
		e.preventDefault();
	});
});
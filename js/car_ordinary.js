//添加模板CARTEMPLATE
const CARTEMPLATE = {
    car: {
        head: `<div id="car">
                <h1 id="car-title" class="car-border">
                    车辆列表
                </h1>

                <div id="car-list">
                </div>
            </div>`,
        item: `<div class="at-car-page car-item car-border">
                    <h1 class="car-item-title">
                        <i class="fa fa-car" aria-hidden="true"></i>
                        <span style="cursor: pointer">{{carPlate}}</span>
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
    },
    mainInfo: {
        head: `<div class="car-main-info">
                <div class="car-main-info-title">
                    <i class="fa {{icon}}" aria-hidden="true"></i>
                    {{title}}
                </div>
                <div class="car-main-info-body">
                    
                </div>
            </div>`,
        item: `<div class="car-main-info-body-item">
                  <div class="car-main-info-body-item-label">
                    {{label}}
                  </div>
                  <div class="car-main-info-body-item-value">
                    {{value}}
                  </div>
              </div>`
    },
    carDetail: {
        head: `<div id="car">
                    <h1 id="car-title" class="car-border">
                        <i class="fa fa-car" aria-hidden="true"></i>
                        {{carPlate}}
                    </h1>
                    <div id="car-list">
                        
                    </div>
                </div>`,
        item: `<div class="at-detail-page car-item car-border">
                    <h1 class="car-item-title">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        运单
                    </h1>
                    <div class="car-item-content">
                        <div>起点：{{origin}}</div>
                    </div>
                    <div class="car-item-content">
                        <div>终点：{{terminal}}</div>
                    </div>
                    <div class="car-item-content">
                        <div>出发时间：{{starttime}}</div>
                    </div>
                    <div class="car-item-content">
                        <div>结束时间：{{endtime}}</div>
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
 * 生成‘车辆详细信息’页面
 * @param {String} carPlate  车牌号
 * @param {Array}  list      该车的相关运单列表
 *   格式说明：[{
 *      waybill_id:,
 *      origin:,
 *      terminal:,
 *      starttime:,
 *      endtime:
 *   }]
 */
function createCarDetailPage(carId, carPlate, list) {
    let root = $(utils.replace(utils.getTemplate('carDetail.head'), {carPlate}));
    list.forEach(item => {
        let template = utils.getTemplate('carDetail.item');
        $(utils.replace(template, item)).appendTo(root.children('#car-list'));
    });
    utils.load(root);
    //load后给元素添加事件
}

//加载数据到车辆main-info栏
function createCarMainInfo(item) {
    //清空原来的数据
    $(".main-info li:first-child").empty();
    let root = utils.getTemplate('mainInfo.head');
    root = $(utils.replace(root, { icon: item.icon, title: item.title }));
    item.list.forEach(it => {
        let tmp = utils.getTemplate('mainInfo.item');
        $(utils.replace(tmp, it)).appendTo(root.children('.car-main-info-body'));
    });
    root.appendTo('.main-info li:first-child');
}

//加载数据到运单main-info栏
function createOrderMainInfo(item) {
    //清空原来的数据
    $(".main-info li:nth-child(2)").empty();
    let root = utils.getTemplate('mainInfo.head');
    root = $(utils.replace(root, { icon: item.icon, title: item.title }));
    item.list.forEach(it => {
        let tmp = utils.getTemplate('mainInfo.item');
        $(utils.replace(tmp, it)).appendTo(root.children('.car-main-info-body'));
    });
    root.appendTo('.main-info li:nth-child(2)');
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

/**
 * ‘车辆详情页’页面初始化函数
 */
function goToCarDetail(carId, carPlate) {
    utils.clear();
    //从datajs获取假数据
    var orderId_ = findOrderIdByCarId(carId);
    var orderList = new Array;
    for (var i = 0; i < orderId_.length; ++i) {
        var temp = {
            origin: dataOrder[orderId_[i]-1].addressorAddress,
            terminal: dataOrder[orderId_[i]-1].addresseeAddress,
            starttime: dataOrder[orderId_[i]-1].startTime,
            endtime: dataOrder[orderId_[i]-1].endTime          
        }
        orderList.push(temp);
    }
    createCarDetailPage(carId, carPlate,orderList);
}

//显示车辆信息栏信息
function goToCarMainInfo(carId) {
    //search carID infomation
    //$.get()
    //下面从datajs获取假数据,非ajax后台
    item = {
                icon: 'fa-user-circle',
                title: '车辆信息',
                list: [{
                    label: '车牌号',
                    value: dataCars[carId-1].carPlate
                }, {
                    label: '车辆类型',
                    value: dataCars[carId-1].carType
                }, {
                    label: '购买时间',
                    value: dataCars[carId-1].buyTime
                }, {
                    label: '容量',
                    value: dataCars[carId-1].cargoCapacity
                }, {
                    label: '引擎',
                    value: dataCars[carId-1].engineNo
                }, {
                    label: '所有者',
                    value: dataCars[carId-1].owner
                }, {
                    label: '载客量',
                    value: dataCars[carId-1].passengerNum
                }]
            }
    createCarMainInfo(item);
}

//显示运单信息栏信息
function goToOrderMainInfo(orderId) {
    item = {
                icon: 'fa-info-circle',
                title: '运单信息',
                list: [{
                    label: '收货地址',
                    value: dataOrder[orderId-1].addresseeAddress
                }, {
                    label: '发货地址',
                    value: dataOrder[orderId-1].addressorAddress
                }, {
                    label: '发货时间',
                    value: dataOrder[orderId-1].startTime
                }, {
                    label: '收货时间',
                    value: dataOrder[orderId-1].endTime
                }, {
                    label: '收货人',
                    value: dataOrder[orderId-1].addressorName
                }, {
                    label: '收货人电话',
                    value: dataOrder[orderId-1].addressorPhone
                }, {
                    label: '发货人',
                    value: dataOrder[orderId-1].addresseeName
                }, {
                    label: '发货人电话',
                    value: dataOrder[orderId-1].addresseePhone
                }]
            }
    createOrderMainInfo(item);
}

//车牌号码与ID匹配
function findCarIdByCarPlate(CarPlate) {
    for (var i in dataCars) {
        if (dataCars[i].carPlate == CarPlate) return dataCars[i].id;
    }
}

function findOrderIdByCarId(CarID) {
    var orderIdArray = new Array;
    for (var i in dataOrder) {
        if (dataOrder[i].carID == CarID) orderIdArray.push(dataOrder[i].id);
    }
    return orderIdArray;
}

$(function ($) {
	createMap();
	goToCar();

    //初始化页面的时候显示第一辆车
    goToCarMainInfo(1);
    //初始页面的时候显示第一辆车第一份运单
    var temp = findOrderIdByCarId(1);
    goToOrderMainInfo(temp[0]);

	//点击车辆 显示车辆详情
	$(".car-item-title span").on("click", function() {
		var temp_carPlate = $(this).text();

		//通过temp_carPlate车辆号查找id
		var carId_ = findCarIdByCarPlate(temp_carPlate);
        var orderId_ = findOrderIdByCarId(carId_);
		//getCarIdByCarPlate(CarPlate);

		goToCarDetail(carId_, temp_carPlate);

        goToCarMainInfo(carId_);
        goToOrderMainInfo(orderId_[0]);
	});
});
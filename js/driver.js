/**
 * 驾驶员页面js模块——管理员用户版本
 * @author 陈海城
 */

/*************** View 层 ******************/

const View = {
    driverList: {
        head: `<div id="driver">
                  <h1 id="driver-title" class="driver-border">
                      驾驶员列表<i class="fa fa-plus" aria-hidden="true" onclick="Controller.get('showPopup', '.add-driver')" style="float: right; cursor: pointer"></i>
                  </h1>
                  <div id="driver-list">

                  </div>
              </div>`,
        item: `<div class="driver-item driver-border">
                    <h1 class="driver-item-title">
                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                        <span onclick="Controller.get('loadDriverDetail', {{driver_id}})" style="cursor: pointer">{{name}}</span>
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer" onclick="Controller.get('showPopup', '.modify-driver')"></i>
                    </h1>
                </div>`,
        subitem: `<div class="driver-item-content">
                      <div>{{label}}：</div>
                      <div>{{value}}</div>
                  </div>`
    },
    mainInfo: {
        head: `<div class="driver-main-info">
                <div class="driver-main-info-title">
                    <i class="fa {{icon}}" aria-hidden="true"></i>
                    {{title}}
                </div>
                <div class="driver-main-info-body">
                    
                </div>
            </div>`,
        item: `<div class="driver-main-info-body-item">
                  <div class="driver-main-info-body-item-label">
                    {{label}}
                  </div>
                  <div class="driver-main-info-body-item-value">
                    {{value}}
                  </div>
              </div>`
    },
    driverDetail: {
        head: `<div id="driver">
                    <h1 id="driver-title" class="driver-border">
                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                        {{name}}
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer" onclick="Controller.get('showPopup', '.modify-driver')"></i>
                    </h1>
                    <div id="driver-list">
                        
                    </div>
                </div>`,
        item: `<div class="driver-item driver-border">
                    <h1 class="driver-item-title">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        运单
                        <i class="fa fa-trash" aria-hidden="true" style="float: right; cursor: pointer; margin-left: 5px" onclick="Controller.get('showPopup', '.delete-waybill')"></i>
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer"></i>
                    </h1>
               </div>`,
        subitem: `<div class="driver-item-content">
                    <div>{{label}}：</div>
                    <div>{{value}}</div>
                </div>`
    }
}

/********************* Service 层 *********************/

const utils = (function() {
    /**
     * 获取模板
     * @param {String} name 要获取的键名链，如 driver.head 
     * @return {String}
     */
    var getTemplate = function(name) {
        let result = View;
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
        httpRequest
    }
})();


/*********************** Model 层 *******************/

const Model = (function() {
    let obj = {
        // 驾驶员列表Model，格式参见下面的虚拟数据
        driverList: null,
        // 当前驾驶员详细信息，格式参见下面的虚拟数据
        currDriver: null,
        // 当前用户的 main info 展示信息，格式参见下面的虚拟数据
        mainInfo: null
    };
    /**
     * 修改 Model 数据
     * @param {String} name 
     * @param {Object} value 
     */
    function set(name, value) {
        obj[name] = null;
        obj[name] = value;
    }
    /**
     * 获取 Model 数据
     * @param {Sring} name 
     */
    function get(name) {
        return obj[name];
    }
    return {
        get,
        set
    }
})();


/************** Controller 层 ****************/

const Controller = (function() {
    let obj = {};
    /**
     * 渲染 main info
     * @param {Number} driver_id 驾驶员id
     */
    obj['loadMainInfo'] = function(driver_id) {
        // TODO http请求获取 main info 所需数据
        // let mainInfo = utils.httpRequest({...})
        // Model.set('mainInfo', mainInfo);
        Model.set('mainInfo', getData('mainInfo', driver_id));
        let mainInfo = Model.get('mainInfo');
        let Doms = [];
        Object.values(mainInfo).forEach(item => {
            let root = utils.getTemplate('mainInfo.head');
            root = $(utils.replace(root, { icon: item.icon, title: item.title }));
            let content = '';
            item.list.forEach(it => {
                let tmp = utils.getTemplate('mainInfo.item');
                tmp = utils.replace(tmp, it);
                content += tmp;
            });
            $(content).appendTo(root.children('.driver-main-info-body'));
            Doms.push(root);
        });
        // 挂载到 DOM 树中
        $.each(Doms, (index, value) => {
            let str = `.main-info > .fl:nth-child(${index + 1})`;
            $(str).empty();
            value.appendTo(str);
        })
    };
    /**
     * 渲染 driver list
     */
    obj['loadDriverList'] = function() {
        $('.aside').empty();
        // TODO http请求获取 driver list 所需数据
        // let driverList = utils.httpRequest({...})
        // Model.set('driverList', driverList);
        Model.set('driverList', getData('driverList'));
        let driverList = Model.get('driverList');
        let root = $(utils.getTemplate('driverList.head'));
        driverList.forEach(item => {
            let tmp = utils.getTemplate('driverList.item');
            tmp = $(utils.replace(tmp, { name: item.name, driver_id: item.driver_id }));
            let str = '';
            item.list.forEach(it => {
                str += utils.replace(utils.getTemplate('driverList.subitem'), it);
            });
            $(str).appendTo(tmp);
            tmp.appendTo(root.children('#driver-list'));
        });
        // 挂载到 DOM 树中
        root.appendTo('.aside');
    };
    /**
     * 渲染 driver detail
     */
    obj['loadDriverDetail'] = function(driver_id) {
        $('.aside').empty();
        Controller.get('loadMainInfo', driver_id);
        // TODO http请求获取 driver list 所需数据
        // let waybills = utils.httpRequest({...})
        // Model.set('waybills', waybills);
        Model.set('waybills', getData('waybills', driver_id));
        let waybills = Model.get('waybills');
        let root = $(utils.replace(utils.getTemplate('driverDetail.head'), {
            driver_id: waybills.driver_id,
            name: waybills.name
        }));
        waybills.list.forEach(item => {
            let tmp = $(utils.getTemplate('driverDetail.item'));
            let str = '';
            item.forEach(it => {
                str += utils.replace(utils.getTemplate('driverDetail.subitem'), it);
            });
            $(str).appendTo(tmp);
            tmp.appendTo(root.children('#driver-list'));
        });
        // 挂载到 DOM 树中
        root.appendTo('.aside');
    };
    /**
     * 显示弹出框
     */
    obj['showPopup'] = (className) => {
        // TODO
        $(className).addClass('show').fadeIn("slow");
    };
    /**
     * 去除弹出框
     */
    obj['removePopup'] = (className) => {
        $(className).removeClass('show').fadeOut("slow");
    };

    function get(name, ...param) {
        return obj[name](...param);
    }

    return {
        get
    }
})();

/**
 * 页面初始化
 */
$(document).ready(function() {
    createMap();
    // 初始化 main info
    Controller.get('loadMainInfo', 1);
    // 初始化 driver list
    Controller.get('loadDriverList');
});

/**
 * 虚拟数据
 */
function getData(name, driver_id) {
    let data;
    switch (name) {
        case 'waybills':
            data = getWaybills(driver_id);
            break;
        case 'mainInfo':
            data = getMainInfo(driver_id);
            break;
        case 'driverList':
            data = getDriverList(driver_id);
            break;
    }
    return data;
}

function getWaybills(driver_id) {
    let tmp = [];
    dataOrder.forEach(order => {
        if (order.driverId == driver_id) {
            tmp.push(order);
        }
    });
    let result = {
        driver_id,
        list: []
    };
    dataDrivers.forEach(driver => {
        if (driver.id == driver_id) {
            result.name = driver.username;
        }
    });
    tmp.forEach(order => {
        result.list.push([{
            label: '收货地址',
            value: order.addresseeAddress
        }, {
            label: '发货地址',
            value: order.addressorAddress
        }, {
            label: '发货时间',
            value: order.startTime
        }, {
            label: '收货时间',
            value: order.endTime
        }, {
            label: '收货人',
            value: order.addressorName
        }, {
            label: '收货人电话',
            value: order.addressorPhone
        }, {
            label: '发货人',
            value: order.addresseeName
        }, {
            label: '发货人电话',
            value: order.addresseePhone
        }])
    });
    return result;
}

function getMainInfo(driver_id) {
    let result = {
        car: null,
        driver: null
            // waybill: null
    };
    dataDrivers.forEach(driver => {
        if (driver.id == driver_id) {
            result.driver = {
                icon: 'fa-user-circle',
                title: '驾驶员信息',
                list: [{
                    label: '姓名',
                    value: driver.username
                }, {
                    label: '性别',
                    value: driver.sex && '男' || '女'
                }, {
                    label: '身份证',
                    value: driver.identify
                }, {
                    label: '电话',
                    value: driver.phone
                }, {
                    label: '住址',
                    value: driver.address
                }, {
                    label: '编号',
                    value: driver.jobNo
                }, {
                    label: '类型',
                    value: driver.driverType
                }, {
                    label: '所属部门',
                    value: driver.appartmentID
                }, {
                    label: '所属公司',
                    value: driver.companyID
                }, {
                    label: '是否已确认身份',
                    value: driver.authority && '是' || '否'
                }]
            }
        }
    });
    let carId;
    dataOrder.forEach(order => {
        if (order.driverId == driver_id) {
            carId = order.id;
            // result.waybill = {
            //     icon: 'fa-info-circle',
            //     title: '运单信息',
            //     carId: order.carID,
            //     list: [{
            //         label: '收货地址',
            //         value: order.addresseeAddress
            //     }, {
            //         label: '发货地址',
            //         value: order.addressorAddress
            //     }, {
            //         label: '发货时间',
            //         value: order.startTime
            //     }, {
            //         label: '收货时间',
            //         value: order.endTime
            //     }, {
            //         label: '收货人',
            //         value: order.addressorName
            //     }, {
            //         label: '收货人电话',
            //         value: order.addressorPhone
            //     }, {
            //         label: '发货人',
            //         value: order.addresseeName
            //     }, {
            //         label: '发货人电话',
            //         value: order.addresseePhone
            //     }]
            // };
        }
    });
    dataCars.forEach(car => {
        if (car.id == carId) {
            result.car = {
                icon: 'fa-car',
                title: '车辆信息',
                carId: car.id,
                list: [{
                    label: '牌照',
                    value: car.carPlate
                }, {
                    label: '品牌',
                    value: car.carType
                }, {
                    label: '容量',
                    value: car.cargoCapacity + '吨'
                }, {
                    label: '引擎编号',
                    value: car.engineNo
                }, {
                    label: '购买时间',
                    value: car.buyTime
                }, {
                    label: '载客数',
                    value: car.passengerNum
                }, {
                    label: '持有者',
                    value: car.owner
                }]
            }
        }
    });
    return result;
}

function getDriverList() {
    let drivers = [];
    dataDrivers.forEach(item => {
        drivers.push({
            driver_id: item.id,
            name: item.username,
            list: [{
                label: '电话',
                value: item.phone
            }, {
                label: '编号',
                value: item.jobNo
            }, {
                label: '身份证',
                value: item.identify
            }, {
                label: '是否已确认身份',
                value: item.authority && '是' || '否'
            }]
        });
    });
    return drivers;
}
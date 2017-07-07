/*************** View 层 ******************/

const View = {
    infoList: {
        head: `<div id="info">
                  <h1 id="info-title" class="info-border">
                      消息列表<i class="fa fa-plus" aria-hidden="true" onclick="Controller.get('showPopup', '.add-info')" style="float: right; cursor: pointer"></i>
                  </h1>
                  <div id="info-list">
                  </div>
              </div>`,
        //TODO
        item: `<div class="info-item info-border">
                    <h1 class="info-item-title">
                        <i class="fa fa-bullhorn" aria-hidden="true"></i>
                        <span>广播消息</span>
                    </h1>
                </div>`,
        warning: `<div class="info-item info-border">
                    <h1 class="info-item-title">
                        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                        <span>警告消息</span>
                    </h1>
                </div>`,
        subitem: `<div class="info-item-content">
                      <div>内容</div>
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
    }
}

/********************* Service 层 *********************/

const utils = (function() {

    var getTemplate = function(name) {
        let result = View;
        name.split('.').forEach(key => {
            result = result[key];
        });
        return result;
    };
    
    var replace = function(template, data) {
        let regExp;
        Object.keys(data).forEach(key => {
            regExp = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regExp, data[key]);
        });
        return template;
    };
    
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
        
        driverList: null,
        
        currDriver: null,
        
        mainInfo: null
    };
    
    function set(name, value) {
        obj[name] = null;
        obj[name] = value;
    }
    
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
    
    obj['loadMainInfo'] = function(driver_id) {
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
        
        $.each(Doms, (index, value) => {
            let str = `.main-info > .fl:nth-child(${index + 1})`;
            $(str).empty();
            value.appendTo(str);
        })
    };
    
    obj['loadInfoList'] = function() {
        $('.aside').empty();
        Model.set('infoList', getData('infoList'));
        let driverList = Model.get('infoList');
        let root = $(utils.getTemplate('infoList.head'));
        driverList.forEach(item => {
            let tmp = utils.getTemplate('infoList.item');
            tmp = $(utils.replace(tmp, { name: item.name, driver_id: item.driver_id }));
            let str = '';
            item.list.forEach(it => {
                str += utils.replace(utils.getTemplate('infoList.subitem'), it);
            });
            $(str).appendTo(tmp);
            tmp.appendTo(root.children('#info-list'));
        });
        
        root.appendTo('.aside');
    };
    
    
    obj['showPopup'] = (className) => {
        // TODO
        $(className).addClass('show').fadeIn("slow");
    };
    
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


$(document).ready(function() {
    createMap();
    
    Controller.get('loadMainInfo', 1);
    
    Controller.get('loadInfoList');
});

function getData(name, driver_id) {
    let data;
    switch (name) {
        case 'mainInfo':
            data = getMainInfo(driver_id);
            break;
        case 'infoList':
            data = getInfoList(driver_id);
            break;
    }
    return data;
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

function getInfoList() {
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
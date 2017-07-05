/**
 * 驾驶员页面js模块——普通用户版本 
 * @author 陈海城
 */

/*************** View 层 ******************/

const View = {
    driverList: {
        head: `<div id="driver">
                  <h1 id="driver-title" class="driver-border">
                      驾驶员列表
                  </h1>
                  <div id="driver-list">

                  </div>
              </div>`,
        item: `<div class="driver-item driver-border">
                    <h1 class="driver-item-title">
                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                        <span onclick="Controller.get('loadDriverDetail', {{driver_id}})" style="cursor: pointer">{{name}}</span>
                    </h1>
                    <div class="driver-item-content">
                        <div>总里程：</div>
                        <div>{{mileage}}公里</div>
                    </div>
                    <div class="driver-item-content">
                        <div>运单数量：</div>
                        <div>{{waybillsum}}</div>
                    </div>
                    <div class="driver-item-content">
                        <div>警告次数：</div>
                        <div>{{warningsum}}</div>
                    </div>
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
                    </h1>
                    <div id="driver-list">
                        
                    </div>
                </div>`,
        item: `<div class="driver-item driver-border">
                    <h1 class="driver-item-title">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        运单
                    </h1>
                    <div class="driver-item-content">
                        <div>起点：</div>
                        <div>{{origin}}公里</div>
                    </div>
                    <div class="driver-item-content">
                        <div>终点：</div>
                        <div>{{terminal}}</div>
                    </div>
                    <div class="driver-item-content">
                        <div>出发时间：</div>
                        <div>{{starttime}}</div>
                    </div>
                    <div class="driver-item-content">
                        <div>结束时间：</div>
                        <div>{{endtime}}</div>
                    </div>
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
            let template = utils.getTemplate('driverList.item');
            $(utils.replace(template, item)).appendTo(root.children('#driver-list'));
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
            let template = utils.getTemplate('driverDetail.item');
            $(utils.replace(template, item)).appendTo(root.children('#driver-list'));
        });
        // 挂载到 DOM 树中
        root.appendTo('.aside');
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
    let obj = {};
    obj['waybills'] = {
        1: {
            driver_id: 1,
            name: '张三',
            list: [{
                waybill_id: 1,
                origin: '广东省广州市越秀区方圆路33号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.01.29 09:30',
                endtime: '2017.01.30 12:10'
            }, {
                waybill_id: 2,
                origin: '广东省惠州市广德路20号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.02.29 09:30',
                endtime: '2017.02.30 12:10'
            }, {
                waybill_id: 3,
                origin: '北京途包录得路20号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.03.29 09:30',
                endtime: '2017.03.30 12:10'
            }, {
                waybill_id: 4,
                origin: '上海市外滩23号',
                terminal: '广东省广州市越秀区方圆路33号',
                starttime: '2017.01.29 09:30',
                endtime: '2017.01.30 12:10'
            }]
        },
        2: {
            driver_id: 2,
            name: '李四',
            list: [{
                waybill_id: 1,
                origin: '广东省广州市越秀区方圆路33号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.01.29 09:30',
                endtime: '2017.01.30 12:10'
            }, {
                waybill_id: 2,
                origin: '广东省惠州市广德路20号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.02.29 09:30',
                endtime: '2017.02.30 12:10'
            }, {
                waybill_id: 3,
                origin: '北京途包录得路20号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.03.29 09:30',
                endtime: '2017.03.30 12:10'
            }, {
                waybill_id: 4,
                origin: '上海市外滩23号',
                terminal: '广东省广州市越秀区方圆路33号',
                starttime: '2017.01.29 09:30',
                endtime: '2017.01.30 12:10'
            }, {
                waybill_id: 5,
                origin: '广东省深圳市',
                terminal: '广东省广州',
                starttime: '2017.11.29 09:30',
                endtime: '2017.11.30 12:10'
            }]
        },
        3: {
            driver_id: 3,
            name: '王二麻',
            list: [{
                waybill_id: 1,
                origin: '广东省广州市越秀区方圆路33号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.01.29 09:30',
                endtime: '2017.01.30 12:10'
            }, {
                waybill_id: 2,
                origin: '广东省惠州市广德路20号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.02.29 09:30',
                endtime: '2017.02.30 12:10'
            }, {
                waybill_id: 3,
                origin: '北京途包录得路20号',
                terminal: '广东省广州市白云区罗德路29号',
                starttime: '2017.03.29 09:30',
                endtime: '2017.03.30 12:10'
            }]
        }
    };
    obj['mainInfo'] = {
        1: {
            car: {
                icon: 'fa-car',
                title: '车辆信息',
                list: [{
                    label: '牌照',
                    value: '粤A-AAA00'
                }, {
                    label: '油量',
                    value: 100
                }, {
                    label: '速度',
                    value: 100
                }, {
                    label: '平均速度',
                    value: 100
                }, {
                    label: '总里程',
                    value: 100
                }]
            },
            driver: {
                icon: 'fa-user-circle',
                title: '驾驶员信息',
                list: [{
                    label: '姓名',
                    value: '张三'
                }, {
                    label: '总里程',
                    value: 100
                }, {
                    label: '警告次数',
                    value: 100
                }, {
                    label: '信用等级',
                    value: 8
                }]
            },
            waybill: {
                icon: 'fa-info-circle',
                title: '运单信息',
                list: [{
                    label: '起点',
                    value: '北京途包录得路20号'
                }, {
                    label: '终点',
                    value: '广东省广州市白云区罗德路29号'
                }, {
                    label: '里程',
                    value: 100
                }, {
                    label: '出发时间',
                    value: '2017.03.29 09:30'
                }, {
                    label: '预定送达时间',
                    value: '2017.03.30 12:10'
                }]
            }
        },
        2: {
            car: {
                icon: 'fa-car',
                title: '车辆信息',
                list: [{
                    label: '牌照',
                    value: '粤B-BBB00'
                }, {
                    label: '油量',
                    value: 200
                }, {
                    label: '速度',
                    value: 180
                }, {
                    label: '平均速度',
                    value: 190
                }, {
                    label: '总里程',
                    value: 10
                }]
            },
            driver: {
                icon: 'fa-user-circle',
                title: '驾驶员信息',
                list: [{
                    label: '姓名',
                    value: '李四'
                }, {
                    label: '总里程',
                    value: 1000
                }, {
                    label: '警告次数',
                    value: 80
                }, {
                    label: '信用等级',
                    value: 10
                }]
            },
            waybill: {
                icon: 'fa-info-circle',
                title: '运单信息',
                list: [{
                    label: '起点',
                    value: '广东省广州市越秀区方圆路33号'
                }, {
                    label: '终点',
                    value: '广东省广州市白云区罗德路29号'
                }, {
                    label: '里程',
                    value: 100
                }, {
                    label: '出发时间',
                    value: '2017.01.29 09:30'
                }, {
                    label: '预定送达时间',
                    value: '2017.01.30 12:10'
                }]
            }
        },
        3: {
            car: {
                icon: 'fa-car',
                title: '车辆信息',
                list: [{
                    label: '牌照',
                    value: '粤C-CCC00'
                }, {
                    label: '油量',
                    value: 50
                }, {
                    label: '速度',
                    value: 80
                }, {
                    label: '平均速度',
                    value: 390
                }, {
                    label: '总里程',
                    value: 1000
                }]
            },
            driver: {
                icon: 'fa-user-circle',
                title: '驾驶员信息',
                list: [{
                    label: '姓名',
                    value: '王二麻'
                }, {
                    label: '总里程',
                    value: 1000
                }, {
                    label: '警告次数',
                    value: 10
                }, {
                    label: '信用等级',
                    value: 10
                }]
            },
            waybill: {
                icon: 'fa-info-circle',
                title: '运单信息',
                list: [{
                    label: '起点',
                    value: '广东省惠州市广德路20号'
                }, {
                    label: '终点',
                    value: '广东省广州市白云区罗德路29号'
                }, {
                    label: '里程',
                    value: 900
                }, {
                    label: '出发时间',
                    value: '2017.03.29 09:30'
                }, {
                    label: '预定送达时间',
                    value: '2017.01.30 12:10'
                }]
            }
        }
    };
    obj['driverList'] = [{
        driver_id: 1,
        name: '张三',
        mileage: 100,
        waybillsum: 5,
        warningsum: 100
    }, {
        driver_id: 2,
        name: '李四',
        mileage: 100,
        waybillsum: 5,
        warningsum: 100
    }, {
        driver_id: 3,
        name: '王二嘛',
        mileage: 100,
        waybillsum: 5,
        warningsum: 100
    }];
    return driver_id && obj[name][driver_id] || obj[name];
}
/**
 * 驾驶员页面js模块——管理员版本 
 * @author 陈海城
 */


/*************** html 渲染模板 ******************/

const DRIVERTEMPLATE = {
    driver: {
        head: `<div id="driver">
                <h1 id="driver-title" class="driver-border">
                    驾驶员列表<i class="fa fa-plus" aria-hidden="true" onclick="addDriver()" style="float: right; cursor: pointer"></i>
                </h1>
                <div id="driver-list">
                    
                </div>
              </div>`,
        item: `<div class="driver-item driver-border">
                    <h1 class="driver-item-title">
                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                        <span onclick="goToDriverDetail({{driver_id}})" style="cursor: pointer">{{name}}</span>
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer" onclick="modifyDriver({{driver_id}})"></i>
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
    driverDetail: {
        head: `<div id="driver">
                    <h1 id="driver-title" class="driver-border">
                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                        {{name}}
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer" onclick="modifyDriver({{driver_id}})"></i>
                    </h1>
                    <div id="driver-list">
                        
                    </div>
                </div>`,
        item: `<div class="driver-item driver-border">
                    <h1 class="driver-item-title">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        运单
                        <i class="fa fa-trash" aria-hidden="true" style="float: right; cursor: pointer; margin-left: 5px" onclick="deleteWayBill({{waybill_id}})"></i>
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer" onclick="modifyWayBill({{waybill_id}})"></i>
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
    },
    modifyDriver: `<div id="driver-pop-up">
                    <div id="mask" class="mask"></div>
                    <div id="popUps" class="pop-ups">
                            <h4 class="pop-ups-title">修改驾驶员</h4>
                            <div class="driver-pop-ups-content">
                                <div>
                                    <div class="driver-pop-ups-label">姓名</div>
                                    <div class="driver-pop-ups-input"><input id="driver-pop-ups-name" /></div>
                                </div>
                                <div>
                                    <div class="driver-pop-ups-label">其它信息</div>
                                    <div class="driver-pop-ups-input"><input id="driver-pop-ups-other-info" /></div>
                                </div>
                                <div class="driver-pop-ups-btns">
                                    <button onclick="modifyDriverMakeSure({{driver_id}})">确定</button>
                                    <button onclick="driverPopUpCancel()">取消</button>
                                </div>
                            </div>
                    </div>
                   </div>`,
    addDriver: `<div id="driver-pop-up">
                    <div id="mask" class="mask"></div>
                    <div id="popUps" class="pop-ups">
                            <h4 class="pop-ups-title">添加驾驶员</h4>
                            <div class="driver-pop-ups-content">
                                <div>
                                    <div class="driver-pop-ups-label">姓名</div>
                                    <div class="driver-pop-ups-input"><input id="driver-pop-ups-name" /></div>
                                </div>
                                <div>
                                    <div class="driver-pop-ups-label">其它信息</div>
                                    <div class="driver-pop-ups-input"><input id="driver-pop-ups-other-info" /></div>
                                </div>
                                <div class="driver-pop-ups-btns">
                                    <button onclick="addDriverMakeSure()">确定</button>
                                    <button onclick="driverPopUpCancel()">取消</button>
                                </div>
                            </div>
                    </div>
                </div>`,
    deleteWayBill: `<div id="driver-pop-up">
                    <div id="mask" class="mask"></div>
                    <div id="popUps" class="pop-ups">
                            <h4 class="pop-ups-title">删除运单</h4>
                            <div class="driver-pop-ups-content">
                                <p style="text-align: center">
                                    此操作将不可逆，确定删除订单？
                                </p>
                                <div class="driver-pop-ups-btns">
                                    <button onclick="deleteWayBillMakeSure({{waybill_id}})">确定</button>
                                    <button onclick="driverPopUpCancel()">取消</button>
                                </div>
                            </div>
                    </div>
                    </div>`
}


/********************* 工具模块 *********************/

const utils = (function() {
    /**
     * 获取模板
     * @param {String} name 要获取的键名链，如 driver.head 
     * @return {String}
     */
    var getTemplate = function(name) {
        let result = DRIVERTEMPLATE;
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


/***************  各种事件响应函数 *****************/

/**
 * 生成‘驾驶员列表’页面
 * @param {Array} list
 *   格式说明：[{
 *      driver_id: ,
 *      name: ,
 *      mileage: ,
 *      waybillsum:,
 *      warningsum:
 *   }]
 */
function createDriverListPage(list) {
    let root = $(utils.getTemplate('driver.head'));
    list.forEach(item => {
        let template = utils.getTemplate('driver.item');
        $(utils.replace(template, item)).appendTo(root.children('#driver-list'));
    });
    utils.load(root);
}

/**
 * 生成‘驾驶员详细信息’页面
 * @param {Number} driver_id 驾驶员id
 * @param {String} name      驾驶员姓名
 * @param {Array}  list      关于该驾驶员的所有运单信息
 *   格式说明：[{
 *      waybill_id:,
 *      origin:,
 *      terminal:,
 *      starttime:,
 *      endtime:
 *   }]
 */
function createDriverDetailPage(driver_id, name, list) {
    let root = $(utils.replace(utils.getTemplate('driverDetail.head'), { driver_id, name }));
    list.forEach(item => {
        let template = utils.getTemplate('driverDetail.item');
        $(utils.replace(template, item)).appendTo(root.children('#driver-list'));
    });
    utils.load(root);
}

/**
 * 跳转到删除删除运单页面
 * @param {Number} driver_id 
 */
function deleteWayBill(waybill_id) {
    // TODO
    console.log('删除运单页面');
    let template = utils.getTemplate('deleteWayBill');
    template = utils.replace(template, { waybill_id })
    $(template).appendTo('body');
}

/**
 * 跳转修改运单页
 * @param {Number} waybill_id
 */
function modifyWayBill(waybill_id) {
    // TODO
    console.log('修改运单页面');
}

/**
 * 跳转修改驾驶员信息
 * @param {Number} driver_id 
 */
function modifyDriver(driver_id) {
    // TODO
    console.log('修改驾驶员信息页面');
    let template = utils.getTemplate('modifyDriver');
    template = utils.replace(template, { driver_id })
    $(template).appendTo('body');
}

/**
 * 跳转到添加驾驶员页面
 */
function addDriver() {
    // TODO
    console.log('添加驾驶员页面');
    let template = utils.getTemplate('addDriver');
    $(template).appendTo('body');
}

/**
 * 确定修改驾驶员信息
 */
function modifyDriverMakeSure(driver_id) {
    let name = $('#driver-pop-ups-name').val();
    let othInfo = $('#driver-pop-ups-other-info').val();
    console.log(name, othInfo);
    // TODO 对输入信息进行处理
    // 去除蒙版
    driverPopUpCancel();
}

/**
 * 确定添加驾驶员
 */
function addDriverMakeSure() {
    let name = $('#driver-pop-ups-name').val();
    let othInfo = $('#driver-pop-ups-other-info').val();
    console.log(name, othInfo);
    // TODO 对输入信息进行处理
    // 去除蒙版
    driverPopUpCancel();
}

/**
 * 确定删除运单
 * @param {Number} waybill_id 
 */
function deleteWayBillMakeSure(waybill_id) {
    // TODO
    // 去除蒙版
    driverPopUpCancel();
}

/**
 * 取消弹窗
 */
function driverPopUpCancel() {
    // 去除蒙版
    $('#driver-pop-up').remove();
}


/********************** ‘驾驶员’页面初始化函数 *********************/

/**
 * ‘驾驶员列表’页面初始化函数
 */
function goTodriver() {
    utils.clear();
    // TODO http请求获取相关数据
    // 测试
    createDriverListPage([{
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
    }])
}

/**
 * ‘驾驶员详情页’页面初始化函数
 */
function goToDriverDetail(driver_id) {
    utils.clear();
    // TODO http请求获取相关数据
    // 测试
    createDriverDetailPage(
        driver_id,
        '张三', [{
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
    )
}


/**
 * 页面初始化
 */
$(document).ready(function() {
    createMap();
    goTodriver();
});
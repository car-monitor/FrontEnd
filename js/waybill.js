/*
 * 运单页面js模块
 * @author 陈海城
 */


/*************** html 渲染模板 ******************/

const TEMPLATE = {
    waybill: {
        comm: `<div id="waybill">
              <h1 id="waybill-title" class="waybill-border">
                  运单列表<span onclick="makeWaybill()">+</span>
              </h1>
              <div id="waybill-list">
                  
              </div>
           </div>`,
        item: `<div class="waybill-item waybill-border">
                    <h1 class="waybill-item-title">运单</h1>
                    <div class="waybill-item-content">
                        <div>起点：</div>
                        <div>{{origin}}</div>
                    </div>
                    <div class="waybill-item-content">
                        <div>终点：</div>
                        <div>{{terminal}}</div>
                    </div>
                    <div class="waybill-item-content">
                        <div>出发时间：</div>
                        <div>{{starttime}}</div>
                    </div>
                    <div class="waybill-item-content">
                        <div>结束时间：</div>
                        <div>{{endtime}}</div>
                    </div>
               </div>`
    },
    makeWaybill: `<div id="waybill">
                    <h1 class="waybill-border">添加运单</h1>
                    <div id="#waybill-list">
                        <div class="waybill-item waybill-border">
                            <div class="waybill-btn">
                                <button>设置起点</button>
                            </div>
                            <div class="waybill-item-content">
                                <div>起点：</div>
                                <div>{{origin}}</div>
                            </div>
                        </div>

                        <div class="waybill-item waybill-border">
                            <div class="waybill-btn">
                                <button>设置终点</button>
                            </div>
                            <div class="waybill-item-content">
                                <div>终点：</div>
                                <div>{{terminal}}</div>
                            </div>
                        </div>

                        <div class="waybill-item waybill-border">
                            <div class="waybill-item-content">
                                <div>出发时间：</div>
                                <div><input id="starttime" /></div>
                            </div>
                            <div class="waybill-item-content">
                                <div>到达时间：</div>
                                <div><input id="endtime" /></div>
                            </div>
                        </div>

                        <div class="waybill-item">
                            <div class="waybill-btn waybill-btn-sure">
                                <button onclick="waybillMakeSure()">确定</button>
                            </div>
                            <div class="waybill-btn waybill-btn-cancel">
                                <button onclick="waybillCancel()">取消</button>
                            </div>
                        </div>
                    </div>
                </div>`
}


/*************** 工具模块 *********************/

const utils = (function() {
    /**
     * 获取模板
     * @param {String} name 要获取的键名链，如 waybill.comm 
     * @return {String}
     */
    var getTemplate = function(name) {
        let result = TEMPLATE;
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
        Object.keys(data).forEach(key => {
            template = template.replace(`{{${key}}}`, data[key]);
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


/***************  响应函数 *****************/

/**
 * 生成‘下运单’页面
 */
function makeWaybill() {
    utils.clear();
    utils.load($(utils.getTemplate('makeWaybill')));
}

/**
 * 生成‘运单’页面
 * @param {Array} list
 *   格式说明：[{
 *      origin: ,
 *      terminal: ,
 *      starttime: ,
 *      endtime:
 *   }]
 */
function createWaybillListPage(list) {
    let root = $(utils.getTemplate('waybill.comm'));
    list.forEach(item => {
        let template = utils.getTemplate('waybill.item');
        $(utils.replace(template, item)).appendTo(root.children('#waybill-list'))
    });
    utils.load(root);
}

/**
 * 点击‘运单’后跳转到‘运单’页面
 */
function goToWaybill() {
    utils.clear();
    // 测试
    createWaybillListPage([{
        origin: '广东省深圳市光明区九号73133331',
        terminal: '广东省深圳市光明区九号73133331',
        starttime: '2017.4.25 12:00',
        endtime: '2017.4.25 12:00'
    }, {
        origin: '广东省深圳市光明区九号73133331',
        terminal: '广东省深圳市光明区九号73133331',
        starttime: '2017.4.25 12:00',
        endtime: '2017.4.25 12:00'
    }, {
        origin: '广东省深圳市光明区九号73133331',
        terminal: '广东省深圳市光明区九号73133331',
        starttime: '2017.4.25 12:00',
        endtime: '2017.4.25 12:00'
    }])
}

/**
 * 点击创建运单响应函数
 */
function waybillMakeSure() {
    // TODO
    console.log('make sure');
}

/**
 * 点击取消创建订单响应函数
 */
function waybillCancel() {
    // TODO
    console.log('cancel');
}
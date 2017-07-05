/*
 * login页面js模块
 * @author LCK
 */



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
 * 跳转修改驾驶员信息
 * @param {Number} driver_id 
 */
function loginSure(user, password) {
    // TODO
}

function loginCancel() {
    // TODO
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
 * 页面初始化
 */
$(document).ready(function() {
    createMap();
});
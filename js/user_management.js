/*
 * 管理页面js模块
 * @author LCK
 */


/*************** html 渲染模板 ******************/

const USERTEMPLATE = {
    user: {
        head: `<div id="user">
                <h1 id="user-title" class="user-border">
                    驾驶员列表<i class="fa fa-plus" aria-hidden="true" onclick="addUser()" style="float: right; cursor: pointer"></i>
                </h1>
                <div id="user-list">
                    
                </div>
              </div>`,
        item: `<div class="user-item user-border">
                    <h1 class="user-item-title">
                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                        <span onclick="goToUserDetail({{user_id}})" style="cursor: pointer">{{name}}</span>
                        <i class="fa fa-cog" aria-hidden="true" style="float: right; cursor: pointer" onclick="modifyUser({{user_id}})"></i>
                    </h1>
                    <div class="user-item-content">
                        <div>角色：</div>
                        <div>{{role}}</div>
                    </div>
               </div>`
    },
    modifyUser: `<div id="user-pop-up">
                    <div id="mask" class="mask"></div>
                    <div id="popUps" class="pop-ups">
                            <h4 class="pop-ups-title">修改用户权限</h4>
                            <div class="user-pop-ups-content">
                                <div>
                                    <div class="user-pop-ups-label">用户名</div>
                                    <div class="user-pop-ups-input"><input id="user-pop-ups-name" /></div>
                                </div>
                                <div>
                                    <div class="user-pop-ups-label">权限设置</div>
                                    <div class="user-pop-ups-input">
                                    	<select name="" id="user-pop-ups-other-info"> 
											<option value="0">普通用户</option> 
											<option value="1">老司机</option> 
											<option value="2">管理员</option> 
										</select>
                                    </div>
                                </div>
                                <div class="user-pop-ups-btns">
                                    <button onclick="modifyUserMakeSure({{user_id}})">确定</button>
                                    <button onclick="userPopUpCancel()">取消</button>
                                </div>
                            </div>
                    </div>
                   </div>`,
    addUser: `<div id="user-pop-up">
                    <div id="mask" class="mask"></div>
                    <div id="popUps" class="pop-ups">
                            <h4 class="pop-ups-title">添加用户</h4>
                            <div class="user-pop-ups-content">
                                <div>
                                    <div class="user-pop-ups-label">姓名</div>
                                    <div class="user-pop-ups-input"><input id="user-pop-ups-name" /></div>
                                </div>
                                <div>
                                    <div class="user-pop-ups-label">其它信息</div>
                                    <div class="user-pop-ups-input"><input id="user-pop-ups-other-info" /></div>
                                </div>
                                <div class="user-pop-ups-btns">
                                    <button onclick="addUserMakeSure()">确定</button>
                                    <button onclick="userPopUpCancel()">取消</button>
                                </div>
                            </div>
                    </div>
                </div>`
}


/********************* 工具模块 *********************/

const utils = (function() {
    /**
     * 获取模板
     * @param {String} name 要获取的键名链，如 user.head 
     * @return {String}
     */
    var getTemplate = function(name) {
        let result = USERTEMPLATE;
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
 *      user_id: ,
 *      name: ,
 *      mileage: ,
 *      waybillsum:,
 *      warningsum:
 *   }]
 */
function createUserListPage(list) {
    let root = $(utils.getTemplate('user.head'));
    list.forEach(item => {
        let template = utils.getTemplate('user.item');
        $(utils.replace(template, item)).appendTo(root.children('#user-list'));
    });
    utils.load(root);
}

/**
 * 生成‘驾驶员详细信息’页面
 * @param {Number} user_id 驾驶员id
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
function createUserDetailPage(user, name, list) {
    let root = $(utils.replace(utils.getTemplate('userDetail.head'), { user_id, name }));
    list.forEach(item => {
        let template = utils.getTemplate('userDetail.item');
        $(utils.replace(template, item)).appendTo(root.children('#user-list'));
    });
    utils.load(root);
}


function modifyUser(user_id) {
    // TODO
    console.log('修改用户信息页面');
    let template = utils.getTemplate('modifyUser');
    template = utils.replace(template, { user_id })
    $(template).appendTo('body');
}

/**
 * 跳转到添加驾驶员页面
 */
function addUser() {
    // TODO
    console.log('添加用户页面');
    let template = utils.getTemplate('addUser');
    $(template).appendTo('body');
}

/**
 * 确定修改驾驶员信息
 */
function modifyUserMakeSure(user_id) {
    let name = $('#user-pop-ups-name').val();
    let othInfo = $('#user-pop-ups-other-info').val();
    console.log(name, othInfo);
    // TODO 对输入信息进行处理
    // 去除蒙版
    userPopUpCancel();
}

/**
 * 确定添加驾驶员
 */
function addUserMakeSure() {
    let name = $('#user-pop-ups-name').val();
    let othInfo = $('#user-pop-ups-other-info').val();
    console.log(name, othInfo);
    // TODO 对输入信息进行处理
    // 去除蒙版
    userPopUpCancel();
}



/**
 * 取消弹窗
 */
function userPopUpCancel() {
    // 去除蒙版
    $('#user-pop-up').remove();
}


/********************** ‘驾驶员’页面初始化函数 *********************/

/**
 * ‘驾驶员列表’页面初始化函数
 */
function goTouser() {
    utils.clear();
    // TODO http请求获取相关数据
    // 测试
    createUserListPage([{
        user_id: 1,
        name: '张晓斌',
        role: '司机'
    }, {
        user_id: 2,
        name: '李宇光',
        role: '司机'
    }, {
        user_id: 3,
        name: '田氏仁',
        role: '司机'
    },{
        user_id: 4,
        name: '车里梓',
        role: '司机'
    },{
        user_id: 5,
        name: '时文武',
        role: '司机'
    }])
}




/**
 * 页面初始化
 */
$(document).ready(function() {
    createMap();
    goTouser();
});

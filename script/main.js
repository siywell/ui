//框架路径配置
window.SIYWELL_UI_BASE = "assets/ui/";
//require配置
require.config({
    baseUrl: SIYWELL_UI_BASE,
    paths: {
        //必须基础组件
        "jquery": "plugin/jquery-3.3.1.min" ,
        "jquery-ui" : "plugin/jquery-ui-1.12.1/jquery-ui.min" ,
        "bootstrap" : "plugin/bootstrap-3.3.7/js/bootstrap.min" ,
        "font" : "plugin/font-awesome-4.7.0/js/font-awesome" ,

        //Siywell OS 组件
        "util" : "script/module/util" ,

        "siywell" : "script/module/siywell" ,
        "siywell-jquery" : "script/module/jquery" ,
        "desktop" : "script/module/desktop" ,
        "taskbar" : "script/module/taskbar" ,
        "background" : "script/module/background",
        "popup" : "script/module/popup"
    },
    map : {
        "*" : {
            'css': 'plugin/css.min'
        }
    },
    shim : {
        //必须基础组件
        "jquery-ui" : ["css!plugin/jquery-ui-1.12.1/jquery-ui.min.css"] ,
        "bootstrap" : [
            "css!plugin/bootstrap-3.3.7/css/bootstrap.min.css",
            "css!style/bootstrap.css"
        ],
        "font" : ["css!plugin/font-awesome-4.7.0/css/font-awesome.min.css"],

        //Siywell OS 样式文件
        "siywell" : ["css!style/module/siywell.css"],
        "desktop" : ["css!style/module/desktop.css"],
        "taskbar" : ["css!style/module/taskbar.css"],
        "background" : ["css!style/module/background.css"],
        "popup" : ["css!style/module/popup.css"]
    }
});

define(function (require) {
    //初始化
    var $ = require("jquery");
    var siywell = require("siywell");

    //DOM加载完成后，初始化
    $(function () {
        siywell.init();
    })

    //注册为全局
    window.siywell = siywell;
})
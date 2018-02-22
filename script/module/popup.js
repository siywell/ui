define(function (require) {
    var $ = require("jquery");
    var taskbar = require("taskbar");



    var template = '<div class="popup popup-hidden">' +
        '    <div class="title-bar">' +
        '        <div class="icon"><i class="fa fa-cog"></i></div>' +
        '        <div class="title">弹出窗口</div>' +
        '        <div class="action">' +
        '            <div class="item min">' +
        '            </div><div class="item re">' +
        '            </div><div class="item max">' +
        '            </div><div class="item exit">' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="body"></div>' +
        '</div>';

    var init = function () {
    }

    var open = function (param) {
        //初始化配置
        var config = {
            id : guid(),
            title : "弹出窗口" ,
            html : null ,
            url : null ,
            minable : true ,
            maxable : true ,
            closeable : true ,
            icon : "fa fa-cube" ,
            container : ".desktop" ,
            task : true ,
            tray : true
        }
        $.extend(config,param);
        //生成DOM对象
        var popup = getPopupById(config.id);
        if(popup.length == 0){
            popup = $(template);
            popup.appendTo(config.container);
            popup.attr("id",config.id);
            initObject(popup);
        }
        setting(config.id,config);
        //设置内容
        if(config.url){
            load(config.id,config.url);
        }else{
            html(config.id,config.html);
        }
        return popup;
    }
    
    var initObject = function (object) {
        object.draggable();
        object.resizable();
    }

    var getPopupById = function (id) {
        var object = $(".popup#"+id);
        return object;
    }

    var setting = function (id,config) {
        var popup = require("popup");
        var object = getPopupById(id);
        if(object.length == 0)
            return;
        var oldSetting = object.data("setting");
        $.extend(oldSetting,config);
        object.data("setting",oldSetting);
        for(i in config){
            if(i == "html" || i == "url")
                continue;
            var callback = popup[i];
            if(typeof callback == ""){
                try{
                    callback(id,config[i]);
                }catch (e){
                    console.log(e);
                }
            }
        }
    }
    
    var load = function (id,url) {
        $.get(url,function (htmlString) {
            html(id,htmlString);
        });
    }
    
    var html = function (id,htmlString) {
        var object = getPopupById(id);
        if(object.length == 0)
            return;

        object.find(".body").html(htmlString);
        object.removeClass("popup-hidden");
    }

    var get = function (id) {
        return null;
    }

    var guid = function () {
        return 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    return {
        init : init ,
        open : open ,
        html : html ,
        get : get
    }
});
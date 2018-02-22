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

    var Popup = function(param){
        var self = this;
        var object = null;
        var util = require("util");
        //默认配置
        var config = {
            id : util.uuid(),
            title : "弹出窗口" ,
            html : null ,
            url : null ,
            minable : true ,
            maxable : true ,
            closeable : true ,
            icon : "fa fa-cube" ,
            container : ".desktop" ,
            task : true ,
            tray : true ,
            minHeight : 100 ,
            minWidth : 100 ,
            top : 0 ,
            left : 0 ,
            height : 400 ,
            width : 500
        }

        var init = function (param) {
            //初始化配置
            $.extend(config,param);
            if(object == null){
                object = $(template);
                object.appendTo(config.container);
                object.attr("id",config.id);
                initObject();
            }
            //根据配置设置弹出框
            setting(config);
            //设置内容
            if(config.url){
                load(config.url,function(){
                    center();
                });
            }else{
                html(config.html);
                center();
            }
        }

        var initObject = function () {
            object.draggable();
            object.resizable();
            object.data("popup",self);
        }

        var setting = function (setting) {
            var popup = this;
            if(object == null)
                return;
            $.extend(config,setting);
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

        var top = function(top){
            if(typeof top == "undefined")
                return config.top;
            if(top < 0) top = 0;
            config.top = top;
            if(object == null)
                return;
            object.css("top",top+"px");
        }

        var left = function(left){
            if(typeof left == "undefined")
                return config.left;
            if(left < 0) left = 0;
            config.left = left;
            if(object == null)
                return;
            object.css("left",left+"px");
        }

        var height = function(height){
            if(typeof height == "undefined")
                return config.height;
            if(height < config.minHeight) height = config.minHeight;
            config.height = height;
            if(object == null)
                return;
            object.height(height);
        }

        var width = function(width){
            if(typeof width == "undefined")
                return config.width;
            if(width < config.minWidth) width = config.minWidth;
            config.width = width;
            if(object == null)
                return;
            object.width(width);
        }

        var center = function(){
            var container = $(config.container);
            top((container.height() - config.height) / 2);
            left((container.width() - config.width) / 2);
        }

        var load = function (url,callback) {
            $.get(url,function (htmlString) {
                config.url = url;
                html(htmlString);
                if(typeof callback == "function"){
                    try{
                        callback();
                    }catch(e){
                        console.log(e);
                    }
                }
            });
        }

        var html = function (htmlString) {
            if(typeof htmlString == "undefined")
                return config.html;
            config.html = htmlString;
            htmlString = htmlString.replaceAll("{popup.id}",config.id);
            if(object == null)
                return;

            object.find(".body").html(htmlString);
            object.removeClass("popup-hidden");
        }

        var getPopupById = function(id){
            var object = $(".popup#"+id);
            return object;
        }

        //对外暴露方法
        this.html = html;
        this.load = load;
        this.center = center;
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
        this.setting = setting;

        //构造函数
        init(param);
    }

    var open = function (param) {
        return new Popup(param);
    }
    
    var get = function (id) {
        var object = null;
        try{
            object = $(".popup#"+id);
        }catch(e){
            console.log(e);
        }
        if(object == null)
            return null;
        return object.data("popup");
    }

    return {
        open : open ,
        get : get
    }
});
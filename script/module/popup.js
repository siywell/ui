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
        Component.call(this);
        var object = null;
        var util = require("util");

        var task = null;

        //默认配置
        var config = {
            id : util.uuid(),
            title : "弹出窗口" ,
            html : null ,
            url : null ,
            minable : true ,
            maxable : true ,
            closeable : true ,
            draggable : true ,
            resizable : true ,
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
            initTask();
            //显示出来后，在顶部
            toTop();
        }

        var initTask = function () {
            if(!config.task){
                return;
            }
            task = taskbar.addTask({
                id : config.id ,
                title : config.title ,
                icon : config.icon
            });
            self.bind("close",function () {
                task.close();
            })
            task.bind("click",function (e) {
                if(self.isMin()){
                    self.unmin();
                    toTop();
                }else{
                    if(isTop()){
                        self.min();
                    }else{
                        toTop();
                    }
                }
            })
        }

        var initObject = function () {
            object.click(function () {
                toTop();
            })
            object.draggable({
                handle : ".title-bar > .title" ,
                start : function (e,helper) {
                    toTop();
                    if(object.hasClass("mode-max") || object.hasClass("mode-min"))
                        return false;
                    return config.draggable;
                },
                stop : function (e,helper) {
                    var position = helper.position;
                    top(position.top);
                    left(position.left);
                },
                drag : function (e,helper) {
                }
            });
            object.resizable({
                helper: "ui-resizable-helper" ,
                start : function (e,helper) {
                    toTop();
                    if(object.hasClass("mode-max") || object.hasClass("mode-min"))
                        return false;
                    return config.resizable;
                },
                stop : function (e,helper) {
                    var size = helper.size;
                    height(size.height);
                    width(size.width);
                },
                resize : function (e,helper) {
                }
            });
            object.data("popup",self);

            object.delegate(".title-bar .item.exit","click",function () {
                close();
            });
            object.delegate(".title-bar .item.max","click",function () {
                max();
            });
            object.delegate(".title-bar .item.min","click",function () {
                min();
            });
            object.delegate(".title-bar .item.re","click",function () {
                unmax();
            });
            object.delegate(".title-bar .title","dblclick",function () {
                if(object.hasClass("mode-max")){
                    unmax();
                }else{
                    max();
                }
            });
        }

        var setting = function (setting) {
            var popup = self;
            if(object == null)
                return;
            $.extend(config,setting);
            for(i in config){
                if(i == "html" || i == "url")
                    continue;
                var callback = popup[i];
                if(typeof callback == "function"){
                    try{
                        callback(config[i]);
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
            self.trigger("position",[{type:"top",value:top}]);
        }

        var left = function(left){
            if(typeof left == "undefined")
                return config.left;
            if(left < 0) left = 0;
            config.left = left;
            if(object == null)
                return;
            object.css("left",left+"px");
            self.trigger("position",[{type:"left",value:top}]);
        }

        var height = function(height){
            if(typeof height == "undefined")
                return config.height;
            if(height < config.minHeight) height = config.minHeight;
            config.height = height;
            if(object == null)
                return;
            object.height(height);
            self.trigger("resize",[{type:"height",value:height}]);
        }

        var width = function(width){
            if(typeof width == "undefined")
                return config.width;
            if(width < config.minWidth) width = config.minWidth;
            config.width = width;
            if(object == null)
                return;
            object.width(width);
            self.trigger("resize",[{type:"width",value:width}]);
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

        /**
         * 去顶部
         */
        var toTop = function () {
            if(isTop())
                return;
            var topPopup = getTop();
            var topZ = 100;
            if(topPopup != null){
                var z = Number(topPopup.css("z-index"));
                topZ = z + 1;
            }
            object.css("z-index",topZ);
        }
        
        var isTop = function () {
            var topPopup = getTop();
            return object.is(topPopup);
        }
        
        var getTop = function () {
            var container = $(config.container);
            var popups = container.find("div.popup");
            var startZ = 0;
            var topPopup = null;
            popups.each(function (i) {
                var popup = popups.eq(i);
                var z = Number(popup.css("z-index"));
                if(z > startZ){
                    startZ = z ;
                    topPopup = popup;
                }
            })
            return topPopup;
        }

        /**
         * 设置内容
         * @param htmlString
         * @returns {null}
         */
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

        var close = function () {
            if(object)
                object.remove();
            self.trigger("close");
        }

        var max = function () {
            if(!object)
                return;
            object.addClass("mode-max");
        }

        var min = function () {
            if(!object)
                return;
            object.addClass("mode-min");
        }

        var unmax = function () {
            if(!object)
                return;
            object.removeClass("mode-max");
        }

        var unmin = function () {
            if(!object)
                return;
            object.removeClass("mode-min");
        }

        var isMin = function () {
            return object.hasClass("mode-min");
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
        this.close = close;
        this.max = max;
        this.min = min;
        this.unmax = unmax;
        this.unmin = unmin;
        this.isMin = isMin;

        var getPopupById = function(id){
            var object = $(".popup#"+id);
            return object;
        }

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
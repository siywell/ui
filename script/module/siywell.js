/**
 * Siywell OS UI组件核心库
 */
define(function (require) {
    //jQuery支持库
    var $ = require("jquery");
    require("jquery-ui");
    require("bootstrap");
    require("font");

    //加载桌面组件
    var taskbar = require("taskbar");
    var desktop = require("desktop");
    var background = require("background");
    var jquery = require("siywell-jquery");
    var popup = require("popup");

    var eventMap = {};
    var onceMap = {};

    var setting = {};

    /**
     * 初始化
     */
    var init = function () {
        //加载设置
        loadSetting(doInit);
    };

    var doInit = function(){
        initBind();
        //加载完成后初始化
        jquery.init();
        background.init();
        desktop.init();
        taskbar.init();
        initEvent();

        //打开窗口
        popup.open({
            url : "assets/html/demo.html"
        });
    }

    var initBind = function(){
        bind("setting.change",function(){
        });
    }

    var initEvent = function () {
        var doc = $(document);
        doc.delegate(".tooltip-helper","mouseenter",function (e) {
            var helper = $(this);
            var timer = helper.data("timer");
            clearTimeout(timer);
            timer = setTimeout(function () {
                var tooltip = helper.data("tooltip");
                if(!tooltip){
                    tooltip = $('<div class="tooltip-panel hide"></div>');
                    tooltip.appendTo("body");
                    helper.data("tooltip",tooltip);
                }
                if(!tooltip.hasClass("hide"))
                    return;
                tooltip.removeClass("hide");
                tooltip.html(helper.data("title"));
                var position = helper.data("position");
                //位置
                var win = $(window);
                if(position.top + tooltip.height() > win.height()){
                    position.top = win.height() - tooltip.height() - 5;
                }else{
                    position.top = position.top + 5;
                }
                if(position.left + tooltip.width() > win.width()){
                    position.left = win.width() - tooltip.width() - 5;
                }else{
                    position.left = position.left + 5;
                }
                tooltip.css("top",position.top+"px");
                tooltip.css("left",position.left+"px");
                tooltip.stop().animate({
                    opacity : 1
                },200);
            },300);
            helper.data("timer",timer);
        }).delegate(".tooltip-helper","mouseleave",function (e) {
            hideTooltip($(this));
        }).delegate(".tooltip-helper","mousemove",function (e) {
            var helper = $(this);
            helper.data("position",{
                left : e.clientX ,
                top : e.clientY
            })
        }).delegate(".tooltip-helper","click",function (e) {
            hideTooltip($(this));
        });
    }
    
    var hideTooltip = function (helper) {
        var timer = helper.data("timer");
        clearTimeout(timer);
        var tooltip = helper.data("tooltip");
        if(!tooltip)
            return;
        tooltip.stop().animate({
            opacity : 0
        }, 200 , function () {
            tooltip.addClass("hide");
        });
    }

    /**
     * 绑定事件函数
     * @param name  事件名称
     * @param callback  回调函数
     */
    var bind = function (name,callback) {
        var array = eventMap[name];
        if(!array){
            eventMap[name] = new Array();
            array = eventMap[name];
        }
        array.push(callback);
    }

    /**
     * 触发事件
     * @param name  事件名称
     * @param args  回调参数
     */
    var trigger = function (name,args) {
        //事件回调
        var array = eventMap[name];
        if(array) {
            $.each(array, function (i) {
                var callback = array[i];
                if (typeof callback == "function") {
                    try {
                        callback(args);
                    } catch (e) {
                        console.log(e);
                    }
                }
            })
        }
        //一次执行
        var onceArray = onceMap[name];
        if(onceArray) {
            $.each(onceArray, function (i) {
                var callback = onceArray[i];
                if (typeof callback == "function") {
                    try {
                        callback(args);
                    } catch (e) {
                        console.log(e);
                    }
                }
            })
            onceMap[name] = new Array();
        }
    }

    /**
     * 绑定一次事件，触发后销毁，只执行一次
     * @param name  事件名称
     * @param callback  回调函数
     */
    var once = function (name,callback) {
        var array = onceMap[name];
        if(!array){
            onceMap[name] = new Array();
            array = onceMap[name];
        }
        array.push(callback);
    }

    var loadSetting = function(callback){
        var call = function(){
            if(typeof callback == "function"){
                try{
                    callback();
                }catch(e){
                    console.log(e);
                }
            }
        }
        var script = $("script[data-config]");
        if(script.length == 0){
            call();
        }else{
            var config = script.data("config");
            $.ajax({
                url : config ,
                type : "get" ,
                complete : function(xhr,status){
                    if(xhr.responseJSON) $.extend(setting,xhr.responseJSON);
                    call();
                }
            });
        }

    }

    var getSetting = function(){
        return setting;
    }

    var module = function (name) {
        return require(name);
    }




    var Component = function(){
        var events = {};

        /**
         * 绑定事件
         * @param name
         * @param callback
         */
        var bind = function (name,callback) {
            var eventArray = events[name];
            if(!eventArray){
                events[name] = new Array();
                eventArray = events[name];
            }
            eventArray.push(callback);
        }

        /**
         * 触发事件
         * @param name
         * @param params
         */
        var trigger = function (name,params) {
            var eventArray = events[name];
            if(!eventArray){
                return;
            }
            $.each(eventArray,function (i) {
                var call = eventArray[i];
                if(typeof call == "function"){
                    try{
                        call(params);
                    }catch (e){
                        console.log(e);
                    }
                }
            })
        }

        this.bind = bind;
        this.trigger = trigger;
    }
    window.Component = Component;



    return {
        init : init ,
        bind : bind ,
        once : once ,
        trigger : trigger ,
        setting : setting ,
        module : module
    }
});